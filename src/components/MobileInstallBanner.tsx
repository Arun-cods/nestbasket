import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2, Share, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

export const MobileInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('nestbasket_install_dismissed') === 'true';
  });
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as physical app)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Detect In-App Browsers (Instagram, Facebook, Messenger, WhatsApp, Twitter, TikTok)
    const inApp = /instagram|fbav|fban|messenger|whatsapp|twitter|tiktok|snapchat/i.test(userAgent);
    setIsInAppBrowser(inApp);

    // Capture Android/Chrome PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowInstallGuide(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const triggerDirectApkDownload = () => {
    const isNestBasketSubdir = window.location.pathname.startsWith('/nestbasket');
    const apkUrl = isNestBasketSubdir ? '/nestbasket/NestBasket.apk' : './NestBasket.apk';
    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = 'NestBasket.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openInChromeIntent = () => {
    const currentUrl = window.location.href.replace(/^https?:\/\//, '');
    window.location.href = `intent://${currentUrl}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  const handleInstallClick = async () => {
    // 1. If native Chrome PWA install prompt is ready, trigger it immediately (1-tap native prompt)
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setIsInstallable(false);
        return;
      }
    }

    // 2. If in Instagram/In-App browser, show instant options: Open in Chrome or Download APK
    setShowInstallGuide(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('nestbasket_install_dismissed', 'true');
  };

  return (
    <>
      {/* Top Banner (Only if not installed and not dismissed) */}
      {!isDismissed && !isInstalled && (
        <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white px-3 sm:px-4 py-2 border-b border-emerald-500/40 flex items-center justify-between gap-2 text-xs shadow-md w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs sm:text-sm shadow-md shrink-0">
              🛒
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-white flex items-center gap-1.5 truncate">
                <span className="truncate">Install NestBasket App</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/40 shrink-0">
                  {isInAppBrowser ? 'INSTANT APK' : 'PHYSICAL APP'}
                </span>
              </div>
              <div className="text-[10px] text-slate-300 hidden sm:block truncate">
                Fast standalone physical app with home screen icon and no URL bar.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-1 sm:gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            >
              {isIos ? <Share className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isInAppBrowser ? 'Download / Install' : isIos ? 'Add to Phone' : 'Install App'}</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Physical App Installation Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* App Icon & Header */}
            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-600/30 mx-auto mb-3 border-2 border-emerald-400">
                🛒
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Install NestBasket App
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Run NestBasket directly on your phone like Zepto, Blinkit & Swiggy!
              </p>
            </div>

            {/* In-App Browser Notice */}
            {isInAppBrowser && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                <div className="font-extrabold flex items-center gap-1 text-amber-950 mb-1">
                  <span>⚠️ Instagram / Social In-App Browser Detected</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Instagram's in-app webview prevents automatic 1-tap app installs. Choose an option below:
                </p>
              </div>
            )}

            {/* Action Buttons: Instant App Install */}
            <div className="space-y-2.5 mb-5">
              {/* Option 1: Native 1-Tap Install (WebAPK) */}
              <button
                type="button"
                onClick={async () => {
                  if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                      setIsInstalled(true);
                      setShowInstallGuide(false);
                    }
                  } else if (isIos) {
                    // iOS instructions displayed below
                  } else {
                    openInChromeIntent();
                  }
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#0c831f] hover:bg-[#0b721b] text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>⚡ 1-Tap Install Official App</span>
              </button>

              {/* Option 2: Open in Google Chrome */}
              {!isIos && (
                <button
                  type="button"
                  onClick={openInChromeIntent}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  <span>Open in Google Chrome (Full Features &amp; Fast)</span>
                </button>
              )}

              {/* Android Chrome 3-dot step guide */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-950 font-medium leading-relaxed">
                <p className="font-bold flex items-center gap-1 text-emerald-900 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>How to Install on Phone in 3 Seconds:</span>
                </p>
                <span>Tap the <strong>3 dots (⋮)</strong> at top-right of your browser $\rightarrow$ Tap <strong>'Install app'</strong> (or <strong>'Add to Home screen'</strong>). It creates the real app icon with 100% features and zero storage lag!</span>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-sm font-black text-emerald-700">Full Screen</div>
                <div className="text-[9.5px] text-emerald-800 font-semibold mt-0.5">No Browser Bar</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-sm font-black text-amber-700">1 Tap</div>
                <div className="text-[9.5px] text-amber-800 font-semibold mt-0.5">Home Screen Icon</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-200">
                <div className="text-sm font-black text-teal-700">&lt; 2 MB</div>
                <div className="text-[9.5px] text-teal-800 font-semibold mt-0.5">Fast &amp; Light</div>
              </div>
            </div>

            {/* iOS Safari Instructions */}
            {isIos && (
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 mb-4 text-xs text-slate-700 space-y-2">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Instructions for iPhone / iPad (Safari)</span>
                </div>
                <ol className="space-y-1.5 list-decimal list-inside font-medium text-slate-600 text-[11px]">
                  <li>Tap the <strong>Share button</strong> (<Share className="w-3 h-3 inline text-blue-600" /> square with arrow) at bottom of Safari.</li>
                  <li>Scroll down and select <strong>'Add to Home Screen'</strong> (+).</li>
                  <li>Tap <strong>'Add'</strong> in the top-right corner.</li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
};