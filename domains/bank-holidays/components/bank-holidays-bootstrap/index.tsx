import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { bankHolidaysOptions } from "@/domains/bank-holidays/hooks/queries/use-bank-holidays-query";
import { useBankHolidaysStore } from "@/domains/bank-holidays/stores";

export const BankHolidaysBootstrap = () => {
  const bankHolidays = useBankHolidaysStore((state) => state.bankHolidays);
  const hasHydrated = useBankHolidaysStore((state) => state.hasHydrated);
  const setBankHolidays = useBankHolidaysStore((state) => state.setBankHolidays);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hasHydrated || bankHolidays.length > 0) {
      return;
    }

    let isMounted = true;

    void queryClient
      .fetchQuery(bankHolidaysOptions())
      .then((data) => {
        if (isMounted) {
          setBankHolidays(data);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [bankHolidays.length, hasHydrated, queryClient, setBankHolidays]);

  return null;
};
