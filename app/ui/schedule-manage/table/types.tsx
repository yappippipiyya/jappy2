export type CellData = {
  practiceBandIds: number[];
  isAvailable: boolean;
  isDefaultAvailable: boolean;
};

export type ScheduleMatrix = Record<string, Record<number, CellData>>;
