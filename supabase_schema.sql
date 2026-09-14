-- NestBasket PostgreSQL & Supabase Production Schema
-- Designed for High-Performance Quick-Commerce Telemetry, User Baskets & Price Drop Watchlists
-- Author: Gopagani Arun (NestBasket Founder)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS nestbasket_users (
    id VARCHAR(64) PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150),
    city VARCHAR(60) NOT NULL DEFAULT 'Hyderabad',
    society VARCHAR(120) DEFAULT 'ShivBagh, Balkampet',
    lifetime_savings_rupees NUMERIC(10, 2) DEFAULT 0.00,
    is_pro BOOLEAN DEFAULT FALSE,
    is_founder BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for phone lookups
CREATE INDEX IF NOT EXISTS idx_nestbasket_users_phone ON nestbasket_users(phone);

-- 2. Cloud Baskets Table (Persistent Across Devices)
CREATE TABLE IF NOT EXISTS nestbasket_baskets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(64) NOT NULL,
    basket_name VARCHAR(100) DEFAULT 'Primary Family Basket',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_items_count INT DEFAULT 0,
    estimated_savings NUMERIC(10, 2) DEFAULT 0.00,
    preferred_platform VARCHAR(30) DEFAULT 'smart-cheapest',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nestbasket_baskets_user ON nestbasket_baskets(user_id);

-- 3. Price Drop Watchlist & Real-Time Alerts
CREATE TABLE IF NOT EXISTS nestbasket_watchlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(64) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(60),
    unit VARCHAR(60),
    image_url TEXT,
    target_price NUMERIC(10, 2) NOT NULL,
    initial_price NUMERIC(10, 2) NOT NULL,
    current_lowest_price NUMERIC(10, 2) NOT NULL,
    cheapest_platform VARCHAR(30) NOT NULL,
    alert_triggered BOOLEAN DEFAULT FALSE,
    alert_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_nestbasket_watchlist_user ON nestbasket_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_nestbasket_watchlist_alert ON nestbasket_watchlist(alert_triggered);

-- 4. Price History Telemetry
CREATE TABLE IF NOT EXISTS nestbasket_price_history (
    id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    platform VARCHAR(30) NOT NULL,
    pincode VARCHAR(10) DEFAULT '500016',
    price NUMERIC(10, 2) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nestbasket_price_history_prod ON nestbasket_price_history(product_id, recorded_at DESC);

-- 5. Master Products Catalog (1 Lakh+ Quick-Commerce SKUs across all 20 Blinkit categories)
CREATE TABLE IF NOT EXISTS nestbasket_master_products (
    id VARCHAR(120) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_hindi VARCHAR(255),
    brand VARCHAR(120) NOT NULL,
    category VARCHAR(60) NOT NULL,
    sub_category VARCHAR(100) NOT NULL,
    unit VARCHAR(60) NOT NULL,
    image_url TEXT NOT NULL,
    offers JSONB NOT NULL DEFAULT '{}'::jsonb,
    direct_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    pincode VARCHAR(10) DEFAULT '500016',
    is_essential BOOLEAN DEFAULT FALSE,
    total_orders_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- High-performance indexes for lightning fast filtering & searching across 1 lakh+ rows
CREATE INDEX IF NOT EXISTS idx_nb_products_cat_sub ON nestbasket_master_products(category, sub_category);
CREATE INDEX IF NOT EXISTS idx_nb_products_brand ON nestbasket_master_products(brand);
CREATE INDEX IF NOT EXISTS idx_nb_products_essential ON nestbasket_master_products(is_essential);
CREATE INDEX IF NOT EXISTS idx_nb_products_pincode ON nestbasket_master_products(pincode);

-- Full-text search index for real-time auto-complete and search
CREATE INDEX IF NOT EXISTS idx_nb_products_search ON nestbasket_master_products 
USING gin(to_tsvector('english', name || ' ' || brand || ' ' || COALESCE(name_hindi, '')));

-- 6. Row Level Security (RLS) Policies
ALTER TABLE nestbasket_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nestbasket_baskets ENABLE ROW LEVEL SECURITY;
ALTER TABLE nestbasket_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE nestbasket_master_products ENABLE ROW LEVEL SECURITY;

-- Anonymous / Service Read & Insert policies for client API
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public user read/write') THEN
        CREATE POLICY "Allow public user read/write" ON nestbasket_users FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow basket access') THEN
        CREATE POLICY "Allow basket access" ON nestbasket_baskets FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow watchlist access') THEN
        CREATE POLICY "Allow watchlist access" ON nestbasket_watchlist FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public products read') THEN
        CREATE POLICY "Allow public products read" ON nestbasket_master_products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow backend products write') THEN
        CREATE POLICY "Allow backend products write" ON nestbasket_master_products FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;
