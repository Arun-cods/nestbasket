import React, { useState, useEffect } from 'react';
import {
  X,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Send,
  Smartphone,
  Store,
  Tag,
  Bug,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CustomerProblemTicket, UserProfile, CityOption } from '../types';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  selectedCity?: CityOption;
}

export const INITIAL_CUSTOMER_ISSUES: CustomerProblemTicket[] = [
  {
    id: 'PRB-1082',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    customerName: 'Suresh Reddy',
    customerPhone: '+91 9849011223',
    customerEmail: 'suresh.reddy@gmail.com',
    city: 'Hyderabad',
    society: 'Aparna Sarovar, Nallagandla',
    category: 'Price Mismatch',
    storeAffected: 'Zepto',
    subject: 'Amul Taaza 500ml price difference',
    description: 'NestBasket listed Zepto price as ₹27, but on Zepto app checkout it was ₹28. Please sync live darkstore prices.',
    status: 'OPEN',
    priority: 'HIGH',
    ownerNotes: 'Checking Zepto Nallagandla darkstore API endpoint.',
  },
  {
    id: 'PRB-1049',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 9820044556',
    customerEmail: 'ananya.d@gmail.com',
    city: 'Mumbai',
    society: 'Hiranandani Gardens, Powai',
    category: 'New Store Request',
    storeAffected: 'D-Mart Ready',
    subject: 'Please add D-Mart Ready to price comparison',
    description: 'Can you please add D-Mart Ready for staple groceries? Their prices are very competitive for pulses and edible oil.',
    status: 'OPEN',
    priority: 'MEDIUM',
  },
  {
    id: 'PRB-1011',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    customerName: 'Ravi Teja',
    customerPhone: '+91 9000188990',
    customerEmail: 'raviteja.k@gmail.com',
    city: 'Hyderabad',
    society: 'My Home Bhooja, Hitec City',
    category: 'Buy Link Broken',
    storeAffected: 'Blinkit',
    subject: 'Fortune Sunflower Oil link opened home page',
    description: 'When clicking Buy Now for Fortune Oil on Blinkit, it opened the Blinkit homepage instead of the product page.',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    ownerNotes: 'Fixed deep-link routing for Fortune Oil. Resolved by Arun.',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  }
];

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  selectedCity,
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [category, setCategory] = useState<CustomerProblemTicket['category']>('Price Mismatch');
  const [storeAffected, setStoreAffected] = useState('Zepto');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CustomerProblemTicket['priority']>('MEDIUM');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<CustomerProblemTicket | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number so our team can contact you.');
      return;
    }
    if (!subject.trim()) {
      setErrorMessage('Please provide a short subject or summary of the problem.');
      return;
    }
    if (description.trim().length < 10) {
      setErrorMessage('Please describe the problem in a bit more detail (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);

    const newTicket: CustomerProblemTicket = {
      id: 'PRB-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString(),
      customerName: name.trim(),
      customerPhone: '+91 ' + cleanPhone,
      customerEmail: email.trim() || undefined,
      city: currentUser?.city || selectedCity?.name || 'Hyderabad',
      society: currentUser?.society || 'Ameerpet',
      category,
      storeAffected,
      subject: subject.trim(),
      description: description.trim(),
      status: 'OPEN',
      priority,
    };

    try {
      const stored = localStorage.getItem('NestBasket_customer_issues');
      const existing: CustomerProblemTicket[] = stored ? JSON.parse(stored) : INITIAL_CUSTOMER_ISSUES;
      const updated = [newTicket, ...existing];
      localStorage.setItem('NestBasket_customer_issues', JSON.stringify(updated));

      // Dispatch global event so Owner section updates in real time
      window.dispatchEvent(new CustomEvent('NestBasket_new_problem', { detail: newTicket }));
    } catch (err) {
      console.warn('Failed to save issue locally:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedTicket(newTicket);
    }, 450);
  };

  const handleResetAndClose = () => {
    setSubmittedTicket(null);
    setSubject('');
    setDescription('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={handleResetAndClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-slate-200 overflow-hidden max-h-[92vh] overflow-y-auto">
          {/* Top Accent Gradient */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />

          {/* Close Button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {submittedTicket ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs mb-1">
                  Ticket #{submittedTicket.id}
                </div>
                <h3 className="font-black text-xl text-slate-900">
                  Problem Sent to Owner & CEO Desk!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your issue has been logged directly into the <strong className="text-slate-800">Founder & CEO Executive Console (Gopagani Arun)</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-500 text-[11px]">
                  <span>Category: <strong className="text-slate-800">{submittedTicket.category}</strong></span>
                  <span>Store: <strong className="text-slate-800">{submittedTicket.storeAffected}</strong></span>
                </div>
                <div className="font-bold text-slate-900">{submittedTicket.subject}</div>
                <p className="text-slate-600 text-[11px] leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                  "{submittedTicket.description}"
                </p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Contact: {submittedTicket.customerPhone}</span>
                  <span className="text-emerald-700 font-bold">Status: OPEN (Assigned to Arun)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Done & Return to Shopping
              </button>
            </div>
          ) : (
            /* PROBLEM SUBMISSION FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Header */}
              <div className="text-center space-y-1 pb-1">
                <div className="inline-flex p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs mb-1">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl text-slate-900">
                  Help & Problem Resolution Desk
                </h3>
                <p className="text-xs text-slate-500">
                  Encountered an issue? All tickets go directly to <strong className="text-emerald-800 font-bold">Founder & CEO Gopagani Arun</strong>.
                </p>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Problem Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  What kind of problem are you facing? *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: 'Price Mismatch', label: 'Price Mismatch', icon: Tag },
                    { id: 'Buy Link Broken', label: 'Buy Link Issue', icon: Store },
                    { id: 'OTP / Login', label: 'OTP / Login', icon: Smartphone },
                    { id: 'Missing Item', label: 'Missing Item', icon: Bug },
                    { id: 'New Store Request', label: 'Request Store', icon: Sparkles },
                    { id: 'Other', label: 'General Help', icon: HelpCircle },
                  ].map((cat) => {
                    const IconComponent = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as any)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="truncate text-[11px]">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Store Affected & Urgency Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store / Platform
                  </label>
                  <select
                    value={storeAffected}
                    onChange={(e) => setStoreAffected(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Zepto">Zepto</option>
                    <option value="Blinkit">Blinkit</option>
                    <option value="Swiggy Instamart">Swiggy Instamart</option>
                    <option value="BigBasket">BigBasket / BB Now</option>
                    <option value="Amazon Fresh">Amazon Fresh</option>
                    <option value="Flipkart Minutes">Flipkart Minutes</option>
                    <option value="JioMart">JioMart</option>
                    <option value="All Stores">All Stores / App Overall</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="LOW">Low (Feedback / Suggestion)</option>
                    <option value="MEDIUM">Medium (Normal)</option>
                    <option value="HIGH">High (Impacts Savings)</option>
                    <option value="URGENT">Urgent (App / Link Blocked)</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Problem Summary / Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Zepto price for Nandini Milk is ₹29 on app instead of ₹28"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Explanation *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe what happened, what you expected, or what brand/store needs correction..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (For Resolution Updates) *
                  </label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    <span className="px-2.5 py-2 text-xs font-bold text-slate-500 bg-slate-100 border-r border-slate-200">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile"
                      className="w-full px-3 py-2 bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending to Founder Console...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Problem to Owner Desk →</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reviewed directly by Gopagani Arun (Founder & CEO, NestBasket)</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
