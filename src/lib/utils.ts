import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import localFont from "next/font/local";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export const WhyteInktrap = localFont({
  src: [
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-Heavy.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-Super.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-ExtraLightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-SuperItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-BookItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/whyte-inktrap/WhyteInktrap-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-whyteinktrap",
});
