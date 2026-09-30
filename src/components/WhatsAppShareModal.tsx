import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';
import { CityOption } from '../types';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityOption;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  city,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `🚨 *GROCERY PRICE ALERT FOR ${city.name.toUpperCase()}* (${city.popularAreas[0]} / ${city.pincode})

Don't overpay for daily groceries today! Here is the live comparison across Blinkit vs Zepto vs BB Now:

🍅 *Hybrid Tomatoes 1kg:*
• Zepto: ₹36 ✅
• Blinkit: ₹52 ❌ (₹16 extra + surge!)

🥛 *Amul Gold Milk:*
• BB Now / Zepto: ₹32.5 - ₹33 ✅
• Blinkit: ₹34 + ₹5 platform fee

🌾 *Aashirvaad Atta 10kg:*
• BB Now: ₹449 ✅
• Blinkit: ₹490 ❌ (Save ₹41!)

⚡ *Live Surge Alert:* Blinkit currently has +₹15 surge fee active!

👉 Compare live rates before you order today:
https://NestBasket.in?ref=wa_${city.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Viral WhatsApp Deal Share
                </h3>
                <p className="text-xs text-slate-500">
                  Share to your Apartment Society or Family Groups
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* WhatsApp Message Preview Card */}
          <div className="bg-[#EFEAE2] p-4 rounded-xl font-mono text-xs text-slate-800 border border-[#dad3c8] whitespace-pre-line leading-relaxed shadow-inner max-h-72 overflow-y-auto mb-5">
            {shareText}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Message</span>
                </>
              )}
            </button>

            <button
              onClick={handleNativeShare}
              className="py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-green-600/20"
            >
              <Send className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400 mt-4">
            🔥 Apartment society WhatsApp groups are the #1 zero-cost acquisition channel in Indian metro cities.
          </p>

        </div>
      </div>
    </div>
  );
};
