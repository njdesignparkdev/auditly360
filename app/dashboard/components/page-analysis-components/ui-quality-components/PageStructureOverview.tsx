interface PageStructureOverviewProps {
  headingCount: number
  imageCount: number
  linkCount: number
  formCount: number
  buttonCount: number
  inputCount: number
  labelCount: number
}

export default function PageStructureOverview({
  headingCount,
  imageCount,
  linkCount,
  formCount,
  buttonCount,
  inputCount,
  labelCount
}: PageStructureOverviewProps) {
  return (
    <div className="bg-white border-b border-gray-300  p-6 break-inside-avoid mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Page Structure Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[#ff4b01]">{headingCount}</div>
          <div className="text-sm text-gray-600">Headings</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{imageCount}</div>
          <div className="text-sm text-gray-600">Images</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{linkCount}</div>
          <div className="text-sm text-gray-600">Links</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{formCount}</div>
          <div className="text-sm text-gray-600">Forms</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{buttonCount}</div>
          <div className="text-sm text-gray-600">Buttons</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{inputCount}</div>
          <div className="text-sm text-gray-600">Inputs</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{labelCount}</div>
          <div className="text-sm text-gray-600">Labels</div>
        </div>
      </div>
    </div>
  )
}

