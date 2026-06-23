import { Router } from "express";
import { projectsRoutes } from "./projects.routes";

/**
 * Router principal da aplicação.
 *
 * Centralizar os módulos aqui evita que app.ts fique poluído
 * quando surgirem rotas de apontamentos, clientes e integrações.
 */
const routes = Router();

routes.use("/projects", projectsRoutes);

export { routes };