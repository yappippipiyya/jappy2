export type DayOfWeekItem = {
  key: string;
  label: string;
};

export type FixedCellData = {
  isAvailable: boolean;
};

export type FixedScheduleMatrix = Record<string, Record<number, FixedCellData>>;
