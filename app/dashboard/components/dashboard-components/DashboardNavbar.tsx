'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { roleVerifier } from '@/lib/role-utils';
import { useUserPlan } from '@/hooks/useUserPlan';
import UpgradePlanButton from '../UpgradePlanButton';

interface DashboardNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userProfile: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
    email_confirmed: boolean;
    created_at: string;
  } | null;
  selectedProjectId?: string | null;
}

export default function DashboardNavbar({
  activeTab,
  onTabChange,
  userProfile,
  selectedProjectId
}: DashboardNavbarProps) {
  const {
    signOut,
    user
  } = useSupabase();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [userInitial, setUserInitial] = useState<string>('U');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Get user plan information
  const {
    planInfo,
    loading: planLoading,
    refreshPlan
  } = useUserPlan();

  // Real-time role verification
  const verifyRole = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    try {
      const result = await roleVerifier.verifyUserRole(user.id, false);
      const adminStatus = result.isAdmin && result.verified;
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Navbar role verification error:', error);
      setIsAdmin(false);
    }
  }, [user]);
  
  useEffect(() => {
    verifyRole();
  }, [verifyRole]);

  // Update display name when userProfile or user changes
  useEffect(() => {
    if (userProfile?.first_name && userProfile?.last_name) {
      const fullName = `${userProfile.first_name} ${userProfile.last_name}`;
      setDisplayName(fullName);
      setUserInitial(userProfile.first_name[0].toUpperCase());
    } else if (userProfile?.first_name) {
      setDisplayName(userProfile.first_name);
      setUserInitial(userProfile.first_name[0].toUpperCase());
    } else if (userProfile?.last_name) {
      setDisplayName(userProfile.last_name);
      setUserInitial(userProfile.last_name[0].toUpperCase());
    } else if (user?.user_metadata?.full_name) {
      const googleName = user.user_metadata.full_name;
      setDisplayName(googleName);
      setUserInitial(googleName.trim()[0].toUpperCase());
    } else if (user?.user_metadata?.name) {
      const googleName = user.user_metadata.name;
      setDisplayName(googleName);
      setUserInitial(googleName.trim()[0].toUpperCase());
    } else if (userProfile?.email) {
      setDisplayName(userProfile.email.split('@')[0]);
      setUserInitial(userProfile.email[0].toUpperCase());
    } else if (user?.email) {
      setDisplayName(user.email.split('@')[0]);
      setUserInitial(user.email[0].toUpperCase());
    } else {
      setDisplayName('User');
      setUserInitial('U');
    }
  }, [userProfile, user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Memoize navigation items
  const navigationItems = useMemo(() => {
    const baseItems = [{
      id: 'dashboard',
      name: 'Dashboard',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
    }, {
      id: 'projects',
      name: 'Projects',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    }];

    // Add analysis tab if needed
    // if (activeTab === 'analysis' && selectedProjectId) {
    //   baseItems.push({
    //     id: 'analysis',
    //     name: 'Analysis',
    //     icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    //       </svg>
    //   });
    // }

    // Billing tab - acts as a direct link to profile billing
    baseItems.push({
      id: 'billing',
      name: 'Billing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7h18M3 11h18M7 15h2m4 0h2m-8 4h8a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )
    });

   
    return baseItems;
  }, [activeTab, selectedProjectId, isAdmin]);

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-white border-b border-gray-300 "
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/dashboard?tab=dashboard" className="flex items-center flex-shrink-0">
              <Image
                src="/orange-black-auditly.png"
                alt="Auditly360"
                width={124}
                height={43}
                className="h-8 w-auto"
              />
            </Link>

          
          </div>

          <div className="flex items-center space-x-8">
            {/* Logo */}
              {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'billing') {
                      router.push('/dashboard?tab=profile&subtab=billing');
                      return;
                    }
                    onTabChange(item.id);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === item.id
                      ? 'text-[#FF4B01]'
                      : 'text-gray-700 hover:text-[#FF4B01] hover:bg-gray-50'
                  }`}
                >
                  <span className={activeTab === item.id ? 'text-[#FF4B01]' : 'text-gray-500'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

          
          </div>

          {/* Right side - User Profile and Plan Info */}
          <div className="flex items-center space-x-4">
          
            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-[#ff4b01] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm">
                    {userInitial}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-black">
                    {displayName}
                  </p>
                  {/* <p className="text-xs text-gray-600">
                    {userProfile?.email || user?.email || ''}
                  </p> */}
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* User Info Section */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#ff4b01] rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-sm">
                            {userInitial}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-black truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {userProfile?.email || user?.email || ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    

                    {/* Menu Options */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          onTabChange('profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-black hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile</span>
                      </button>
                      
                      
                      {/* Admin button - only show if user is admin */}
                      {isAdmin === true && (
                        <button
                          onClick={() => {
                            onTabChange('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-black hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>Admin</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleSignOut();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-black hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                    {/* Plan Info in Dropdown */}
                    {planInfo && (
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                          Current Plan
                        </div>
                        <div className="text-sm font-medium text-black">
                          {planInfo.plan_name || 'Unknown Plan'}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                          <span>{planInfo.can_use_features?.length || 0} features</span>
                          <span>
                            {planInfo.max_projects === -1 ? 'Unlimited' : planInfo.max_projects || 0} projects
                          </span>
                        </div>
                        <div className=" py-2 w-full mt-2 border-gray-200">
                        <UpgradePlanButton 
                          href="/dashboard?tab=profile&subtab=billing"
                          className="w-full text-xs"
                          label="Upgrade Plan"
                        />
                      </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Show tabs below navbar on small screens */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex items-center overflow-x-auto px-4 space-x-1">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'billing') {
                  router.push('/dashboard?tab=profile&subtab=billing');
                  return;
                }
                onTabChange(item.id);
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === item.id
                  ? 'text-[#FF4B01] bg-[#ff4b01]/10'
                  : 'text-gray-700 hover:text-[#FF4B01] hover:bg-gray-50'
              }`}
            >
              <span className={activeTab === item.id ? 'text-[#FF4B01]' : 'text-gray-500'}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

