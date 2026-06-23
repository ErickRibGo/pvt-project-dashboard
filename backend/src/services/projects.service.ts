import { projectsMock } from "../data/projects.mock";
import {
  ProjectDashboardItem,
  ProjectHealthStatus,
  ProjectSourceData
} from "../types/project";

/**
 * Filtros aceitos na listagem de projetos.
 */
interface ListProjectsFilters {
  healthStatus?: ProjectHealthStatus;
}

/**
 * Service responsável por concentrar as regras de negócio
 * relacionadas ao Painel de Projetos.
 *
 * O controller não deve calcular saldo, consumo ou status.
 * Ele apenas recebe a requisição e usa este service.
 */
export class ProjectsService {
  /**
   * Lista os projetos já enriquecidos com indicadores do painel.
   */
  public listProjects(
    filters: ListProjectsFilters = {}
  ): ProjectDashboardItem[] {
    const dashboardProjects = projectsMock.map((project) =>
      this.buildDashboardItem(project)
    );

    if (!filters.healthStatus) {
      return dashboardProjects;
    }

    return dashboardProjects.filter(
      (project) => project.healthStatus === filters.healthStatus
    );
  }

  /**
   * Converte dados brutos do projeto em dados próprios para o dashboard.
   */
  private buildDashboardItem(
    project: ProjectSourceData
  ): ProjectDashboardItem {
    const hoursBalance = this.calculateHoursBalance(project);
    const hoursConsumptionPercent = this.calculateHoursConsumptionPercent(project);

    const financialProgressPercent =
      this.calculateFinancialProgressPercent(project);

    const financialPhysicalGapPercent =
      financialProgressPercent - project.physicalProgressPercent;

    const { healthStatus, healthReasons } = this.calculateHealthStatus({
      project,
      hoursBalance,
      hoursConsumptionPercent,
      financialPhysicalGapPercent
    });

    return {
      ...project,
      hoursBalance,
      hoursConsumptionPercent,
      financialProgressPercent,
      financialPhysicalGapPercent,
      healthStatus,
      healthReasons
    };
  }

  /**
   * Calcula quantas horas ainda estão disponíveis no contrato.
   *
   * Fórmula:
   * horas vendidas - horas aprovadas/apontadas.
   */
  private calculateHoursBalance(project: ProjectSourceData): number {
    return project.hoursSold - project.approvedHours;
  }

  /**
   * Calcula o percentual de consumo de horas do projeto.
   *
   * Fórmula:
   * (horas aprovadas / horas vendidas) * 100
   */
  private calculateHoursConsumptionPercent(
    project: ProjectSourceData
  ): number {
    if (project.hoursSold === 0) {
      return 0;
    }

    const percentage =
      (project.approvedHours / project.hoursSold) * 100;

    return Number(percentage.toFixed(2));
  }

  /**
   * Calcula o avanço financeiro do projeto.
   *
   * Fórmula:
   * (valor faturado / valor total do contrato) * 100
   */
  private calculateFinancialProgressPercent(
    project: ProjectSourceData
  ): number {
    if (project.contractValue === 0) {
      return 0;
    }

    const percentage =
      (project.billedAmount / project.contractValue) * 100;

    return Number(percentage.toFixed(2));
  }

  /**
   * Determina a saúde do projeto usando critérios objetivos.
   *
   * Prioridade:
   * 1. CRITICO
   * 2. ATENCAO
   * 3. SAUDAVEL
   *
   * Regra importante:
   * se um projeto atende a mais de uma condição,
   * a condição mais grave prevalece.
   */
  private calculateHealthStatus({
    project,
    hoursBalance,
    hoursConsumptionPercent,
    financialPhysicalGapPercent
  }: {
    project: ProjectSourceData;
    hoursBalance: number;
    hoursConsumptionPercent: number;
    financialPhysicalGapPercent: number;
  }): {
    healthStatus: ProjectHealthStatus;
    healthReasons: string[];
  } {
    const criticalReasons: string[] = [];
    const attentionReasons: string[] = [];

    if (hoursBalance <= 0) {
      criticalReasons.push("Projeto sem saldo de horas disponível.");
    }

    if (project.hasOverdueMilestone) {
      criticalReasons.push("Existe pelo menos um marco de entrega vencido.");
    }

    if (financialPhysicalGapPercent > 20) {
      criticalReasons.push(
        "A execução física está mais de 20 pontos percentuais atrás do financeiro."
      );
    }

    if (criticalReasons.length > 0) {
      return {
        healthStatus: "CRITICO",
        healthReasons: criticalReasons
      };
    }

    if (hoursConsumptionPercent >= 80) {
      attentionReasons.push(
        "O consumo de horas atingiu ou ultrapassou 80%."
      );
    }

    if (financialPhysicalGapPercent > 10) {
      attentionReasons.push(
        "A execução física está mais de 10 pontos percentuais atrás do financeiro."
      );
    }

    if (attentionReasons.length > 0) {
      return {
        healthStatus: "ATENCAO",
        healthReasons: attentionReasons
      };
    }

    return {
      healthStatus: "SAUDAVEL",
      healthReasons: ["Projeto dentro dos indicadores esperados."]
    };
  }
}