import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import superjson from 'superjson';
import type { AppRouter } from '../../../../backend/src/trpc/app.router';

export const queryClient = new QueryClient();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/trpc`,
      transformer: superjson,
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
