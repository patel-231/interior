import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      let userData;
      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        // Create new organization for the first user or something?
        // Let's create a default org for them
        const orgId = `org_${user.uid}`;
        await setDoc(doc(db, 'organizations', orgId), {
          id: orgId,
          name: `${user.displayName || 'User'}'s Organization`,
          createdAt: Date.now()
        });

        userData = {
          id: user.uid,
          organizationId: orgId,
          name: user.displayName || 'Unknown User',
          email: user.email,
          phone: user.phoneNumber || '',
          role: 'OWNER',
          profilePhoto: user.photoURL || '',
          createdAt: Date.now()
        };
        await setDoc(userRef, userData);
      }
      
      onLoginSuccess(userData);
    } catch (err: any) {
      console.error("Login error", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#1E2022] mb-2 text-center">SiteFlow</h1>
        <p className="text-[#7A756F] text-center mb-8">Sign in to manage your construction sites.</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-[#1E2022] text-white py-3.5 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};
