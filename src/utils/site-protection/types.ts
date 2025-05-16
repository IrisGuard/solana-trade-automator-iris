
// Define interfaces for our backup system
export interface SiteBackup {
  timestamp: number;
  version: string;
  data: Record<string, any>;
  hash: string;
}

export interface BackupOptions {
  name?: string;
  silent?: boolean;
}
