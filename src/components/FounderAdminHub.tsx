import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Users, Building, Check, Sliders, RefreshCw, 
  Terminal, ShieldCheck, Download, Plus, Trash2, Zap, Play, CheckCircle2, CreditCard, Send, Smartphone, Landmark, ArrowUpRight,
  ArrowDownLeft, History, FileText, CheckCheck, Sparkles, Printer, ArrowRight, Shield, ShieldAlert, Lock, AlertTriangle, EyeOff, Radio, Activity, Globe, MapPin, KeyRound, Server, Copy, ExternalLink,
  Search, Filter, HelpCircle, PhoneCall, MessageCircle, AlertCircle, CheckSquare, Clock, MessageSquare
} from 'lucide-react';
import { FounderStats, CustomerProblemTicket } from '../types';
import { CITIES } from '../data/mockGroceryData';
import { INITIAL_CUSTOMER_ISSUES } from './HelpSupportModal';

interface FounderAdminHubProps {
  stats: FounderStats;
  onUpdateStats: (newStats: Partial<FounderStats>) => void;
  isOpen: boolean;
  onClose: () => void;
  onTriggerScrape: () => void;
}

export const FounderAdminHub: React.FC<FounderAdminHubProps> = ({ 
  stats, 
  onUpdateStats, 
  isOpen, 
  onClose,
  onTriggerScrape
}) => {
  const [activeTab, setActiveTab] = useState<'payouts' | 'metrics' | 'members' | 'problems' | 'billing' | 'security' | 'scrapers' | 'acquisition'>('payouts');
  const [commissionRate, setCommissionRate] = useState<number>(stats.affiliateCommissionRate || 4.5);
  const [isScrapingRunning, setIsScrapingRunning] = useState<boolean>(false);
  const [smsGatewayKey, setSmsGatewayKey] = useState(() => localStorage.getItem('nestbasket_sms_key') || '');
  const [smsGatewaySaved, setSmsGatewaySaved] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberCityFilter, setMemberCityFilter] = useState('all');
  const [testSmsLoading, setTestSmsLoading] = useState(false);
  const [testSmsStatus, setTestSmsStatus] = useState<string | null>(null);
  const [testSmsTargetPhone, setTestSmsTargetPhone] = useState('9014218406');

  // Customer Problems & Help Desk State (All customer reported issues go directly to Owner desk)
  const [customerIssues, setCustomerIssues] = useState<CustomerProblemTicket[]>(() => {
    try {
      const stored = localStorage.getItem('nestbasket_customer_issues');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_CUSTOMER_ISSUES;
  });
  const [issueFilterStatus, setIssueFilterStatus] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  const [issueSearchQuery, setIssueSearchQuery] = useState('');
  const [editingTicketNoteId, setEditingTicketNoteId] = useState<string | null>(null);
  const [ticketNoteDraft, setTicketNoteDraft] = useState('');

  // Founder Biometric Photo (Gopagani Arun Only)
  const [founderPhoto, setFounderPhoto] = useState<string | null>(() => {
    return localStorage.getItem('nestbasket_founder_biometric_photo') || null;
  });

  // Listen for real-time customer problem submissions & photo updates
  useEffect(() => {
    const handleNewProblem = (e: any) => {
      if (e && e.detail) {
        setCustomerIssues((prev) => [e.detail, ...prev.filter((t) => t.id !== e.detail.id)]);
      }
    };
    const handlePhotoUpdated = (e: any) => {
      if (e && e.detail) {
        setFounderPhoto(e.detail);
      }
    };
    window.addEventListener('nestbasket_new_problem', handleNewProblem);
    window.addEventListener('nestbasket_founder_photo_updated', handlePhotoUpdated);
    return () => {
      window.removeEventListener('nestbasket_new_problem', handleNewProblem);
      window.removeEventListener('nestbasket_founder_photo_updated', handlePhotoUpdated);
    };
  }, []);