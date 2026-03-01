import { CellData } from "./types";

interface TableCellProps {
  mode: "view" | "edit";
  cellId: string;
  cellData?: CellData;
  isPractice: boolean;
  userMap: Record<number, string>;
  onCheckChange: (cellId: string, checked: boolean) => void;
  onInteract: (e: React.MouseEvent | React.TouchEvent, text: string) => void;
  onLeave: () => void;
}

const BG_COLORS =[
  "bg-white dark:bg-zinc-900",
  "bg-sky-50 dark:bg-sky-950",
  "bg-sky-100 dark:bg-sky-900",
  "bg-sky-200 dark:bg-sky-700",
  "bg-sky-300 dark:bg-sky-500",
  "bg-sky-400 dark:bg-sky-300",
  "bg-sky-500 dark:bg-sky-100",
];

export function TableCell({ mode, cellId, cellData, isPractice, userMap, onCheckChange, onInteract, onLeave }: TableCellProps) {
  const memberIds = cellData?.memberIds ??[];
  const memberCount = memberIds.length;
  const tooltipText = memberCount > 0
    ? `${memberCount}人参加可能\n${memberIds.map((id) => `・${userMap[id] || "不明"}`).join("\n")}`
    : "参加可能者なし";

  const baseBg = BG_COLORS[memberCount] || "bg-sky-500 dark:bg-sky-100";
  const practiceStyle = isPractice
    ? "bg-size-[8px_8px] relative font-semibold outline-2 -outline-offset-2 outline-[#00a1ff] bg-[linear-gradient(45deg,#00a1ff_25%,transparent_25%,transparent_50%,#00a1ff_50%,#00a1ff_75%,transparent_75%,transparent)] dark:outline-[#0051ff] dark:bg-[linear-gradient(45deg,#0051ff_25%,transparent_25%,transparent_50%,#0051ff_50%,#0051ff_75%,transparent_75%,transparent)]"
    : "text-slate-700 dark:text-zinc-300";

  return (
    <td
      onMouseEnter={(e) => onInteract(e, tooltipText)}
      onMouseLeave={onLeave}
      onTouchStart={(e) => onInteract(e, tooltipText)}
      onClick={(e) => onInteract(e, tooltipText)}
      className={`border-b border-r border-slate-200 dark:border-zinc-700 p-2 transition-colors duration-150 ${baseBg} ${practiceStyle}`}
    >
      {mode === "view" ? (
        <span>{memberCount > 0 ? memberCount : ""}</span>
      ) : (
        <input
          type="checkbox"
          checked={isPractice}
          className="w-4 h-4 cursor-pointer accent-gray-500 dark:accent-gray-700"
          onChange={(e) => onCheckChange(cellId, e.target.checked)}
        />
      )}
    </td>
  );
}