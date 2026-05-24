export interface IconSpec {
  type: string;
  size: number;
}

export type ProgressCallback = (step: number, total: number) => void;
