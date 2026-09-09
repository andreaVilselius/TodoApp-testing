
import React from "react";
import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App.jsx";

describe("Komponenttester", () => {
  test("appen renderas", () => {
    render(<App />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});