'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Profile from './Profile'
import Billing from './Billing'
import Security from './Security'
import Support from './Support'

interface ProfileSubTabsProps {
  userProfile: any
}

type TabType = 'profile' | 'billing' | 'security' | 'support'

const tabs = [
  { id: 'profile' as TabType, name: 'Profile' },
  { id: 'billing' as TabType, name: 'Billing' },
  { id: 'security' as TabType, name: 'Security' },
  { id: 'support' as TabType, name: 'Support' }
]

export default function ProfileSubTabs({ userProfile }: ProfileSubTabsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('profile')

  // Sync active tab with URL ?subtab=
  useEffect(() => {
    const subtabParam = (searchParams.get('subtab') as TabType | null) || 'profile'
    if (tabs.some(t => t.id === subtabParam)) {
      setActiveTab(subtabParam)
    }
  }, [searchParams])

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', 'profile')
    url.searchParams.set('subtab', tab)
    router.push(url.toString())
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile userProfile={userProfile} />
      case 'billing':
        return <Billing userProfile={userProfile} />
      case 'security':
        return <Security userProfile={userProfile} />
      case 'support':
        return <Support userProfile={userProfile} />
      default:
        return <Profile userProfile={userProfile} />
    }
  }

  return (
    <motion.div 
      className="" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600">
          Manage your account information and preferences
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="border-y border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <nav className="flex">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-4 px-6 font-medium text-sm transition-colors duration-300 ${
                index < tabs.length - 1 ? 'border-r border-gray-300' : ''
              } ${
                activeTab === tab.id
                  ? 'border-b-2 border-b-gray-900 text-gray-900 bg-gray-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              {tab.name}
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Tab Content */}
      <motion.div 
          className=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {renderTabContent()}
      </motion.div>
    </motion.div>
  )
}
