"use client";

import { toast } from "sonner";


export default function CopyButton({ token }: { token: string }) {
  const handleCopy = async () => {
    const fullURL = `${window.location.origin}/band/${token}/join?openExternalBrowser=1`;
    try {
      await navigator.clipboard.writeText(fullURL);
      toast.success("コピーしました！")
    } catch (err) {
      toast.error("コピーに失敗しました。")
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
    </div>
  );
}