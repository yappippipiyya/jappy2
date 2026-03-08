export type CellData = {
  memberIds: number[];
  bandPractice: boolean;
};

export type ScheduleMatrix = Record<string, Record<number, CellData>>;