interface AnalysisCardsProps {
  hasAltText: boolean
  hasLabels: boolean
  hasAriaLabels: boolean
  hasLangAttribute: boolean
  hasTitleAttributes: boolean
  hasExternalCSS: boolean
  hasExternalJS: boolean
  hasInlineStyles: boolean
  hasDeprecatedTags: boolean
  hasSemanticHTML: boolean
  hasLazyLoading: boolean
  hasAsyncScripts: boolean
  hasPreloadLinks: boolean
  hasViewport: boolean
  hasResponsiveDesign: boolean
  hasMetaDescription: boolean
}

export function AccessibilityAnalysisCard({
  hasAltText,
  hasLabels,
  hasAriaLabels,
  hasLangAttribute,
  hasTitleAttributes
}: AnalysisCardsProps) {
  return (
    <div className="bg-white border-b border-gray-300  p-6 break-inside-avoid mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="w-2 h-2 bg-[#ff4b01] rounded-full mr-2"></span>
        Accessibility Analysis
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Alt Text for Images</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasAltText ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-200 text-gray-900'
            }`}
          >
            {hasAltText ? 'Present' : 'Missing'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Form Labels</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasLabels ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-200 text-gray-900'
            }`}
          >
            {hasLabels ? 'Present' : 'Missing'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">ARIA Labels</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasAriaLabels ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {hasAriaLabels ? 'Present' : 'Not Found'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Language Attribute</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasLangAttribute ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-200 text-gray-900'
            }`}
          >
            {hasLangAttribute ? 'Present' : 'Missing'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Title Attributes</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasTitleAttributes ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {hasTitleAttributes ? 'Present' : 'None'}
          </span>
        </div>
      </div>
    </div>
  )
}

export function CodeQualityAnalysisCard({
  hasExternalCSS,
  hasExternalJS,
  hasInlineStyles,
  hasDeprecatedTags,
  hasSemanticHTML
}: AnalysisCardsProps) {
  return (
    <div className="bg-white border-b border-gray-300  p-6 break-inside-avoid mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="w-2 h-2 bg-[#ff4b01] rounded-full mr-2"></span>
        Code Quality Analysis
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">External CSS</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasExternalCSS ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {hasExternalCSS ? 'Good' : 'Needs Improvement'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">External JavaScript</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasExternalJS ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {hasExternalJS ? 'Good' : 'Needs Improvement'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Inline Styles</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasInlineStyles ? 'bg-gray-200 text-gray-900' : 'bg-[#ff4b01]/20 text-[#ff4b01]'
            }`}
          >
            {hasInlineStyles ? 'Found' : 'None'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Deprecated Tags</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasDeprecatedTags ? 'bg-gray-200 text-gray-900' : 'bg-[#ff4b01]/20 text-[#ff4b01]'
            }`}
          >
            {hasDeprecatedTags ? 'Found' : 'None'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Semantic HTML</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasSemanticHTML ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {hasSemanticHTML ? 'Present' : 'Not Found'}
          </span>
        </div>
      </div>
    </div>
  )
}

export function PerformanceIndicatorsCard({
  hasLazyLoading,
  hasAsyncScripts,
  hasPreloadLinks
}: AnalysisCardsProps) {
  return (
    <div className="bg-white border-b border-gray-300  p-6 break-inside-avoid mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="w-2 h-2 bg-[#ff4b01] rounded-full mr-2"></span>
        Performance Indicators
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Lazy Loading</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasLazyLoading ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {hasLazyLoading ? 'Enabled' : 'Not Enabled'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Async Scripts</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasAsyncScripts ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {hasAsyncScripts ? 'Present' : 'Not Found'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Preload Links</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasPreloadLinks ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {hasPreloadLinks ? 'Present' : 'None'}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ModernStandardsCard({
  hasViewport,
  hasResponsiveDesign,
  hasMetaDescription
}: AnalysisCardsProps) {
  return (
    <div className="bg-white border-b border-gray-300  p-6 break-inside-avoid mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="w-2 h-2 bg-[#ff4b01] rounded-full mr-2"></span>
        Modern Standards
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Viewport Meta Tag</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasViewport ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-200 text-gray-900'
            }`}
          >
            {hasViewport ? 'Present' : 'Missing'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Responsive Design</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasResponsiveDesign ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {hasResponsiveDesign ? 'Detected' : 'Not Detected'}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Meta Description</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              hasMetaDescription ? 'bg-[#ff4b01]/20 text-[#ff4b01]' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {hasMetaDescription ? 'Present' : 'Missing'}
          </span>
        </div>
      </div>
    </div>
  )
}

