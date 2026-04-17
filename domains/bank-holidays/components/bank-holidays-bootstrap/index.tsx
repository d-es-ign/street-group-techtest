import { useEffect } from "react";

import { bankHolidaysOptions } from "@/domains/bank-holidays/hooks/queries/use-bank-holidays-query";
import { useBankHolidaysStore } from "@/domains/bank-holidays/stores";
import { queryClient } from "@/domains/shared/services/client";

export const BankHolidaysBootstrap = () => {
  const bankHolidays = useBankHolidaysStore((state) => state.bankHolidays);
  const setBankHolidays = useBankHolidaysStore((state) => state.setBankHolidays);

  useEffect(() => {
    if (bankHolidays.length > 0) {
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
  }, [bankHolidays.length, setBankHolidays]);

  return null;
};
