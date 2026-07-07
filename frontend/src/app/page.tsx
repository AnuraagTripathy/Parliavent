"use client";

import { useUser } from "@hexclave/next";
import { LandingPage } from "@/components/debate/LandingPage";
import { MarketingHeader } from "@/components/auth/MarketingHeader";

export default function HomePage() {
  const user = useUser();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MarketingHeader />
      <LandingPage
        isSignedIn={!!user}
        onEnterDebates={() => {
          window.location.href = user ? "/app" : "/sign-up";
        }}
      />
    </div>
  );
}
