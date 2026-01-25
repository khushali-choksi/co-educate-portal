'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import BrandHeader from './BrandHeader';
import LoginForm from './LoginForm';
import SecurityBadge from './SecurityBadge';
import PracticeInfo from './PracticeInfo';

const LoginInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router?.replace('/main-dashboard');
    }
  }, [user, loading, router]);

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="space-y-8 animate-pulse">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-96 bg-muted rounded-lg" />
            <div className="h-24 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Don't render login form if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl py-8 lg:py-12">
        <BrandHeader />
        <LoginForm />
        <SecurityBadge />
        <PracticeInfo />
      </div>
    </div>
  );
};

export default LoginInteractive;