export type ProjectHealthStatus = "SAUDAVEL" | "ATENCAO" | "CRITICO";

export interface ProjectDashboardItem {
  id: string;
  code: string;
  name: string;
  clientName: string;
  lifecycleStatus: "ATIVO" | "ENCERRADO" | "CANCELADO";

  startDate: string;
  endDate: string | null;

  hoursSold: number;
  hoursPlanned: number;
  approvedHours: number;
  hoursBalance: number;
  hoursConsumptionPercent: number;

  contractValue: number;
  billedAmount: number;
  physicalProgressPercent: number;
  financialProgressPercent: number;
  financialPhysicalGapPercent: number;

  hasOverdueMilestone: boolean;
  healthStatus: ProjectHealthStatus;
  healthReasons: string[];
}

export interface ListProjectsResponse {
  data: ProjectDashboardItem[];
  meta: {
    total: number;
  };
}