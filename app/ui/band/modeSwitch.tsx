export function ModeSwitch({ mode, setMode }: {
  mode: "view" | "edit",
  setMode: (m: "view" | "edit") => void
}) {
  return (
    <div className="flex flex-col items-center justify-center my-7 w-full gap-4">
      <div className="flex flex-col gap-1 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-64">
        <button
          onClick={() => setMode("view")}
          className={`flex items-center justify-center gap-3 px-3 py-2 rounded-md transition-colors ${
            mode === "view"
              ? "bg-zinc-700 text-white dark:bg-zinc-300 dark:text-zinc-800"
              : "text-gray-600 dark:text-gray-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <span className="material-icons">groups</span>
          <span className="font-medium">みんなの予定確認</span>
        </button>

        <button
          onClick={() => setMode("edit")}
          className={`flex items-center justify-center gap-3 px-3 py-2 rounded-md transition-colors ${
            mode === "edit"
              ? "bg-zinc-700 text-white dark:bg-zinc-300 dark:text-zinc-800"
              : "text-gray-600 dark:text-gray-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <span className="material-icons">edit_calendar</span>
          <span className="font-medium">バンド練編集</span>
        </button>
      </div>
    </div>
  );
}