import { useBankHolidaysQuery } from "@/domains/bank-holidays/hooks/queries/use-bank-holidays-query";
import { useBankHolidaysStore } from "@/domains/bank-holidays/stores";

export const useBankHolidays = () => {
  const bankHolidays = useBankHolidaysStore((state) => state.bankHolidays);
  const setBankHolidays = useBankHolidaysStore((state) => state.setBankHolidays);
  const { isError, isLoading, isRefetching, refetch } = useBankHolidaysQuery();

  const refreshBankHolidays = async () => {
    const refreshedResult = await refetch();

    if (refreshedResult.data) {
      setBankHolidays(refreshedResult.data);
    }

    return refreshedResult;
  };

  return {
    bankHolidays,
    isError,
    isLoading: isLoading && bankHolidays.length === 0,
    isRefreshing: isRefetching,
    refreshBankHolidays,
  };
};
