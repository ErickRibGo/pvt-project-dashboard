import { describe, expect, it } from "vitest";
import { ProjectsService } from "./projects.service";

/**
 * Testes das regras de negócio do Painel de Projetos.
 *
 * Estamos testando o comportamento público do service:
 * dado um conjunto de projetos, qual status e quais indicadores
 * a aplicação retorna para cada um.
 */
describe("ProjectsService", () => {
  const projectsService = new ProjectsService();

  /**
   * Função auxiliar para encontrar um projeto específico
   * e evitar repetir código nos testes.
   */
  function getProjectById(projectId: string) {
    const projects = projectsService.listProjects();

    const project = projects.find((item) => item.id === projectId);

    if (!project) {
      throw new Error(`Projeto ${projectId} não encontrado no mock.`);
    }

    return project;
  }

  it("deve classificar o projeto Alfa como SAUDAVEL", () => {
    const project = getProjectById("project-001");

    expect(project.healthStatus).toBe("SAUDAVEL");
    expect(project.hoursBalance).toBe(220);
    expect(project.hoursConsumptionPercent).toBe(56);
    expect(project.healthReasons).toContain(
      "Projeto dentro dos indicadores esperados."
    );
  });

  it("deve classificar o projeto Beta como ATENCAO", () => {
    const project = getProjectById("project-002");

    expect(project.healthStatus).toBe("ATENCAO");
    expect(project.hoursBalance).toBe(45);
    expect(project.hoursConsumptionPercent).toBe(85);

    expect(project.healthReasons).toContain(
      "O consumo de horas atingiu ou ultrapassou 80%."
    );

    expect(project.healthReasons).toContain(
      "A execução física está mais de 10 pontos percentuais atrás do financeiro."
    );
  });

  it("deve classificar o projeto Gama como CRITICO", () => {
    const project = getProjectById("project-003");

    expect(project.healthStatus).toBe("CRITICO");
    expect(project.hoursBalance).toBe(-15);
    expect(project.hoursConsumptionPercent).toBe(107.5);

    expect(project.healthReasons).toContain(
      "Projeto sem saldo de horas disponível."
    );

    expect(project.healthReasons).toContain(
      "Existe pelo menos um marco de entrega vencido."
    );

    expect(project.healthReasons).toContain(
      "A execução física está mais de 20 pontos percentuais atrás do financeiro."
    );
  });

  it("deve filtrar apenas os projetos críticos", () => {
    const projects = projectsService.listProjects({
      healthStatus: "CRITICO"
    });

    expect(projects).toHaveLength(1);
    expect(projects[0].id).toBe("project-003");
    expect(projects[0].healthStatus).toBe("CRITICO");
  });
});