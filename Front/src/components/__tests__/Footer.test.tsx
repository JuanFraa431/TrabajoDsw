import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders contact and sales sections", () => {
    render(<Footer />);

    expect(screen.getByText("Atención al cliente")).toBeInTheDocument();
    expect(screen.getByText("Ventas")).toBeInTheDocument();
  });
});
