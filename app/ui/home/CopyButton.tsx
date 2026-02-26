"use client"

export default function CopyButton({ token }: { token: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      alert("招待リンクをコピーしました！");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-indigo-600 hover:bg-indigo-50 transition-colors"
      title="招待リンクをコピー"
    >
      <span className="material-icons">content_copy</span>
    </button>
  );
}