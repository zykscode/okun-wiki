import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { Header } from "@/components/layout/header";

// Mock next/link
vi.mock("next/link", () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => {
      return <a href={href}>{children}</a>;
    },
  };
});

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock ThemeToggle and MobileNav since they might have complex logic/hooks
vi.mock("@/components/theme/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

vi.mock("@/components/layout/mobile-nav", () => ({
  MobileNav: () => <div data-testid="mobile-nav">Mobile Nav</div>,
}));

test("Header renders successfully", async () => {
  // Since Header is an async Server Component, we need to await it
  const HeaderComponent = await Header();
  render(HeaderComponent);

  // Check for logo text
  expect(screen.getByText("Okunpedia")).toBeInTheDocument();

  // Check for navigation links
  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Towns")).toBeInTheDocument();
  expect(screen.getByText("Blog")).toBeInTheDocument();
  expect(screen.getByText("About")).toBeInTheDocument();
});
