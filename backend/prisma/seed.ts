import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não foi definida.");
}

const adapter = new PrismaPg({
  connectionString
});

const prisma = new PrismaClient({
  adapter
});

function date(value: string): Date {
  return new Date(`${value}T12:00:00.000Z`);
}

async function main() {
  console.log("Limpando dados locais de desenvolvimento...");

  await prisma.$transaction([
    prisma.timeEntry.deleteMany(),
    prisma.allocation.deleteMany(),
    prisma.milestone.deleteMany(),
    prisma.billing.deleteMany(),
    prisma.project.deleteMany(),
    prisma.analyst.deleteMany(),
    prisma.client.deleteMany()
  ]);

  console.log("Criando clientes...");

  const [clientAlfa, clientBeta, clientGama] = await Promise.all([
    prisma.client.create({
      data: {
        rmId: "RM-CLIENT-001",
        name: "Cliente Alfa Ltda.",
        document: "11111111000101"
      }
    }),
    prisma.client.create({
      data: {
        rmId: "RM-CLIENT-002",
        name: "Cliente Beta S.A.",
        document: "22222222000102"
      }
    }),
    prisma.client.create({
      data: {
        rmId: "RM-CLIENT-003",
        name: "Cliente Gama Comércio Ltda.",
        document: "33333333000103"
      }
    })
  ]);

  console.log("Criando analistas...");

  const [analystAna, analystBruno, analystCarla] = await Promise.all([
    prisma.analyst.create({
      data: {
        rmId: "RM-ANALYST-001",
        name: "Ana Martins",
        email: "ana.martins@pvt.local",
        role: "Analista de Implantação"
      }
    }),
    prisma.analyst.create({
      data: {
        rmId: "RM-ANALYST-002",
        name: "Bruno Costa",
        email: "bruno.costa@pvt.local",
        role: "Analista Fiscal"
      }
    }),
    prisma.analyst.create({
      data: {
        rmId: "RM-ANALYST-003",
        name: "Carla Souza",
        email: "carla.souza@pvt.local",
        role: "Analista de Dados"
      }
    })
  ]);

  console.log("Criando projetos...");

  const [projectAlfa, projectBeta, projectGama] = await Promise.all([
    prisma.project.create({
      data: {
        rmId: "RM-PROJECT-001",
        code: "PVT-2026-001",
        name: "Implantação ERP - Cliente Alfa",
        clientId: clientAlfa.id,
        startDate: date("2026-04-01"),
        endDate: date("2026-08-30"),
        soldHours: 500,
        contractValue: 120000,
        lastSyncedAt: new Date()
      }
    }),
    prisma.project.create({
      data: {
        rmId: "RM-PROJECT-002",
        code: "PVT-2026-002",
        name: "Sustentação Fiscal - Cliente Beta",
        clientId: clientBeta.id,
        startDate: date("2026-02-01"),
        endDate: date("2026-07-31"),
        soldHours: 300,
        contractValue: 70000,
        lastSyncedAt: new Date()
      }
    }),
    prisma.project.create({
      data: {
        rmId: "RM-PROJECT-003",
        code: "PVT-2026-003",
        name: "Migração de Dados - Cliente Gama",
        clientId: clientGama.id,
        startDate: date("2026-03-10"),
        endDate: date("2026-06-30"),
        soldHours: 200,
        contractValue: 45000,
        lastSyncedAt: new Date()
      }
    })
  ]);

  console.log("Criando alocações...");

  const [allocationAlfa, allocationBeta, allocationGama] = await Promise.all([
    prisma.allocation.create({
      data: {
        projectId: projectAlfa.id,
        analystId: analystAna.id,
        startDate: date("2026-04-01"),
        endDate: date("2026-08-30"),
        plannedHours: 470
      }
    }),
    prisma.allocation.create({
      data: {
        projectId: projectBeta.id,
        analystId: analystBruno.id,
        startDate: date("2026-02-01"),
        endDate: date("2026-07-31"),
        plannedHours: 290
      }
    }),
    prisma.allocation.create({
      data: {
        projectId: projectGama.id,
        analystId: analystCarla.id,
        startDate: date("2026-03-10"),
        endDate: date("2026-06-30"),
        plannedHours: 230
      }
    })
  ]);

  console.log("Criando apontamentos, marcos e faturamentos...");

  await prisma.timeEntry.createMany({
    data: [
      {
        rmId: "RM-TIME-ALFA-001",
        projectId: projectAlfa.id,
        analystId: analystAna.id,
        allocationId: allocationAlfa.id,
        workDate: date("2026-04-10"),
        hours: 70,
        status: "APROVADO",
        approvedAt: date("2026-04-11")
      },
      {
        rmId: "RM-TIME-ALFA-002",
        projectId: projectAlfa.id,
        analystId: analystAna.id,
        allocationId: allocationAlfa.id,
        workDate: date("2026-04-24"),
        hours: 70,
        status: "APROVADO",
        approvedAt: date("2026-04-25")
      },
      {
        rmId: "RM-TIME-ALFA-003",
        projectId: projectAlfa.id,
        analystId: analystAna.id,
        allocationId: allocationAlfa.id,
        workDate: date("2026-05-08"),
        hours: 70,
        status: "APROVADO",
        approvedAt: date("2026-05-09")
      },
      {
        rmId: "RM-TIME-ALFA-004",
        projectId: projectAlfa.id,
        analystId: analystAna.id,
        allocationId: allocationAlfa.id,
        workDate: date("2026-05-22"),
        hours: 70,
        status: "APROVADO",
        approvedAt: date("2026-05-23")
      },

      {
        rmId: "RM-TIME-BETA-001",
        projectId: projectBeta.id,
        analystId: analystBruno.id,
        allocationId: allocationBeta.id,
        workDate: date("2026-03-05"),
        hours: 63.75,
        status: "APROVADO",
        approvedAt: date("2026-03-06")
      },
      {
        rmId: "RM-TIME-BETA-002",
        projectId: projectBeta.id,
        analystId: analystBruno.id,
        allocationId: allocationBeta.id,
        workDate: date("2026-03-19"),
        hours: 63.75,
        status: "APROVADO",
        approvedAt: date("2026-03-20")
      },
      {
        rmId: "RM-TIME-BETA-003",
        projectId: projectBeta.id,
        analystId: analystBruno.id,
        allocationId: allocationBeta.id,
        workDate: date("2026-04-02"),
        hours: 63.75,
        status: "APROVADO",
        approvedAt: date("2026-04-03")
      },
      {
        rmId: "RM-TIME-BETA-004",
        projectId: projectBeta.id,
        analystId: analystBruno.id,
        allocationId: allocationBeta.id,
        workDate: date("2026-04-16"),
        hours: 63.75,
        status: "APROVADO",
        approvedAt: date("2026-04-17")
      },

      {
        rmId: "RM-TIME-GAMA-001",
        projectId: projectGama.id,
        analystId: analystCarla.id,
        allocationId: allocationGama.id,
        workDate: date("2026-03-20"),
        hours: 53.75,
        status: "APROVADO",
        approvedAt: date("2026-03-21")
      },
      {
        rmId: "RM-TIME-GAMA-002",
        projectId: projectGama.id,
        analystId: analystCarla.id,
        allocationId: allocationGama.id,
        workDate: date("2026-04-03"),
        hours: 53.75,
        status: "APROVADO",
        approvedAt: date("2026-04-04")
      },
      {
        rmId: "RM-TIME-GAMA-003",
        projectId: projectGama.id,
        analystId: analystCarla.id,
        allocationId: allocationGama.id,
        workDate: date("2026-04-17"),
        hours: 53.75,
        status: "APROVADO",
        approvedAt: date("2026-04-18")
      },
      {
        rmId: "RM-TIME-GAMA-004",
        projectId: projectGama.id,
        analystId: analystCarla.id,
        allocationId: allocationGama.id,
        workDate: date("2026-05-01"),
        hours: 53.75,
        status: "APROVADO",
        approvedAt: date("2026-05-02")
      }
    ]
  });

  await prisma.milestone.createMany({
    data: [
      {
        projectId: projectAlfa.id,
        title: "Levantamento e configuração inicial",
        weight: 42,
        plannedDate: date("2026-05-30"),
        completedAt: date("2026-05-28"),
        status: "CONCLUIDO"
      },
      {
        projectId: projectAlfa.id,
        title: "Treinamento e entrada em produção",
        weight: 58,
        plannedDate: date("2026-08-20"),
        status: "PENDENTE"
      },

      {
        projectId: projectBeta.id,
        title: "Regularização de rotinas fiscais",
        weight: 65,
        plannedDate: date("2026-04-30"),
        completedAt: date("2026-04-29"),
        status: "CONCLUIDO"
      },
      {
        projectId: projectBeta.id,
        title: "Validação final e encerramento",
        weight: 35,
        plannedDate: date("2026-07-20"),
        status: "PENDENTE"
      },

      {
        projectId: projectGama.id,
        title: "Extração e saneamento inicial",
        weight: 45,
        plannedDate: date("2026-04-30"),
        completedAt: date("2026-04-28"),
        status: "CONCLUIDO"
      },
      {
        projectId: projectGama.id,
        title: "Carga final e homologação",
        weight: 55,
        plannedDate: date("2026-05-30"),
        status: "ATRASADO"
      }
    ]
  });

  await prisma.billing.createMany({
    data: [
      {
        rmId: "RM-BILLING-ALFA-001",
        projectId: projectAlfa.id,
        amount: 50000,
        billingDate: date("2026-05-31"),
        status: "FATURADO"
      },
      {
        rmId: "RM-BILLING-BETA-001",
        projectId: projectBeta.id,
        amount: 56000,
        billingDate: date("2026-05-31"),
        status: "FATURADO"
      },
      {
        rmId: "RM-BILLING-GAMA-001",
        projectId: projectGama.id,
        amount: 36000,
        billingDate: date("2026-05-31"),
        status: "FATURADO"
      }
    ]
  });

  console.log("Seed concluído com sucesso.");
}

main()
  .catch((error) => {
    console.error("Falha ao executar o seed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });