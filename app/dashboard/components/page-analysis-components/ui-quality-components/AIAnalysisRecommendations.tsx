import { ImageAnalysis } from './types'

interface AIAnalysisRecommendationsProps {
  recommendations: ImageAnalysis['recommendations']
}

export default function AIAnalysisRecommendations({ recommendations }: AIAnalysisRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 break-inside-avoid mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Actionable Recommendations</h3>
      <div className="space-y-4">
        {recommendations.map((rec, idx: number) => {
          // Handle both old format (string) and new format (object)
          if (typeof rec === 'string') {
            return (
              <div key={idx} className="p-3 rounded-lg border-l-4 border-[#ff4b01]/50 bg-[#ff4b01]/10">
                <div className="text-sm text-gray-700">{rec}</div>
              </div>
            )
          }
          return (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high'
                  ? 'border-red-400 bg-red-50'
                  : rec.priority === 'medium'
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-[#ff4b01]/50 bg-[#ff4b01]/10'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {rec.category && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                        {rec.category}
                      </span>
                    )}
                    {rec.effort && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        Effort: {rec.effort}
                      </span>
                    )}
                  </div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-1">{rec.title || rec.description}</h5>
                  {rec.description && rec.title && (
                    <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                  )}
                  {rec.impact && <p className="text-xs text-gray-600">Impact: {rec.impact}</p>}
                </div>
                {rec.priority && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-[#ff4b01]/20 text-[#ff4b01]'
                    }`}
                  >
                    {rec.priority.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

