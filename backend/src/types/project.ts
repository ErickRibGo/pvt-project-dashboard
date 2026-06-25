/**
 * Representa os possíveis estados de saúde de um projeto.
 *
 * SAUDAVEL: projeto dentro dos limites esperados.
 * ATENCAO: existe risco que precisa ser acompanhado.
 * CRITICO: existe uma situação que exige ação imediata.
 */
export type ProjectHealthStatus = "SAUDAVEL" | "ATENCAO" | "CRITICO";

/**
 * Representa o ciclo de vida operacional do projeto.
 * Isso é diferente do status de saúde.
 *
 * Exemplo:
 * Um projeto pode estar ATIVO e, ao mesmo tempo, CRITICO.
 */

export type ProjectLifecycleStatus = "ATIVO" | "ENCERRADO" | "CANCELADO";

/**
 * Dados brutos do projeto.
 *
 * Por enquanto, esses dados virão de um mock.
 * No futuro, poderão vir do PostgreSQL e de uma sincronização com o TOTVS RM.
 */
export interface ProjectSourceData {
  id: string;
  code: string;
  name: string;
  clientName: string;
  lifecycleStatus: ProjectLifecycleStatus;

  startDate: string;
  endDate: string | null;

  hoursSold: number;
  hoursPlanned: number;
  approvedHours: number;

  contractValue: number;
  billedAmount: number;

  physicalProgressPercent: number;
  hasOverdueMilestone: boolean;
}

/**
 * Projeto já enriquecido pelas regras de negócio.
 *
 * Este é o formato que a API vai entregar para o frontend.
 */
export interface ProjectDashboardItem extends ProjectSourceData {
  hoursBalance: number;
  hoursConsumptionPercent: number;

  financialProgressPercent: number;
  financialPhysicalGapPercent: number;

  healthStatus: ProjectHealthStatus;
  healthReasons: string[];
}