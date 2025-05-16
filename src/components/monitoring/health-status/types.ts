
export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface HealthState {
  status: HealthStatus;
  lastChecked: Date;
  issues: string[];
  backupCount: number;
  maxBackups: number;
  lastBackupTime?: Date | null;
}

export interface SystemHealthCheckResult {
  healthy: boolean;
  issues: string[];
  criticalIssuesFound: boolean;
}
