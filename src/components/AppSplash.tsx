import React, { useState, useEffect, useRef } from 'react';

interface AppSplashProps {
  currentUser?: any;
  onComplete?: () => void;
}

export const AppSplash: React.FC<AppSplashProps> = ({
  currentUser,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState('Initializing darkstore comparison engine...');

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Stage 1: 35%
    const t1 = setTimeout(() => {
      setProgress(35);
      setStatusText('Connecting to Blinkit, Zepto, Instamart & BigBasket...');
    }, 300);

    // Stage 2: 65%
    const t2 = setTimeout(() => {
      setProgress(65);
      setStatusText('Syncing live darkstore inventory & surge fees...');
    }, 650);

    // Stage 3: 88%
    const t3 = setTimeout(() => {
      setProgress(88);
      setStatusText('Calibrating real-time price comparison radar...');
    }, 1000);

    // Stage 4: 100% Complete!
    const t4 = setTimeout(() => {
      setProgress(100);
      setStatusText('Darkstores Connected • 100% Ready');
    }, 1350);

    // Stage 5: Begin fade-out
    const t5 = setTimeout(() => {
      setIsFading(true);
    }, 1750);

    // Stage 6: Unmount and trigger complete
    const t6 = setTimeout(() => {
      setIsVisible(false);
      onCompleteRef.current?.();
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 text-white p-6 select-none transition-opacity duration-350 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transition: 'opacity 350ms ease-out' }}
    >
      {/* Top Brand Header */}
      <div className="w-full flex justify-between items-center max-w-sm mx-auto pt-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          NestBasket OS 2.0
        </span>
        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
          Live Sync
        </span>
      </div>

      {/* Center Logo & 100% Progress Animation */}
      <div className="flex flex-col items-center text-center max-w-sm my-auto">
        {/* Animated 3D Logo */}
        <div className="relative mb-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-800 flex items-center justify-center text-white text-4xl sm:text-5xl font-black shadow-2xl shadow-emerald-500/40 border border-emerald-300/50 animate-pulse">
            ₹
          </div>
          <div className="absolute -inset-2 rounded-[2rem] bg-emerald-500/20 blur-lg -z-10 animate-ping opacity-60" />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
          <span>Nest</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Basket
          </span>
        </h1>
        <p className="text-emerald-400 text-xs font-bold mt-1 tracking-wider uppercase">
          खरीदारी की टोकरी • 100% Free Public Utility
        </p>
        <p className="text-slate-400 text-xs mt-2 font-medium px-4">
          India's Real-Time Quick-Commerce Price Comparison Engine
        </p>

        {/* 100% Progress Bar with Animated Percentage Counter */}
        <div className="w-64 sm:w-72 mt-8">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5 px-0.5">
            <span className="text-slate-400 text-[11px]">System Status</span>
            <span className="font-mono text-emerald-400 text-xs font-black">
              {progress}%
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-300 ease-out shadow-sm shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2.5 font-medium h-4 transition-all">
            {statusText}
          </p>
        </div>
      </div>

      {/* Bottom Store Badges */}
      <div className="flex flex-col items-center gap-2 pb-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Comparing Live Darkstores</span>
        </div>
        <div className="flex items-center flex-wrap justify-center gap-2 text-[11px] font-bold text-slate-300">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 shadow-sm">🟡 Blinkit</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 shadow-sm">⚡ Zepto</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 shadow-sm">🟠 Instamart</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 shadow-sm">🟢 BB Now</span>
        </div>
      </div>
    </div>
  );
};