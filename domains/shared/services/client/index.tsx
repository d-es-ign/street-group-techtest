import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  persistQueryClientRestore,
  persistQueryClientSubscribe,
} from "@tanstack/react-query-persist-client";
import { PropsWithChildren, useEffect, useState } from "react";

const QUERY_PERSISTENCE_MAX_AGE = Infinity;

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
export const createQueryPersister = (storage = AsyncStorage) => {
  return createAsyncStoragePersister({
    storage,
    key: "bank-holidays-query-cache",
  });
};

export const queryPersister = createQueryPersister();

export const restorePersistedQueryClient = async (
  client: QueryClient,
  persister = queryPersister,
) => {
  await persistQueryClientRestore({
    queryClient: client,
    persister,
    maxAge: QUERY_PERSISTENCE_MAX_AGE,
  });
};

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [hasRestored, setHasRestored] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: () => void = () => undefined;

    const restore = async () => {
      try {
        await restorePersistedQueryClient(queryClient);
      } finally {
        unsubscribe = persistQueryClientSubscribe({
          queryClient,
          persister: queryPersister,
        });

        if (isMounted) {
          setHasRestored(true);
        }
      }
    };

    void restore();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (!hasRestored) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
