import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Globe,
  MessageCircle,
  Send,
} from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWhatsAppText, setCopiedWhatsAppText] = useState(false);

  if (!isOpen) return null;

  // Guaranteed 24/7 globally-hosted production URL accessible on any phone anywhere:
  const LIVE_URL = 'https://arungopagani.is-a.dev/NestBasket/';

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalDev = !currentHostname || currentHostname === 'localhost' || currentHostname === '127.0.0.1' || currentHostname.startsWith('10.') || currentHostname.startsWith('192.168.');

  // Clean canonical link that always loads the website reliably on any device:
  const siteUrl = isLocalDev ? LIVE_URL : (typeof window !== 'undefined' ? window.location.href.split('?')[0].split('#')[0] : LIVE_URL);
  const localNetworkUrl = 'http://10.133.8.198:3000/';

  // Viral WhatsApp message
  const whatsAppMessage = `🛒 *NestBasket (बचत रडार) — India's #1 Daily Quick-Commerce Price Tracker!*

Ever noticed how Blinkit, Zepto, Swiggy Instamart, and BigBasket charge totally different prices for the exact same milk, vegetables, and atta?

Families are saving *₹1,500 to ₹3,500 every month* using NestBasket!
⚡ Compare 10-minute darkstores in 1 tap
🥦 Avoid surge charges & find secret discounts
🎉 *100% FREE for all Indian families*

Check live prices now:
${siteUrl}`;

  const twitterText = `Tired of overpaying on grocery apps? Compare Blinkit, Zepto, Swiggy Instamart & BigBasket in 1 tap on NestBasket! Save ₹2,000+ monthly. 100% Free: ${siteUrl} #QuickCommerce #NestBasket`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsAppMessage);
    setCopiedWhatsAppText(true);
    setTimeout(() => setCopiedWhatsAppText(false), 2000);
  };

  const shareToWhatsApp = () => {
    const url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(whatsAppMessage);
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(siteUrl);
    window.open(url, '_blank');
  };

  const shareToTwitter = () => {
    const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(twitterText);
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(siteUrl);
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    const url = 'https://t.me/share/url?url=' + encodeURIComponent(siteUrl) + '&text=' + encodeURIComponent('Save ₹1,500+ every month comparing Blinkit, Zepto, and Instamart!');
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-slate-900 border border-slate-750 rounded-3xl p-6 text-white shadow-2xl space-y-5">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Clean Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Share NestBasket
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Help friends & family save ₹1,500 – ₹3,500 on daily groceries
              </p>
            </div>
          </div>

          {/* Clean Link Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs truncate">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="font-mono text-emerald-400 text-xs truncate select-all">{siteUrl}</div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs flex items-center gap-1 transition-all"
                  title="Open live link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open</span>
                </a>
              </div>
            </div>

            {isLocalDev && (
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Same Wi-Fi Direct: <code className="text-blue-300 font-mono">{localNetworkUrl}</code></span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(localNetworkUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  Copy
                </button>
              </div>
            )}
          </div>

          {/* Quick 1-Click Action Grid - Direct Sharing */}
          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp */}
            <button
              onClick={shareToWhatsApp}
              className="p-3.5 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-left transition-all group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#25D366] text-slate-950 flex items-center justify-center font-bold">
                  <MessageCircle className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">WhatsApp</div>
                  <div className="text-[11px] text-[#25D366] font-medium">Share to Groups</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#25D366] opacity-70 group-hover:opacity-100" />
            </button>

            {/* Telegram */}
            <button
              onClick={shareToTelegram}
              className="p-3.5 rounded-2xl bg-[#229ED9]/20 hover:bg-[#229ED9]/30 border border-[#229ED9]/50 text-left transition-all group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#229ED9] text-white flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Telegram</div>
                  <div className="text-[11px] text-[#229ED9] font-medium">Send to Friends</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#229ED9] opacity-70 group-hover:opacity-100" />
            </button>

            {/* X / Twitter */}
            <button
              onClick={shareToTwitter}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-all group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-slate-950 flex items-center justify-center font-black text-xs">
                  𝕏
                </div>
                <div>
                  <div className="font-bold text-xs text-white">X (Twitter)</div>
                  <div className="text-[11px] text-slate-400 font-medium">Post Tweet</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-70 group-hover:opacity-100" />
            </button>

            {/* LinkedIn */}
            <button
              onClick={shareToLinkedIn}
              className="p-3.5 rounded-2xl bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/50 text-left transition-all group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center font-bold text-xs">
                  in
                </div>
                <div>
                  <div className="font-bold text-xs text-white">LinkedIn</div>
                  <div className="text-[11px] text-[#0A66C2] font-medium">Share Update</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#0A66C2] opacity-70 group-hover:opacity-100" />
            </button>

            {/* Facebook */}
            <button
              onClick={shareToFacebook}
              className="p-3.5 rounded-2xl bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/50 text-left transition-all group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs">
                  f
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Facebook</div>
                  <div className="text-[11px] text-[#1877F2] font-medium">Post to Feed</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#1877F2] opacity-70 group-hover:opacity-100" />
            </button>

            {/* Copy Full Message */}
            <button
              onClick={handleCopyWhatsApp}
              className="p-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-left transition-all group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  {copiedWhatsAppText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-xs text-white">{copiedWhatsAppText ? 'Copied!' : 'Copy Message'}</div>
                  <div className="text-[11px] text-amber-400 font-medium">Full Deal Text</div>
                </div>
              </div>
              <Copy className="w-3.5 h-3.5 text-amber-400 opacity-70 group-hover:opacity-100" />
            </button>
          </div>

          {/* Clean Modal Bottom */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
            <span>100% Free Grocery Comparison</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};