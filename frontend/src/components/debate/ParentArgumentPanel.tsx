"use client";

interface ParentArgumentPanelProps {
  text: string;
  author?: string;
}

export function ParentArgumentPanel({ text, author }: ParentArgumentPanelProps) {
  const showScrollHint = text.length > 240;

  return (
    <section
      aria-label="Argument you are replying to"
      className="mb-5 overflow-hidden rounded-xl border border-border bg-muted/15"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-card/40 px-4 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Replying to
          {author ? (
            <span className="normal-case tracking-normal text-foreground/80">
              {" "}
              · {author}
            </span>
          ) : null}
        </p>
        {showScrollHint && (
          <p className="shrink-0 text-[10px] text-muted-foreground">
            Scroll to read full argument
          </p>
        )}
      </div>
      <div className="max-h-[min(280px,38vh)] overflow-y-auto px-4 py-3.5">
        <p className="whitespace-pre-wrap text-[14px] leading-[1.65] text-foreground/85">
          {text}
        </p>
      </div>
    </section>
  );
}
