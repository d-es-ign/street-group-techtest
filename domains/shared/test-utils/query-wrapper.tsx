import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

import { createQueryClient } from "@/domains/shared/services/client";

export const createQueryWrapper = () => {
  const client = createQueryClient();

  const QueryWrapper = ({ children }: PropsWithChildren) => {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };

  QueryWrapper.displayName = "QueryWrapper";

  return QueryWrapper;
};
