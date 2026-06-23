import { Router } from "express";
import { ProjectsController } from "../controllers/projects.controller";

/**
 * Router responsável pelas rotas relacionadas a projetos.
 */
const projectsRoutes = Router();

const projectsController = new ProjectsController();

/**
 * Lista os projetos e seus indicadores de saúde.
 *
 * GET /api/v1/projects
 * GET /api/v1/projects?healthStatus=CRITICO
 */
projectsRoutes.get("/", projectsController.list);

export { projectsRoutes };