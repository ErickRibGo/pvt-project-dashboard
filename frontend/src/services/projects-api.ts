import type { ListProjectsResponse, ProjectDashboardItem } from "../types/project";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export async function listProjects(): Promise<ProjectDashboardItem[]> {
  const response = await fetch(`${apiBaseUrl}/api/v1/projects`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os projetos.");
  }

  const payload = (await response.json()) as ListProjectsResponse;

  return payload.data;
}