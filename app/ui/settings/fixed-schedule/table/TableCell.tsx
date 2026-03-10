import { FixedCellData } from "./types";

type TableCellProps = {
  cellId: string;
  isAvailable: boolean;
  onCheckChange: (cellId: string, checked: boolean) => void;
}

export function TableCell({ cellId, isAvailable, onCheckChange }: TableCellProps) {
  const bgColor = isAvailable ? "bg-sky-100 dark:bg-sky-400/20" : "";

  return (
    <td
      className={`border-b border-r border-slate-200 dark:border-zinc-700 p-2 transition-colors duration-150 ${bgColor}`}
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
