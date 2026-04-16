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
        "Empty Expo Router starter for interview and tech test exercises.",
      ),
    ).toBeOnTheScreen();
  });
});
