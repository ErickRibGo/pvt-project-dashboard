import { describe, expect, it } from "vitest";
import { InMemoryProjectsRepository } from "../repositories/in-memory-projects.repository";
import { ProjectsService } from "./projects.service";

describe("ProjectsService", () => {
  const projectsRepository = new InMemoryProjectsRepository();

  const projectsService = new ProjectsService(projectsRepository);

  async function getProjectById(projectId: string) {
    const projects = await projectsService.listProjects();

    const project = projects.find((item) => item.id === projectId);

    if (!project) {
      throw new Error(`Projeto ${projectId} não encontrado no mock.`);
    }

    return project;
  }

  it("deve classificar o projeto Alfa como SAUDAVEL", async () => {
    const project = await getProjectById("project-001");

    expect(project.healthStatus).toBe("SAUDAVEL");
    expect(project.hoursBalance).toBe(220);
    expect(project.hoursConsumptionPercent).toBe(56);
  });

  it("deve classificar o projeto Beta como ATENCAO", async () => {
    const project = await getProjectById("project-002");

    expect(project.healthStatus).toBe("ATENCAO");
    expect(project.hoursBalance).toBe(45);
    expect(project.hoursConsumptionPercent).toBe(85);

    expect(project.healthReasons).toContain(
      "O consumo de horas atingiu ou ultrapassou 80%."
    );
  });

  it("deve classificar o projeto Gama como CRITICO", async () => {
    const project = await getProjectById("project-003");

    expect(project.healthStatus).toBe("CRITICO");
    expect(project.hoursBalance).toBe(-15);
    expect(project.hoursConsumptionPercent).toBe(107.5);

    expect(project.healthReasons).toContain(
      "Projeto sem saldo de horas disponível."
    );

    expect(project.healthReasons).toContain(
      "Existe pelo menos um marco de entrega vencido."
    );
  });

  it("deve retornar somente projetos críticos ao aplicar o filtro", async () => {
    const projects = await projectsService.listProjects({
      healthStatus: "CRITICO"
    });

    expect(projects).toHaveLength(1);
    expect(projects[0].id).toBe("project-003");
    expect(projects[0].healthStatus).toBe("CRITICO");
  });
});