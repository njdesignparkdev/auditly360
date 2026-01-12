import { Recommendation } from './types'

interface ComprehensiveRecommendationsProps {
  recommendations: Recommendation[]
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-gray-200 text-gray-900'
    case 'medium':
      return 'bg-gray-100 text-gray-800'
    case 'low':
      return 'bg-[#ff4b01]/20 text-[#ff4b01]'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}

export default function ComprehensiveRecommendations({
  recommendations
}: ComprehensiveRecommendationsProps) {
  return (
    <div className="bg-white border-b border-gray-300   break-inside-avoid ">
      <h3 className="text-xl font-semibold text-gray-900 px-8 mb-8">Improvement Recommendations</h3>
      {recommendations.length === 0 ? (
        <div className="bg-[#ff4b01]/10 rounded-lg p-6 text-center">
          
          <h4 className="font-semibold text-[#ff4b01] mb-1">Excellent Work!</h4>
          <p className="text-[#ff4b01]">Your page follows modern web standards and best practices.</p>
        </div>
      ) : (
        <div className="space-y-4 px-8 pb-8">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`border border-gray-300 p-4 `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-semibold text-gray-900 mr-3">{rec.title}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}
                    >
                      {rec.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{rec.description}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Impact:</span>
                    <span className="ml-1">{rec.impact}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

