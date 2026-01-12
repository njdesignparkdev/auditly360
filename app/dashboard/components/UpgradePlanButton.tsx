'use client'

interface UpgradePlanButtonProps {
  href?: string
  label?: string
  className?: string
}

export default function UpgradePlanButton({
  href = '/dashboard?tab=profile&subtab=billing',
  label = 'Upgrade Plan',
  className = ''
}: UpgradePlanButtonProps) {
  return (
    <button
      onClick={() => { window.location.href = href }}
      className={`px-4 cursor-pointer py-2 bg-[#ff4b01] text-white rounded-lg hover:bg-[#e64401] transition-colors text-sm font-medium ${className}`}
    >
      {label}
    </button>
  )
}

