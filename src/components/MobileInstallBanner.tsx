import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2, Share, ArrowRight, ExternalLink } from 'lucide-react';

export const MobileInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('NestBasket_install_dismissed') === 'true';
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

  const handleInstallClick = async () => {
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
    // If deferredPrompt not yet ready or user wants instructions, open interactive guide
    setShowInstallGuide(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('NestBasket_install_dismissed', 'true');
  };

  return (
    <>
      {/* Top Banner (Only if not installed and not dismissed) */}
      {!isDismissed && !isInstalled && (
        <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white px-3 sm:px-4 py-2 border-b border-emerald-500/40 flex items-center justify-between gap-2 text-xs shadow-md w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs sm:text-sm shadow-md shrink-0">
              ₹
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-white flex items-center gap-1.5 truncate">
                <span className="truncate">Install NestBasket App</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/40 shrink-0">
                  PHYSICAL APP
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
              <span>{isIos ? 'Add to Phone' : 'Install App'}</span>
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
                ₹
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Install NestBasket App
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Run NestBasket directly on your phone like Zepto, Blinkit & Swiggy!
              </p>
            </div>

            {/* Why Physical App is Better */}
            <div className="grid grid-cols-3 gap-2 mb-5 text-center">
              <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-base font-black text-emerald-700">Full Screen</div>
                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">No Browser Bar</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-base font-black text-amber-700">1 Tap</div>
                <div className="text-[10px] text-amber-800 font-semibold mt-0.5">Home Screen Icon</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-200">
                <div className="text-base font-black text-teal-700">&lt; 1 MB</div>
                <div className="text-[10px] text-teal-800 font-semibold mt-0.5">Zero Phone Memory</div>
              </div>
            </div>

            {/* Installation Steps based on OS */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5 text-xs text-slate-700 space-y-3">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>{isIos ? 'Instructions for iPhone / iPad (Safari)' : 'Instructions for Android Phone (Chrome)'}</span>
              </div>

              {isIos ? (
                <ol className="space-y-2 list-decimal list-inside font-medium text-slate-600">
                  <li>
                    Tap the <strong>Share button</strong> (<Share className="w-3 h-3 inline text-blue-600" /> square with arrow) at bottom of Safari.
                  </li>
                  <li>
                    Scroll down and select <strong>'Add to Home Screen'</strong> (+).
                  </li>
                  <li>
                    Tap <strong>'Add'</strong> in the top-right corner.
                  </li>
                </ol>
              ) : (
                <ol className="space-y-2.5 list-decimal list-inside font-medium text-slate-600">
                  <li>
                    Tap the <strong>three dots menu (⋮)</strong> in the top-right corner of Google Chrome.
                  </li>
                  <li>
                    Tap <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.
                  </li>
                  <li>
                    Tap <strong>'Install'</strong> on the Android confirmation pop-up.
                  </li>
                </ol>
              )}

              <div className="pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>NestBasket will appear on your phone home screen as a physical standalone app!</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {deferredPrompt && (
                <button
                  onClick={async () => {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                      setIsInstalled(true);
                      setShowInstallGuide(false);
                    }
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tap to Install WebAPK Now</span>
                </button>
              )}

              <button
                onClick={() => setShowInstallGuide(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Got it, Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};