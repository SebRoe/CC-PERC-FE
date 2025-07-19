import { apiClient } from './api';
import { apiInterceptor } from './api-interceptor';
import type { 
  Analysis, 
  AnalysisRequest, 
  DetailedReport,
  AuthResponse,
  User
} from '../types/analysis';

export const api = {
  // Auth endpoints
  register: (email: string, password: string, firstName: string, lastName: string) =>
    apiInterceptor.makeRequest(() => apiClient.register(email, password, firstName, lastName), { skipAuth: true }),
  
  login: (email: string, password: string) =>
    apiInterceptor.makeRequest(() => apiClient.login(email, password), { skipAuth: true }),
  
  getCurrentUser: (skipAuth = false) =>
    apiInterceptor.makeRequest(() => apiClient.getCurrentUser(), { skipAuth }),
  
  logout: () => apiClient.logout(), // No need to intercept logout
  
  // Analysis endpoints
  requestAnalysis: (url: string, analysisType: 'homepage' = 'homepage') =>
    apiInterceptor.makeRequest(() => apiClient.requestAnalysis(url, analysisType)),
  
  getAnalyses: () =>
    apiInterceptor.makeRequest(() => apiClient.getAnalyses()),
  
  getAnalysis: (id: string) =>
    apiInterceptor.makeRequest(() => apiClient.getAnalysis(id)),
  
  deleteAnalysis: (id: string) =>
    apiInterceptor.makeRequest(() => apiClient.deleteAnalysis(id)),
  
  getAnalysisReport: (id: string, format: 'json' | 'markdown' | 'html' = 'json') =>
    apiInterceptor.makeRequest(() => apiClient.getAnalysisReport(id, format)),
  
  // Direct access to setToken for auth context
  setToken: (token: string | null) => apiClient.setToken(token),
};

// Re-export types
export type { AuthResponse, User };