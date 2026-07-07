import { AccountSettings } from "@hexclave/next";
import Link from "next/link";
import { Landmark } from "lucide-react";
import { hexclaveServerApp } from "@/hexclave/server";

export default async function AccountPage() {
  await hexclaveServerApp.getUser({ or: "redirect" });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 md:px-8">
          <Link href="/app" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Landmark className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <span className="text-[15px] font-bold tracking-tight">parliavent</span>
          </Link>
          <Link
            href="/app"
            className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4"
          >
            Back to debates
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <AccountSettings fullPage={false} />
      </main>
    </div>
  );
}
