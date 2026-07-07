import { ParliaventApp } from "@/components/debate/ParliaventApp";
import { hexclaveServerApp } from "@/hexclave/server";
import { Suspense } from "react";

export default async function DebateThreadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await hexclaveServerApp.getUser({ or: "redirect" });
  const { slug } = await params;

  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}>
      <ParliaventApp initialDebateSlug={slug} />
    </Suspense>
  );
}
