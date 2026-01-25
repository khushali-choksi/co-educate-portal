'use client';

import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router?.push('/login-screen');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowUserMenu(false);
    }
  };

  const navItems = [
    { href: '/main-dashboard', label: 'Dashboard', icon: 'HomeIcon' },
    { href: '/receipt-listing-screen', label: 'Receipts', icon: 'DocumentTextIcon' },
    { href: '/receipt-type-selection', label: 'New Receipt', icon: 'PlusCircleIcon' },
  ];

  if (!user || pathname === '/login-screen') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border shadow-clinical z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/main-dashboard" className="flex items-center space-x-2">
              <img 
                src="/logo.jpeg" 
                alt="Core Educate Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-heading font-bold text-text-primary">
                CoreEducate
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navItems?.map((item) => {
                const isActive = pathname === item?.href;
                return (
                  <Link
                    key={item?.href}
                    href={item?.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium therapeutic-transition ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                    }`}
                  >
                    <Icon name={item?.icon} size={18} variant={isActive ? 'solid' : 'outline'} />
                    <span>{item?.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-muted therapeutic-transition"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="UserIcon" size={18} variant="solid" className="text-primary-foreground" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-text-primary">
                    Dr. Khushali Choksi
                  </p>
                  <p className="text-xs text-text-secondary capitalize">
                    {userProfile?.role || ''}
                  </p>
                </div>
                <Icon name="ChevronDownIcon" size={16} variant="outline" className="text-text-secondary" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-clinical-lg py-2">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-error hover:bg-error/10 therapeutic-transition disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin" />
                        <span>Signing out...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="ArrowRightOnRectangleIcon" size={18} variant="outline" />
                        <span>Sign Out</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;