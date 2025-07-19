/**
 * V1 API Client - Enhanced integration with CC-PERC v1 backend
 * 
 * Features:
 * - Real-time progress tracking
 * - Background job monitoring
 * - Enhanced error handling
 * - System monitoring integration
 */

import type { 
  Analysis, 
  AnalysisRequest, 
  DetailedReport,
  AuthResponse,
  User
} from '../types/analysis';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// V1 specific types
export interface V1AnalysisResponse {
  id: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  profile?: {
    name: string;
    description: string;
  };
  progress?: {
    total_analyzers: number;
    completed_analyzers: number;
    progress_percentage: number;
    current_analyzer?: string;
    analyzer_status: Array<{
      name: string;
      status: string;
      started_at?: string;
      execution_time?: number;
    }>;
  };
  results?: {
    analyzer_results: Record<string, any>;
    summary: {
      total_analyzers: number;
      successful_analyzers: number;
      failed_analyzers: number;
      total_results: number;
      critical_issues: number;
      warnings: number;
      artifacts_count: number;
    };
    artifacts: Array<{
      type: string;
      subtype?: string;
      path: string;
      metadata?: any;
    }>;
  };
}

export interface V1AnalysisProfile {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  analyzer_configs: {
    analyzers: Array<{
      name: string;
      version: string;
      config: Record<string, any>;
    }>;
  };
  created_at: string;
  updated_at?: string;
}

export interface V1SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  components: {
    database: {
      status: string;
      response_time?: string;
      error?: string;
    };
    celery: {
      status: string;
      active_workers?: number;
      worker_names?: string[];
      error?: string;
    };
  };
}

export interface V1PerformanceMetrics {
  time_period_hours: number;
  summary: {
    total_analyses: number;
    completed: number;
    failed: number;
    running: number;
    pending: number;
    success_rate: number;
    avg_completion_time_seconds: number;
  };
  analyzer_performance: Array<{
    name: string;
    total_runs: number;
    successful: number;
    failed: number;
    success_rate: number;
    avg_execution_time: number;
    max_execution_time: number;
    min_execution_time: number;
  }>;
  hourly_breakdown: Array<{
    hour: string;
    analyses_started: number;
    completed: number;
    completion_rate: number;
  }>;
}

class V1ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      const errorMessage = error.detail || `Request failed with status ${response.status}`;
      
      const err = new Error(errorMessage);
      (err as any).status = response.status;
      throw err;
    }

    return response.json();
  }

  // ============================================================================
  // V1 Analysis Endpoints
  // ============================================================================

  async createAnalysis(url: string, profileId?: string): Promise<V1AnalysisResponse> {
    return this.request<V1AnalysisResponse>('/api/v1/analyses', {
      method: 'POST',
      body: JSON.stringify({ 
        url, 
        profile_id: profileId 
      }),
    });
  }

  async getAnalyses(page = 1, perPage = 20, status?: string): Promise<{
    analyses: V1AnalysisResponse[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (status) params.append('status', status);

    return this.request(`/api/v1/analyses?${params}`);
  }

  async getAnalysis(id: string): Promise<V1AnalysisResponse> {
    return this.request<V1AnalysisResponse>(`/api/v1/analyses/${id}`);
  }

  async deleteAnalysis(id: string): Promise<{ message: string }> {
    return this.request(`/api/v1/analyses/${id}`, { method: 'DELETE' });
  }

  async retryAnalysis(id: string): Promise<{ message: string; task_id: string }> {
    return this.request(`/api/v1/analyses/${id}/retry`, { method: 'POST' });
  }

  async getJobStatus(id: string): Promise<{
    task_id?: string;
    status: string;
    result?: any;
    info?: any;
  }> {
    return this.request(`/api/v1/analyses/${id}/job-status`);
  }

  // ============================================================================
  // V1 Profile Management
  // ============================================================================

  async getProfiles(): Promise<V1AnalysisProfile[]> {
    return this.request<V1AnalysisProfile[]>('/api/v1/profiles');
  }

  async getProfile(id: string): Promise<V1AnalysisProfile> {
    return this.request<V1AnalysisProfile>(`/api/v1/profiles/${id}`);
  }

  async getDefaultProfile(): Promise<{
    id: string;
    name: string;
    analyzer_configs: any;
  }> {
    return this.request('/api/v1/profiles/default/config');
  }

  async validateProfile(id: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    analyzer_status: Record<string, any>;
  }> {
    return this.request(`/api/v1/profiles/validate/${id}`);
  }

  async getAvailableAnalyzers(): Promise<{
    analyzers: Record<string, {
      name: string;
      version: string;
      dependencies: string[];
      description: string;
      config_schema: any;
      available_versions: string[];
    }>;
    total_count: number;
  }> {
    return this.request('/api/v1/profiles/available-analyzers/list');
  }

  // ============================================================================
  // V1 Monitoring & System Health
  // ============================================================================

  async getSystemHealth(): Promise<V1SystemHealth> {
    return this.request<V1SystemHealth>('/api/v1/monitoring/health');
  }

  async getPerformanceMetrics(hours = 24): Promise<V1PerformanceMetrics> {
    return this.request<V1PerformanceMetrics>(`/api/v1/monitoring/metrics/analysis-performance?hours=${hours}`);
  }

  async getCeleryWorkers(): Promise<{
    workers: Record<string, {
      status: string;
      broker: any;
      pool: any;
      rusage: any;
      active_tasks: number;
      scheduled_tasks: number;
      registered_tasks: number;
      active_task_details: any[];
      registered_task_list: string[];
    }>;
    total_workers: number;
    online_workers: number;
  }> {
    return this.request('/api/v1/monitoring/celery/workers');
  }

  async getQueueStats(): Promise<{
    queues: Record<string, { length: number; type: string }>;
    redis_info: {
      connected_clients: number;
      used_memory: string;
      total_commands_processed: number;
    };
    inspect_available: boolean;
  }> {
    return this.request('/api/v1/monitoring/celery/queue-stats');
  }

  async getDatabaseStats(): Promise<{
    tables: Array<{ name: string; row_count: number }>;
    recent_activity: Array<{ date: string; analyses_created: number }>;
  }> {
    return this.request('/api/v1/monitoring/database/stats');
  }

  // ============================================================================
  // V1 System Info
  // ============================================================================

  async getSystemInfo(): Promise<{
    version: string;
    features: string[];
    available_analyzers: string[];
    total_analyzer_count: number;
  }> {
    return this.request('/api/v1/info');
  }

  async getApiHealth(): Promise<{
    status: string;
    version: string;
    api: string;
  }> {
    return this.request('/api/v1/health');
  }
}

