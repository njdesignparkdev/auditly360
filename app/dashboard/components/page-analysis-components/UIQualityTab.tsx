'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowPathIcon, CameraIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Masonry from 'react-masonry-css'
import { useUserPlan } from '@/hooks/useUserPlan'
import { useScreenshot } from '@/lib/api-client'
import {
  AIPoweredPageAnalysis,
  ContentAnalysisCard,
  UIUXAnalysisCard,
  DesignPatternsSection,
  BrandConsistencySection,
  DetailedSummarySection,
  AIAnalysisRecommendations,
  PageStructureOverview,
  AccessibilityAnalysisCard,
  CodeQualityAnalysisCard,
  PerformanceIndicatorsCard,
  ModernStandardsCard,
  ComprehensiveRecommendations
} from './ui-quality-components'

interface UIQualityTabProps {
  page: {
    id?: string
    html_content: string | null
    url?: string
    page_image?: {
      url?: string
      imageUrl?: string
      screenshotUrl?: string
      desktop?: {
        url?: string
        imageUrl?: string
        screenshotUrl?: string
        [key: string]: any
      }
      mobile?: {
        url?: string
        imageUrl?: string
        screenshotUrl?: string
        [key: string]: any
      } | null
      [key: string]: any
    } | null
  }
}

interface QualityMetric {
  name: string
  value: number
  max: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  description: string
}

interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'accessibility' | 'performance' | 'structure' | 'modern-standards'
  impact: string
}

interface ImageAnalysis {
  desktop?: {
    ui_ux_score: number
    content_score: number
    overall_score: number
    [key: string]: any
  }
  mobile?: {
    ui_ux_score: number
    content_score: number
    overall_score: number
    [key: string]: any
  } | null
  ui_ux_score: number
  content_score: number
  overall_score: number
  ui_ux_analysis: {
    layout_score: number
    color_scheme_score: number
    typography_score: number
    spacing_score: number
    visual_hierarchy_score: number
    accessibility_score?: number
    mobile_responsiveness_score?: number
    navigation_score?: number
    call_to_action_score?: number
    issues: Array<{
      type: string
      severity: 'high' | 'medium' | 'low'
      heading?: string
      problem?: string
      solution?: string
      description?: string
      suggestion?: string
      location?: string
      impact?: string
    }>
    strengths: string[]
    detailed_metrics?: {
      color_contrast_ratio?: string
      font_sizes_used?: string[]
      spacing_consistency?: string
      element_alignment?: string
      visual_balance?: string
    }
  }
  content_analysis: {
    readability_score: number
    clarity_score: number
    structure_score: number
    seo_score?: number
    content_length_score?: number
    heading_structure_score?: number
    issues: Array<{
      type: string
      severity: 'high' | 'medium' | 'low'
      description: string
      suggestion: string
      location?: string
    }>
    strengths: string[]
    detailed_metrics?: {
      word_count_estimate?: number
      heading_count?: number
      paragraph_count?: number
      list_usage?: string
      content_density?: string
    }
  }
  design_patterns?: {
    identified_patterns?: string[]
    modern_design_elements?: string[]
    outdated_elements?: string[]
    best_practices_followed?: string[]
    best_practices_missing?: string[]
  }
  brand_consistency?: {
    score?: number
    color_consistency?: string
    typography_consistency?: string
    style_consistency?: string
    issues?: Array<{
      description: string
      suggestion: string
    }>
  }
  recommendations: Array<{
    category?: string
    priority?: 'high' | 'medium' | 'low'
    title?: string
    description?: string
    impact?: string
    effort?: 'low' | 'medium' | 'high'
  }> | string[]
  summary: string
  detailed_summary?: {
    overall_assessment?: string
    key_strengths?: string[]
    key_weaknesses?: string[]
    quick_wins?: string[]
    long_term_improvements?: string[]
  }
  analysis_timestamp: string
}

