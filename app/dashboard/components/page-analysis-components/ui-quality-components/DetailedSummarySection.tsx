import { ImageAnalysis } from './types'

interface DetailedSummarySectionProps {
  detailedSummary: ImageAnalysis['detailed_summary']
}

export default function DetailedSummarySection({ detailedSummary }: DetailedSummarySectionProps) {
  if (!detailedSummary) return null

  return (
    <div className="bg-white p-8 border-b border-gray-300  break-inside-avoid mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Detailed Assessment</h3>
      {detailedSummary.overall_assessment && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Overall Assessment:</div>
          <p className="text-sm text-gray-700 leading-relaxed">{detailedSummary.overall_assessment}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {detailedSummary.key_strengths && detailedSummary.key_strengths.length > 0 && (
          <div>
            <div className="text-sm font-medium text-green-700 mb-2">Key Strengths:</div>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {detailedSummary.key_strengths.map((strength: string, idx: number) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
        {detailedSummary.key_weaknesses && detailedSummary.key_weaknesses.length > 0 && (
          <div>
            <div className="text-sm font-medium text-red-700 mb-2">Key Weaknesses:</div>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {detailedSummary.key_weaknesses.map((weakness: string, idx: number) => (
                <li key={idx}>{weakness}</li>
              ))}
            </ul>
          </div>
        )}
        {detailedSummary.quick_wins && detailedSummary.quick_wins.length > 0 && (
          <div>
            <div className="text-sm font-medium text-[#ff4b01] mb-2">Quick Wins:</div>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {detailedSummary.quick_wins.map((win: string, idx: number) => (
                <li key={idx}>{win}</li>
              ))}
            </ul>
          </div>
        )}
        {detailedSummary.long_term_improvements && detailedSummary.long_term_improvements.length > 0 && (
          <div>
            <div className="text-sm font-medium text-purple-700 mb-2">Long-term Improvements:</div>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {detailedSummary.long_term_improvements.map((improvement: string, idx: number) => (
                <li key={idx}>{improvement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

