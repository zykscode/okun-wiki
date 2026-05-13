import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    return React.createElement("img", { ...props, priority: undefined });
  },
}));
