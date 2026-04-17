import { render, screen } from "@/test-utils";

import HomeScreen from "./index";

describe("GIVEN HomeScreen", () => {
  it("SHOULD render the starter copy", () => {
    render(<HomeScreen />);

    expect(
      screen.getByRole("header", { name: "Street Group Tech Test" }),
    ).toBeOnTheScreen();
    expect(
      screen.getByText(
        "Empty Expo + Expo Router project for Jasper van Es' tech test exercise.",
      ),
    ).toBeOnTheScreen();
  });
});