// ============================================================================
// Progress Polling Utility
// ============================================================================

export class AnalysisProgressPoller {
  private intervalId?: NodeJS.Timeout;
  private onUpdate?: (analysis: V1AnalysisResponse) => void;
  private onComplete?: (analysis: V1AnalysisResponse) => void;
  private onError?: (error: Error) => void;

  constructor(
    private apiClient: V1ApiClient,
    private analysisId: string,
    private pollInterval = 2000 // 2 seconds
  ) {}

  start(callbacks: {
    onUpdate?: (analysis: V1AnalysisResponse) => void;
    onComplete?: (analysis: V1AnalysisResponse) => void;
    onError?: (error: Error) => void;
  }) {
    this.onUpdate = callbacks.onUpdate;
    this.onComplete = callbacks.onComplete;
    this.onError = callbacks.onError;

    this.intervalId = setInterval(async () => {
      try {
        const analysis = await this.apiClient.getAnalysis(this.analysisId);
        
        this.onUpdate?.(analysis);

        if (analysis.status === 'completed' || analysis.status === 'failed') {
          this.stop();
          this.onComplete?.(analysis);
        }
      } catch (error) {
        this.onError?.(error as Error);
        this.stop();
      }
    }, this.pollInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}

// ============================================================================
// Enhanced API with interceptor support
// ============================================================================

export class EnhancedApiClient {
  private v1Client: V1ApiClient;
  private legacyClient: any; // For v0 compatibility

  constructor(baseUrl: string, legacyClient?: any) {
    this.v1Client = new V1ApiClient(baseUrl);
    this.legacyClient = legacyClient;
  }

  // V1 methods
  get v1() {
    return this.v1Client;
  }

  // Legacy methods (for backward compatibility)
  get legacy() {
    return this.legacyClient;
  }

  // Convenience method for creating analysis with real-time updates
  async createAnalysisWithProgress(
    url: string,
    profileId?: string,
    callbacks?: {
      onUpdate?: (analysis: V1AnalysisResponse) => void;
      onComplete?: (analysis: V1AnalysisResponse) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<{ analysis: V1AnalysisResponse; poller: AnalysisProgressPoller }> {
    const analysis = await this.v1Client.createAnalysis(url, profileId);
    
    const poller = new AnalysisProgressPoller(this.v1Client, analysis.id);
    
    if (callbacks) {
      poller.start(callbacks);
    }

    return { analysis, poller };
  }
}

// Export instances
export const v1ApiClient = new V1ApiClient(API_BASE_URL);
export const enhancedApiClient = new EnhancedApiClient(API_BASE_URL);

// Export types
export type { 
  V1AnalysisResponse,
  V1AnalysisProfile, 
  V1SystemHealth,
  V1PerformanceMetrics 
};