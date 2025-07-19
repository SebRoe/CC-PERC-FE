// Type definitions for the enhanced analysis API

export interface Analysis {
  id: string;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  analysis_type: 'homepage' | 'competitor' | 'tech_seo' | 'accessibility';
  ai_analysis?: AIAnalysis;
  performance_analysis?: PerformanceAnalysis;
  report?: DetailedReport;
  screenshots: string[];
  created_at: string;
  processing_time?: number;
}

export interface AIAnalysis {
  // From advanced_homepage_analyzer
  content?: ContentReport;
  visual_analysis?: VisualReport;
  seo?: SEOReport;
  technical_seo?: TechnicalSEOReport;
  ux?: UXReport;
  html_analysis?: HTMLAnalysis;
  competitive_insights?: CompetitiveInsights;
  summary?: SummaryReport;
  scores?: AnalysisScores;
  
  // From parallel workers
  content_analysis?: WorkerContentAnalysis;
  seo_analysis?: WorkerSEOAnalysis;
  ux_analysis?: WorkerUXAnalysis;
  performance?: PerformanceAnalysis;
}

export interface ContentReport {
  value_proposition: string;
  messaging_clarity: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface VisualReport {
  layout_score: number;
  color_scheme: Record<string, any>;
  typography: Record<string, any>;
  visual_hierarchy: string[];
  above_fold_analysis: Record<string, any>;
  cta_visibility: Record<string, any>;
  mobile_responsiveness: string;
  accessibility_visual: string[];
  improvement_suggestions: string[];
}

export interface SEOReport {
  title: string;
  meta_description: string;
  keyword_density: number;
  heading_structure: string;
  internal_links: number;
  external_links: number;
  critical_issues: string[];
  recommendations: string[];
}

export interface StructuredDataInfo {
  has_structured_data: boolean;
  types_found: string[];
}

export interface OpenGraphInfo {
  has_og_tags: boolean;
  title?: string;
  description?: string;
  image?: string;
}

export interface TwitterCardInfo {
  has_twitter_card: boolean;
  card_type?: string;
  title?: string;
  description?: string;
}

export interface PageSpeedInsights {
  optimization_score: number;
  opportunities: string[];
}

export interface HreflangTag {
  lang: string;
  url: string;
}

export interface TechnicalSEOReport {
  structured_data: StructuredDataInfo;
  open_graph: OpenGraphInfo;
  twitter_card: TwitterCardInfo;
  canonical_url?: string;
  robots_directives: string[];
  hreflang_tags: HreflangTag[];
  sitemap_reference: boolean;
  page_speed_insights: PageSpeedInsights;
}

export interface UXReport {
  navigation_clarity: string;
  page_speed: string;
  mobile_friendliness: string;
  accessibility_issues: string[];
  improvement_suggestions: string[];
}

export interface HTMLAnalysis {
  heading_structure: {
    headings: Record<string, any>;
    h1_count: number;
    has_proper_hierarchy: boolean;
    total_headings: number;
  };
  semantic_html: {
    semantic_tags_used: Record<string, number>;
    uses_semantic_html: boolean;
    semantic_score: number;
  };
  forms: Array<{
    action: string;
    method: string;
    input_count: number;
    has_submit_button: boolean;
    input_types: string[];
  }>;
  images: {
    total_images: number;
    images_with_alt: number;
    alt_text_percentage: number;
    lazy_loaded_images: number;
  };
  links: {
    total_links: number;
    internal_links: number;
    external_links: number;
    external_links_sample: string[];
  };
  scripts: {
    total_scripts: number;
    external_scripts: number;
    inline_scripts: number;
    detected_libraries: Record<string, boolean>;
  };
}

export interface CompetitiveInsights {
  industry_standards: string[];
  unique_elements: string[];
  missing_elements: string[];
  competitive_advantages: string[];
}

export interface SummaryReport {
  overall_score: number;
  key_findings: string[];
  critical_issues: string[];
  action_items: Array<{
    task: string;
    priority: 'high' | 'medium' | 'low';
    timeframe: string;
  }>;
}

export interface AnalysisScores {
  overall_score: number;
  content_score: number;
  visual_score: number;
  seo_score: number;
  ux_score: number;
  performance_score: number;
  scoring_rationale: Record<string, string>;
}

export interface PerformanceAnalysis {
  resource_hints: {
    resource_hints: Record<string, any[]>;
    optimization_level: string;
    missing_hints: string[];
  };
  critical_css: {
    has_critical_css: boolean;
    critical_css_size: number;
    render_blocking_css: number;
    optimization_suggestions: string[];
  };
  core_web_vitals: {
    estimates: {
      LCP: number;
      FID: number;
      CLS: number;
      FCP: number;
      TTFB: number;
    };
    ratings: Record<string, 'good' | 'needs improvement' | 'poor'>;
    overall_rating: 'good' | 'needs improvement' | 'poor';
  };
  resource_loading: {
    scripts: {
      all: string[];
      async: string[];
      defer: string[];
      render_blocking: number;
    };
    stylesheets: {
      all: string[];
      render_blocking: number;
    };
    images: {
      all: string[];
      lazy_loaded: number;
      missing_lazy_loading: number;
      next_gen_formats: Record<string, any>;
    };
    total_requests: number;
  };
  third_party_impact: {
    categories: Record<string, string[]>;
    total_count: number;
    impact_assessment: string;
    recommendations: string[];
  };
  best_practices: {
    checks: Record<string, any>;
    compliance_score: number;
    missing_optimizations: string[];
  };
  optimization_score: number;
  recommendations: Array<{
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
  }>;
}

export interface WorkerContentAnalysis {
  analysis: string;
  timestamp: string;
}

export interface WorkerSEOAnalysis {
  technical_data: Record<string, any>;
  ai_insights: string;
  timestamp: string;
}

export interface WorkerUXAnalysis {
  ux_metrics: Record<string, any>;
  ai_evaluation: string;
  timestamp: string;
}

export interface DetailedReport {
  id: string;
  url: string;
  analysis_date: string;
  executive_summary: {
    overall_score: number;
    grade: string;
    key_findings: string[];
    critical_issues: string[];
    quick_wins: string[];
    strategic_recommendations: string[];
  };
  sections: Array<{
    title: string;
    content: any;
    priority: 'high' | 'medium' | 'low';
    visualization?: VisualizationData;
  }>;
  visualizations: Record<string, VisualizationData>;
}

export interface VisualizationData {
  chart_type: 'bar' | 'line' | 'pie' | 'radar' | 'spider' | 'gauge' | 'checklist' | 'horizontal-bar' | 'timeline' | 'comparison';
  data: any[];
  options?: Record<string, any>;
}

// Analysis request types
export interface AnalysisRequest {
  url: string;
  analysis_type?: 'homepage' | 'competitor' | 'tech_seo' | 'accessibility';
}

// API Response types
export interface AnalysisResponse extends Analysis {}

export interface ReportFormat {
  format: 'json' | 'markdown' | 'html';
}