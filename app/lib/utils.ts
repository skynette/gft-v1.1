import { QueryClientConfig } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx"
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

export const createQueryString = (pathname: string, router: any, name: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search)
  if (value) {
    if (!Array.isArray(value)) {
      if (!searchParams.has(name)) searchParams.append(name, value)
      else searchParams.set(name, value)
    } else {
      if (!searchParams.has(name)) searchParams.append(name, value.join())
      else searchParams.set(name, value.join())
    }
  } else if (searchParams.has(name)) searchParams.delete(name)
  const newUrl = pathname + '?' + searchParams.toString()
  router.push(newUrl)
}