import React, { useState, useMemo } from 'react';
import { X, Shield, Lock, Mail, User, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../ui/Toast.tsx';
import { ClaySticker, STICKER_IMAGES } from '../ui/ClaySticker.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'register' }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const isEmailValid = useMemo(() => {
    return emailRegex.test(email.trim());
  }, [email]);

  // Password strength calculator
  const passwordEvaluation = useMemo(() => {
    const pwd = password;
    const hasMinLength = pwd.length >= 8;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (hasLower && hasUpper) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    let label = 'Weak';
    let colorClass = 'bg-rose-500';
    let textClass = 'text-rose-700';
    let barPercent = 25;

    if (!pwd) {
      barPercent = 0;
      label = 'Enter password';
      textClass = 'text-slate-400';
    } else if (score <= 2) {
      strength = 'weak';
      label = 'Weak Password';
      colorClass = 'bg-rose-500';
      textClass = 'text-rose-700';
      barPercent = 33;
    } else if (score <= 3) {
      strength = 'medium';
      label = 'Medium Strength';
      colorClass = 'bg-amber-500';
      textClass = 'text-amber-700';
      barPercent = 66;
    } else {
      strength = 'strong';
      label = 'Strong & Secure';
      colorClass = 'bg-emerald-500';
      textClass = 'text-emerald-700';
      barPercent = 100;
    }

    return {
      hasMinLength,
      hasLower,
      hasUpper,
      hasNumber,
      hasSpecial,
      strength,
      label,
      colorClass,
      textClass,
      barPercent,
    };
  }, [password]);

  // Password match validation
  const passwordsMatch = useMemo(() => {
    return password === confirmPassword;
  }, [password, confirmPassword]);

  if (!isOpen) return null;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Front-end validation checks
    if (!isEmailValid) {
      setError('Please provide a valid email address (e.g. yourname@example.com).');
      return;
    }

    if (mode === 'register') {
      if (!passwordEvaluation.hasMinLength) {
        setError('Password must contain at least 8 characters.');
        return;
      }
      if (!passwordEvaluation.hasNumber || (!passwordEvaluation.hasLower && !passwordEvaluation.hasUpper)) {
        setError('Password must contain both letters and numbers.');
        return;
      }
      if (!passwordsMatch) {
        setError('Passwords do not match. Please re-enter confirm password.');
        return;
      }
    } else {
      if (!password) {
        setError('Please enter your password.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email.trim().toLowerCase(), password);
        if (res.success) {
          showToast('Signed in successfully. Welcome back!', 'success');
          onClose();
        } else {
          setError(res.error || 'Authentication failed. Please check your credentials.');
        }
      } else {
        const res = await register(email.trim().toLowerCase(), password, name.trim());
        if (res.success) {
          showToast('Account created successfully! You are now logged in.', 'success');
          onClose();
        } else {
          setError(res.error || 'Registration failed.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
    setTouched({});
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="clay-card max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 my-auto relative">
        {/* Floating Verified Seal Sticker */}
        <div className="absolute -top-4 -right-3 pointer-events-none hidden sm:block">
          <ClaySticker
            imageSrc={STICKER_IMAGES.securitySeal}
            alt="Verified Security"
            size="sm"
            rotation={6}
          />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                {mode === 'register' ? 'Create Your Account' : 'Sign In to ScamShield'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {mode === 'register'
                  ? 'First create your account to unlock continuous scan history.'
                  : 'Enter your credentials to access your security telemetry.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informational Guidance Banner */}
        <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-2xl text-xs flex items-center gap-2.5 text-emerald-900 font-medium">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {mode === 'register'
              ? 'New to ScamShield? Create your account first, then log in anytime!'
              : 'Sign in with your registered email and secure password.'}
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl gap-1 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`py-2 px-3 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            1. Create Account
          </button>
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2 px-3 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            2. Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          {error && (
            <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Alex Vance"
                  className="w-full text-xs pl-8 pr-3 py-2.5 clay-inset text-slate-900 font-medium focus:outline-none"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          )}

          {/* Email with real-time validation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              {email && touched.email && (
                <span
                  className={`text-[10px] font-bold flex items-center gap-1 ${
                    isEmailValid ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {isEmailValid ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> Valid email format
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" /> Invalid email format
                    </>
                  )}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onBlur={() => handleBlur('email')}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className={`w-full text-xs pl-8 pr-8 py-2.5 clay-inset text-slate-900 font-medium focus:outline-none ${
                  touched.email && !isEmailValid && email
                    ? 'border border-rose-400 ring-1 ring-rose-200'
                    : ''
                }`}
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              {email && isEmailValid && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 absolute right-2.5 top-3" />
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {mode === 'register' ? 'Set Secure Password' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onBlur={() => handleBlur('password')}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-8 pr-9 py-2.5 clay-inset text-slate-900 font-medium focus:outline-none"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Password Strength Meter (Shown on Register) */}
            {mode === 'register' && password && (
              <div className="mt-2 space-y-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-600">Password Strength:</span>
                  <span className={`font-extrabold ${passwordEvaluation.textClass}`}>
                    {passwordEvaluation.label}
                  </span>
                </div>
                {/* Strength Bar */}
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordEvaluation.colorClass} transition-all duration-300 rounded-full`}
                    style={{ width: `${passwordEvaluation.barPercent}%` }}
                  />
                </div>
                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
                  <div className={`flex items-center gap-1 ${passwordEvaluation.hasMinLength ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-2.5 h-2.5" /> Min 8 characters
                  </div>
                  <div className={`flex items-center gap-1 ${passwordEvaluation.hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-2.5 h-2.5" /> Includes numbers
                  </div>
                  <div className={`flex items-center gap-1 ${(passwordEvaluation.hasLower && passwordEvaluation.hasUpper) ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-2.5 h-2.5" /> Mixed case letters
                  </div>
                  <div className={`flex items-center gap-1 ${passwordEvaluation.hasSpecial ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-2.5 h-2.5" /> Special symbol
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password (Register mode only) */}
          {mode === 'register' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Confirm Password
                </label>
                {confirmPassword && touched.confirmPassword && (
                  <span
                    className={`text-[10px] font-bold flex items-center gap-1 ${
                      passwordsMatch ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" /> Passwords do not match
                      </>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onBlur={() => handleBlur('confirmPassword')}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full text-xs pl-8 pr-9 py-2.5 clay-inset text-slate-900 font-medium focus:outline-none ${
                    touched.confirmPassword && !passwordsMatch && confirmPassword
                      ? 'border border-rose-400 ring-1 ring-rose-200'
                      : ''
                  }`}
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 p-0.5"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full clay-button-primary py-3 px-4 text-xs font-extrabold disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              'Processing Security Credentials...'
            ) : mode === 'register' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-emerald-300" />
                Create Account & Unlock Protection
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-emerald-300" />
                Sign In to Account
              </>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
          {mode === 'login' ? (
            <div>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="font-extrabold text-emerald-800 hover:text-emerald-950 underline ml-1"
              >
                Create Account First
              </button>
            </div>
          ) : (
            <div>
              Already created your account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-extrabold text-emerald-800 hover:text-emerald-950 underline ml-1"
              >
                Sign in here
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-slate-400 hover:text-slate-700 block mx-auto"
          >
            Continue as Guest without account
          </button>
        </div>
      </div>
    </div>
  );
};
