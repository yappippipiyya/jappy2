import { CellData } from "./types";

type TableCellProps = {
  cellId: string;
  cellData?: CellData;
  selectedBandId: number;
  isAvailable: boolean;
  bandMap: Record<number, string>;
  onCheckChange: (cellId: string, checked: boolean) => void;
  onInteract: (e: React.MouseEvent | React.TouchEvent, text: string) => void;
  onLeave: () => void;
}


export function TableCell({ cellId, cellData, selectedBandId, isAvailable, bandMap, onCheckChange, onInteract, onLeave }: TableCellProps) {
  const bandIds = cellData?.practiceBandIds ?? [];
  const hasPractice = bandIds.length > 0;

  const isOwnPractice = hasPractice && bandIds.includes(selectedBandId);
  const isOtherPractice = hasPractice && !isOwnPractice;

  const bgColor = isOwnPractice
    ? "bg-pink-200/70"
    : isOtherPractice
      ? "bg-emerald-200/70"
      : cellData?.isDefaultAvailable
        ? "bg-sky-100 dark:bg-sky-400/20"
        : "";

  const tooltipText = hasPractice
    ? `バンド練あり\n${bandIds.map((id) => `・${bandMap[id] || "不明"}`).join("\n")}`
    : "";

  return (
    <td
      onMouseEnter={(e) => hasPractice && onInteract(e, tooltipText)}
      onMouseLeave={onLeave}
      onTouchStart={(e) => hasPractice && onInteract(e, tooltipText)}
      onClick={(e) => hasPractice && onInteract(e, tooltipText)}
      className={`border-b border-r border-slate-200 dark:border-zinc-700 p-2 transition-colors duration-150 ${bgColor} ${hasPractice ? "cursor-pointer" : ""}`}
    >
      <input
        type="checkbox"
        checked={isAvailable}
        className="w-4 h-4 cursor-pointer accent-sky-600"
        onChange={(e) => onCheckChange(cellId, e.target.checked)}
      />
    </td>
  );
}