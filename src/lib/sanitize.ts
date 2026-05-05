/**
 * Server-safe HTML sanitizer using isomorphic-dompurify.
 * Use this before saving ANY user-generated HTML content to the database.
 */
import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "code",
  "pre",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "hr",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "span",
  "div",
];

const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "class",
  "style",
  "colspan",
  "rowspan",
  "data-text-align",
];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Force external links to open safely
    FORCE_BODY: true,
    RETURN_DOM: false,
    // Add rel noopener to all links
    ADD_ATTR: ["target"],
  });
}
