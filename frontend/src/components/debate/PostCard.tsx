"use client";

import { MessageSquare, ShieldCheck } from "lucide-react";
import type { PublishedArgument } from "@/lib/types";
import { DeskBangButton } from "./DeskBangButton";

interface PostCardProps {
  post: PublishedArgument;
  onOpen: () => void;
  onRespond?: () => void;
  onDeskBang: () => void;
  nested?: boolean;
}

function AuthorAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ececea] text-[11px] font-medium text-[#5a5a58]">
      {name
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
  );
}

export function PostCard({
  post,
  onOpen,
  onRespond,
  onDeskBang,
  nested = false,
}: PostCardProps) {
  const preview =
    post.text.length > 280 ? `${post.text.slice(0, 280).trim()}…` : post.text;
  const sourceCount = post.sources.length;
  const responseLabel = post.kind === "starter" ? "Respond" : "Reply";

  return (
    <article
      className={`flex gap-2 sm:gap-3 ${
        nested ? "ml-4 border-l-2 border-[#ececea] pl-3 sm:ml-6 sm:pl-4" : ""
      }`}
    >
      <DeskBangButton
        count={post.deskBangs ?? 0}
        banged={post.userBanged ?? false}
        onToggle={onDeskBang}
        layout="vertical"
        size={nested ? "sm" : "md"}
      />

      <div className="min-w-0 flex-1 rounded-md border border-transparent transition-colors hover:border-[#e8e8e4] hover:bg-white">
        <div className="px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <AuthorAvatar name={post.author} />
            <span className="text-[13px] font-medium text-[#1a1a18]">
              {post.author}
            </span>
            <span className="text-[11px] text-[#9a9a96]">·</span>
            <span className="text-[11px] text-[#9a9a96]">{post.postedAt}</span>
            {post.kind === "starter" && !nested && (
              <>
                <span className="text-[11px] text-[#9a9a96]">·</span>
                <span className="rounded bg-[#ececea] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#6a6a66]">
                  Starter
                </span>
              </>
            )}
            {sourceCount > 0 && (
              <>
                <span className="text-[11px] text-[#9a9a96]">·</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#5a7a9e]">
                  <ShieldCheck className="h-3 w-3" strokeWidth={1.75} />
                  {sourceCount} source{sourceCount === 1 ? "" : "s"}
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="w-full text-left"
          >
            <p className="text-[15px] leading-relaxed text-[#2a2a28] hover:text-[#1a1a18]">
              {preview}
            </p>
          </button>

          {(post.contestedFallacies?.length ?? 0) > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.contestedFallacies!.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-[#ebdede] bg-[#faf5f5] px-2 py-0.5 text-[10px] text-[#9e5a5a]"
                >
                  Contests: {f.toLowerCase()}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium text-[#6a6a66] transition-colors hover:bg-[#f0f0ec] hover:text-[#3a3a38]"
            >
              Read full argument
            </button>
            {onRespond && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRespond();
                }}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium text-[#6a6a66] transition-colors hover:bg-[#f0f0ec] hover:text-[#3a3a38]"
              >
                <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
                {responseLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
