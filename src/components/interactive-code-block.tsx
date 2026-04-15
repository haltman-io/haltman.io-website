"use client";

import { useState } from "react";
import { Check, Copy, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function InteractiveCodeBlock({
  fileName,
  rawCode,
  htmlContent,
}: {
  fileName: string;
  rawCode: string;
  htmlContent: string;
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  const onCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error("Clipboard API failed", e);
    }
  };

  const onCopyFile = async () => {
    try {
      await navigator.clipboard.writeText(fileName);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    } catch (e) {
      console.error("Clipboard API failed", e);
    }
  };

  return (
    <div className="my-8 overflow-hidden rounded-sm border border-[var(--red-border)] bg-[#0a0a0a] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between border-b border-[#333] bg-[#111] py-1.5 pl-0 pr-3 shadow-sm">
        
        <button
          onClick={onCopyFile}
          className="group flex items-center gap-2 px-4 py-1.5 font-mono text-xs text-[#888] transition-colors hover:text-white"
          title="Copy file path"
        >
          <FileText className="size-3.5 transition-colors group-hover:text-[var(--red)]" />
          <span>{fileName}</span>
          {copiedFile ? (
            <Check className="ml-1 size-3 text-green-500" />
          ) : (
            <Copy className="ml-1 size-3 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </button>

        <button
          onClick={onCopyCode}
          className="flex items-center justify-center gap-2 rounded-sm border border-[#333] bg-[#050505] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#888] transition-all hover:border-[var(--red)] hover:text-white hover:shadow-[0_0_10px_var(--red-glow)]"
          title="Copy full code snippet"
        >
          {copiedCode ? (
            <>
              <Check className="size-3 text-green-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Renders server-side generated HTML dynamically with Tailwind overrides mapped to Shiki syntax */}
      <div
        className={cn(
          "selection:bg-[var(--red)] selection:text-white",
          "[&>pre]:m-0 [&>pre]:!bg-transparent [&>pre]:p-4 [&>pre]:py-5 [&>pre]:font-mono [&>pre]:text-[13px] leading-relaxed",
          // Native word wrapping (disables horizontal scroll explicitly)
          "[&>pre]:whitespace-pre-wrap [&>pre]:break-words [&>pre]:overflow-hidden",
          // Line numbers structural setup
          "[&>pre>code]:[counter-reset:line]",
          "[&>pre>code>.line]:block",
          // Inject actual numbers before each line
          "[&>pre>code>.line]:before:inline-block [&>pre>code>.line]:before:content-[counter(line)]",
          "[&>pre>code>.line]:before:[counter-increment:line]",
          // Styling the numbers softly
          "[&>pre>code>.line]:before:mr-6 [&>pre>code>.line]:before:w-4 [&>pre>code>.line]:before:text-right [&>pre>code>.line]:before:text-[#444] [&>pre>code>.line]:before:select-none"
        )}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
