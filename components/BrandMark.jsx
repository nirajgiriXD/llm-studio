/**
 * Internal dependencies.
 */
import { cn } from "@/lib/utils";

/**
 * The product glyph. Kept as inline SVG so it inherits colour from whatever
 * surface it sits on and never costs a network request.
 *
 * The same star is mirrored in `app/icon.svg` and `app/favicon.ico`, minus the
 * accent dot — at 16px it collides with the upper-right arm and reads as a
 * smudge rather than a highlight.
 */
export const BrandMark = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={cn("size-4", className)}
    {...props}
  >
    <path
      d="M12 2.5 14.3 9.7 21.5 12l-7.2 2.3L12 21.5l-2.3-7.2L2.5 12l7.2-2.3L12 2.5Z"
      fill="currentColor"
    />
    <circle cx="19" cy="5" r="1.6" fill="currentColor" opacity="0.55" />
  </svg>
);
