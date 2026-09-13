import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface DpdpConsentBannerProps {
  onOpenPrivacyPolicy: (tab?: 'dpdp' | 'affiliate') => void;
}

export const DpdpConsentBanner: React.FC<DpdpConsentBannerProps> = ({ onOpenPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nestbasket_dpdp_consent');
      if (!saved) {
        // Show after small delay so it doesn't pop up abruptly
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const handleAccept = () => {
    const consentPayload = {
      agreed: true,
      timestamp: new Date().toISOString(),
      status: 'PERMISSION_GRANTED',
      dpdpActVersion: '2023',
    };
    localStorage.setItem('nestbasket_dpdp_consent', JSON.stringify(consentPayload));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy and Compliance Notice"
      className="fixed bottom-18 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-4 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-700/80 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
                <span>DPDP Act 2023 & Affiliate Disclosure</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  REQUIRED
                </span>
              </div>
              <div className="text-[10px] text-slate-400">Zero Spam Guarantee • India IT Act Compliant</div>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            title="Dismiss temporarily"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          NestBasket collects minimal phone and darkstore location data solely to discover real-time grocery prices, and participates in merchant affiliate programs at <strong>zero extra markup to you</strong>. Do you agree and grant permission to use this service?
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>I Agree & Understand</span>
          </button>

          <button
            onClick={() => onOpenPrivacyPolicy('dpdp')}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors border border-slate-700 shrink-0"
          >
            Review Policy
          </button>
        </div>
      </div>
    </aside>
  );
};
