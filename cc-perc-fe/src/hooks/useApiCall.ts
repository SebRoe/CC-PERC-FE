import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useApiCall<T extends (...args: any[]) => Promise<any>>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const execute = useCallback(async (
    apiFunction: T,
    ...args: Parameters<T>
  ): Promise<ReturnType<T> | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err: any) {
      setError(err);
      
      // The interceptor will handle 401 errors, so we don't need to logout here
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [logout, navigate]);

  return {
    execute,
    isLoading,
    error,
  };
}