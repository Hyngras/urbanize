export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export type WithId<T> = T & { id: string };
