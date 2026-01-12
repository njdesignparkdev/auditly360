import { ImageAnalysis } from './types'

interface UIUXAnalysisCardProps {
  primaryAnalysis: ImageAnalysis | ImageAnalysis['desktop']
  hasMobile: boolean
}

export default function UIUXAnalysisCard({ primaryAnalysis, hasMobile }: UIUXAnalysisCardProps) {
  if (!primaryAnalysis) return null

  return (
    <div className="bg-white border-b  border-gray-300 break-inside-avoid mb-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 px-8">UI/UX Analysis</h3>
        {hasMobile && <p className="text-sm text-gray-500">Desktop View Analysis</p>}
      </div>
      {primaryAnalysis.ui_ux_analysis && (
        <>
        

          {/* Detailed Metrics */}
          {primaryAnalysis.ui_ux_analysis.detailed_metrics && (
            <div className="mb-8 px-8 py-4 border-y border-gray-300">
              <h5 className="text-base font-semibold text-gray-900 mb-5">Detailed Metrics</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {primaryAnalysis.ui_ux_analysis.detailed_metrics.color_contrast_ratio && (
                  <div>
                    <span className="font-medium text-gray-700">Color Contrast:</span>
                    <span className="ml-2 text-gray-600">
                      {primaryAnalysis.ui_ux_analysis.detailed_metrics.color_contrast_ratio}
                    </span>
                  </div>
                )}
                {primaryAnalysis.ui_ux_analysis.detailed_metrics.font_sizes_used &&
                  primaryAnalysis.ui_ux_analysis.detailed_metrics.font_sizes_used.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Font Sizes:</span>
                      <span className="ml-2 text-gray-600">
                        {primaryAnalysis.ui_ux_analysis.detailed_metrics.font_sizes_used.join(', ')}
                      </span>
                    </div>
                  )}
                {primaryAnalysis.ui_ux_analysis.detailed_metrics.spacing_consistency && (
                  <div>
                    <span className="font-medium text-gray-700">Spacing:</span>
                    <span className="ml-2 text-gray-600">
                      {primaryAnalysis.ui_ux_analysis.detailed_metrics.spacing_consistency}
                    </span>
                  </div>
                )}
                {primaryAnalysis.ui_ux_analysis.detailed_metrics.element_alignment && (
                  <div>
                    <span className="font-medium text-gray-700">Alignment:</span>
                    <span className="ml-2 text-gray-600">
                      {primaryAnalysis.ui_ux_analysis.detailed_metrics.element_alignment}
                    </span>
                  </div>
                )}
                {primaryAnalysis.ui_ux_analysis.detailed_metrics.visual_balance && (
                  <div>
                    <span className="font-medium text-gray-700">Visual Balance:</span>
                    <span className="ml-2 text-gray-600">
                      {primaryAnalysis.ui_ux_analysis.detailed_metrics.visual_balance}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {primaryAnalysis.ui_ux_analysis.strengths && primaryAnalysis.ui_ux_analysis.strengths.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-300">
              <h5 className="text-base font-semibold text-gray-900 mb-4 px-8">Strengths</h5>
              <ul className="space-y-3">
                {primaryAnalysis.ui_ux_analysis.strengths.map((strength: string, idx: number) => (
                  <li key={idx} className="flex items-start group px-8">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#ff4b01]/20 flex items-center justify-center mt-0.5 mr-3 group-hover:bg-[#ff4b01]/30 transition-colors">
                      <span className="text-[#ff4b01] text-xs font-bold">✓</span>
                    </span>
                    <span className="text-sm text-gray-700 flex-1 leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {primaryAnalysis.ui_ux_analysis.issues && primaryAnalysis.ui_ux_analysis.issues.length > 0 && (
            <div>
              <h5 className="text-base font-semibold text-gray-900 mb-5 px-8">Issues & Recommendations</h5>
              <div className="grid gap-4 md:grid-cols-3 px-8 pb-8">
                {primaryAnalysis.ui_ux_analysis.issues.map((issue: { type: string; severity: 'high' | 'medium' | 'low'; heading?: string; problem?: string; solution?: string; description?: string; suggestion?: string; location?: string; impact?: string }, idx: number) => {
                  const heading = issue.heading || issue.type || 'Issue'
                  const problem = issue.problem || issue.description || 'No description provided'
                  const solution = issue.solution || issue.suggestion || 'No solution provided'
                  return (
                    <div
                      key={idx}
                      className={` p-5 border space-y-3`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {issue.type}
                          </div>
                          <div className="text-2xl capitalize font-semibold text-gray-900 leading-snug">
                            {heading}
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
                            issue.severity === 'high'
                              ? 'bg-red-100 text-red-700'
                              : issue.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div>
                          <div className="text-[11px] font-semibold text-gray-500">Problem</div>
                          <div className="text-sm text-gray-800">{problem}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-gray-500">Solution</div>
                          <div className="text-sm text-gray-800">{solution}</div>
                        </div>
                        {(issue.location || issue.impact) && (
                          <div className="flex flex-wrap gap-4 text-xs text-gray-600 border-t border-gray-300 pt-4 mt-4">
                            {issue.location && (
                              <span className="flex items-center gap-1">
                                <span role="img" aria-label="location">📍</span>
                                {issue.location}
                              </span>
                            )}
                            {issue.impact && (
                              <span className="flex items-center gap-1">
                                <span role="img" aria-label="impact">⚡</span>
                                {issue.impact}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

