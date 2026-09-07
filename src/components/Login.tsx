import React, { useState, useEffect } from 'react';
import { signInWithGoogle, setupRecaptcha, startPhoneAuth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserRole } from '../types';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Phone Auth State
  const [usePhoneAuth, setUsePhoneAuth] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  // Role Selection State
  const [needsRole, setNeedsRole] = useState<any>(null);

  useEffect(() => {
    // Look for invite phone parameter in URL
    const params = new URLSearchParams(window.location.search);
    const invitePhone = params.get('phone');
    if (invitePhone) {
      setUsePhoneAuth(true);
      setPhoneNumber(invitePhone);
    }
  }, []);

  const handleAuthSuccess = async (user: any) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      onLoginSuccess(userSnap.data());
      return;
    }

    // If new user, check for an invite via phone number
    if (user.phoneNumber) {
      const inviteRef = doc(db, 'invites', user.phoneNumber);
      const inviteSnap = await getDoc(inviteRef);
      if (inviteSnap.exists()) {
        const inviteData = inviteSnap.data();
        const newUser = {
          id: user.uid,
          name: user.displayName || user.phoneNumber || 'Worker',
          email: user.email || '',
          role: 'WORKER',
          employerId: inviteData.employerId
        };
        await setDoc(userRef, newUser);
        // Also delete the invite to prevent reuse? Optional.
        onLoginSuccess(newUser);
        return;
      }
    }

    // Otherwise, needs manual role selection
    setNeedsRole(user);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithGoogle();
      await handleAuthSuccess(result.user);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError("Please enter a valid phone number");
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const appVerifier = setupRecaptcha('recaptcha-container');
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const result = await startPhoneAuth(formattedPhone, appVerifier);
      setConfirmationResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || !confirmationResult) return;
    
    try {
      setLoading(true);
      setError('');
      const result = await confirmationResult.confirm(verificationCode);
      await handleAuthSuccess(result.user);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = async (role: UserRole) => {
    try {
      setLoading(true);
      const userRef = doc(db, 'users', needsRole.uid);
      const newUser: any = {
        id: needsRole.uid,
        name: needsRole.displayName || needsRole.phoneNumber || 'Unknown',
        email: needsRole.email || '',
        role: role,
      };
      if (role === 'WORKER') {
        newUser.employerId = 'DEMO_EMPLOYER'; // Fallback if no invite
      }
      await setDoc(userRef, newUser);
      onLoginSuccess(newUser);
    } catch (err: any) {
      setError(err.message || 'Failed to create user profile');
    } finally {
      setLoading(false);
    }
  };

  if (needsRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Choose your role</h2>
          <p className="text-gray-600 text-center mb-8">How will you be using SiteFlow?</p>
          <div className="space-y-4">
            <button
              onClick={() => handleSelectRole('OWNER')}
              disabled={loading}
              className="w-full flex items-center justify-center p-4 border-2 border-blue-500 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              <div className="text-left">
                <div className="font-bold text-lg">Site Owner / Manager</div>
                <div className="text-sm opacity-80">I manage projects and oversee workers</div>
              </div>
            </button>
            <button
              onClick={() => handleSelectRole('WORKER')}
              disabled={loading}
              className="w-full flex items-center justify-center p-4 border-2 border-emerald-500 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors disabled:opacity-50"
            >
              <div className="text-left">
                <div className="font-bold text-lg">Site Worker</div>
                <div className="text-sm opacity-80">I complete tasks and report progress</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SiteFlow</h1>
          <p className="text-gray-500">Manage your construction sites efficiently.</p>
        </div>
        
        {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

        <div id="recaptcha-container"></div>

        {!usePhoneAuth ? (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              onClick={() => setUsePhoneAuth(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Sign in with Phone Number
            </button>
          </div>
        ) : !confirmationResult ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (with country code)</label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !phoneNumber}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending code...' : 'Send Verification Code'}
            </button>
            <button
              type="button"
              onClick={() => setUsePhoneAuth(false)}
              className="w-full text-gray-500 py-2 hover:text-gray-700 text-sm font-medium"
            >
              Back to Google Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-digit Code</label>
              <input
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-lg tracking-widest"
                required
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
