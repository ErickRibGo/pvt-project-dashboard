import { Router } from "express";
import { ProjectsController } from "../controllers/projects.controller.js";
import { PrismaProjectsRepository } from "../repositories/prisma-projects.repository.js";
import { ProjectsService } from "../services/projects.service.js";

const projectsRoutes = Router();

/**
 * Ambiente real:
 * PrismaProjectsRepository → PostgreSQL
 *
 * Para testes unitários:
 * InMemoryProjectsRepository → dados mockados
 */
const projectsRepository = new PrismaProjectsRepository();

const projectsService = new ProjectsService(projectsRepository);

const projectsController = new ProjectsController(projectsService);

projectsRoutes.get("/", projectsController.list);

export { projectsRoutes };