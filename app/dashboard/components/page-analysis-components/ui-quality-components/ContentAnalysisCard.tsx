import { ImageAnalysis } from './types'

interface ContentAnalysisCardProps {
  primaryAnalysis: ImageAnalysis | ImageAnalysis['desktop']
}

export default function ContentAnalysisCard({ primaryAnalysis }: ContentAnalysisCardProps) {
  if (!primaryAnalysis) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 break-inside-avoid mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Content Analysis</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-5 text-center border border-gray-100 hover:border-[#ff4b01]/30 hover:bg-[#ff4b01]/10 transition-all">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {primaryAnalysis.content_analysis?.readability_score}
          </div>
          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Readability</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-5 text-center border border-gray-100 hover:border-[#ff4b01]/30 hover:bg-[#ff4b01]/10 transition-all">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {primaryAnalysis.content_analysis?.clarity_score}
          </div>
          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Clarity</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-5 text-center border border-gray-100 hover:border-[#ff4b01]/30 hover:bg-[#ff4b01]/10 transition-all">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {primaryAnalysis.content_analysis?.structure_score}
          </div>
          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Structure</div>
        </div>
        {primaryAnalysis.content_analysis?.seo_score !== undefined && (
          <div className="bg-gray-50 rounded-lg p-5 text-center border border-gray-100 hover:border-[#ff4b01]/30 hover:bg-[#ff4b01]/10 transition-all">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {primaryAnalysis.content_analysis.seo_score}
            </div>
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">SEO</div>
          </div>
        )}
        {primaryAnalysis.content_analysis?.content_length_score !== undefined && (
          <div className="bg-gray-50 rounded-lg p-5 text-center border border-gray-100 hover:border-[#ff4b01]/30 hover:bg-[#ff4b01]/10 transition-all">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {primaryAnalysis.content_analysis.content_length_score}
            </div>
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Length</div>
          </div>
        )}
        {primaryAnalysis.content_analysis?.heading_structure_score !== undefined && (
          <div className="bg-gray-50 rounded-lg p-5 text-center border border-gray-100 hover:border-[#ff4b01]/30 hover:bg-[#ff4b01]/10 transition-all">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {primaryAnalysis.content_analysis.heading_structure_score}
            </div>
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Headings</div>
          </div>
        )}
      </div>

      {/* Content Detailed Metrics */}
      {primaryAnalysis.content_analysis?.detailed_metrics && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h5 className="text-base font-semibold text-gray-900 mb-5">Content Metrics</h5>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            {primaryAnalysis.content_analysis.detailed_metrics.word_count_estimate !== undefined && (
              <div>
                <span className="font-medium text-gray-700">Words:</span>
                <span className="ml-2 text-gray-600">
                  {primaryAnalysis.content_analysis.detailed_metrics.word_count_estimate.toLocaleString()}
                </span>
              </div>
            )}
            {primaryAnalysis.content_analysis.detailed_metrics.heading_count !== undefined && (
              <div>
                <span className="font-medium text-gray-700">Headings:</span>
                <span className="ml-2 text-gray-600">
                  {primaryAnalysis.content_analysis.detailed_metrics.heading_count}
                </span>
              </div>
            )}
            {primaryAnalysis.content_analysis.detailed_metrics.paragraph_count !== undefined && (
              <div>
                <span className="font-medium text-gray-700">Paragraphs:</span>
                <span className="ml-2 text-gray-600">
                  {primaryAnalysis.content_analysis.detailed_metrics.paragraph_count}
                </span>
              </div>
            )}
            {primaryAnalysis.content_analysis.detailed_metrics.list_usage && (
              <div>
                <span className="font-medium text-gray-700">Lists:</span>
                <span className="ml-2 text-gray-600">
                  {primaryAnalysis.content_analysis.detailed_metrics.list_usage}
                </span>
              </div>
            )}
            {primaryAnalysis.content_analysis.detailed_metrics.content_density && (
              <div>
                <span className="font-medium text-gray-700">Density:</span>
                <span className="ml-2 text-gray-600">
                  {primaryAnalysis.content_analysis.detailed_metrics.content_density}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {primaryAnalysis.content_analysis?.strengths && primaryAnalysis.content_analysis.strengths.length > 0 && (
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h5 className="text-base font-semibold text-gray-900 mb-4">Content Strengths</h5>
          <ul className="space-y-3">
            {primaryAnalysis.content_analysis.strengths.map((strength: string, idx: number) => (
              <li key={idx} className="flex items-start group">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#ff4b01]/20 flex items-center justify-center mt-0.5 mr-3 group-hover:bg-[#ff4b01]/30 transition-colors">
                  <span className="text-[#ff4b01] text-xs font-bold">✓</span>
                </span>
                <span className="text-sm text-gray-700 flex-1 leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {primaryAnalysis.content_analysis?.issues && primaryAnalysis.content_analysis.issues.length > 0 && (
        <div>
          <h5 className="text-base font-semibold text-gray-900 mb-5">Content Issues</h5>
          <div className="space-y-4">
            {primaryAnalysis.content_analysis.issues.map((issue: { type: string; severity: 'high' | 'medium' | 'low'; description: string; suggestion: string; location?: string }, idx: number) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 shadow-sm ${
                  issue.severity === 'high'
                    ? 'border-red-400 bg-red-50/50'
                    : issue.severity === 'medium'
                    ? 'border-yellow-400 bg-yellow-50/50'
                    : 'border-[#ff4b01]/50 bg-[#ff4b01]/10'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="text-sm font-semibold text-gray-900 leading-snug">
                      {issue.description}
                    </div>
                    <div className="text-xs text-gray-600 leading-relaxed">{issue.suggestion}</div>
                    {issue.location && (
                      <div className="text-xs text-gray-500 pt-1 flex items-center">
                        <span className="mr-1">📍</span>
                        {issue.location}
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide flex-shrink-0 ${
                      issue.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : issue.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-[#ff4b01]/20 text-[#ff4b01]'
                    }`}
                  >
                    {issue.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

