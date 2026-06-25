import { ProjectSourceData } from "../types/project.js";

/**
 * Contrato para qualquer fonte de dados de projetos.
 *
 * Hoje será implementado com dados em memória.
 * Depois poderá ser implementado com PostgreSQL, Prisma
 * ou uma integração sincronizada com o TOTVS RM.
 */
export interface ProjectsRepository {
  findAll(): Promise<ProjectSourceData[]>;
}