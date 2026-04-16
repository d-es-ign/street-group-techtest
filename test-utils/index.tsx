import { render } from "@testing-library/react-native";
import { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "styled-components/native";

import { appTheme } from "@/theme/theme";

const Providers = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider theme={appTheme}>{children}</ThemeProvider>;
};

const customRender = (ui: ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => <Providers>{children}</Providers>,
  });
};

export * from "@testing-library/react-native";
export { customRender as render };
