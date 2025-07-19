import type { 
  Analysis, 
  AnalysisRequest, 
  DetailedReport,
  ReportFormat 
} from '../types/analysis'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export interface AuthResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    email: string
    first_name?: string
    last_name?: string
  }
}

export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    // No longer needed with httpOnly cookies
    // Token is managed by the browser automatically
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies in requests
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }))
      const errorMessage = error.detail || `Request failed with status ${response.status}`
      
      // Include status code in error for interceptor to handle
      const err = new Error(errorMessage);
      (err as any).status = response.status;
      throw err;
    }

    return response.json()
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
    })
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  async logout(): Promise<void> {
    await this.request<void>('/auth/logout', {
      method: 'POST',
    })
  }

  // ------------------------------------------------------------
  // Analysis endpoints
  // ------------------------------------------------------------

  async requestAnalysis(url: string, analysisType: 'homepage' = 'homepage'): Promise<Analysis> {
    return this.request<Analysis>('/analyze', {
      method: 'POST',
      body: JSON.stringify({ url, analysis_type: analysisType } as AnalysisRequest),
    })
  }

  async getAnalyses(): Promise<Analysis[]> {
    return this.request<Analysis[]>('/analyses')
  }

  async getAnalysis(id: string): Promise<Analysis> {
    return this.request<Analysis>(`/analyses/${id}`)
  }

  async deleteAnalysis(id: string): Promise<void> {
    return this.request<void>(`/analyses/${id}`, { method: 'DELETE' })
  }

  async getAnalysisReport(id: string, format: 'json' | 'markdown' | 'html' = 'json'): Promise<DetailedReport | string> {
    const endpoint = `/analyses/${id}/report?format=${format}`
    
    if (format === 'json') {
      return this.request<DetailedReport>(endpoint)
    }
    
    // For markdown and html, we need to handle text response
    const headers: HeadersInit = {}
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, { 
      headers,
      credentials: 'include' // Include cookies in requests
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }))
      throw new Error(error.detail || 'Request failed')
    }
    
    return response.text()
  }
}

const apiClientInstance = new ApiClient(API_BASE_URL)
export const apiClient = apiClientInstance