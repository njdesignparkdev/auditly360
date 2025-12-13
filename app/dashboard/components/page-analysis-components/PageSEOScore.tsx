'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SEOAnalysisResult, SEOHighlight } from '@/types/audit'
import { analyzeSEO } from '@/lib/seo-analysis'
import { AuditProject } from '@/types/audit'

interface PageSEOScoreProps {
  page: {
    id: string
    url: string
    html_content?: string | null
    audit_project_id?: string
  } | null
  project: AuditProject | null
}

export default function PageSEOScore({ page, project }: PageSEOScoreProps) {
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const analysisTriggered = useRef(false)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const analyzePage = useCallback(async () => {
    if (!page?.html_content || !page?.url) {
      setError('No HTML content available for analysis')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const analysis = analyzeSEO(page.html_content, page.url)
      setSeoAnalysis(analysis)
    } catch {
      setError('Failed to analyze SEO content')
    } finally {
      setLoading(false)
    }
  }, [page?.html_content, page?.url])

  useEffect(() => {
    if (
      page?.html_content &&
      !seoAnalysis &&
      !analysisTriggered.current
    ) {
      analysisTriggered.current = true
      analyzePage()
    }
  }, [page?.html_content, seoAnalysis, analyzePage])

  if (loading) {
    return (
      <div className=" p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 w-full mb-2"></div>
          <div className="h-4 bg-gray-200 w-3/4"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className=" p-6">
        <p className="text-gray-600 text-sm">{error}</p>
      </div>
    )
  }

  if (!seoAnalysis) {
    return null
  }

  return (
    <div className=" border-r border-gray-300">
      {/* SEO Score */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-900">
            SEO Score
          </span>
          <span
            className={`text-2xl font-bold ${getScoreColor(seoAnalysis.score)}`}
          >
            {seoAnalysis.score}
          </span>
        </div>
        <div className="w-full bg-gray-200 h-3 mt-4">
          <div
            className={`h-3 transition-all duration-500 ${getScoreBgColor(
              seoAnalysis.score
            )}`}
            style={{
              width: `${seoAnalysis.score}%`,
            }}
          ></div>
        </div>
      </div>

      {/* What's Working Well */}
      {seoAnalysis.highlights && seoAnalysis.highlights.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            What&apos;s Working Well
          </h4>
          <div className="space-y-2">
            {seoAnalysis.highlights.map(
              (highlight: SEOHighlight, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white border border-gray-200 p-3"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      <i
                        className={
                          highlight.type === 'achievement'
                            ? 'fas fa-trophy text-yellow-600'
                            : highlight.type === 'good-practice'
                            ? 'fas fa-check-circle text-green-600'
                            : 'fas fa-bolt text-blue-500'
                        }
                      ></i>
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {highlight.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {highlight.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1">
                      {highlight.category}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1">
                      {highlight.impact}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Recommendations - Displayed in a row */}
      {seoAnalysis.recommendations &&
        seoAnalysis.recommendations.length > 0 && (
          <div className="p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Recommendations
            </h4>
            <div className="flex flex-wrap gap-3">
              {seoAnalysis.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start bg-white border border-gray-200 p-3 flex-shrink-0"
                  style={{ maxWidth: 'calc(50% - 0.375rem)' }}
                >
                  <span className="mr-2 mt-0.5 flex-shrink-0">
                    <i className="fas fa-lightbulb text-blue-500"></i>
                  </span>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  )
}

