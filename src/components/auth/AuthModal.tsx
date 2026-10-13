import React, { useState } from 'react';
import { X, Shield, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../ui/Toast.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          showToast('Signed in successfully.', 'success');
          onClose();
        } else {
          setError(res.error || 'Authentication failed.');
        }
      } else {
        const res = await register(email, password, name);
        if (res.success) {
          showToast('Account registered successfully.', 'success');
          onClose();
        } else {
          setError(res.error || 'Registration failed.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseDemoAccount = () => {
    setEmail('analyst@scamshield.ai');
    setPassword('DemoSecure123!');
    setMode('login');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="clay-card max-w-sm w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {mode === 'login' ? 'Sign In to ScamShield' : 'Create Free Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo Account Quick Shortcut */}
        <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-xs space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950">Evaluation Account:</span>
            <button
              type="button"
              onClick={handleUseDemoAccount}
              className="text-[11px] underline font-extrabold text-emerald-800 hover:text-emerald-950"
            >
              Fill Credentials
            </button>
          </div>
          <p className="text-[11px] text-emerald-950 font-mono">
            analyst@scamshield.ai / DemoSecure123!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Security Analyst"
                  className="w-full text-xs pl-8 pr-3 py-2.5 clay-inset text-slate-900 font-medium focus:outline-none"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@scamshield.ai"
                className="w-full text-xs pl-8 pr-3 py-2.5 clay-inset text-slate-900 font-medium focus:outline-none"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-8 pr-3 py-2.5 clay-inset text-slate-900 font-medium focus:outline-none"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full clay-button-primary py-2.5 px-3 text-xs font-bold disabled:opacity-50"
          >
            {isSubmitting
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode & Guest continue */}
        <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2 text-center text-xs text-slate-500">
          <div>
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="font-semibold text-emerald-800 hover:underline"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-semibold text-emerald-800 hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-slate-400 hover:text-slate-700"
          >
            Continue as Guest without account
          </button>
        </div>
      </div>
    </div>
  );
};
