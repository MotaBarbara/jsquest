import { User } from '@supabase/supabase-js';

export const calculateInitials = (firstName?: string, lastName?: string): string => {
  const firstInitial = firstName?.[0] ?? '';
  const lastInitial = lastName?.[0] ?? '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

export const calculateProgress = (completed: number, total: number): number => {
  return Math.round((completed / total) * 100);
};

export const isUserAuthenticated = (user: User | null): boolean => {
  return !!user;
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}; 