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
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.token = localStorage.getItem('access_token')
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('access_token', token)
    } else {
      localStorage.removeItem('access_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }))
      throw new Error(error.detail || 'Request failed')
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
    this.setToken(null)
  }

  // ------------------------------------------------------------
  // Analysis endpoints
  // ------------------------------------------------------------

  async requestAnalysis(url: string, analysisType: 'homepage' = 'homepage') {
    type AnalysisResponse = {
      id: string
      url: string
      status: 'pending' | 'processing' | 'completed' | 'failed'
      analysis_type: string
      ai_analysis?: Record<string, unknown>
      screenshots?: string[]
      created_at: string
    }

    return this.request<AnalysisResponse>('/analyze', {
      method: 'POST',
      body: JSON.stringify({ url, analysis_type: analysisType }),
    })
  }

  async getAnalyses(): Promise<any[]> {
    return this.request<any[]>('/analyses')
  }

  async getAnalysis(id: string): Promise<any> {
    return this.request<any>(`/analyses/${id}`)
  }

  async deleteAnalysis(id: string): Promise<void> {
    return this.request<void>(`/analyses/${id}`, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)