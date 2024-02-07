'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function Provider({ children }: any) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default Provider;
