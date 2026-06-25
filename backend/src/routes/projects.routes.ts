import { Router } from "express";
import { ProjectsController } from "../controllers/projects.controller.js";
import { InMemoryProjectsRepository } from "../repositories/in-memory-projects.repository.js";
import { ProjectsService } from "../services/projects.service.js";

const projectsRoutes = Router();

/**
 * Aqui definimos qual implementação de repositório será usada.
 *
 * Hoje: InMemoryProjectsRepository
 * Depois: PrismaProjectsRepository
 */
const projectsRepository = new InMemoryProjectsRepository();

const projectsService = new ProjectsService(projectsRepository);

const projectsController = new ProjectsController(projectsService);

projectsRoutes.get("/", projectsController.list);

export { projectsRoutes };