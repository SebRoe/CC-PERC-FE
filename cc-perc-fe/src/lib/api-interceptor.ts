interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  request: () => Promise<any>;
}

class ApiInterceptor {
  private isRefreshing = false;
  private failedQueue: QueuedRequest[] = [];
  private refreshAttempts = 0;
  private maxRefreshAttempts = 1;

  private processQueue(error: Error | null = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.request().then(prom.resolve).catch(prom.reject);
      }
    });
    
    this.failedQueue = [];
  }

  async makeRequest<T>(
    requestFn: () => Promise<T>,
    options: { skipAuth?: boolean, isRetry?: boolean } = {}
  ): Promise<T> {
    try {
      this.refreshAttempts = 0; // Reset on successful request
      return await requestFn();
    } catch (error: any) {
      // Check if error is due to expired token (401)
      if (error.status === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        if (options.skipAuth || options.isRetry || this.refreshAttempts >= this.maxRefreshAttempts) {
          // Don't retry auth requests, retries, or if we've hit the limit
          throw error;
        }

        if (this.isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            this.failedQueue.push({
              resolve,
              reject,
              request: requestFn
            });
          });
        }

        this.isRefreshing = true;
        this.refreshAttempts++;

        try {
          // For cookie-based auth with httpOnly cookies, we can't access the token
          // The backend should handle token refresh automatically via Supabase
          // If we get a 401, it means the session is truly expired
          
          this.isRefreshing = false;
          this.refreshAttempts = 0;
          this.processQueue(new Error('Session expired'));
          
          // Clear any auth state and redirect to login
          window.location.href = '/auth';
          
          throw new Error('Session expired');
        } catch (refreshError) {
          this.isRefreshing = false;
          this.refreshAttempts = 0;
          this.processQueue(refreshError as Error);
          
          throw refreshError;
        }
      }

      throw error;
    }
  }
}

export const apiInterceptor = new ApiInterceptor();