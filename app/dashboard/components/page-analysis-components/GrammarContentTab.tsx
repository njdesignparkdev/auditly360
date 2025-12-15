'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { filterHtmlContent } from "@/lib/html-content-filter";
import { GeminiAnalysisResult } from "@/lib/gemini";
import { useAuth } from "@/hooks/useAuth";
import { useUserPlan } from "@/hooks/useUserPlan";
import SkeletonLoader from "@/app/dashboard/components/SkeletonLoader";
import { featureCache, createCacheKey } from "@/lib/feature-cache";
import UpgradePlanButton from "@/app/dashboard/components/UpgradePlanButton";

// Define proper interfaces for the page data
interface ScrapedPageData {
  id: string;
  url: string;
  html_content: string | null;
  filtered_content?: string | null;
  gemini_analysis?: GeminiAnalysisResult | null;
}
interface GrammarContentTabProps {
  page: ScrapedPageData;
  cachedAnalysis?: GeminiAnalysisResult;
  grammarAnalysis?: GeminiAnalysisResult | null;
  grammarAnalysisError?: string | null;
  isGrammarAnalyzing?: boolean;
  onReAnalyze?: () => void;
}
type TabType = 'grammar' | 'punctuation' | 'structure' | 'style' | 'spelling' | 'uk-english' | 'content';
export default function GrammarContentTab({
  page,
  cachedAnalysis,
  grammarAnalysis,
  grammarAnalysisError,
  isGrammarAnalyzing,
  onReAnalyze
}: GrammarContentTabProps) {
  const [activeTab, setActiveTab] = useState<TabType>('grammar');
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const { user } = useAuth();
  const { hasFeature, loading: planLoading } = useUserPlan();
  
  // Use props for analysis state instead of internal state
  const geminiAnalysis = grammarAnalysis || cachedAnalysis || page?.gemini_analysis || null;
  const analysisError = grammarAnalysisError;
  const isStreaming = isGrammarAnalyzing || false;

  // Check if user has access to grammar content analysis with caching
  const hasFeatureAccess = useMemo(() => {
    const cacheKey = createCacheKey('grammar_content_analysis', user?.id);
    
    // Return cached result if available
    const cachedResult = featureCache.get(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    
    // If still loading, return null to show skeleton
    if (planLoading) {
      return null;
    }
    
    // Get fresh result and cache it
    // Access hasFeature directly from the hook instead of depending on it
    const result = hasFeature('grammar_content_analysis');
    featureCache.set(cacheKey, result);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, planLoading]);

  // Update checking access state when feature access is determined
  useEffect(() => {
    if (hasFeatureAccess !== null) {
      setIsCheckingAccess(false);
    }
  }, [hasFeatureAccess]);


  // Use filtered content if available, otherwise filter HTML content
  const filteredContent = page?.filtered_content || filterHtmlContent(page?.html_content || '');
  const textContent = typeof filteredContent === 'string' ? filteredContent : filteredContent?.pureContent || '';

  // Clean up expired cache entries on mount
  useEffect(() => {
    featureCache.clearExpired();
  }, []);

  // Function to trigger re-analysis
  const handleReAnalyze = useCallback(() => {
    if (onReAnalyze) {
      onReAnalyze();
    }
  }, [onReAnalyze]);

  // Show skeleton loading while checking feature access
  if (isCheckingAccess || hasFeatureAccess === null) {
    return <SkeletonLoader type="grammar" />;
  }

  // Show upgrade card if user doesn't have access to grammar content analysis
  if (hasFeatureAccess === false) {
    return (
      <div className="bg-white p-4 border">
        <div className="flex items-center space-x-4">
          <div className="text-[#ff4b01]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Grammar & Content Analysis</h3>
            <p className="text-sm text-gray-600 mb-3">
              This feature is not available in your current plan. Upgrade to access AI-powered grammar and content analysis.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Current plan: <span className="font-medium">Check your plan settings</span>
              </div>
              <UpgradePlanButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if page data is incomplete
  if (!page) {
    return (
      <div className="bg-white p-6 border text-center">
        <p className="text-gray-500">No page data available for analysis.</p>
      </div>
    );
  }
  if (!page.id || !page.url) {
    return (
      <div className="bg-white p-6 border text-center">
        <p className="text-gray-500">Page data is incomplete. Missing ID or URL.</p>
      </div>
    );
  }
  if (!textContent || textContent.trim().length === 0) {
    return (
      <div className="bg-white p-6 border text-center">
        <p className="text-gray-500">No content available for analysis.</p>
      </div>
    );
  }

  // Helper functions to categorize issues
  const getGrammarIssues = () => {
    if (!geminiAnalysis) return [];
    return geminiAnalysis.grammar_issues.filter(issue => issue.type === 'grammar');
  };
  const getPunctuationIssues = () => {
    if (!geminiAnalysis) return [];
    return geminiAnalysis.grammar_issues.filter(issue => issue.type === 'punctuation');
  };
  const getSpellingIssues = () => {
    if (!geminiAnalysis) return [];
    return geminiAnalysis.grammar_issues.filter(issue => issue.type === 'spelling');
  };
  const getStyleIssues = () => {
    if (!geminiAnalysis) return [];
    return geminiAnalysis.grammar_issues.filter(issue => issue.type === 'style');
  };
  const getStructureIssues = () => {
    if (!geminiAnalysis) return [];
    return geminiAnalysis.readability_issues.filter(issue => issue.type === 'structure');
  };
  const getUKEnglishIssues = () => {
    if (!geminiAnalysis) return [];
    return geminiAnalysis.uk_english_issues || [];
  };
  const getContentIssues = () => {
    if (!geminiAnalysis) return [];
    return [...geminiAnalysis.consistency_issues, ...geminiAnalysis.readability_issues.filter(issue => issue.type !== 'structure')];
  };

  // Get issue counts for each tab
  const getTabCounts = () => {
    return {
      grammar: getGrammarIssues().length,
      punctuation: getPunctuationIssues().length,
      structure: getStructureIssues().length,
      style: getStyleIssues().length,
      spelling: getSpellingIssues().length,
      'uk-english': getUKEnglishIssues().length,
      content: getContentIssues().length
    };
  };
  const tabCounts = getTabCounts();

  // Format analysis timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Define issue interface
  interface AnalysisIssue {
    type: string;
    severity: 'high' | 'medium' | 'low';
    text?: string;
    description?: string;
    suggestion: string;
  }

  // Render issues for current tab
  const renderTabContent = () => {
    if (!geminiAnalysis) return null;
    let issues: AnalysisIssue[] = [];
    let title = "";
    switch (activeTab) {
      case 'grammar':
        issues = getGrammarIssues();
        title = "Grammar Issues";
        break;
      case 'punctuation':
        issues = getPunctuationIssues();
        title = "Punctuation Issues";
        break;
      case 'structure':
        issues = getStructureIssues();
        title = "Structure Issues";
        break;
      case 'style':
        issues = getStyleIssues();
        title = "Style Issues";
        break;
      case 'spelling':
        issues = getSpellingIssues();
        title = "Spelling Issues";
        break;
      case 'uk-english':
        issues = getUKEnglishIssues();
        title = "UK English Issues";
        break;
      case 'content':
        issues = getContentIssues();
        title = "Content Issues";
        break;
    }
    if (issues.length === 0) {
      return (
        <div className="bg-white p-8 border text-center">
          <div className="text-green-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">No {title.toLowerCase()} found</p>
          <p className="text-sm text-gray-500">Great job! Your content looks good in this area.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 mb-4">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {issues.map((issue, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-300 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.severity === 'high'
                          ? 'bg-red-100 text-red-800'
                          : issue.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-[#ff4b01]/20 text-[#ff4b01]'
                      }`}
                    >
                      {issue.severity.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {issue.type || 'Issue'}
                    </span>
                  </div>

                  {issue.text && (
                    <p className="text-sm text-gray-800 mb-2">
                      <strong>Text:</strong> &ldquo;{issue.text}&rdquo;
                    </p>
                  )}

                  {issue.description && (
                    <p className="text-sm text-gray-800 mb-2">
                      <strong>Description:</strong> {issue.description}
                    </p>
                  )}

                  <p className="text-sm text-gray-600">
                    <strong>Suggestion:</strong> {issue.suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      {/* Header with Cached Status */}
      <div className="border-b border-gray-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Grammar & Content Quality</h3>
            {geminiAnalysis?.analysis_timestamp && (
              <p className="text-sm text-gray-500 mt-1">
                Content analysis (from {formatTimestamp(geminiAnalysis.analysis_timestamp)})
              </p>
            )}
          </div>
          {!geminiAnalysis && !isStreaming && (
            <button
              onClick={handleReAnalyze}
              disabled={isStreaming}
              className="px-4 py-2 bg-[#ff4b01] text-white rounded-lg hover:bg-[#e64401] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Re-analyze
            </button>
          )}
        </div>

        {analysisError && (
          <div className="bg-white p-4 border mb-6">
            <p className="text-red-800">{analysisError}</p>
          </div>
        )}

        {isStreaming ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#ff4b01]/30 border-t-[#ff4b01] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#ff4b01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Analyzing your content...
                </h4>
                <p className="text-gray-600">Our AI is analyzing your content for grammar, consistency, and readability...</p>
                
                <div className="mt-4 flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-[#ff4b01] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#ff4b01] rounded-full animate-bounce" style={{
                    animationDelay: '0.1s'
                  }}></div>
                  <div className="w-2 h-2 bg-[#ff4b01] rounded-full animate-bounce" style={{
                    animationDelay: '0.2s'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        ) : geminiAnalysis ? (
          <>
            {/* Tab Navigation */}
            <div className="border-y border-gray-300">
              <nav className="flex overflow-x-auto">
                {[{
                  id: 'grammar',
                  label: 'Grammar',
                  count: tabCounts.grammar
                }, {
                  id: 'punctuation',
                  label: 'Punctuation',
                  count: tabCounts.punctuation
                }, {
                  id: 'structure',
                  label: 'Structure',
                  count: tabCounts.structure
                }, {
                  id: 'style',
                  label: 'Style',
                  count: tabCounts.style
                }, {
                  id: 'spelling',
                  label: 'Spelling',
                  count: tabCounts.spelling
                }, {
                  id: 'uk-english',
                  label: 'UK English',
                  count: tabCounts['uk-english']
                }, {
                  id: 'content',
                  label: 'Content Issues',
                  count: tabCounts.content
                }].map((tab, index, tabsArray) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-4 px-6 font-medium text-sm transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${
                      index < tabsArray.length - 1 ? 'border-r border-gray-300' : ''
                    } ${
                      activeTab === tab.id
                        ? 'border-b-2 border-b-gray-900 text-gray-900 bg-gray-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {tab.label}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-[#ff4b01]/20 text-[#ff4b01]'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px] p-6">
              {renderTabContent()}
            </div>

            {/* Overall Summary */}
            <div className="border-t border-gray-300 bg-gray-50 p-6">
              <h4 className="font-medium text-gray-900 mb-2">Overall Summary</h4>
              <p className="text-gray-700 text-sm">{geminiAnalysis.summary}</p>
            </div>
          </>
        ) : (
          <div className="bg-white p-8 border text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">No AI analysis available yet</p>
            <p className="text-sm text-gray-500">Click &ldquo;Re-analyze&rdquo; to get AI-powered grammar analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}