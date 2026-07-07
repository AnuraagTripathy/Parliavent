import { FallacyGlossaryPage } from "@/components/debate/FallacyGlossaryPage";
import { hexclaveServerApp } from "@/hexclave/server";

export default async function FallaciesPage() {
  await hexclaveServerApp.getUser({ or: "redirect" });

  return <FallacyGlossaryPage />;
}
