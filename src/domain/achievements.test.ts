import { describe, it, expect } from "vitest";
import { openingTitle } from "./achievements";

describe("openingTitle", () => {
  it("gives a flavourful title for known openings", () => {
    expect(openingTitle("sicilian-dragon", "Sicilian Dragon")).toBe("Dragon Slayer");
    expect(openingTitle("london-system", "London System")).toBe("London Grandmaster");
  });

  it("falls back to '<Name> Master' for unknown openings", () => {
    expect(openingTitle("some-new-line", "Some New Line")).toBe("Some New Line Master");
  });
});
