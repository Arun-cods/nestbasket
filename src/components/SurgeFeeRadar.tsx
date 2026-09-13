import React from 'react';
import { Zap, Clock, ShieldAlert, Check, TrendingDown, Compass } from 'lucide-react';
import { CityOption } from '../types';
import { PLATFORMS } from '../data/mockGroceryData';

interface SurgeFeeRadarProps {
  city: CityOption;
  onOpenDarkstoreTelemetry?: () => void;
  onOpenGeoMap?: () => void;
}

export const SurgeFeeRadar: React.FC<SurgeFeeRadarProps> = ({ city, onOpenDarkstoreTelemetry, onOpenGeoMap }) => {
  // Live simulated fee metrics for selected city
  const feeStatus = [
    {
      platform: PLATFORMS.zepto,
      surge: 0,
      handling: 4,
      deliveryTime: '8-10 mins',
      surgeStatus: 'Normal (No Surge)',
      isSurging: false,
    },
    {
      platform: PLATFORMS.blinkit,
      surge: 15,
      handling: 5,
      deliveryTime: '12-14 mins',
      surgeStatus: 'Rain / High Demand (+₹15)',
      isSurging: true,
    },
    {
      platform: PLATFORMS.instamart,
      surge: 0,
      handling: 6,
      deliveryTime: '15-18 mins',
      surgeStatus: 'Normal (₹6 fee)',
      isSurging: false,
    },
    {
      platform: PLATFORMS.bigbasket,
      surge: 0,
      handling: 3,
      deliveryTime: '18-25 mins',
      surgeStatus: 'Lowest Fee (₹3)',
      isSurging: false,
    },
    {
      platform: PLATFORMS.flipkart,
      surge: 0,
      handling: 4,
      deliveryTime: '9-12 mins',
      surgeStatus: 'Normal (10m Express)',
      isSurging: false,
    },
  ];

  return (
    <div className="bg-slate-900/90 text-white rounded-xl p-2.5 sm:p-3 shadow-md border border-slate-700/60 mb-4 w-full max-w-full">
      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2 pb-1.5 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-400 text-amber-950 uppercase tracking-wider shrink-0">
            Fee Radar
          </span>
          <span className="text-[11px] text-slate-300 font-medium truncate">
            {(city.popularAreas[0] || '').replace(/\s*\(\d+\)/g, '')} ({city.pincode})
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="text-[11px] font-bold text-emerald-400 hidden sm:flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span>Lowest Fee: BB Now &amp; Zepto (₹3–₹4)</span>
          </div>
          {onOpenDarkstoreTelemetry && (
            <button
              onClick={onOpenDarkstoreTelemetry}
              className="text-[10.5px] font-extrabold text-emerald-300 hover:text-white flex items-center gap-1 bg-emerald-900/60 hover:bg-emerald-800 px-2 py-0.5 rounded-md border border-emerald-500/50 transition-all cursor-pointer shadow-2xs"
            >
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
              <span>Inspect Darkstores ⚡</span>
            </button>
          )}
          {onOpenGeoMap && (
            <button
              onClick={onOpenGeoMap}
              className="text-[10.5px] font-extrabold text-blue-300 hover:text-white flex items-center gap-1 bg-blue-950/80 hover:bg-blue-900 px-2 py-0.5 rounded-md border border-blue-500/50 transition-all cursor-pointer shadow-2xs"
              title="View Geospatial Darkstore Coverage Map"
            >
              <Compass className="w-3 h-3 text-blue-400" />
              <span>Radar Map 🗺️</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 Compact Instant Delivery Store Fee Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 w-full">
        {feeStatus.map((item) => (
          <div
            key={item.platform.id}
            className={`px-2 py-1.5 rounded-lg border text-xs flex flex-col justify-between ${
              item.isSurging
                ? 'bg-amber-950/40 border-amber-500/50'
                : 'bg-slate-800/60 border-slate-700/70'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-bold text-[11px] flex items-center gap-1 truncate">
                <span className="shrink-0 text-xs">{item.platform.logo}</span>
                <span className="truncate text-slate-200">{item.platform.name}</span>
              </span>
              <span className={`text-[9px] font-extrabold px-1 py-0.5 rounded shrink-0 ${
                item.isSurging ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {item.isSurging ? '+₹15 surge' : '₹0 surge'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Fee: <strong className="text-white">₹{item.handling}</strong></span>
              <span className="flex items-center gap-0.5 text-slate-300 font-medium">
                <Clock className="w-2.5 h-2.5 text-slate-400" /> {item.deliveryTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
