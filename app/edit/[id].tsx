import { router, useLocalSearchParams } from "expo-router";
import { Button } from "react-native";

import { useBankHolidaysStore } from "@/domains/bank-holidays/stores";
import { EditBankHolidayScreen } from "@/screens/edit-bank-holiday-screen";
import {
  StyledBody,
  StyledContainer,
} from "@/screens/home-screen/home-screen.styles";

export default function EditBankHolidayRoute() {
  const { id } = useLocalSearchParams();
  const bankHoliday = useBankHolidaysStore((state) =>
    state.bankHolidays.find((event) => event.id === id),
  );

  if (!bankHoliday) {
    return (
      <StyledContainer>
        <StyledBody accessibilityLiveRegion="assertive" accessibilityRole="alert">
          Bank holiday not found.
        </StyledBody>
        <Button title="Go back" onPress={() => router.back()} />
      </StyledContainer>
    );
  }

  return <EditBankHolidayScreen bankHoliday={bankHoliday} />;
}
