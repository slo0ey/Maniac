export interface IWordleRecord {
  total: number;
  win: number;
  lose: number;
  streak: number;
  max_streak: number;
}

export interface IWordleStatistics {
  total: number;
  win: number;
  lose: number;
  detailed_record: Record<string, IWordleRecord>;
}
