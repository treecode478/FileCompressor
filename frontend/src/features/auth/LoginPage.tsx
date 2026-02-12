import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../store/auth.store';

export const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.post('/auth/phone/request-otp', { phone });
      setOtpRequested(true);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await apiClient.post('/auth/phone/verify-otp', { phone, otp });
      const { user, accessToken } = resp.data.data;
      setAuth({ user, accessToken });
      navigate({ to: '/' });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await apiClient.post('/auth/email/login', { email, password });
      const { user, accessToken } = resp.data.data;
      setAuth({ user, accessToken });
      navigate({ to: '/' });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-slate-50">
      <div className="kc-card w-full max-w-md p-6">
        <h1 className="mb-2 text-xl font-semibold text-slate-900">Welcome to KrishiConnect</h1>
        <p className="mb-4 text-sm text-slate-600">
          Connect with fellow farmers and experts. Login with your phone or email.
        </p>
        <div className="mb-4 flex rounded-lg bg-slate-100 p-1 text-xs font-medium">
          <button
            className={`flex-1 rounded-md px-2 py-1 ${
              mode === 'phone' ? 'bg-white shadow-sm' : 'text-slate-500'
            }`}
            onClick={() => setMode('phone')}
          >
            Phone OTP
          </button>
          <button
            className={`flex-1 rounded-md px-2 py-1 ${
              mode === 'email' ? 'bg-white shadow-sm' : 'text-slate-500'
            }`}
            onClick={() => setMode('email')}
          >
            Email
          </button>
        </div>

        {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}

        {mode === 'phone' ? (
          <div className="space-y-3">
            <input
              type="tel"
              className="kc-input"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {otpRequested && (
              <input
                type="text"
                className="kc-input"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            )}
            <button
              className="kc-btn-primary w-full"
              disabled={loading || !phone}
              onClick={otpRequested ? handleVerifyOtp : handleRequestOtp}
            >
              {loading ? 'Please wait...' : otpRequested ? 'Verify OTP' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="email"
              className="kc-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="kc-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="kc-btn-primary w-full"
              disabled={loading || !email || !password}
              onClick={handleEmailLogin}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

