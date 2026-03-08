"use client";

import { useState } from "react";

export default function CopyButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const fullURL = `${window.location.origin}/band/${token}/join?openExternalBrowser=1`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullURL);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={handleCopy}
        className="flex items-center justify-center w-12 h-12 rounded-full text-zinc-500 hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-colors"
        title="招待リンクをコピー"
      >
        <span className="material-icons">content_copy</span>
      </button>

      <span
        className={`
          absolute -bottom-6 left-1/2 -translate-x-1/2
          text-sm p-2 rounded-xl
          bg-zinc-100 text-black
          dark:bg-zinc-700 dark:text-white
          font-medium whitespace-nowrap
          transition-all duration-300
          ${copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"}
        `}
      >
        コピーしました！
      </span>
    </div>
  );
}