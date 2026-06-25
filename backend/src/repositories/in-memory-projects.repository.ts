import { projectsMock } from "../data/projects.mock";
import { ProjectSourceData } from "../types/project";
import { ProjectsRepository } from "./projects.repository";

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