import { render } from "@testing-library/react-native";
import { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "styled-components/native";

import { createQueryWrapper } from "@/domains/shared/test-utils/query-wrapper";
import { appTheme } from "@/theme/theme";

const customRender = (ui: ReactElement) => {
  const QueryWrapper = createQueryWrapper();

  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) => {
      return (
        <QueryWrapper>
          <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
        </QueryWrapper>
      );
    },
  });
};

export * from "@testing-library/react-native";
export { createQueryWrapper, customRender as render };
