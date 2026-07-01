"use client";

import type { Source } from "@/lib/types";

interface SourcePopoverProps {
  sources: Source[];
  onSelect: (sourceId: string) => void;
  onClose: () => void;
}

export function SourcePopover({ sources, onSelect, onClose }: SourcePopoverProps) {
  return (
    <div className="mt-3 rounded-lg border border-[#dce4ef] bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]">
          Sample sources
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-[10px] text-[#9a9a96] hover:text-[#6a6a66]"
        >
          Cancel
        </button>
      </div>
      <ul className="space-y-1">
        {sources.map((source) => (
          <li key={source.id}>
            <button
              type="button"
              onClick={() => onSelect(source.id)}
              className="w-full rounded-md border border-transparent px-2.5 py-2 text-left transition-colors hover:border-[#dce4ef] hover:bg-[#f4f7fb]"
            >
              <p className="text-[11px] font-medium text-[#4a4a48]">{source.title}</p>
              <p className="text-[10px] text-[#9a9a96]">
                {source.publisher}
                {source.isSample && " · sample"}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
