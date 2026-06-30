"use client";

import { useState } from "react";
import { DebateFeed } from "./DebateFeed";
import { DebateApp } from "./DebateApp";
import { PublishedArgumentView } from "./PublishedArgumentView";
import { SiteHeader } from "./SiteHeader";
import { getPublishedArgument } from "@/lib/mockPublishedArguments";
import type { AppScreen } from "@/lib/types";

export function ParliaventApp() {
  const [screen, setScreen] = useState<AppScreen>("feed");
  const [selectedArgumentId, setSelectedArgumentId] = useState<string | null>(
    null,
  );

  const selectedArgument = selectedArgumentId
    ? getPublishedArgument(selectedArgumentId)
    : undefined;

  function openArgument(id: string) {
    setSelectedArgumentId(id);
    setScreen("argument");
  }

  function navigate(next: AppScreen) {
    if (next !== "argument") {
      setSelectedArgumentId(null);
    }
    setScreen(next);
  }

  const subtitle =
    screen === "composer"
      ? "Composer"
      : screen === "argument"
        ? "Argument"
        : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f5]">
      <SiteHeader screen={screen} onNavigate={navigate} subtitle={subtitle} />

      {screen === "feed" && (
        <DebateFeed
          onOpenArgument={openArgument}
          onWrite={() => navigate("composer")}
        />
      )}

      {screen === "argument" && selectedArgument && (
        <PublishedArgumentView
          argument={selectedArgument}
          onBack={() => navigate("feed")}
        />
      )}

      {screen === "argument" && !selectedArgument && (
        <div className="mx-auto px-4 py-16 text-center text-[14px] text-[#6a6a66]">
          Argument not found.{" "}
          <button
            type="button"
            onClick={() => navigate("feed")}
            className="font-medium text-[#1a1a18] underline"
          >
            Back to debate
          </button>
        </div>
      )}

      {screen === "composer" && <DebateApp embedded />}
    </div>
  );
}
