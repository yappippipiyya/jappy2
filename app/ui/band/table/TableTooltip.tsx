import { TooltipState } from "./types";

export function TableTooltip({ tooltip }: { tooltip: TooltipState }) {
  if (!tooltip) return null;

  return (
    <div
      id="table-tooltip"
      className="fixed z-50 px-3 py-2 text-xs font-medium leading-relaxed text-white bg-slate-800 dark:bg-zinc-700 rounded-md shadow-xl pointer-events-none whitespace-pre-wrap w-max max-w-50"
      style={{
        left: `${tooltip.x}px`,
        top: `${tooltip.y - 8}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      {tooltip.text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[6px] border-transparent border-t-slate-800 dark:border-t-zinc-700" />
    </div>
  );
}