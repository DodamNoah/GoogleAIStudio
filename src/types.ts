export interface RenderLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface StorageItem {
  key: string;
  value: string;
  updatedAt: string;
}
