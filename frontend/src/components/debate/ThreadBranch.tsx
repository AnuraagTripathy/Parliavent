"use client";

import { useState } from "react";
import { MessageSquare, Reply, ShieldCheck } from "lucide-react";
import { countDescendants, type PostNode } from "@/lib/buildPostTree";
import type { PublishedArgument } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function ThreadPost({
  post,
  depth,
  replyCount,
  isExpanded,
  onToggleExpanded,
  onOpenPost,
  onReply,
  onDeskBang,
  isRoot,
}: {
  post: PublishedArgument;
  depth: number;
  replyCount: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onOpenPost: (id: string) => void;
  onReply: (id: string) => void;
  onDeskBang: (id: string) => void;
  isRoot?: boolean;
}) {
  const preview =
    post.text.length > 320 ? `${post.text.slice(0, 320).trim()}…` : post.text;

  return (
    <Card
      className={cn(
        "mb-3 border-border/80 bg-card/60 transition-colors hover:bg-muted/30",
        isRoot && "border-border bg-card/90",
      )}
    >
      <CardHeader className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className={depth === 0 ? "h-9 w-9" : "h-7 w-7"}>
            <AvatarImage
              src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(post.author)}`}
              alt=""
            />
            <AvatarFallback className="bg-primary/10 text-xs">
              {initials(post.author)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[13px] font-semibold text-foreground">
                {post.author}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {post.postedAt}
              </span>
              {isRoot && (
                <Badge className="border-transparent bg-teal-500/15 px-2 py-0 text-[10px] uppercase tracking-wider text-teal-400 hover:bg-teal-500/15">
                  Starter
                </Badge>
              )}
              {post.sources.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] text-teal-400/80">
                  <ShieldCheck className="h-3 w-3" strokeWidth={2} />
                  {post.sources.length} sourced
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onOpenPost(post.id)}
              className="w-full text-left"
            >
              <p
                className={cn(
                  "leading-relaxed text-foreground/80 transition-colors hover:text-foreground",
                  isRoot ? "text-[15px]" : "text-[14px]",
                )}
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
              <p key={c} className="mt-2 text-[11px] italic text-muted-foreground">
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
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={() => onReply(post.id)}
              >
                <Reply className="mr-1 h-3 w-3" strokeWidth={2} />
                Reply
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={() => onOpenPost(post.id)}
              >
                <MessageSquare className="mr-1 h-3 w-3" strokeWidth={2} />
                Read
              </Button>
              {replyCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground md:ml-auto"
                  onClick={onToggleExpanded}
                >
                  {isExpanded ? "Collapse" : `Expand (${replyCount})`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function ThreadNode({
  node,
  depth,
  onOpenPost,
  onReply,
  onDeskBang,
  isRoot,
}: {
  node: PostNode;
  depth: number;
  onOpenPost: (id: string) => void;
  onReply: (id: string) => void;
  onDeskBang: (id: string) => void;
  isRoot?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const replyCount = countDescendants(node);

  return (
    <div
      className={cn(
        "border-l-2",
        depth > 0
          ? "ml-3 border-muted pl-3 md:ml-5 md:pl-5"
          : "border-transparent",
      )}
    >
      <ThreadPost
        post={node.post}
        depth={depth}
        replyCount={replyCount}
        isExpanded={isExpanded}
        onToggleExpanded={() => setIsExpanded((open) => !open)}
        onOpenPost={onOpenPost}
        onReply={onReply}
        onDeskBang={onDeskBang}
        isRoot={isRoot}
      />

      {isExpanded && node.children.length > 0 && (
        <div className="space-y-0">
          {node.children.map((child) => (
            <ThreadNode
              key={child.post.id}
              node={child}
              depth={depth + 1}
              onOpenPost={onOpenPost}
              onReply={onReply}
              onDeskBang={onDeskBang}
            />
          ))}
        </div>
      )}
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
      isRoot={isRoot}
    />
  );
}
