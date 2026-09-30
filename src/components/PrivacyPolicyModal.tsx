import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'dpdp' | 'affiliate' | 'terms';
  onConsentGranted?: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'dpdp',
  onConsentGranted,
}) => {
  const [activeTab, setActiveTab] = useState<'dpdp' | 'affiliate' | 'terms'>(initialTab);
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [consentDate, setConsentDate] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('NestBasket_dpdp_consent');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.agreed) {
          setHasConsented(true);
          setConsentDate(parsed.timestamp ? new Date(parsed.timestamp).toLocaleDateString('en-IN') : 'Active');
        }
      }
    } catch (e) {}
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGrantConsent = () => {
    const consentPayload = {
      agreed: true,
      timestamp: new Date().toISOString(),
      status: 'PERMISSION_GRANTED',
      dpdpActVersion: '2023',
    };
    localStorage.setItem('NestBasket_dpdp_consent', JSON.stringify(consentPayload));
    setHasConsented(true);
    setConsentDate(new Date().toLocaleDateString('en-IN'));
    onConsentGranted?.();
    onClose();
  };

  const handleRevokeConsent = () => {
    localStorage.removeItem('NestBasket_dpdp_consent');
    setHasConsented(false);
    setConsentDate(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 overflow-hidden text-slate-800 max-h-[90vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">
                Privacy Policy & DPDP Act 2023 Compliance
              </h2>
              <p className="text-xs text-slate-500">
                Digital Personal Data Protection Act (DPDP) 2023 & ASCI Affiliate Disclosures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 gap-2 pt-3 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('dpdp')}
            className={`pb-2.5 px-2 border-b-2 transition-colors ${
              activeTab === 'dpdp'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🛡️ DPDP Act 2023 Consent
          </button>
          <button
            onClick={() => setActiveTab('affiliate')}
            className={`pb-2.5 px-2 border-b-2 transition-colors ${
              activeTab === 'affiliate'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            💰 Affiliate Disclosure
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-2.5 px-2 border-b-2 transition-colors ${
              activeTab === 'terms'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📜 Terms & Grievance Officer
          </button>
        </div>

        {/* Policy Body */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4 text-xs text-slate-600 leading-relaxed scrollbar-thin">
          {/* TAB 1: DPDP ACT 2023 */}
          {activeTab === 'dpdp' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                <strong>Digital Personal Data Protection (DPDP) Act 2023 Compliance:</strong>{' '}
                Under India's DPDP Act, you have full ownership of your personal data. NestBasket collects only the bare minimum data (mobile phone number and locality) necessary to compare darkstore grocery prices within your delivery zone.
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  1. Your Rights as a Data Principal (Section 11-14, DPDP Act)
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Right to Access:</strong> You can request a summary of your personal data and processing activities at any time.</li>
                  <li><strong>Right to Correction & Erasure:</strong> You may correct inaccurate information or request total deletion of your profile and search history.</li>
                  <li><strong>Right of Grievance Redressal:</strong> Dedicated redressal directly by Founder & CEO Gopagani Arun within 48 hours.</li>
                  <li><strong>Right to Withdraw Consent:</strong> You can revoke your consent at any time, ceasing any future processing.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  2. Purpose Limitation & Data Minimization
                </h3>
                <p>
                  We collect your 10-digit mobile number strictly to authenticate your account and prevent fraudulent price scraping bots. We never sell, rent, or transfer your contact information to telemarketing call centers, credit card agents, or external data brokers.
                </p>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  3. Data Fiduciary Identity
                </h3>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1 font-medium text-slate-700">
                  <div><strong>Data Fiduciary Entity:</strong> NestBasket Technologies Pvt. Ltd.</div>
                  <div><strong>Founder, Owner & CEO:</strong> Gopagani Arun</div>
                  <div><strong>Grievance & Privacy Officer:</strong> gopaganiarungoud@gmail.com</div>
                  <div><strong>Data Storage Jurisdiction:</strong> Mumbai & Bengaluru Data Centers (Republic of India)</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AFFILIATE DISCLOSURE */}
          {activeTab === 'affiliate' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-medium">
                <strong>ASCI & Consumer Protection Disclosure:</strong> Transparency is our founding principle. NestBasket operates on a zero-markup model. You pay the exact same price (or lower) as ordering directly on store apps.
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  1. How NestBasket Generates Revenue
                </h3>
                <p>
                  NestBasket is free for all Indian consumers. To support darkstore scraping infrastructure, server bandwidth, and real-time syncing engines, we participate in affiliate partner programs with merchant platforms including <em>Amazon Associates, EarnKaro, BigBasket Partner Program, and Zepto / Blinkit promotional links</em>.
                </p>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  2. Zero Cost to You Guarantee
                </h3>
                <p>
                  When you click on an external link or smart basket deal and complete an order, the merchant may pay NestBasket a small referral commission (typically 2% to 4.5%). This fee is paid entirely by the store from their marketing budget. <strong>There is zero extra charge, zero surge, and zero hidden markup added to your bill.</strong>
                </p>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  3. Editorial Independence
                </h3>
                <p>
                  Our price ranking algorithms are 100% mathematical and objective. The app with the genuine lowest total bill is always highlighted as the winner, regardless of commission rates.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TERMS & GRIEVANCE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  1. Independent Price Aggregator Status
                </h3>
                <p>
                  NestBasket is an independent aggregator operated by <strong>Gopagani Arun</strong>. <em>Blinkit (Zomato Ltd), Zepto (KiranaKart Technologies), Swiggy Instamart (Bundl Technologies), BigBasket (Innovative Retail Concepts / Tata Neu), and Amazon Fresh</em> are trademarks of their respective owners. NestBasket has no direct corporate ownership or endorsement with these entities.
                </p>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  2. Price Accuracy Disclaimer
                </h3>
                <p>
                  While our multi-platform scrapers refresh prices multiple times daily, darkstore inventory and flash surge fees fluctuate minute-by-minute based on delivery rider availability. Final billing is verified at checkout on the destination application.
                </p>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                  3. Official Grievance Officer
                </h3>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1 font-medium text-slate-700">
                  <div><strong>Designated Grievance Officer:</strong> Gopagani Arun (Founder & CEO)</div>
                  <div><strong>Official Redressal:</strong> In-App Help & Problem Desk</div>
                  <div><strong>Official Support:</strong> support@NestBasket.com</div>
                  <div><strong>Jurisdiction:</strong> Hyderabad & Suryapet, Telangana, India</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Consent Status & Permission Action Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs">
            {hasConsented ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>DPDP Consent Active (Granted: {consentDate})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Permission required to personalize darkstore prices</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasConsented && (
              <button
                type="button"
                onClick={handleRevokeConsent}
                className="py-2 px-3 text-xs text-slate-500 hover:text-red-600 font-medium transition-colors"
              >
                Revoke Consent
              </button>
            )}

            <button
              onClick={handleGrantConsent}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{hasConsented ? 'Re-Affirm & Close' : 'I Agree & Understand (Grant DPDP Permission)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
