import { ProjectSourceData } from "../types/project";

/**
 * Simula os dados que, em um cenário real,
 * seriam sincronizados do TOTVS RM e armazenados localmente.
 *
 * A intenção é permitir construir e testar a regra de negócio
 * antes da integração real com ERP e banco de dados.
 */
export const projectsMock: ProjectSourceData[] = [
  {
    id: "project-001",
    code: "PVT-2026-001",
    name: "Implantação ERP - Cliente Alfa",
    clientName: "Cliente Alfa Ltda.",
    lifecycleStatus: "ATIVO",

    startDate: "2026-04-01",
    endDate: "2026-08-30",

    hoursSold: 500,
    hoursPlanned: 470,
    approvedHours: 280,

    contractValue: 120000,
    billedAmount: 50000,

    physicalProgressPercent: 42,
    hasOverdueMilestone: false
  },
  {
    id: "project-002",
    code: "PVT-2026-002",
    name: "Sustentação Fiscal - Cliente Beta",
    clientName: "Cliente Beta S.A.",
    lifecycleStatus: "ATIVO",

    startDate: "2026-02-01",
    endDate: "2026-07-31",

    hoursSold: 300,
    hoursPlanned: 290,
    approvedHours: 255,

    contractValue: 70000,
    billedAmount: 56000,

    physicalProgressPercent: 65,
    hasOverdueMilestone: false
  },
  {
    id: "project-003",
    code: "PVT-2026-003",
    name: "Migração de Dados - Cliente Gama",
    clientName: "Cliente Gama Comércio Ltda.",
    lifecycleStatus: "ATIVO",

    startDate: "2026-03-10",
    endDate: "2026-06-30",

    hoursSold: 200,
    hoursPlanned: 230,
    approvedHours: 215,

    contractValue: 45000,
    billedAmount: 36000,

    physicalProgressPercent: 45,
    hasOverdueMilestone: true
  }
];