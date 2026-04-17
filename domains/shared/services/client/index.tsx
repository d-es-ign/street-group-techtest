import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        retry: false,
        staleTime: 60 * 1000 * 5,
      },
      mutations: {
        gcTime: 0,
        retry: false,
      },
    },
  });
};

export const queryClient = createQueryClient();

export const QueryProvider = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
