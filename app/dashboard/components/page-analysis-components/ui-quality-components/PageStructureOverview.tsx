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
    <div className="bg-white border-b border-gray-300  px-8 pb-4 break-inside-avoid ">
      <h3 className="text-xl font-semibold text-gray-900 ">Page Structure Overview</h3>
      
    </div>
  )
}

