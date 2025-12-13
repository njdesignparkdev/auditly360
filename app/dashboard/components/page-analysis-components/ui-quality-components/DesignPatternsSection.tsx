import { ImageAnalysis } from './types'

interface DesignPatternsSectionProps {
  designPatterns: ImageAnalysis['design_patterns']
}

export default function DesignPatternsSection({ designPatterns }: DesignPatternsSectionProps) {
  if (!designPatterns) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 break-inside-avoid mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Design Patterns & Best Practices</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {designPatterns.identified_patterns && designPatterns.identified_patterns.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Identified Patterns:</div>
            <div className="flex flex-wrap gap-2">
              {designPatterns.identified_patterns.map((pattern: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-[#ff4b01]/20 text-[#ff4b01] rounded-full text-xs">
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        )}
        {designPatterns.modern_design_elements && designPatterns.modern_design_elements.length > 0 && (
          <div>
            <div className="text-sm font-medium text-green-700 mb-2">Modern Elements:</div>
            <div className="flex flex-wrap gap-2">
              {designPatterns.modern_design_elements.map((element: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {element}
                </span>
              ))}
            </div>
          </div>
        )}
        {designPatterns.outdated_elements && designPatterns.outdated_elements.length > 0 && (
          <div>
            <div className="text-sm font-medium text-red-700 mb-2">Outdated Elements:</div>
            <div className="flex flex-wrap gap-2">
              {designPatterns.outdated_elements.map((element: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  {element}
                </span>
              ))}
            </div>
          </div>
        )}
        {designPatterns.best_practices_followed && designPatterns.best_practices_followed.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Best Practices Followed:</div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {designPatterns.best_practices_followed.map((practice: string, idx: number) => (
                <li key={idx}>{practice}</li>
              ))}
            </ul>
          </div>
        )}
        {designPatterns.best_practices_missing && designPatterns.best_practices_missing.length > 0 && (
          <div>
            <div className="text-sm font-medium text-orange-700 mb-2">Missing Best Practices:</div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {designPatterns.best_practices_missing.map((practice: string, idx: number) => (
                <li key={idx}>{practice}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

