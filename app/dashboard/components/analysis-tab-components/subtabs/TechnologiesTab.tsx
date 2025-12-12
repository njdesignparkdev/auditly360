'use client'

import { useState, useEffect } from 'react'
import { AuditProject } from '@/types/audit'
import Image from 'next/image'
import { detectTechnologiesFromHTML, categorizeTechnologies, getTechnologyStats, DetectedTechnology } from '@/lib/technology-detector'

interface TechnologiesTabProps {
  project: AuditProject
  htmlContent?: string
  headers?: Record<string, string>
  cookies?: string[]
}

interface Technology {
  name: string
  version?: string | null
  category?: string
  confidence?: number
  detection_method?: string
  description?: string | null
  website?: string | null
  icon?: string | null
}

interface TechnologyIconProps {
  tech: Technology | DetectedTechnology
  className?: string
}

// Technology icon component with better icon support
const TechnologyIcon = ({ tech, className = "w-8 h-8" }: TechnologyIconProps) => {
  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return 'TD'
    }
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get technology icon from a public icon service
  const getTechnologyIconUrl = (name: string) => {
    const techName = name.toLowerCase().replace(/\s+/g, '-')
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${techName}/${techName}-original.svg`
  }

  // Alternative icon sources for technologies not in DevIcons
  const getAlternativeIconUrl = (name: string) => {
    const altIcons: { [key: string]: string } = {
      // Analytics & Tracking
      'facebook pixel': 'https://img.icons8.com/color/48/facebook.png',
      'google analytics': 'https://img.icons8.com/color/48/google-analytics.png',
      'google tag manager': 'https://img.icons8.com/color/48/google-tag-manager.png',
      'gtag': 'https://img.icons8.com/color/48/google-analytics.png',
      'gtm': 'https://img.icons8.com/color/48/google-tag-manager.png',

      // CSS Frameworks
      'tailwind css': 'https://img.icons8.com/color/48/tailwind-css.png',
      'tailwindcss': 'https://img.icons8.com/color/48/tailwind-css.png',

      // Additional tracking
      'hotjar': 'https://img.icons8.com/color/48/hotjar.png',
      'mixpanel': 'https://img.icons8.com/color/48/mixpanel.png',
      'segment': 'https://img.icons8.com/color/48/segment.png',
      'amplitude': 'https://img.icons8.com/color/48/amplitude.png',

      // Payment & E-commerce
      'stripe': 'https://img.icons8.com/color/48/stripe.png',
      'paypal': 'https://img.icons8.com/color/48/paypal.png',
      'square': 'https://img.icons8.com/color/48/square.png',

      // Social Media
      'instagram': 'https://img.icons8.com/color/48/instagram.png',
      'youtube': 'https://img.icons8.com/color/48/youtube.png',
      'tiktok': 'https://img.icons8.com/color/48/tiktok.png',
      'snapchat': 'https://img.icons8.com/color/48/snapchat.png',

      // Communication
      'slack': 'https://img.icons8.com/color/48/slack.png',
      'discord': 'https://img.icons8.com/color/48/discord.png',
      'telegram': 'https://img.icons8.com/color/48/telegram.png',
      'whatsapp': 'https://img.icons8.com/color/48/whatsapp.png',

      // Development Tools
      'figma': 'https://img.icons8.com/color/48/figma.png',
      'sketch': 'https://img.icons8.com/color/48/sketch.png',
      'adobe': 'https://img.icons8.com/color/48/adobe.png',
      'photoshop': 'https://img.icons8.com/color/48/adobe-photoshop.png',
      'illustrator': 'https://img.icons8.com/color/48/adobe-illustrator.png'
    }

    return altIcons[name.toLowerCase()]
  }

  // Common technology icon mappings
  const getIconUrl = (name: string) => {
    const iconMap: { [key: string]: string } = {
      // Frontend Frameworks
      'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      'vue.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      'angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg',
      'svelte': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg',

      // Languages
      'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'html': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      'css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      'php': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
      'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      'c#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
      'go': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
      'rust': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',

      // CSS Frameworks
      'bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
      'tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      'tailwindcss': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      'tailwind css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      'sass': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
      'scss': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
      'less': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/less/less-plain-wordmark.svg',
      'stylus': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/stylus/stylus-original.svg',

      // Libraries
      'jquery': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg',
      'lodash': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lodash/lodash-original.svg',
      'd3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/d3js/d3js-original.svg',

      // CMS & E-commerce
      'wordpress': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg',
      'shopify': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg',
      'drupal': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/drupal/drupal-original.svg',
      'joomla': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/joomla/joomla-original.svg',
      'magento': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/magento/magento-original.svg',

      // Databases
      'mysql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      'postgresql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      'mongodb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      'redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
      'sqlite': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
      'firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',

      // Backend
      'node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
      'django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
      'flask': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
      'laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg',
      'symfony': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/symfony/symfony-original.svg',

      // Cloud & DevOps
      'aws': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
      'docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg',
      'nginx': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',
      'apache': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg',

      // Tools & Services
      'google': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
      'github': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      'npm': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg',
      'yarn': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yarn/yarn-original.svg',
      'webpack': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg',
      'vite': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',
      'gulp': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gulp/gulp-plain.svg',
      'grunt': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grunt/grunt-original.svg',

      // Analytics & Marketing
      'google-analytics': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
      'google analytics': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
      'google-tag-manager': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
      'google tag manager': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
      'facebook': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg',
      'facebook pixel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg',
      'facebook-pixel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg',
      'twitter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg',
      'linkedin': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg',

      // Additional Analytics & Tracking
      'gtag': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
      'gtm': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
      'hotjar': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hotjar/hotjar-original.svg',
      'mixpanel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mixpanel/mixpanel-original.svg',
      'segment': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/segment/segment-original.svg',
      'amplitude': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amplitude/amplitude-original.svg'
    }

    return iconMap[name.toLowerCase()] || getAlternativeIconUrl(name) || getTechnologyIconUrl(name)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'javascript': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'css': 'bg-[#ff4b01]/30 text-[#ff4b01]',
      'html': 'bg-[#ff4b01]/40 text-[#ff4b01]',
      'framework': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'library': 'bg-[#ff4b01]/30 text-[#ff4b01]',
      'database': 'bg-[#ff4b01]/40 text-[#ff4b01]',
      'server': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'analytics': 'bg-[#ff4b01]/30 text-[#ff4b01]',
      'cms': 'bg-[#ff4b01]/40 text-[#ff4b01]',
      'ecommerce': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'detected': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'technologies': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'javascript_framework': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'website_builder': 'bg-[#ff4b01]/30 text-[#ff4b01]',
      'css_framework': 'bg-[#ff4b01]/40 text-[#ff4b01]',
      'ui_library': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'testing_framework': 'bg-[#ff4b01]/30 text-[#ff4b01]',
      'build_tool': 'bg-[#ff4b01]/40 text-[#ff4b01]',
      'deployment': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'monitoring': 'bg-[#ff4b01]/30 text-[#ff4b01]',
      'security': 'bg-[#ff4b01]/40 text-[#ff4b01]',
      'payment': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'marketing': 'bg-[#ff4b01]/30 text-[#ff4b01]',
      'social_media': 'bg-[#ff4b01]/40 text-[#ff4b01]',
      'chat': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'search': 'bg-[#ff4b01]/30 text-[#ff4b01]',
      'cdn': 'bg-[#ff4b01]/40 text-[#ff4b01]',
      'hosting': 'bg-[#ff4b01]/20 text-[#ff4b01]',
      'other': 'bg-[#ff4b01]/30 text-[#ff4b01]'
    }
    return colors[category?.toLowerCase() || 'technologies'] || colors['other']
  }

  // Try to get icon URL (from tech.icon or from icon service)
  const iconUrl = tech.icon || getIconUrl(tech.name)

  if (iconUrl) {
    return (
      <div className={`${className} rounded-lg flex items-center justify-center bg-white border border-gray-200 `}>
        <Image
          src={iconUrl}
          alt={tech.name || 'Technology'}
          width={24}
          height={24}
          className="w-6 h-6 object-contain"
          onError={(e) => {
            // Hide the image and show fallback
            e.currentTarget.style.display = 'none'
            const parent = e.currentTarget.parentElement
            if (parent) {
                parent.innerHTML = `
                  <div class="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">
                    <span class="text-xs font-semibold text-slate-600">${getInitials(tech.name || 'Technologies detected')}</span>
                  </div>
                `
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className={`${className} rounded-lg flex items-center justify-center bg-white border border-gray-200 `}>
      <div className={`w-6 h-6 rounded flex items-center justify-center ${getCategoryColor(tech.category || 'Technologies')}`}>
        <span className="text-xs font-semibold">{getInitials(tech.name || 'Technologies detected')}</span>
      </div>
    </div>
  )
}

export default function TechnologiesTab({ project, htmlContent, headers, cookies }: TechnologiesTabProps) {
  const [detectedTechnologies, setDetectedTechnologies] = useState<DetectedTechnology[]>([])
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionError, setDetectionError] = useState<string | null>(null)

  // HTML-based technology detection
  useEffect(() => {

    if (htmlContent && htmlContent.length > 0) {

      setIsDetecting(true)
      setDetectionError(null)

      try {
        const detected = detectTechnologiesFromHTML(htmlContent, headers, cookies)

        setDetectedTechnologies(detected)
      } catch (error) {
        console.error('Error detecting technologies:', error)
        setDetectionError('Failed to detect technologies from HTML content')
      } finally {
        setIsDetecting(false)
      }
    } else {

      // Test with sample HTML if no content is provided
      const testHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Test</title>
          <link rel="stylesheet" href="bootstrap.min.css">
          <script src="jquery.min.js"></script>
        </head>
        <body>
          <div class="text-center bg-[#ff4b01]">Test</div>
          <script>gtag('config', 'GA_MEASUREMENT_ID');</script>
        </body>
        </html>
      `

      try {
        const testDetected = detectTechnologiesFromHTML(testHtml)

        setDetectedTechnologies(testDetected)
      } catch (error) {
        console.error('Test detection failed:', error)
      }
    }
  }, [htmlContent, headers, cookies])

  // Convert project.technologies to DetectedTechnology format for unified display
  const projectTechnologies: DetectedTechnology[] = project.technologies?.map(tech => ({
    name: tech.name,
    version: tech.version || null,
    category: tech.category || 'detected',
    confidence: tech.confidence || 0.8,
    detection_method: 'project_data',
    description: null,
    website: null,
    icon: tech.icon || null
  })) || []

  // Combine both sources of technologies
  const allTechnologies = [...projectTechnologies, ...detectedTechnologies]

  // Remove duplicates based on name (project technologies take precedence)
  const uniqueTechnologies = allTechnologies.reduce((acc, tech) => {
    const existing = acc.find(t => t.name.toLowerCase() === tech.name.toLowerCase())
    if (!existing) {
      acc.push(tech)
    } else if (tech.detection_method === 'project_data') {
      // Replace with project data if it exists
      const index = acc.findIndex(t => t.name.toLowerCase() === tech.name.toLowerCase())
      acc[index] = tech
    }
    return acc
  }, [] as DetectedTechnology[])

  // Get technology statistics
  const stats = getTechnologyStats(uniqueTechnologies)
  const categorizedTechnologies = categorizeTechnologies(uniqueTechnologies)
  const hasTechnologies = uniqueTechnologies.length > 0

  // Debug: Log categories to see if any contain "unknown"

  return (
    <div className="space-y-6">
      {/* Project Technologies Section */}
      {/* {hasProjectTechnologies && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium text-green-800">Project Technologies</span>
            </div>
            <span className="text-sm text-green-600 font-medium">
              {projectTechnologies.length} technologies from project data
            </span>
          </div>
        </div>
      )} */}

   

      {/* Show all technologies (project + detected) in a single list */}
      {hasTechnologies && (
        <div className="bg-white border border-gray-200  p-4 space-y-3">
         

          <div className="flex flex-wrap gap-2">
            {uniqueTechnologies.map((tech: DetectedTechnology, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2  border border-gray-200 bg-gray-50 hover:border-[#ff4b01] transition-colors"
              >
                <TechnologyIcon tech={tech} className="w-8 h-8 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{tech.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    {tech.version && <span className="truncate">v{tech.version}</span>}
                    {/* {typeof tech.confidence === 'number' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#ff4b01]/10 text-[#ff4b01]">
                        {Math.round((tech.confidence || 0) * 100)}%
                      </span>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show message if no technologies found */}
      {!hasTechnologies && !isDetecting && !detectionError && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100  flex items-center justify-center">
            <span className="text-2xl text-gray-400">🔍</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No technologies found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            We couldn&apos;t identify any technologies from project data or HTML content. This might be due to the site&apos;s structure or detection limitations.
          </p>
        </div>
      )}
    </div>
  )
}
