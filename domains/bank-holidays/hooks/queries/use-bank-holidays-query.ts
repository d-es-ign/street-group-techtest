import { queryOptions, useQuery } from "@tanstack/react-query";

import { bankHolidaysQueryKeys } from "@/domains/bank-holidays/constants/query-keys";
import { bankHolidaysApiService } from "@/domains/bank-holidays/services/api";
import { BankHolidayEvent } from "@/domains/bank-holidays/types";

export const bankHolidaysOptions = () => {
  return queryOptions<BankHolidayEvent[], Error>({
    queryKey: bankHolidaysQueryKeys.all,
    queryFn: () => bankHolidaysApiService.getBankHolidays(),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useBankHolidaysQuery = () => {
  return useQuery(bankHolidaysOptions());
};
