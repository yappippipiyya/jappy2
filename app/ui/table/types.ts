export type SaveStatus = "idle" | "saving" | "saved" | "error";

export type DateListItem = {
  key: string;
  label: string;
};

export type TooltipState = {
  text: string;
  x: number;
  y: number;
} | null;