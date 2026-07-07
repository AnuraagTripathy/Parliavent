import Image from "next/image";
import Link from "next/link";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  alternateLabel: string;
  alternateHref: string;
}

export function AuthShell({
  title,
  subtitle,
  children,
  alternateLabel,
  alternateHref,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(236,78,2,0.12)_0%,_transparent_55%)]" />

      <header className="relative z-10 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/parliavent-logo.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-[17px] font-semibold tracking-[0.04em] text-foreground">
              Parliavent
            </span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="mb-2 font-display text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
              {title}
            </p>
            <h1 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-foreground">
              {subtitle}
            </h1>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-lg shadow-black/20 md:p-8">
            {children}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {alternateLabel}{" "}
            <Link
              href={alternateHref}
              className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
            >
              Continue here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
