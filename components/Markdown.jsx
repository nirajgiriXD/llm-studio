"use client";

/**
 * External dependencies.
 */
import { Children, isValidElement, memo, useMemo } from "react";
import MarkdownToJsx from "markdown-to-jsx";
import { CheckIcon, CopyIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useCopy from "@/hooks/useCopy";

/**
 * Flatten a rendered node back to plain text so a code block can be copied.
 * @param {import("react").ReactNode} node Rendered node.
 * @returns {string} Plain text.
 */
const toText = (node) => {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(toText).join("");
  }

  if (isValidElement(node)) {
    return toText(node.props.children);
  }

  return "";
};

/**
 * A fenced code block with a language label and a copy action.
 */
const CodeBlock = ({ children }) => {
  const { isCopied, copy } = useCopy();

  const [code, language] = useMemo(() => {
    const [first] = Children.toArray(children);
    const className = isValidElement(first) ? first.props.className ?? "" : "";
    const match = className.match(/lang(?:uage)?-(\w+)/);

    return [toText(children).replace(/\n$/, ""), match?.[1] ?? ""];
  }, [children]);

  return (
    <div className="not-first:mt-3 mb-3 overflow-hidden rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between gap-2 border-b bg-muted/60 py-1 pr-1 pl-3">
        <span className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
          {language || "code"}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => copy(code)}
          aria-label={isCopied ? "Code copied" : "Copy code"}
        >
          {isCopied ? <CheckIcon className="text-success" /> : <CopyIcon />}
        </Button>
      </div>
      <pre className="scrollbar-subtle overflow-x-auto p-3 text-[13px] leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
};

/**
 * Markdown overrides. Everything is styled explicitly rather than through a
 * typography plugin so model output matches the rest of the design system.
 */
const OVERRIDES = {
  p: { props: { className: "not-last:mb-3 leading-relaxed" } },
  h1: { props: { className: "not-first:mt-4 mb-2 text-base font-semibold tracking-tight" } },
  h2: { props: { className: "not-first:mt-4 mb-2 text-base font-semibold tracking-tight" } },
  h3: { props: { className: "not-first:mt-3 mb-1.5 text-sm font-semibold tracking-tight" } },
  h4: { props: { className: "not-first:mt-3 mb-1.5 text-sm font-semibold tracking-tight" } },
  ul: { props: { className: "not-last:mb-3 ml-5 list-disc space-y-1 marker:text-muted-foreground" } },
  ol: { props: { className: "not-last:mb-3 ml-5 list-decimal space-y-1 marker:text-muted-foreground" } },
  li: { props: { className: "leading-relaxed" } },
  blockquote: {
    props: {
      className: "not-last:mb-3 border-l-2 border-border pl-3 text-muted-foreground italic",
    },
  },
  hr: { props: { className: "my-4 border-t" } },
  // A component (rather than plain props) so the generated `lang-*` class
  // survives and the fenced block can label its language.
  code: {
    component: ({ className, ...props }) => (
      <code
        className={cn("rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]", className)}
        {...props}
      />
    ),
  },
  pre: { component: CodeBlock },
  a: {
    props: {
      className: "font-medium underline underline-offset-4 hover:opacity-80",
      target: "_blank",
      rel: "noreferrer noopener",
    },
  },
  table: {
    component: ({ className, ...props }) => (
      <div className="scrollbar-subtle not-last:mb-3 w-full overflow-x-auto rounded-lg border">
        <table className={cn("w-full text-left text-sm", className)} {...props} />
      </div>
    ),
  },
  th: { props: { className: "border-b bg-muted/50 px-3 py-2 font-medium" } },
  td: { props: { className: "border-b px-3 py-2" } },
  img: { props: { className: "my-3 max-w-full rounded-lg border" } },
};

/**
 * Renders model output as rich text.
 */
export const Markdown = memo(function Markdown({ children, className }) {
  return (
    <div className={cn("text-sm break-words", className)}>
      <MarkdownToJsx options={{ overrides: OVERRIDES, forceBlock: true }}>
        {children ?? ""}
      </MarkdownToJsx>
    </div>
  );
});
