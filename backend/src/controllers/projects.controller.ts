import { Request, Response } from "express";
import { z } from "zod";
import { ProjectsService } from "../services/projects.service.js";

const listProjectsQuerySchema = z.object({
  healthStatus: z.enum(["SAUDAVEL", "ATENCAO", "CRITICO"]).optional()
});

/**
 * Responsável por receber a requisição HTTP,
 * validar os dados e devolver a resposta.
 */
export class ProjectsController {
  public constructor(
    private readonly projectsService: ProjectsService
  ) {}

  public list = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const queryValidation = listProjectsQuerySchema.safeParse(request.query);

    if (!queryValidation.success) {
      return response.status(400).json({
        message: "Filtros inválidos.",
        errors: queryValidation.error.flatten()
      });
    }

    const projects = await this.projectsService.listProjects(
      queryValidation.data
    );

    return response.status(200).json({
      data: projects,
      meta: {
        total: projects.length
      }
    });
  };
}