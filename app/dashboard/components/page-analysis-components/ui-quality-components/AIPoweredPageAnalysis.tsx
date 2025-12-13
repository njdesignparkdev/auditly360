import { ImageAnalysis } from './types'

interface AIPoweredPageAnalysisProps {
  imageAnalysis: ImageAnalysis
  primaryAnalysis: ImageAnalysis | ImageAnalysis['desktop']
}

export default function AIPoweredPageAnalysis({
  imageAnalysis,
  primaryAnalysis
}: AIPoweredPageAnalysisProps) {
  if (!primaryAnalysis) return null

  return (
    <div className="bg-white border-b border-gray-300 p-8 break-inside-avoid mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Page Analysis</h2>
          <p className="text-md text-gray-600 leading-relaxed">
            {primaryAnalysis.summary || imageAnalysis.summary}
          </p>
        </div>
        <div className="text-center md:text-right">
          <div className="text-6xl font-bold text-[#ff4b01] mb-1">{imageAnalysis.overall_score}</div>
          <div className="text-base text-gray-600 font-medium">Overall Score</div>
        </div>
      </div>
      
      {/* Score Grid - Secondary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
        <div className="bg-[#ff4b01]/10 rounded-lg p-5">
          <div className="text-sm text-gray-600 mb-2 font-medium">UI/UX Score</div>
          <div className="text-3xl font-bold text-gray-900">{imageAnalysis.ui_ux_score}</div>
        </div>
        <div className="bg-[#ff4b01]/10 rounded-lg p-5">
          <div className="text-sm text-gray-600 mb-2 font-medium">Content Score</div>
          <div className="text-3xl font-bold text-gray-900">{imageAnalysis.content_score}</div>
        </div>
      </div>
    </div>
  )
}

