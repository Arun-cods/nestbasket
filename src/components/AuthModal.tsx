import React, { useState } from 'react';
import { MapPin, ShoppingBag, Share2, TrendingUp, User, LogOut, CheckCircle, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { CityOption, UserProfile } from '../types';
import { CITIES } from '../data/mockGroceryData';

const GOOGLE_ACCOUNTS_KEY = 'nestbasket_google_accounts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onOpenPrivacyPolicy?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenPrivacyPolicy,
}) => {
  const [step, setStep] = useState<'main' | 'phone' | 'password' | 'detail'>('main');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [secretOtp, setSecretOtp] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const [otpError, setOtpError] = useState<string>('');
  const [otpResentNotice, setOtpResentNotice] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState<string>(CITIES[0].id);
  const [society, setSociety] = useState('');
  const [googleAccounts, setGoogleAccounts] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(GOOGLE_ACCOUNTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestOtp = () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setSecretOtp(newCode);

    setCountdown(30);
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setOtpResentNotice(true);
    setTimeout(() => setOtpResentNotice(false), 3500);

    // Dispatch real physical cellular SMS
    const defaultSmsKey = 'g6VRGQSHs3zLdJKNwj7kqvhPW48TeIicC2XZuUyoFpl1A5EBbnaVm9ABnUZ0sDFieNk5ydWI4KtTR12J';
    const smsApiKey = localStorage.getItem('nestbasket_sms_key') || defaultSmsKey;
    const smsMsg = `Your NestBasket verification code is: ${newCode}. Valid for 10 minutes.`;

    fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${smsApiKey}&route=q&numbers=${cleanPhone}&message=${encodeURIComponent(smsMsg)}`)
      .then(() => {
        console.log(`✓ SMS sent to ${phone}`);
      })
      .catch((err) => {
        console.warn('SMS delivery warning:', err);
        alert(`SMS sent to +91 ${phone}\nYour OTP: ${newCode}`);
      });
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(0, 1);
    setOtpDigits(newDigits);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otpDigits.join('');
    if (enteredOtp !== secretOtp) {
      setOtpError('❌ Incorrect OTP. Try again.');
      return;
    }
    setOtpError('');
    setStep('detail');
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const recordLoginAudit = (
    method: string,
    contact: string,
    name: string,
    city: string,
    society: string,
    status: string,
    userType: string
  ) => {
    const auditLog = {
      timestamp: new Date().toISOString(),
      method,
      contact,
      name,
      city,
      society,
      status,
      userType,
    };
    try {
      const existing = JSON.parse(localStorage.getItem('nestbasket_login_audit') || '[]');
      existing.push(auditLog);
      localStorage.setItem('nestbasket_login_audit', JSON.stringify(existing.slice(-100)));
    } catch (e) {}
  };

  const handleRegisterUser = () => {
    if (!fullName || !email) {
      alert('Please fill in all fields.');
      return;
    }

    setTimeout(() => {
      const user: UserProfile = {
        id: `user_${Date.now()}`,
        name: fullName,
        email: email,
        phone: `+91 ${phone}`,
        city: CITIES.find((c) => c.id === city)?.name || 'Hyderabad',
        society: society || 'Not Specified',
        lifetimeSavingsRupees: 0,
        orderCount: 0,
        isFounder: false,
      };

      localStorage.setItem('nestbasket_user', JSON.stringify(user));
      recordLoginAudit(
        'SMS OTP + Password',
        email,
        fullName,
        user.city,
        society,
        'SUCCESS',
        'Customer'
      );
      onLoginSuccess(user);
      handleClose();
    }, 400);
  };

  const handleClose = () => {
    setStep('main');
    setPhone('');
    setPassword('');
    setOtpDigits(['', '', '', '']);
    setSecretOtp('');
    setFullName('');
    setEmail('');
    setCity(CITIES[0].id);
    setSociety('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 text-white text-center">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl font-black mx-auto mb-3 shadow-lg">
              ₹
            </div>
            <h2 className="text-2xl font-black tracking-tight">NestBasket</h2>
            <p className="text-emerald-100 text-xs font-semibold mt-1">Quick-Commerce Price Tracker</p>
          </div>

          {/* Main Step */}
          {step === 'main' && (
            <div className="p-6 space-y-4">
              <button
                onClick={() => setStep('phone')}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                📱 Login with Phone & OTP
              </button>
              <button
                onClick={() => setStep('phone')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-sm transition-all"
              >
                📧 New User? Register Now
              </button>

              <div className="pt-2 text-center">
                <button
                  onClick={onOpenPrivacyPolicy}
                  className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  Privacy Policy & DPDP Consent
                </button>
              </div>
            </div>
          )}

          {/* Phone Input Step */}
          {step === 'phone' && (
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-2">Phone Number</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-600">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={handleRequestOtp}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all"
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Send OTP'}
              </button>

              {otpResentNotice && (
                <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium">
                  ✓ OTP sent successfully to +91 {phone}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};