import { Request, Response } from "express";
import { z } from "zod";
import { ProjectsService } from "../services/projects.service";

/**
 * Valida os filtros aceitos pela rota de listagem.
 *
 * Exemplo válido:
 * /api/v1/projects?healthStatus=CRITICO
 */
const listProjectsQuerySchema = z.object({
  healthStatus: z.enum(["SAUDAVEL", "ATENCAO", "CRITICO"]).optional()
});

/**
 * Controller responsável por lidar com HTTP.
 *
 * Ele não calcula indicadores e não conhece a origem dos dados.
 * Sua função é validar entrada, chamar o service e devolver a resposta.
 */
export class ProjectsController {
  private readonly projectsService: ProjectsService;

  public constructor() {
    this.projectsService = new ProjectsService();
  }

  /**
   * GET /api/v1/projects
   *
   * Retorna todos os projetos com indicadores calculados.
   */
  public list = (request: Request, response: Response): Response => {
    const queryValidation = listProjectsQuerySchema.safeParse(request.query);

    if (!queryValidation.success) {
      return response.status(400).json({
        message: "Filtros inválidos.",
        errors: queryValidation.error.flatten()
      });
    }

    const projects = this.projectsService.listProjects(queryValidation.data);

    return response.status(200).json({
      data: projects,
      meta: {
        total: projects.length
      }
    });
  };
}