export default function UIQualityTab({ page }: UIQualityTabProps) {
  const content = page.html_content || ''
  const { hasFeature, loading: planLoading, planInfo } = useUserPlan()
  const hasScreenshotAccess = hasFeature('capture_screenshot')
  
  // Log plan features for debugging
  useEffect(() => {
    if (!planLoading && planInfo) {
      console.log('UIQualityTab - Plan Features*****************************************************:', {
        planType: planInfo.plan_type,
        planName: planInfo.plan_name,
        can_use_features: planInfo.can_use_features,
        hasScreenshotAccess,
        featuresCount: planInfo.can_use_features?.length || 0
      })
    }
  }, [planLoading, planInfo, hasScreenshotAccess])
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [desktopScreenshotUrl, setDesktopScreenshotUrl] = useState<string | null>(null)
  const [mobileScreenshotUrl, setMobileScreenshotUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [hasCheckedDatabase, setHasCheckedDatabase] = useState(false)
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null)
  const [currentStep, setCurrentStep] = useState<'idle' | 'capturing' | 'analyzing' | 'complete'>('idle')

  // Use the screenshot API client hook
  const {
    takeScreenshot: apiTakeScreenshot,
    isProcessing: apiIsProcessing,
    error: apiError,
    clearError: clearApiError,
  } = useScreenshot({
    onError: (error) => {
      console.error('Screenshot API error:', error)
      setProcessingError(error.message || 'Failed to capture screenshot')
    },
  })

  // Refs to prevent duplicate API calls and handle cleanup
  const isProcessingRef = useRef(false)
  const currentPageIdRef = useRef<string | undefined>(undefined)
  const abortControllerRef = useRef<AbortController | null>(null)
  const hasInitializedRef = useRef<string | undefined>(undefined) // Track which pages have been initialized
  const processingCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Helper to persist processing state in sessionStorage
  const setProcessingState = (pageId: string | undefined, isProcessing: boolean) => {
    if (typeof window === 'undefined') return
    if (isProcessing && pageId) {
      sessionStorage.setItem(`ui-quality-processing-${pageId}`, 'true')
      sessionStorage.setItem(`ui-quality-processing-page-id`, pageId)
    } else {
      if (pageId) {
        sessionStorage.removeItem(`ui-quality-processing-${pageId}`)
      }
      sessionStorage.removeItem('ui-quality-processing-page-id')
    }
  }

  // Helper to check if processing state exists in sessionStorage
  const getProcessingState = (pageId: string): boolean => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(`ui-quality-processing-${pageId}`) === 'true'
  }

  // Unified process: Capture screenshot and analyze in one flow
  const processPageAnalysis = async (forceRetake: boolean = false) => {
    // Check if user has access to screenshot feature
    if (!hasScreenshotAccess) {
      setProcessingError('Screenshot capture is a premium feature. Please upgrade your plan to access this feature.')
      return
    }

    if (!page.url || !page.id) {
      setProcessingError('No URL or page ID available')
        return
      }

    // Prevent duplicate calls - if already processing the same page, skip
    if (isProcessingRef.current && !forceRetake) {
      if (currentPageIdRef.current === page.id) {
        console.log('Already processing this page, skipping duplicate call')
        return
      }
    }

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // Mark as processing and update page ID
    isProcessingRef.current = true
    currentPageIdRef.current = page.id
    hasInitializedRef.current = page.id // Mark as initialized to prevent re-triggering
    
    // Persist processing state to survive tab switches
    setProcessingState(page.id, true)

    setProcessing(true)
    setProcessingError(null)
    clearApiError() // Clear any previous API errors
    setCurrentStep('capturing')
    setImageAnalysis(null)

    try {
      // Step 1: Capture screenshot using API client
      setCurrentStep('capturing')
      
      // Use the API client hook to take screenshot
      const screenshotData = await apiTakeScreenshot(
        page.url,
        {
          delay: 3000
        },
        page.id
      )

      // Handle API client errors
      if (!screenshotData) {
        if (apiError) {
          throw new Error(apiError.message || 'Failed to capture screenshot')
        }
        throw new Error('Failed to capture screenshot: No response received')
      }

      // Extract desktop and mobile URLs from response
      const desktopUrl = screenshotData.desktop?.screenshotUrl ||
                        screenshotData.desktop?.url ||
                        screenshotData.desktopUrl || 
                        screenshotData.data?.desktop?.screenshotUrl ||
                        screenshotData.data?.desktop?.url ||
                        screenshotData.screenshots?.desktop?.screenshotUrl ||
                        screenshotData.screenshots?.desktop?.url ||
                        screenshotData.url || 
                        screenshotData.data?.url || 
                        screenshotData.data?.imageUrl || 
                        screenshotData.data?.screenshotUrl
      
      const mobileUrl = screenshotData.mobile?.screenshotUrl ||
                       screenshotData.mobile?.url ||
                       screenshotData.mobileUrl || 
                       screenshotData.data?.mobile?.screenshotUrl ||
                       screenshotData.data?.mobile?.url ||
                       screenshotData.screenshots?.mobile?.screenshotUrl ||
                       screenshotData.screenshots?.mobile?.url
      
      // If desktop URL exists, we can proceed even if there was an error or mobile failed
      if (desktopUrl) {
        // Log warning if mobile failed but desktop succeeded (non-blocking)
        if (!mobileUrl && (screenshotData.success === 'partial' || screenshotData.success === false)) {
          console.warn('⚠️ Mobile screenshot failed, but desktop screenshot succeeded. Proceeding with desktop only.')
          // Show warning message if provided
          if (screenshotData.warning) {
            console.info('ℹ️', screenshotData.warning)
          }
          // Don't set this as a blocking error - just show a warning message
          // The analysis will proceed with desktop only
        }
      } else {
        // Only throw error if desktop URL is missing
        const errorMsg = screenshotData.details || screenshotData.error || screenshotData.message || 'Invalid response format: no desktop image URL found'
        throw new Error(errorMsg)
      }

      // Set both URLs
      setDesktopScreenshotUrl(desktopUrl)
      setMobileScreenshotUrl(mobileUrl || null)
      setScreenshotUrl(desktopUrl) // Keep legacy for backward compatibility

      // Step 2: Analyze both images immediately (no delay)
      // Note: Not using abort signal to allow requests to continue when component unmounts
      setCurrentStep('analyzing')
      const analysisResponse = await fetch('/api/image-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: page.id,
          desktopUrl,
          mobileUrl: mobileUrl || null,
          pageUrl: page.url,
          userId: null
        })
        // Removed signal to allow requests to continue in background
      })

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json().catch(() => ({}))
        // Don't throw error if analysis fails, just show the screenshot
        console.error('Analysis error:', errorData)
        setProcessingError(errorData.details || errorData.error || 'Analysis failed, but screenshot captured')
        setCurrentStep('complete')
        return
      }

      const analysisData = await analysisResponse.json()
      if (analysisData.analysis) {
        // Handle both new format (with desktop/mobile) and old format
        const analysis = analysisData.analysis
        if (analysis.desktop) {
          // New format: use desktop analysis as primary, but keep both
          setImageAnalysis(analysis)
        } else {
          // Old format: single analysis
          setImageAnalysis(analysis)
        }
      }
      
      setCurrentStep('complete')
      
      // Clear processing state from sessionStorage on success
      setProcessingState(page.id, false)
      } catch (error) {
      // Log and show error
      console.error('Error processing page analysis:', error)
      setProcessingError(error instanceof Error ? error.message : 'Failed to process page analysis')
      setCurrentStep('complete')
      
      // Clear processing state from sessionStorage on error
      setProcessingState(page.id, false)
      } finally {
      // Reset processing state
      setProcessing(false)
      isProcessingRef.current = false
      
      // Clear abort controller if it's the current one
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null
      }
    }
  }

  const handleRetakeScreenshot = async () => {
    if (!page.id || !page.url) {
      setProcessingError('No page ID or URL available')
      return
    }

    try {
      setProcessingError(null)
      setProcessing(true)
      setCurrentStep('capturing')

      // Clear local state so we don't show stale data
      setImageAnalysis(null)
      setScreenshotUrl(null)
      setDesktopScreenshotUrl(null)
      setMobileScreenshotUrl(null)
      setProcessingState(page.id, false)

      const response = await fetch(`/api/image-analysis?pageId=${page.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to clear previous analysis')
      }
    } catch (error) {
      console.error('Error resetting analysis data:', error)
      setProcessing(false)
      setProcessingError(error instanceof Error ? error.message : 'Failed to reset analysis data')
      return
    }

    // Proceed with fresh capture and analysis
    processPageAnalysis(true)
  }

  // Check if image exists in database - only load existing data, don't trigger new analysis
  useEffect(() => {
    // Wait for plan loading to complete
    if (planLoading) return

    // Check sessionStorage for processing state when component mounts/remounts
    if (page.id && hasScreenshotAccess) {
      const wasProcessing = getProcessingState(page.id)
      
      if (wasProcessing) {
        // We were processing this page - restore processing state and start polling
        isProcessingRef.current = true
        currentPageIdRef.current = page.id
        setProcessing(true)
        setCurrentStep('analyzing')
        
        // Immediately check if analysis completed while away
        fetch(`/api/image-analysis?pageId=${page.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.analysis) {
              // Analysis completed while away - update state
              setImageAnalysis(data.analysis)
              setCurrentStep('complete')
              setProcessing(false)
              isProcessingRef.current = false
              hasInitializedRef.current = page.id
              setProcessingState(page.id, false)
            }
            // If no analysis, polling will continue below
          })
          .catch(() => {
            // Silently fail - polling will continue
          })
      }
    }

    // Abort any ongoing requests for previous page (only on page change, not unmount)
    if (abortControllerRef.current && currentPageIdRef.current !== page.id && currentPageIdRef.current !== undefined) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      isProcessingRef.current = false
      setProcessingState(currentPageIdRef.current, false)
    }

    // Reset check state when page changes (only if it's a different page)
    if (currentPageIdRef.current !== page.id) {
      setHasCheckedDatabase(false)
      setProcessingError(null)
      if (!getProcessingState(page.id || '')) {
        setCurrentStep('idle')
      }
      hasInitializedRef.current = undefined // Reset initialization flag for new page
    }

    // Check database first - look for valid image URL and analysis
    // Support both new format (desktop/mobile) and legacy format
    const desktopImageUrl = page.page_image?.desktop?.screenshotUrl ||
                           page.page_image?.desktop?.url || 
                           page.page_image?.url || 
                           page.page_image?.imageUrl || 
                           page.page_image?.screenshotUrl
    const mobileImageUrl = page.page_image?.mobile?.screenshotUrl ||
                          page.page_image?.mobile?.url
    
    if (desktopImageUrl && typeof desktopImageUrl === 'string' && desktopImageUrl.trim() !== '') {
      // Image exists in database, use it (even if user doesn't have access, show existing screenshots)
      setDesktopScreenshotUrl(desktopImageUrl)
      setMobileScreenshotUrl(mobileImageUrl && typeof mobileImageUrl === 'string' ? mobileImageUrl : null)
      setScreenshotUrl(desktopImageUrl) // Keep legacy for backward compatibility
      setHasCheckedDatabase(true)
      
      // Mark as initialized since we found image in database
      if (!hasInitializedRef.current) {
        hasInitializedRef.current = page.id
      }
      
      // Check if analysis also exists - if so, fetch it; otherwise trigger new analysis automatically
      if (page.id && page.url && hasScreenshotAccess) {
        // Only trigger if not already processing this page
        const isProcessingSamePage = isProcessingRef.current && currentPageIdRef.current === page.id
        if (!isProcessingSamePage) {
          // Try to get existing analysis first
          fetch(`/api/image-analysis?pageId=${page.id}`)
            .then(res => res.json())
            .then(data => {
              if (data.analysis) {
                setImageAnalysis(data.analysis)
                setCurrentStep('complete')
                hasInitializedRef.current = page.id // Mark as initialized since we have analysis
              } else {
                // No analysis exists, trigger it automatically
                const stillProcessingSamePage = isProcessingRef.current && currentPageIdRef.current === page.id
                if (!stillProcessingSamePage) {
                  processPageAnalysis(false)
                }
              }
            })
            .catch(() => {
              // If check fails, trigger new analysis automatically
              const stillProcessingSamePage = isProcessingRef.current && currentPageIdRef.current === page.id
              if (!stillProcessingSamePage) {
                processPageAnalysis(false)
              }
            })
        }
      }
      return
    }

    // No valid image in database - check if we can fetch one
    if (!page.url || !page.id) {
      if (!page.url) {
        setProcessingError('No URL available')
      }
      setHasCheckedDatabase(true)
      return
    }

    // No image in database, start the full process automatically (only if user has access and not already processing)
    setHasCheckedDatabase(true)
    const isProcessingSamePage = isProcessingRef.current && currentPageIdRef.current === page.id
    if (hasScreenshotAccess && !isProcessingSamePage) {
      processPageAnalysis(false)
    }

    // Cleanup function - only abort when page.id changes, not on unmount
    // This allows analysis to continue in background when switching tabs
    return () => {
      // Only abort if page.id changed (handled above in the effect)
      // Don't abort on unmount - let requests complete in background
      // The abort for page changes is already handled above
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.id, planLoading, hasScreenshotAccess]) // Depend on plan loading and access

  // Poll for completion when processing - checks if analysis completed in background
  // This works even if component was unmounted and remounted
  useEffect(() => {
    // Check both processing state and sessionStorage
    const shouldPoll = (processing || getProcessingState(page.id || '')) && 
                      page.id && 
                      hasScreenshotAccess &&
                      currentPageIdRef.current === page.id

    if (!shouldPoll) {
      // Clear any existing interval
      if (processingCheckIntervalRef.current) {
        clearInterval(processingCheckIntervalRef.current)
        processingCheckIntervalRef.current = null
      }
      return
    }

    // Ensure processing state is set
    if (!processing) {
      setProcessing(true)
    }

    // Poll every 3 seconds to check if analysis completed
    const pollInterval = setInterval(() => {
      // Double-check we should still be polling
      if (!getProcessingState(page.id || '') && !isProcessingRef.current) {
        clearInterval(pollInterval)
        processingCheckIntervalRef.current = null
        return
      }

      if (currentPageIdRef.current !== page.id) {
        clearInterval(pollInterval)
        processingCheckIntervalRef.current = null
        return
      }

      fetch(`/api/image-analysis?pageId=${page.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.analysis) {
            // Analysis completed - update state
            setImageAnalysis(data.analysis)
            setCurrentStep('complete')
            setProcessing(false)
            isProcessingRef.current = false
            hasInitializedRef.current = page.id
            setProcessingState(page.id, false)
            clearInterval(pollInterval)
            processingCheckIntervalRef.current = null
          }
        })
        .catch(() => {
          // Silently fail - keep polling
        })
    }, 3000) // Poll every 3 seconds

    processingCheckIntervalRef.current = pollInterval

    return () => {
      if (processingCheckIntervalRef.current) {
        clearInterval(processingCheckIntervalRef.current)
        processingCheckIntervalRef.current = null
      }
    }
  }, [processing, page.id, hasScreenshotAccess])
  
  // Comprehensive HTML Structure Analysis
  const hasViewport = content.includes('viewport')
  const hasResponsiveDesign = content.includes('responsive') || content.includes('mobile') || content.includes('@media')
  const hasForms = content.includes('<form')
  const hasLabels = content.includes('<label')
  
  // Count interactive elements
  const formCount = (content.match(/<form[^>]*>/gi) || []).length
  const buttonCount = (content.match(/<button[^>]*>/gi) || []).length
  const inputCount = (content.match(/<input[^>]*>/gi) || []).length
  const labelCount = (content.match(/<label[^>]*>/gi) || []).length
  const imageCount = (content.match(/<img[^>]*>/gi) || []).length
  const linkCount = (content.match(/<a[^>]*>/gi) || []).length
  const headingCount = (content.match(/<h[1-6][^>]*>/gi) || []).length
  
  // Advanced Structure Analysis
  const hasSemanticHTML = content.includes('<header') || content.includes('<nav') || content.includes('<main') || content.includes('<section') || content.includes('<article') || content.includes('<footer')
  const hasProperHeadingStructure = content.includes('<h1') && content.includes('<h2')
  
  
  // Accessibility Analysis
  const hasAltText = content.includes('alt=')
  const hasTitleAttributes = content.includes('title=')
  const hasAriaLabels = content.includes('aria-label') || content.includes('aria-labelledby')
  
  const hasLangAttribute = content.includes('lang=')
  
  // Code Quality Analysis
  const hasInlineStyles = content.includes('style=')
  const hasInlineScripts = content.includes('<script>')
  const hasDeprecatedTags = content.includes('<center>') || content.includes('<font>') || content.includes('<marquee>') || content.includes('<blink>')
  const hasExternalCSS = content.includes('rel="stylesheet"')
  const hasExternalJS = content.includes('src=') && content.includes('<script')
  
  // Performance Indicators
  const hasLazyLoading = content.includes('loading="lazy"')
  const hasAsyncScripts = content.includes('async') || content.includes('defer')
  const hasPreloadLinks = content.includes('rel="preload"')
  const hasMetaDescription = content.includes('name="description"')
  
  
  // Security Analysis
  
  
  // Calculate comprehensive quality metrics
  const calculateQualityScore = (): QualityMetric[] => {
    return [
      {
        name: 'Accessibility',
        value: Math.round(((
          (hasAltText ? 1 : 0) +
          (hasLabels ? 1 : 0) +
          (hasAriaLabels ? 1 : 0) +
          (hasTitleAttributes ? 1 : 0) +
          (hasLangAttribute ? 1 : 0) +
          (hasProperHeadingStructure ? 1 : 0)
        ) / 6) * 100),
        max: 100,
        status: hasAltText && hasLabels && hasLangAttribute ? 'excellent' : 
                hasAltText && hasLabels ? 'good' : 
                hasAltText || hasLabels ? 'warning' : 'critical',
        description: 'Measures accessibility compliance and user experience'
      },
      {
        name: 'Structure',
        value: Math.round(((
          (hasSemanticHTML ? 1 : 0) +
          (hasProperHeadingStructure ? 1 : 0) +
          (hasViewport ? 1 : 0) +
          (hasResponsiveDesign ? 1 : 0) +
          (!hasDeprecatedTags ? 1 : 0)
        ) / 5) * 100),
        max: 100,
        status: hasSemanticHTML && hasProperHeadingStructure && hasViewport ? 'excellent' :
                hasSemanticHTML && hasViewport ? 'good' :
                hasViewport ? 'warning' : 'critical',
        description: 'Evaluates HTML structure and semantic markup'
      },
      {
        name: 'Performance',
        value: Math.round(((
          (hasExternalCSS ? 1 : 0) +
          (hasExternalJS ? 1 : 0) +
          (hasLazyLoading ? 1 : 0) +
          (hasAsyncScripts ? 1 : 0) +
          (!hasInlineStyles ? 1 : 0) +
          (!hasInlineScripts ? 1 : 0)
        ) / 6) * 100),
        max: 100,
        status: hasExternalCSS && hasExternalJS && hasLazyLoading ? 'excellent' :
                hasExternalCSS && hasExternalJS ? 'good' :
                hasExternalCSS || hasExternalJS ? 'warning' : 'critical',
        description: 'Assesses code organization and loading optimization'
      },
      {
        name: 'Modern Standards',
        value: Math.round(((
          (hasViewport ? 1 : 0) +
          (hasResponsiveDesign ? 1 : 0) +
          (hasMetaDescription ? 1 : 0) +
          (!hasDeprecatedTags ? 1 : 0) +
          (hasSemanticHTML ? 1 : 0)
        ) / 5) * 100),
        max: 100,
        status: hasViewport && hasResponsiveDesign && hasMetaDescription ? 'excellent' :
                hasViewport && hasResponsiveDesign ? 'good' :
                hasViewport ? 'warning' : 'critical',
        description: 'Checks adherence to modern web development standards'
      }
    ]
  }
  
  const qualityMetrics = calculateQualityScore()
  const overallScore = Math.round(qualityMetrics.reduce((sum, metric) => sum + metric.value, 0) / qualityMetrics.length)
  
  // Generate comprehensive recommendations
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = []
    
    if (!hasViewport) {
      recommendations.push({
        id: 'viewport-meta',
        title: 'Add Viewport Meta Tag',
        description: 'Include a viewport meta tag to ensure proper mobile responsiveness and prevent horizontal scrolling.',
        priority: 'high',
        category: 'modern-standards',
        impact: 'Critical for mobile user experience'
      })
    }
    
    if (!hasAltText && imageCount > 0) {
      recommendations.push({
        id: 'alt-text',
        title: 'Add Alt Text to Images',
        description: `Add descriptive alt text to all ${imageCount} images for better accessibility and SEO.`,
        priority: 'high',
        category: 'accessibility',
        impact: 'Essential for screen readers and search engines'
      })
    }
    
    if (hasForms && !hasLabels) {
      recommendations.push({
        id: 'form-labels',
        title: 'Add Form Labels',
        description: 'Associate labels with form inputs for better accessibility and user experience.',
        priority: 'high',
        category: 'accessibility',
        impact: 'Required for WCAG compliance'
      })
    }
    
    if (hasInlineStyles) {
      recommendations.push({
        id: 'inline-styles',
        title: 'Move Inline Styles to CSS',
        description: 'Extract inline styles to external CSS files for better maintainability and performance.',
        priority: 'medium',
        category: 'performance',
        impact: 'Improves code organization and caching'
      })
    }
    
    if (hasDeprecatedTags) {
      recommendations.push({
        id: 'deprecated-tags',
        title: 'Remove Deprecated HTML Tags',
        description: 'Replace deprecated tags with modern HTML5 alternatives for better compatibility.',
        priority: 'high',
        category: 'modern-standards',
        impact: 'Ensures cross-browser compatibility'
      })
    }
    
    if (!hasSemanticHTML) {
      recommendations.push({
        id: 'semantic-html',
        title: 'Use Semantic HTML Elements',
        description: 'Replace div containers with semantic elements like header, nav, main, section, article, and footer.',
        priority: 'medium',
        category: 'structure',
        impact: 'Improves SEO and accessibility'
      })
    }
    
    if (!hasResponsiveDesign) {
      recommendations.push({
        id: 'responsive-design',
        title: 'Implement Responsive Design',
        description: 'Add CSS media queries to ensure the site works well on all device sizes.',
        priority: 'high',
        category: 'modern-standards',
        impact: 'Essential for mobile-first web design'
      })
    }
    
    if (!hasLazyLoading && imageCount > 3) {
      recommendations.push({
        id: 'lazy-loading',
        title: 'Implement Lazy Loading',
        description: 'Add lazy loading to images to improve page load performance.',
        priority: 'medium',
        category: 'performance',
        impact: 'Reduces initial page load time'
      })
    }
    
    if (!hasMetaDescription) {
      recommendations.push({
        id: 'meta-description',
        title: 'Add Meta Description',
        description: 'Include a meta description tag for better SEO and social media sharing.',
        priority: 'medium',
        category: 'modern-standards',
        impact: 'Improves search engine visibility'
      })
    }
    
    return recommendations
  }
  
  const recommendations = generateRecommendations()
  
  
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gray-200 text-gray-900'
      case 'medium': return 'bg-gray-100 text-gray-800'
      case 'low': return 'bg-[#ff4b01]/20 text-[#ff4b01]'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  // Show loading state while checking plan access
  if (planLoading) {
    return (
      <div className="space-y-8">
        <div className="">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  // Don't show premium card - show all non-AI data instead
  // Only hide AI-powered screenshot analysis

  return (
    <div className=" ">
      {/* Header with Reanalyze Button */}
      <div className="flex items-center justify-between px-8 pt-4">
        <h2 className="text-2xl font-bold text-gray-900 ">UI Quality Analysis</h2>
        {(imageAnalysis || screenshotUrl || desktopScreenshotUrl) && hasScreenshotAccess && (
          <button
            onClick={handleRetakeScreenshot}
            disabled={processing}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff4b01] hover:bg-[#e64401] disabled:bg-gray-400 text-white  font-medium transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`w-5 h-5 ${processing ? 'animate-spin' : ''}`} />
            <span>{processing ? 'Reanalyzing...' : 'Reanalyze'}</span>
          </button>
        )}
        {!hasScreenshotAccess && (imageAnalysis || screenshotUrl || desktopScreenshotUrl) && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600  text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Premium Feature - View Only</span>
          </div>
        )}
      </div>

      {/* AI-Powered Screenshot Analysis Section - Premium Feature */}
      {!hasScreenshotAccess && !imageAnalysis && !desktopScreenshotUrl && !screenshotUrl && (
        <div className="mb-8  px-8 ">
          <div className="flex items-start gap-4">
           
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Screenshot Analysis</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Capture a screenshot and get visual, content, and UX insights with prioritized recommendations.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                
                <button
                  onClick={() => window.location.href = '/dashboard?tab=profile&subtab=plans'}
                  className="inline-flex items-center justify-center rounded-lg bg-[#ff4b01] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#e64401]"
                >
                  Upgrade Plan
                </button>
              </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">
                  <span className="h-2 w-2 rounded-full bg-[#ff4b01]"></span>
                  Visual design review
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">
                  <span className="h-2 w-2 rounded-full bg-[#ff4b01]"></span>
                  UX heuristics
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-gray-200">
                  <span className="h-2 w-2 rounded-full bg-[#ff4b01]"></span>
                  Actionable fixes
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* Overall Quality Score */}
      <div className="">
        <div className="flex items-center justify-between border-b border-gray-300 ">
          
          {/* <div className="text-right">
            <div className="text-5xl font-bold text-[#ff4b01]">{overallScore}</div>
            <div className="text-sm text-gray-600">Overall Score</div>
            <div className="text-xs text-gray-500">Out of 100</div>
          </div> */}
        </div>
        
        {/* Processing Steps - Simple Loader - Only show if user has access */}
        {processing && hasScreenshotAccess && (
          <div className="mt-6 bg-[#ff4b01]/10  border border-[#ff4b01]/30 p-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Simple spinner */}
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ff4b01]/30 border-t-[#ff4b01]"></div>
              
              {/* Step indicator */}
              <div className="text-center">
                <div className="text-base font-semibold text-[#ff4b01]">
                  {currentStep === 'capturing' && 'Capturing page screenshot...'}
                  {currentStep === 'analyzing' && 'AI analyzing your page...'}
                  {currentStep === 'complete' && 'Analysis complete'}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {currentStep === 'capturing' && 'Taking a high-quality snapshot of your page'}
                  {currentStep === 'analyzing' && 'Evaluating UI/UX design and content quality'}
                  {currentStep === 'complete' && 'Results ready'}
                </div>
              </div>

            </div>
          </div>
        )}

        {processingError && hasScreenshotAccess && (
          <div className="mt-6  p-6">
            <div className="text-red-600 text-sm mb-2">Error processing page</div>
            <div className="text-red-500 text-xs">{processingError}</div>
          </div>
        )}

        {/* AI Analysis Results - Only show if user has access */}
        {imageAnalysis && hasScreenshotAccess && (() => {
          // Use desktop analysis as primary, fallback to top-level if new format not available
          const primaryAnalysis = imageAnalysis.desktop || imageAnalysis
          return (
          <div className="">
            {/* Grid Layout: Left Masonry + Right Fixed Column */}
            <div className="grid grid-cols-1 lg:grid-cols-5 ">
              {/* Left Side - Masonry Layout */}
              <div className="lg:col-span-3 border-r border-gray-300">
                <Masonry
                  breakpointCols={{
                    default: 1,
                    1024: 1,
                    640: 1
                  }}
                  className="masonry-grid"
                  columnClassName="masonry-grid_column"
                >
                  <AIPoweredPageAnalysis
                    imageAnalysis={imageAnalysis}
                    primaryAnalysis={primaryAnalysis}
                  />
                  <ContentAnalysisCard primaryAnalysis={primaryAnalysis} />
                  <UIUXAnalysisCard
                    primaryAnalysis={primaryAnalysis}
                    hasMobile={!!imageAnalysis.mobile}
                  />
                  <DesignPatternsSection designPatterns={primaryAnalysis.design_patterns} />
                  <BrandConsistencySection brandConsistency={primaryAnalysis.brand_consistency} />
                </Masonry>
              </div>

              {/* Right Side - Fixed Column Grid */}
              <div className="lg:col-span-2 space-y-6">
                <PageStructureOverview
                  headingCount={headingCount}
                  imageCount={imageCount}
                  linkCount={linkCount}
                  formCount={formCount}
                  buttonCount={buttonCount}
                  inputCount={inputCount}
                  labelCount={labelCount}
                />
                <CodeQualityAnalysisCard
                  hasAltText={hasAltText}
                  hasLabels={hasLabels}
                  hasAriaLabels={hasAriaLabels}
                  hasLangAttribute={hasLangAttribute}
                  hasTitleAttributes={hasTitleAttributes}
                  hasExternalCSS={hasExternalCSS}
                  hasExternalJS={hasExternalJS}
                  hasInlineStyles={hasInlineStyles}
                  hasDeprecatedTags={hasDeprecatedTags}
                  hasSemanticHTML={hasSemanticHTML}
                  hasLazyLoading={hasLazyLoading}
                  hasAsyncScripts={hasAsyncScripts}
                  hasPreloadLinks={hasPreloadLinks}
                  hasViewport={hasViewport}
                  hasResponsiveDesign={hasResponsiveDesign}
                  hasMetaDescription={hasMetaDescription}
                />
                <PerformanceIndicatorsCard
                  hasAltText={hasAltText}
                  hasLabels={hasLabels}
                  hasAriaLabels={hasAriaLabels}
                  hasLangAttribute={hasLangAttribute}
                  hasTitleAttributes={hasTitleAttributes}
                  hasExternalCSS={hasExternalCSS}
                  hasExternalJS={hasExternalJS}
                  hasInlineStyles={hasInlineStyles}
                  hasDeprecatedTags={hasDeprecatedTags}
                  hasSemanticHTML={hasSemanticHTML}
                  hasLazyLoading={hasLazyLoading}
                  hasAsyncScripts={hasAsyncScripts}
                  hasPreloadLinks={hasPreloadLinks}
                  hasViewport={hasViewport}
                  hasResponsiveDesign={hasResponsiveDesign}
                  hasMetaDescription={hasMetaDescription}
                />
                <ModernStandardsCard
                  hasAltText={hasAltText}
                  hasLabels={hasLabels}
                  hasAriaLabels={hasAriaLabels}
                  hasLangAttribute={hasLangAttribute}
                  hasTitleAttributes={hasTitleAttributes}
                  hasExternalCSS={hasExternalCSS}
                  hasExternalJS={hasExternalJS}
                  hasInlineStyles={hasInlineStyles}
                  hasDeprecatedTags={hasDeprecatedTags}
                  hasSemanticHTML={hasSemanticHTML}
                  hasLazyLoading={hasLazyLoading}
                  hasAsyncScripts={hasAsyncScripts}
                  hasPreloadLinks={hasPreloadLinks}
                  hasViewport={hasViewport}
                  hasResponsiveDesign={hasResponsiveDesign}
                  hasMetaDescription={hasMetaDescription}
                />
                <AccessibilityAnalysisCard
                  hasAltText={hasAltText}
                  hasLabels={hasLabels}
                  hasAriaLabels={hasAriaLabels}
                  hasLangAttribute={hasLangAttribute}
                  hasTitleAttributes={hasTitleAttributes}
                  hasExternalCSS={hasExternalCSS}
                  hasExternalJS={hasExternalJS}
                  hasInlineStyles={hasInlineStyles}
                  hasDeprecatedTags={hasDeprecatedTags}
                  hasSemanticHTML={hasSemanticHTML}
                  hasLazyLoading={hasLazyLoading}
                  hasAsyncScripts={hasAsyncScripts}
                  hasPreloadLinks={hasPreloadLinks}
                  hasViewport={hasViewport}
                  hasResponsiveDesign={hasResponsiveDesign}
                  hasMetaDescription={hasMetaDescription}
                />
                <DetailedSummarySection detailedSummary={primaryAnalysis.detailed_summary} />
                <AIAnalysisRecommendations recommendations={primaryAnalysis.recommendations} />
                <ComprehensiveRecommendations recommendations={recommendations} />
              </div>
            </div>
          </div>
          )
        })()}

      </div>

      {/* Non-AI Analysis Section - Always visible */}
      {!imageAnalysis && (
        <div className="mt-6">
          <div className="grid grid-cols-1  lg:grid-cols-2">
            <div className="lg:col-span-2 ">
              <PageStructureOverview
                headingCount={headingCount}
                imageCount={imageCount}
                linkCount={linkCount}
                formCount={formCount}
                buttonCount={buttonCount}
                inputCount={inputCount}
                labelCount={labelCount}
              />
            </div>

            <div className="space-y-4 border-r border-gray-300">
              <CodeQualityAnalysisCard
                hasAltText={hasAltText}
                hasLabels={hasLabels}
                hasAriaLabels={hasAriaLabels}
                hasLangAttribute={hasLangAttribute}
                hasTitleAttributes={hasTitleAttributes}
                hasExternalCSS={hasExternalCSS}
                hasExternalJS={hasExternalJS}
                hasInlineStyles={hasInlineStyles}
                hasDeprecatedTags={hasDeprecatedTags}
                hasSemanticHTML={hasSemanticHTML}
                hasLazyLoading={hasLazyLoading}
                hasAsyncScripts={hasAsyncScripts}
                hasPreloadLinks={hasPreloadLinks}
                hasViewport={hasViewport}
                hasResponsiveDesign={hasResponsiveDesign}
                hasMetaDescription={hasMetaDescription}
              />
              <ModernStandardsCard
                hasAltText={hasAltText}
                hasLabels={hasLabels}
                hasAriaLabels={hasAriaLabels}
                hasLangAttribute={hasLangAttribute}
                hasTitleAttributes={hasTitleAttributes}
                hasExternalCSS={hasExternalCSS}
                hasExternalJS={hasExternalJS}
                hasInlineStyles={hasInlineStyles}
                hasDeprecatedTags={hasDeprecatedTags}
                hasSemanticHTML={hasSemanticHTML}
                hasLazyLoading={hasLazyLoading}
                hasAsyncScripts={hasAsyncScripts}
                hasPreloadLinks={hasPreloadLinks}
                hasViewport={hasViewport}
                hasResponsiveDesign={hasResponsiveDesign}
                hasMetaDescription={hasMetaDescription}
              />
              <AccessibilityAnalysisCard
                hasAltText={hasAltText}
                hasLabels={hasLabels}
                hasAriaLabels={hasAriaLabels}
                hasLangAttribute={hasLangAttribute}
                hasTitleAttributes={hasTitleAttributes}
                hasExternalCSS={hasExternalCSS}
                hasExternalJS={hasExternalJS}
                hasInlineStyles={hasInlineStyles}
                hasDeprecatedTags={hasDeprecatedTags}
                hasSemanticHTML={hasSemanticHTML}
                hasLazyLoading={hasLazyLoading}
                hasAsyncScripts={hasAsyncScripts}
                hasPreloadLinks={hasPreloadLinks}
                hasViewport={hasViewport}
                hasResponsiveDesign={hasResponsiveDesign}
                hasMetaDescription={hasMetaDescription}
              />
            </div>

            <div className="space-y-4">
              <PerformanceIndicatorsCard
                hasAltText={hasAltText}
                hasLabels={hasLabels}
                hasAriaLabels={hasAriaLabels}
                hasLangAttribute={hasLangAttribute}
                hasTitleAttributes={hasTitleAttributes}
                hasExternalCSS={hasExternalCSS}
                hasExternalJS={hasExternalJS}
                hasInlineStyles={hasInlineStyles}
                hasDeprecatedTags={hasDeprecatedTags}
                hasSemanticHTML={hasSemanticHTML}
                hasLazyLoading={hasLazyLoading}
                hasAsyncScripts={hasAsyncScripts}
                hasPreloadLinks={hasPreloadLinks}
                hasViewport={hasViewport}
                hasResponsiveDesign={hasResponsiveDesign}
                hasMetaDescription={hasMetaDescription}
              />
              <ComprehensiveRecommendations recommendations={recommendations} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
