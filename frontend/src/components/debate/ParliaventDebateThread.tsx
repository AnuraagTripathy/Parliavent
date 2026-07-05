"use client";

import { useState } from "react";
import { MessageSquare, Reply, ShieldCheck } from "lucide-react";
import type { CommentType } from "@/components/ui/reddit-nested-thread-reply";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ContestedChip } from "./ContestedChip";
import { DeskBangButton } from "./DeskBangButton";
import { StaggerGroup, StaggerItem } from "@/components/ui/fade-in";

export interface DebateCommentMeta {
  deskBangs: number;
  userBanged: boolean;
  isStarter?: boolean;
  sourceCount?: number;
  contestedFallacies?: string[];
}

interface DebateCommentProps {
  comment: CommentType;
  meta: DebateCommentMeta;
  depth?: number;
  onOpenPost: (id: string) => void;
  onReply?: (id: string) => void;
  onDeskBang: (id: string) => void;
  getMeta: (id: string | number) => DebateCommentMeta | undefined;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function DebateComment({
  comment,
  meta,
  depth = 0,
  onOpenPost,
  onReply,
  onDeskBang,
  getMeta,
}: DebateCommentProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const replyCount = comment.replies.length;

  return (
    <div
      className={cn(
        "border-l-2",
        depth > 0
          ? "ml-3 border-border pl-3 md:ml-6 md:pl-6"
          : "border-transparent",
      )}
    >
      <Card className="mb-4 border-border/80 bg-card transition-all duration-200 hover:bg-muted/40">
        <CardHeader className="p-4 md:p-5">
          <div className="flex items-start gap-3">
            <Avatar className={depth === 0 ? "h-10 w-10" : "h-8 w-8"}>
              <AvatarImage
                src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(comment.author)}`}
                alt=""
              />
              <AvatarFallback className="bg-primary/10 text-xs">
                {initials(comment.author)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{comment.author}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {comment.timestamp}
                </span>
                {meta.isStarter && (
                  <Badge
                    variant="secondary"
                    className="border-transparent bg-primary/10 text-[10px] uppercase tracking-wide text-primary"
                  >
                    Starter
                  </Badge>
                )}
                {(meta.sourceCount ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-primary/80">
                    <ShieldCheck className="h-3 w-3" />
                    {meta.sourceCount} sourced
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => onOpenPost(String(comment.id))}
                className="w-full text-left"
              >
                <p
                  className={cn(
                    "mb-3 leading-relaxed text-foreground/85 hover:text-foreground",
                    depth === 0 ? "text-[15px]" : "text-sm",
                  )}
                >
                  {comment.content}
                </p>
              </button>

              {(meta.contestedFallacies?.length ?? 0) > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {meta.contestedFallacies!.map((f) => (
                    <ContestedChip key={f} fallacyName={f} compact />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1">
                <DeskBangButton
                  count={meta.deskBangs}
                  banged={meta.userBanged}
                  onToggle={() => onDeskBang(String(comment.id))}
                  layout="horizontal"
                  size="sm"
                />
                {onReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => onReply(String(comment.id))}
                  >
                    <Reply className="mr-1 h-3 w-3" />
                    Reply
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onOpenPost(String(comment.id))}
                >
                  <MessageSquare className="mr-1 h-3 w-3" />
                  Read full
                </Button>
                {replyCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs md:ml-auto"
                    onClick={() => setIsExpanded((v) => !v)}
                  >
                    {isExpanded
                      ? "Collapse"
                      : `Expand (${replyCount})`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isExpanded &&
        comment.replies.map((reply) => {
          const childMeta = getMeta(reply.id);
          if (!childMeta) return null;
          return (
            <DebateComment
              key={reply.id}
              comment={reply}
              meta={childMeta}
              depth={depth + 1}
              onOpenPost={onOpenPost}
              onReply={onReply}
              onDeskBang={onDeskBang}
              getMeta={getMeta}
            />
          );
        })}
    </div>
  );
}

interface ParliaventDebateThreadProps {
  comments: CommentType[];
  getMeta: (id: string | number) => DebateCommentMeta | undefined;
  onOpenPost: (id: string) => void;
  onReply?: (id: string) => void;
  onDeskBang: (id: string) => void;
  initialDepth?: number;
}

export function ParliaventDebateThread({
  comments,
  getMeta,
  onOpenPost,
  onReply,
  onDeskBang,
  initialDepth = 0,
}: ParliaventDebateThreadProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center text-muted-foreground">
        <MessageSquare className="mx-auto mb-3 h-10 w-10 opacity-40" />
        <p>No starters yet. Be the first to open the debate.</p>
      </div>
    );
  }

  return (
    <StaggerGroup className="w-full space-y-2">
      {comments.map((comment) => {
        const meta = getMeta(comment.id);
        if (!meta) return null;
        return (
          <StaggerItem key={comment.id}>
            <DebateComment
              comment={comment}
              meta={meta}
              depth={initialDepth}
              onOpenPost={onOpenPost}
              onReply={onReply}
              onDeskBang={onDeskBang}
              getMeta={getMeta}
            />
          </StaggerItem>
        );
      })}
    </StaggerGroup>
  );
}