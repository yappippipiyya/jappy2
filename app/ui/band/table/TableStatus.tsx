import { SaveStatus } from "./types";

export function TableStatus({ status }: { status: SaveStatus }) {
  return (
    <div className="flex justify-end px-5 h-1">
      {status === "saving" && (
        <span className="text-xs text-blue-500 animate-pulse font-medium">● 保存中...</span>
      )}
      {status === "saved" && (
        <span className="text-xs text-green-500 font-medium">✓ 保存済み</span>
      )}
      {status === "error" && (
        <span className="text-xs text-red-500 font-medium">⚠️ 保存に失敗しました</span>
      )}
    </div>
  );
}