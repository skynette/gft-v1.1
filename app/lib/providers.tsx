'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { queryClientOptions } from './utils';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';
import Next13ProgressBar from 'next13-progressbar';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries:
        { ...queryClientOptions.defaultOptions?.queries },
      mutations: { ...queryClientOptions.defaultOptions?.mutations }
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient

}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SessionProvider>
          {children}
          <Next13ProgressBar height="4px" color="#0A2FFF" options={{ showSpinner: false }} showOnShallow />
        </SessionProvider>
      </ThemeProvider>
      <Toaster richColors position='top-right' />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}