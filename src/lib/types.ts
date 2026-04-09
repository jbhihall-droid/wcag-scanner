export type Severity = "critical" | "serious" | "moderate" | "minor";

export type ScanViolation = {
  id: string;
  impact: Severity | null;
  help: string;
  description: string;
  helpUrl: string;
  tags: string[];
  nodes: Array<{
    target: string[];
    html: string;
    failureSummary: string;
  }>;
};

export type ScanResult = {
  url: string;
  violationCount: number;
  violations: ScanViolation[];
  scannedAt: string;
};
