import { prisma } from "../lib/prisma.js";
import type { ProjectSourceData } from "../types/project.js";
import type { ProjectsRepository } from "./projects.repository.js";

/**
 * Repositório que lê projetos reais do PostgreSQL usando Prisma.
 *
 * Ele transforma o modelo normalizado do banco em dados que o
 * ProjectsService consegue usar para calcular a saúde do projeto.
 */
export class PrismaProjectsRepository implements ProjectsRepository {
  public async findAll(): Promise<ProjectSourceData[]> {
    const projects = await prisma.project.findMany({
      include: {
        client: {
          select: {
            name: true
          }
        },

        allocations: {
          select: {
            plannedHours: true
          }
        },

        timeEntries: {
          where: {
            status: {
              in: ["APROVADO", "SINCRONIZADO_RM"]
            }
          },
          select: {
            hours: true
          }
        },

        milestones: {
          select: {
            weight: true,
            plannedDate: true,
            status: true
          }
        },

        billings: {
          where: {
            status: "FATURADO"
          },
          select: {
            amount: true
          }
        }
      },

      orderBy: {
        startDate: "asc"
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return projects.map((project): ProjectSourceData => {
      const hoursPlanned = project.allocations.reduce(
        (total, allocation) => total + Number(allocation.plannedHours),
        0
      );

      const approvedHours = project.timeEntries.reduce(
        (total, timeEntry) => total + Number(timeEntry.hours),
        0
      );

      const billedAmount = project.billings.reduce(
        (total, billing) => total + Number(billing.amount),
        0
      );

      const totalMilestoneWeight = project.milestones.reduce(
        (total, milestone) => total + Number(milestone.weight),
        0
      );

      const completedMilestoneWeight = project.milestones
        .filter((milestone) => milestone.status === "CONCLUIDO")
        .reduce(
          (total, milestone) => total + Number(milestone.weight),
          0
        );

      const physicalProgressPercent =
        totalMilestoneWeight === 0
          ? 0
          : Number(
              (
                (completedMilestoneWeight / totalMilestoneWeight) *
                100
              ).toFixed(2)
            );

      const hasOverdueMilestone = project.milestones.some((milestone) => {
        const isPendingOrLate =
          milestone.status !== "CONCLUIDO" &&
          milestone.status !== "CANCELADO";

        return (
          milestone.status === "ATRASADO" ||
          (isPendingOrLate && milestone.plannedDate < today)
        );
      });

      return {
        id: project.id,
        code: project.code,
        name: project.name,
        clientName: project.client.name,
        lifecycleStatus: project.lifecycleStatus,

        startDate: project.startDate.toISOString().slice(0, 10),
        endDate: project.endDate
          ? project.endDate.toISOString().slice(0, 10)
          : null,

        hoursSold: Number(project.soldHours),
        hoursPlanned,
        approvedHours,

        contractValue: Number(project.contractValue),
        billedAmount,

        physicalProgressPercent,
        hasOverdueMilestone
      };
    });
  }
}