'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { PageSpeedInsightsData } from '@/types/audit'
import { useAuth } from '@/hooks/useAuth'
import { useUserPlan } from '@/hooks/useUserPlan'
import SkeletonLoader from '@/app/dashboard/components/SkeletonLoader'
import { featureCache, createCacheKey } from '@/lib/feature-cache'
import { formatPageSpeedScore, getScoreBgColor, getScoreColor } from '@/lib/pagespeed'

interface ImageData {
  size?: number
  loading?: string
  format?: string
}

interface PageData {
  id?: string
  user_id?: string
  url?: string
  html_content?: string
  images?: ImageData[]
  response_time?: number
  html_content_length?: number
  content_encoding?: string
  performance_analysis?: PageSpeedInsightsData
}

interface PerformanceTabProps {
  page: PageData
  cachedAnalysis?: PageSpeedInsightsData
}

export default function PerformanceTab({ page, cachedAnalysis }: PerformanceTabProps) {
  const [performanceData, setPerformanceData] = useState<PageSpeedInsightsData | null>(cachedAnalysis || null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [cacheVersion, setCacheVersion] = useState(0) // Force re-evaluation when cache is cleared
  const [hasAttemptedAnalysis, setHasAttemptedAnalysis] = useState(false) // Prevent multiple attempts
  const { user } = useAuth()
  const { hasFeature, loading: planLoading, refreshPlan, planInfo } = useUserPlan()
  
  // Debug: Log plan info when it changes
  useEffect(() => {
    console.log('[PerformanceTab] 📋 Plan Info Updated:', {
      planInfo,
      planType: planInfo?.plan_type,
      canUseFeatures: planInfo?.can_use_features,
      hasPerformanceMetrics: planInfo?.can_use_features?.includes('performance_metrics'),
      planLoading
    });
  }, [planInfo, planLoading]);
  
  // Check if user has access to performance metrics with caching
  const hasFeatureAccess = useMemo(() => {
    console.log('[PerformanceTab] 🔍 Checking feature access:', {
      accessDenied,
      userId: user?.id,
      planLoading,
      cacheVersion
    });
    
    // If access was denied, don't re-check (prevents loop)
    if (accessDenied) {
      console.log('[PerformanceTab] ❌ Access denied flag is true, returning false');
      return false;
    }
    
    const cacheKey = createCacheKey('performance_metrics', user?.id);
    
    // Return cached result if available
    const cachedResult = featureCache.get(cacheKey);
    console.log('[PerformanceTab] 📦 Cache check:', {
      cacheKey,
      cachedResult,
      isUndefined: cachedResult === undefined
    });
    
    if (cachedResult !== undefined) {
      console.log('[PerformanceTab] ✅ Using cached result:', cachedResult);
      return cachedResult;
    }
    
    // If still loading, return null to show skeleton
    if (planLoading) {
      console.log('[PerformanceTab] ⏳ Plan still loading, returning null');
      return null;
    }
    
    // Get fresh result and cache it
    const result = hasFeature('performance_metrics');
    console.log('[PerformanceTab] 🔎 Fresh feature check result:', result);
    featureCache.set(cacheKey, result);
    console.log('[PerformanceTab] 💾 Cached result:', result);
    return result;
  }, [hasFeature, user?.id, planLoading, cacheVersion, accessDenied]);

  // Update checking access state when feature access is determined
  useEffect(() => {
    console.log('[PerformanceTab] 🎯 hasFeatureAccess changed:', {
      hasFeatureAccess,
      accessDenied,
      isAnalyzing,
      hasAttemptedAnalysis
    });
    
    if (hasFeatureAccess !== null) {
      setIsCheckingAccess(false);
      
      // Only clear access denied if we explicitly confirm access (not just from cache)
      // This prevents clearing when accessDenied is set to prevent loops
      if (hasFeatureAccess === true && accessDenied && !isAnalyzing) {
        console.log('[PerformanceTab] ✅ Access restored, clearing denied state');
        // Small delay to ensure state is stable
        const timeoutId = setTimeout(() => {
          setAccessDenied(false);
          setHasAttemptedAnalysis(false); // Allow retry if access is restored
        }, 100);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [hasFeatureAccess, accessDenied, isAnalyzing, hasAttemptedAnalysis]);


  // Calculate performance score
  // const performanceScore = Math.round((
  //   (responseTime < 1000 ? 1 : responseTime < 2000 ? 0.5 : 0) +
  //   (contentLength < 100000 ? 1 : contentLength < 500000 ? 0.5 : 0) +
  //   (largeImages.length === 0 ? 1 : largeImages.length < imageCount * 0.3 ? 0.5 : 0) +
  //   (hasLazyLoading ? 1 : 0) +
  //   (hasModernFormats ? 1 : 0) +
  //   (hasAsyncScripts ? 1 : 0) +
  //   (hasMinifiedCSS ? 1 : 0) +
  //   (hasMinifiedJS ? 1 : 0) +
  //   (hasCDN ? 1 : 0) +
  //   (hasGzip ? 1 : 0)
  // ) / 10 * 100)

  // Initialize performance data
  useEffect(() => {
    if (cachedAnalysis) {
      setPerformanceData(cachedAnalysis)
    } else if (page.performance_analysis) {
      setPerformanceData(page.performance_analysis)
    } else {
      setPerformanceData(null)
    }
  }, [cachedAnalysis, page.performance_analysis])

  // Clean up expired cache entries on mount and verify access
  useEffect(() => {
    featureCache.clearExpired();
    
    // If plan info is loaded and user has access, clear any stale access denied state
    if (!planLoading && hasFeature('performance_metrics')) {
      const cacheKey = createCacheKey('performance_metrics', user?.id);
      const cachedValue = featureCache.get(cacheKey);
      
      // If cache says no access but plan says yes, clear cache and re-evaluate
      if (cachedValue === false) {
        featureCache.delete(cacheKey);
        setCacheVersion(prev => prev + 1);
        setAccessDenied(false);
      }
    }
  }, [planLoading, hasFeature, user?.id])

  const performPerformanceAnalysis = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isAnalyzing) {
      return;
    }
    
    try {
      setIsAnalyzing(true)
      setError(null)
      setHasAttemptedAnalysis(true)
      // alert('Performing performance analysis...')
      // Call performance analysis API
      const response = await fetch('/api/performance-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: page.id,
          url: page.url,
          userId: page.user_id
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Handle access denied error specifically
        if (response.status === 403 || errorData.error === 'Access denied') {
          console.error('[PerformanceTab] 🚫 Access denied from server:', {
            status: response.status,
            errorData,
            userId: page.user_id,
            pageId: page.id,
            url: page.url
          });
          
          // Set cache to false to prevent future attempts
          const cacheKey = createCacheKey('performance_metrics', user?.id);
          featureCache.set(cacheKey, false);
          console.log('[PerformanceTab] 💾 Set cache to false for:', cacheKey);
          
          // Set access denied state to show upgrade card
          setAccessDenied(true)
          setError(null)
          setIsAnalyzing(false)
          
          console.log('[PerformanceTab] 🚫 State updated:', {
            accessDenied: true,
            isAnalyzing: false,
            hasAttemptedAnalysis: true
          });
          
          // Don't refresh plan here - it causes infinite loop
          // User can manually refresh or navigate away and back
          
          return
        }
        
        throw new Error(errorData.error || `Performance analysis API error: ${response.status}`)
      }
      // alert('Performing performance success')/
      const result = await response.json()
      if (result.success) {
        setPerformanceData(result.analysis)
      } else {
        setError(result.error || 'Performance analysis failed')
      }
    } catch (err) {
      console.error('Error during performance analysis:', err)
      setError(err instanceof Error ? err.message : 'Failed to perform performance analysis')
    } finally {
      setIsAnalyzing(false)
    }
  }, [page.id, page.url, page.user_id, user?.id])

  // Automatically perform analysis when component loads (if no cached data and user has access)
  useEffect(() => {
    console.log('[PerformanceTab] 🔄 Auto-analysis check:', {
      hasFeatureAccess,
      performanceData: !!performanceData,
      isAnalyzing,
      error,
      accessDenied,
      hasAttemptedAnalysis,
      shouldCall: hasFeatureAccess && !performanceData && !isAnalyzing && !error && !accessDenied && !hasAttemptedAnalysis
    });
    
    // Don't auto-call if access was denied or already attempted (prevents infinite loop)
    if (hasFeatureAccess && !performanceData && !isAnalyzing && !error && !accessDenied && !hasAttemptedAnalysis) {
      console.log('[PerformanceTab] ▶️ Auto-triggering performance analysis');
      performPerformanceAnalysis();
    }
  }, [hasFeatureAccess, performanceData, isAnalyzing, error, accessDenied, hasAttemptedAnalysis, performPerformanceAnalysis])

  // Show skeleton loading while checking feature access
  if (isCheckingAccess || hasFeatureAccess === null) {
    console.log('[PerformanceTab] ⏳ Showing skeleton loader:', { isCheckingAccess, hasFeatureAccess });
    return <SkeletonLoader type="performance" />;
  }

  // Show upgrade card if user doesn't have access to performance metrics or access was denied
  console.log('[PerformanceTab] 🎨 Render decision:', {
    hasFeatureAccess,
    accessDenied,
    showUpgradeCard: hasFeatureAccess === false || accessDenied,
    planInfo: {
      planType: planInfo?.plan_type,
      features: planInfo?.can_use_features,
      hasPerformanceMetrics: planInfo?.can_use_features?.includes('performance_metrics')
    },
    isAnalyzing,
    hasAttemptedAnalysis,
    performanceData: !!performanceData
  });
  
  if (hasFeatureAccess === false || accessDenied) {
    return <div className="bg-white -lg border border-gray-300 p-4">
        <div className="flex items-center space-x-4">
          <div className="text-blue-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Performance Analysis tab</h3>
            <p className="text-sm text-gray-600 mb-3">
              This feature is not available in your current plan. Upgrade to access detailed performance metrics and PageSpeed Insights data.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Current plan: <span className="font-medium">Check your plan settings</span>
              </div>
              <button 
                onClick={() => window.location.href = '/dashboard?tab=profile&subtab=plans'}
                className="px-4 py-2 bg-blue-600 text-white -lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>;
  }

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="bg-white -lg border border-gray-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Performance Analysis</h2>
            <div className="flex items-center space-x-2">
              <div className="animate-spin -full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Analyzing performance...</span>
            </div>
          </div>
          
          {/* Enhanced loading message */}
          <div className="bg-blue-50 border border-blue-200 -lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Performance Analysis in Progress</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>We&apos;re running comprehensive performance tests on your page. This typically takes 30-60 seconds to complete.</p>
                 
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200  w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200  w-1/2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 -lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white -lg border border-gray-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Performance Analysis</h2>
            <span className="text-sm text-red-600">Analysis failed</span>
          </div>
          
          <div className="bg-red-50 border border-red-200 -lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Performance analysis failed</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={performPerformanceAnalysis}
                disabled={isAnalyzing}
                className="inline-flex items-center px-3 py-2 border border-red-300  text-sm leading-4 font-medium -md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin -full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Retrying...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No data state - show loading instead of manual trigger
  if (!performanceData && !isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="bg-white -lg border border-gray-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Performance Analysis</h2>
            <div className="flex items-center space-x-2">
              <div className="animate-spin -full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Starting analysis...</span>
            </div>
          </div>
          
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Preparing Performance Analysis</h3>
            <p className="mt-1 text-sm text-gray-500">This will start automatically...</p>
          </div>
        </div>
      </div>
    )
  }

  // Extract PageSpeed data
  const { lighthouseResult, loadingExperience } = performanceData as any
  const { categories, audits } = lighthouseResult

  // Chart component for scores (kept in-file to avoid cross-imports)
  const ScoreChart = ({ score, title, color, size = "w-24 h-24" }: { 
    score: number, 
    title: string, 
    color: string, 
    size?: string 
  }) => {
    const percentage = Math.round(score * 100)
    const circumference = 2 * Math.PI * 45 // radius = 45
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
    const isHexColor = color.startsWith('#')
    const strokeClassName = isHexColor ? '' : color
    
    return (
      <div className="flex flex-col items-center">
        <div className={`relative ${size}`}>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={isHexColor ? color : "currentColor"}
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className={strokeClassName}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900">{percentage}</span>
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mt-2 text-center">{title}</h3>
        <span className={`text-xs px-2 py-1 -full mt-1 ${getScoreBgColor(score)} ${getScoreColor(score)}`}>
          {formatPageSpeedScore(score)}
        </span>
      </div>
    )
  }

  // Metric card component (compact option for dense layout)
  const MetricCard = ({ 
    title, 
    value, 
    score, 
    description,
    compact = false
  }: { 
    title: string, 
    value: string, 
    score: number, 
    description?: string,
    compact?: boolean
  }) => {
    const hasValue = value && value !== 'N/A'
    const cardPadding = compact ? 'p-3 md:p-4' : 'p-4'
    const valueSize = compact ? 'text-xl' : 'text-2xl'
    const titleSize = compact ? 'text-xs md:text-sm' : 'text-sm'
    
    return (
      <div className={`bg-gray-50 -lg ${cardPadding} h-full flex flex-col`}>
        <div className="flex items-center mb-1.5 md:mb-2">
          <h4 className={`${titleSize} font-medium text-gray-900`}>{title}</h4>
          <span className={`text-xs px-2 py-1 -full ${getScoreBgColor(score)} ${getScoreColor(score)}`}>
            {formatPageSpeedScore(score)}
          </span>
        </div>
        {hasValue && (
          <p className={`${valueSize} font-bold text-gray-900 mb-1`}>{value}</p>
        )}
        {description && (
          <p className="text-xs text-gray-500 leading-snug">{description}</p>
        )}
        <div className="flex-1" />
      </div>
    )
  }

  return (
    <div>
      <div className="border-b border-gray-300 p-6">
        <h3 className="text-lg font-semibold text-gray-900">Overall Scores</h3>
        <div className="flex flex-wrap flex-row justify-around gap-6 mt-4">
          <ScoreChart 
            score={categories.performance?.score || 0} 
            title="Performance" 
            color="#FF4A00"
            size="w-20 h-20"
          />
          <ScoreChart 
            score={categories.accessibility?.score || 0} 
            title="Accessibility" 
            color="#FF4A00"
            size="w-20 h-20"
          />
          <ScoreChart 
            score={categories['best-practices']?.score || 0} 
            title="Best Practices" 
            color="#FF4A00"
            size="w-20 h-20"
          />
          <ScoreChart 
            score={categories.seo?.score || 0} 
            title="SEO" 
            color="#FF4A00"
            size="w-20 h-20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-r border-gray-300">
          <div className="border-b border-gray-300 p-6 break-inside-avoid bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
              <MetricCard
                title="Speed Index"
                value={audits['speed-index']?.displayValue || 'N/A'}
                score={audits['speed-index']?.score || 0}
                description="Visual loading speed"
                compact
              />
              <MetricCard
                title="Total Blocking Time"
                value={audits['total-blocking-time']?.displayValue || 'N/A'}
                score={audits['total-blocking-time']?.score || 0}
                description="Time blocked by long tasks"
                compact
              />
              <MetricCard
                title="Time to Interactive"
                value={audits['interactive']?.displayValue || 'N/A'}
                score={audits['interactive']?.score || 0}
                description="Time until page is interactive"
                compact
              />
              <MetricCard
                title="First Input Delay"
                value={audits['max-potential-fid']?.displayValue || 'N/A'}
                score={audits['max-potential-fid']?.score || 0}
                description="Input responsiveness"
                compact
              />
            </div>
          </div>

          <div className="border-b border-gray-300 p-6 break-inside-avoid bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
              <MetricCard
                title="Server Response Time"
                value={audits['server-response-time']?.displayValue || 'N/A'}
                score={audits['server-response-time']?.score || 0}
                description="Time for server to respond"
                compact
              />
              <MetricCard
                title="Total Resource Size"
                value={audits['total-byte-weight']?.displayValue || 'N/A'}
                score={audits['total-byte-weight']?.score || 0}
                description="Total bytes downloaded"
                compact
              />
              <MetricCard
                title="DOM Size"
                value={audits['dom-size']?.displayValue || 'N/A'}
                score={audits['dom-size']?.score || 0}
                description="Number of DOM elements"
                compact
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray-300 p-6 break-inside-avoid bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Core Web Vitals</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
              <MetricCard
                title="First Contentful Paint"
                value={audits['first-contentful-paint']?.displayValue || 'N/A'}
                score={audits['first-contentful-paint']?.score || 0}
                description="Time to first content render"
                compact
              />
              <MetricCard
                title="Largest Contentful Paint"
                value={audits['largest-contentful-paint']?.displayValue || 'N/A'}
                score={audits['largest-contentful-paint']?.score || 0}
                description="Time to largest content render"
                compact
              />
              <MetricCard
                title="Cumulative Layout Shift"
                value={audits['cumulative-layout-shift']?.displayValue || 'N/A'}
                score={audits['cumulative-layout-shift']?.score || 0}
                description="Visual stability measure"
                compact
              />
            </div>
          </div>

          <div className="border-b border-gray-300 p-6 break-inside-avoid bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Technical Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Test Configuration</h4>
                {lighthouseResult.configSettings.formFactor && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Form Factor:</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{lighthouseResult.configSettings.formFactor}</span>
                  </div>
                )}
                {lighthouseResult.configSettings.locale && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Locale:</span>
                    <span className="text-sm font-medium text-gray-900">{lighthouseResult.configSettings.locale}</span>
                  </div>
                )}
                {lighthouseResult.userAgent && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">User Agent:</span>
                    <span className="text-xs font-medium text-gray-900 truncate max-w-48" title={lighthouseResult.userAgent}>
                      {lighthouseResult.userAgent}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Analysis Information</h4>
                {lighthouseResult.finalUrl && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Final URL:</span>
                    <span className="text-xs font-medium text-gray-900 truncate max-w-48" title={lighthouseResult.finalUrl}>
                      {lighthouseResult.finalUrl}
                    </span>
                  </div>
                )}
                {performanceData?.version && performanceData.version.major !== undefined && performanceData.version.minor !== undefined && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Version:</span>
                    <span className="text-sm font-medium text-gray-900">{performanceData.version.major}.{performanceData.version.minor}</span>
                  </div>
                )}
                {lighthouseResult.runWarnings && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Warnings:</span>
                    <span className={`text-sm font-medium ${lighthouseResult.runWarnings.length > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {lighthouseResult.runWarnings.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loadingExperience?.metrics && (
            <div className="border-b border-gray-300 p-6 break-inside-avoid bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Real User Experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                {Object.entries(loadingExperience.metrics).map(([key, metric]) => {
                  const metricData = metric as { percentile?: number; category?: string }
                  const hasValue = metricData.percentile !== undefined && metricData.percentile !== null
                  return (
                    <MetricCard
                      key={key}
                      title={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      value={hasValue ? `${metricData.percentile}ms` : 'N/A'}
                      score={metricData.category === 'FAST' ? 0.9 : metricData.category === 'AVERAGE' ? 0.7 : 0.4}
                      description={`Real user data - ${metricData.category}`}
                      compact
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}