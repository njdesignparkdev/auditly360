import { ImageAnalysis } from './types'

interface BrandConsistencySectionProps {
  brandConsistency: ImageAnalysis['brand_consistency']
}

export default function BrandConsistencySection({ brandConsistency }: BrandConsistencySectionProps) {
  if (!brandConsistency) return null

  return (
    <div className="bg-white border-b  border-gray-300  break-inside-avoid mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 px-8">Brand Consistency</h3>
      
      <div className="space-y-3 mb-4 px-8">
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
          <div className="text-sm font-medium text-gray-700 mb-2 px-8">Consistency Issues:</div>
          <div className="space-y-2 px-8 pb-8">
            {brandConsistency.issues.map((issue, idx: number) => (
              <div key={idx} className="p-3 border border-gray-300">
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

