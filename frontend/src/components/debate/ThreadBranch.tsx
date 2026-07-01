"use client";

import { MessageSquare, ShieldCheck } from "lucide-react";
import type { PostNode } from "@/lib/buildPostTree";
import type { PublishedArgument } from "@/lib/types";
import { ContestedChip } from "./ContestedChip";
import { DeskBangButton } from "./DeskBangButton";

interface ThreadBranchProps {
  node: PostNode;
  depth?: number;
  onOpenPost: (postId: string) => void;
  onReply: (postId: string) => void;
  onDeskBang: (postId: string) => void;
  isRoot?: boolean;
}

function AuthorAvatar({ name, depth }: { name: string; depth: number }) {
  const size = depth === 0 ? "h-9 w-9 text-[12px]" : "h-7 w-7 text-[10px]";
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-zinc-800 font-semibold text-zinc-300 ring-1 ring-zinc-700 ${size}`}
    >
      {name
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
  );
}

function ThreadPost({
  post,
  depth,
  onOpenPost,
  onReply,
  onDeskBang,
  isRoot,
}: {
  post: PublishedArgument;
  depth: number;
  onOpenPost: (id: string) => void;
  onReply: (id: string) => void;
  onDeskBang: (id: string) => void;
  isRoot?: boolean;
}) {
  const preview =
    post.text.length > 320 ? `${post.text.slice(0, 320).trim()}…` : post.text;

  return (
    <div className="relative min-w-0 flex-1 pb-1">
      <div className="flex gap-3">
        <AuthorAvatar name={post.author} depth={depth} />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-[13px] font-semibold text-zinc-100">
              {post.author}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-[12px] text-zinc-500">{post.postedAt}</span>
            {isRoot && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="rounded bg-teal-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-400">
                  Starter
                </span>
              </>
            )}
            {post.sources.length > 0 && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-teal-400/80">
                  <ShieldCheck className="h-3 w-3" strokeWidth={2} />
                  {post.sources.length} sourced
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => onOpenPost(post.id)}
            className="w-full text-left"
          >
            <p
              className={`leading-relaxed text-zinc-300 transition-colors hover:text-zinc-50 ${
                isRoot ? "text-[15px]" : "text-[14px]"
              }`}
            >
              {preview}
            </p>
          </button>

          {(post.contestedFallacies?.length ?? 0) > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.contestedFallacies!.map((f) => (
                <ContestedChip key={f} fallacyName={f} compact />
              ))}
            </div>
          )}

          {post.caveats?.map((c) => (
            <p key={c} className="mt-2 text-[11px] italic text-zinc-600">
              {c}
            </p>
          ))}

          <div className="mt-2.5 flex flex-wrap items-center gap-1">
            <DeskBangButton
              count={post.deskBangs ?? 0}
              banged={post.userBanged ?? false}
              onToggle={() => onDeskBang(post.id)}
              layout="horizontal"
              size="sm"
            />
            <button
              type="button"
              onClick={() => onReply(post.id)}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} />
              Reply
            </button>
            <button
              type="button"
              onClick={() => onOpenPost(post.id)}
              className="rounded-md px-2.5 py-1.5 text-[12px] font-medium text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            >
              Read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThreadNode({
  node,
  depth,
  onOpenPost,
  onReply,
  onDeskBang,
  isLast,
  isRoot,
}: {
  node: PostNode;
  depth: number;
  onOpenPost: (id: string) => void;
  onReply: (id: string) => void;
  onDeskBang: (id: string) => void;
  isLast: boolean;
  isRoot?: boolean;
}) {
  return (
    <div className="relative">
      {depth > 0 && (
        <>
          <div
            className="absolute left-[14px] top-0 w-px bg-zinc-800"
            style={{ height: isLast ? "20px" : "100%" }}
          />
          <div className="absolute left-[14px] top-[20px] h-px w-5 bg-zinc-800" />
        </>
      )}

      <div className={depth > 0 ? "pl-10" : ""}>
        <ThreadPost
          post={node.post}
          depth={depth}
          onOpenPost={onOpenPost}
          onReply={onReply}
          onDeskBang={onDeskBang}
          isRoot={isRoot}
        />

        {node.children.length > 0 && (
          <div className="mt-1 space-y-4">
            {node.children.map((child, i) => (
              <ThreadNode
                key={child.post.id}
                node={child}
                depth={depth + 1}
                onOpenPost={onOpenPost}
                onReply={onReply}
                onDeskBang={onDeskBang}
                isLast={i === node.children.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ThreadBranch({
  node,
  depth = 0,
  onOpenPost,
  onReply,
  onDeskBang,
  isRoot = depth === 0,
}: ThreadBranchProps) {
  return (
    <ThreadNode
      node={node}
      depth={depth}
      onOpenPost={onOpenPost}
      onReply={onReply}
      onDeskBang={onDeskBang}
      isLast
      isRoot={isRoot}
    />
  );
}
