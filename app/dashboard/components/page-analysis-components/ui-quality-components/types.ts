export interface ImageAnalysis {
  desktop?: {
    ui_ux_score: number
    content_score: number
    overall_score: number
    [key: string]: any
  }
  mobile?: {
    ui_ux_score: number
    content_score: number
    overall_score: number
    [key: string]: any
  } | null
  ui_ux_score: number
  content_score: number
  overall_score: number
  ui_ux_analysis: {
    layout_score: number
    color_scheme_score: number
    typography_score: number
    spacing_score: number
    visual_hierarchy_score: number
    accessibility_score?: number
    mobile_responsiveness_score?: number
    navigation_score?: number
    call_to_action_score?: number
    issues: Array<{
      type: string
      severity: 'high' | 'medium' | 'low'
      heading?: string
      problem?: string
      solution?: string
      description?: string
      suggestion?: string
      location?: string
      impact?: string
    }>
    strengths: string[]
    detailed_metrics?: {
      color_contrast_ratio?: string
      font_sizes_used?: string[]
      spacing_consistency?: string
      element_alignment?: string
      visual_balance?: string
    }
  }
  content_analysis: {
    readability_score: number
    clarity_score: number
    structure_score: number
    seo_score?: number
    content_length_score?: number
    heading_structure_score?: number
    issues: Array<{
      type: string
      severity: 'high' | 'medium' | 'low'
      description: string
      suggestion: string
      location?: string
    }>
    strengths: string[]
    detailed_metrics?: {
      word_count_estimate?: number
      heading_count?: number
      paragraph_count?: number
      list_usage?: string
      content_density?: string
    }
  }
  design_patterns?: {
    identified_patterns?: string[]
    modern_design_elements?: string[]
    outdated_elements?: string[]
    best_practices_followed?: string[]
    best_practices_missing?: string[]
  }
  brand_consistency?: {
    score?: number
    color_consistency?: string
    typography_consistency?: string
    style_consistency?: string
    issues?: Array<{
      description: string
      suggestion: string
    }>
  }
  recommendations: Array<{
    category?: string
    priority?: 'high' | 'medium' | 'low'
    title?: string
    description?: string
    impact?: string
    effort?: 'low' | 'medium' | 'high'
  }> | string[]
  summary: string
  detailed_summary?: {
    overall_assessment?: string
    key_strengths?: string[]
    key_weaknesses?: string[]
    quick_wins?: string[]
    long_term_improvements?: string[]
  }
  analysis_timestamp: string
}

export interface QualityMetric {
  name: string
  value: number
  max: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  description: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'accessibility' | 'performance' | 'structure' | 'modern-standards'
  impact: string
}

