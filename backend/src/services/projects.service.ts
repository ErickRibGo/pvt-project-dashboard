import {
  ProjectDashboardItem,
  ProjectHealthStatus,
  ProjectSourceData
} from "../types/project";
import { ProjectsRepository } from "../repositories/projects.repository";

interface ListProjectsFilters {
  healthStatus?: ProjectHealthStatus;
}

/**
 * Contém as regras de negócio do Painel de Projetos.
 *
 * Este service não sabe se os dados vêm de mock, PostgreSQL
 * ou uma sincronização com o TOTVS RM.
 */
export class ProjectsService {
  public constructor(
    private readonly projectsRepository: ProjectsRepository
  ) {}

  /**
   * Busca os projetos na fonte configurada e devolve os dados
   * enriquecidos com os indicadores do dashboard.
   */
  public async listProjects(
    filters: ListProjectsFilters = {}
  ): Promise<ProjectDashboardItem[]> {
    const sourceProjects = await this.projectsRepository.findAll();

    const dashboardProjects = sourceProjects.map((project) =>
      this.buildDashboardItem(project)
    );

    if (!filters.healthStatus) {
      return dashboardProjects;
    }

    return dashboardProjects.filter(
      (project) => project.healthStatus === filters.healthStatus
    );
  }

  private buildDashboardItem(
    project: ProjectSourceData
  ): ProjectDashboardItem {
    const hoursBalance = this.calculateHoursBalance(project);
    const hoursConsumptionPercent =
      this.calculateHoursConsumptionPercent(project);

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

  private calculateHoursBalance(project: ProjectSourceData): number {
    return project.hoursSold - project.approvedHours;
  }

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