"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser, UserButton } from "@hexclave/next";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  const user = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
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

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/app">Enter debates</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
