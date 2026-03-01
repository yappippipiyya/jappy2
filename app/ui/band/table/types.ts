export type SaveStatus = "idle" | "saving" | "saved" | "error";

export type CellData = {
  memberIds: number[];
  bandPractice: boolean;
};

export type ScheduleMatrix = Record<string, Record<number, CellData>>;

export type DateListItem = {
  key: string;
  label: string;
};

export type TooltipState = {
  text: string;
  x: number;
  y: number;
} | null;