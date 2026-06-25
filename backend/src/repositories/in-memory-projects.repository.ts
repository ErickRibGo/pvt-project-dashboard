import { projectsMock } from "../data/projects.mock.js";
import { ProjectSourceData } from "../types/project.js";
import { ProjectsRepository } from "./projects.repository.js";

/**
 * Implementação temporária do repositório usando dados em memória.
 *
 * Ela simula a camada que, futuramente, consultará PostgreSQL
 * após uma sincronização com o TOTVS RM.
 */
export class InMemoryProjectsRepository implements ProjectsRepository {
  public async findAll(): Promise<ProjectSourceData[]> {
    /**
     * Retornamos cópias para evitar que outra parte da aplicação
     * altere acidentalmente os dados originais do mock.
     */
    return projectsMock.map((project) => ({ ...project }));
  }
}