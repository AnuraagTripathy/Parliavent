import { ParliaventApp } from "@/components/debate/ParliaventApp";
import { hexclaveServerApp } from "@/hexclave/server";
import { Suspense } from "react";

export default async function AppPage() {
  await hexclaveServerApp.getUser({ or: "redirect" });

  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}>
      <ParliaventApp />
    </Suspense>
  );
}
