export interface CareEntry {
  id: string;
  date: Date;
  careType: string;
  notes: string;
  otherCareType?: string;
}
