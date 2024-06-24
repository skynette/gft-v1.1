import { type ClassValue, clsx } from "clsx"
import { QueryClientConfig } from "react-query";
import { twMerge } from "tailwind-merge"

export const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 500,
      refetchOnWindowFocus: false,
      staleTime: 3600000 // 1 hr before data goes stale
    },
    // mutations: {
    //   retry: 2,
    //   retryDelay: 500
    // }
  },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
