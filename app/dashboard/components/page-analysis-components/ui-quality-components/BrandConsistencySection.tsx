import { ImageAnalysis } from './types'

interface BrandConsistencySectionProps {
  brandConsistency: ImageAnalysis['brand_consistency']
}

export default function BrandConsistencySection({ brandConsistency }: BrandConsistencySectionProps) {
  if (!brandConsistency) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 break-inside-avoid mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Brand Consistency</h3>
      {brandConsistency.score !== undefined && (
        <div className="mb-6 p-6 bg-[#ff4b01]/10 rounded-lg border border-[#ff4b01]/30 inline-block">
          <div className="text-4xl font-bold text-gray-900 mb-1">{brandConsistency.score}</div>
          <div className="text-sm text-gray-600 font-medium">Consistency Score</div>
        </div>
      )}
      <div className="space-y-3 mb-4">
        {brandConsistency.color_consistency && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Color Consistency:</div>
            <div className="text-sm text-gray-600">{brandConsistency.color_consistency}</div>
          </div>
        )}
        {brandConsistency.typography_consistency && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Typography Consistency:</div>
            <div className="text-sm text-gray-600">{brandConsistency.typography_consistency}</div>
          </div>
        )}
        {brandConsistency.style_consistency && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Style Consistency:</div>
            <div className="text-sm text-gray-600">{brandConsistency.style_consistency}</div>
          </div>
        )}
      </div>
      {brandConsistency.issues && brandConsistency.issues.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Consistency Issues:</div>
          <div className="space-y-2">
            {brandConsistency.issues.map((issue, idx: number) => (
              <div key={idx} className="p-3 rounded-lg border-l-4 border-orange-400 bg-orange-50">
                <div className="text-sm font-medium text-gray-900">{issue.description}</div>
                <div className="text-xs text-gray-600 mt-1">{issue.suggestion}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

