-- CreateEnum
CREATE TYPE "ProjectLifecycleStatus" AS ENUM ('ATIVO', 'ENCERRADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TimeEntryStatus" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO', 'SINCRONIZADO_RM');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDENTE', 'CONCLUIDO', 'ATRASADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('PREVISTO', 'FATURADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "rmId" TEXT,
    "name" TEXT NOT NULL,
    "document" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "rmId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "lifecycleStatus" "ProjectLifecycleStatus" NOT NULL DEFAULT 'ATIVO',
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "soldHours" DECIMAL(10,2) NOT NULL,
    "contractValue" DECIMAL(14,2) NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysts" (
    "id" TEXT NOT NULL,
    "rmId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analysts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allocations" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "analystId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "plannedHours" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_entries" (
    "id" TEXT NOT NULL,
    "rmId" TEXT,
    "projectId" TEXT NOT NULL,
    "analystId" TEXT NOT NULL,
    "allocationId" TEXT,
    "workDate" DATE NOT NULL,
    "hours" DECIMAL(6,2) NOT NULL,
    "description" TEXT,
    "status" "TimeEntryStatus" NOT NULL DEFAULT 'PENDENTE',
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "weight" DECIMAL(5,2) NOT NULL,
    "plannedDate" DATE NOT NULL,
    "completedAt" DATE,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billings" (
    "id" TEXT NOT NULL,
    "rmId" TEXT,
    "projectId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "billingDate" DATE NOT NULL,
    "status" "BillingStatus" NOT NULL DEFAULT 'PREVISTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_rmId_key" ON "clients"("rmId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_document_key" ON "clients"("document");

-- CreateIndex
CREATE INDEX "clients_name_idx" ON "clients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "projects_rmId_key" ON "projects"("rmId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_code_key" ON "projects"("code");

-- CreateIndex
CREATE INDEX "projects_clientId_idx" ON "projects"("clientId");

-- CreateIndex
CREATE INDEX "projects_lifecycleStatus_idx" ON "projects"("lifecycleStatus");

-- CreateIndex
CREATE UNIQUE INDEX "analysts_rmId_key" ON "analysts"("rmId");

-- CreateIndex
CREATE UNIQUE INDEX "analysts_email_key" ON "analysts"("email");

-- CreateIndex
CREATE INDEX "analysts_name_idx" ON "analysts"("name");

-- CreateIndex
CREATE INDEX "allocations_projectId_idx" ON "allocations"("projectId");

-- CreateIndex
CREATE INDEX "allocations_analystId_idx" ON "allocations"("analystId");

-- CreateIndex
CREATE UNIQUE INDEX "allocations_projectId_analystId_startDate_key" ON "allocations"("projectId", "analystId", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "time_entries_rmId_key" ON "time_entries"("rmId");

-- CreateIndex
CREATE INDEX "time_entries_projectId_status_idx" ON "time_entries"("projectId", "status");

-- CreateIndex
CREATE INDEX "time_entries_analystId_workDate_idx" ON "time_entries"("analystId", "workDate");

-- CreateIndex
CREATE INDEX "time_entries_workDate_idx" ON "time_entries"("workDate");

-- CreateIndex
CREATE INDEX "milestones_projectId_status_idx" ON "milestones"("projectId", "status");

-- CreateIndex
CREATE INDEX "milestones_plannedDate_idx" ON "milestones"("plannedDate");

-- CreateIndex
CREATE UNIQUE INDEX "billings_rmId_key" ON "billings"("rmId");

-- CreateIndex
CREATE INDEX "billings_projectId_status_idx" ON "billings"("projectId", "status");

-- CreateIndex
CREATE INDEX "billings_billingDate_idx" ON "billings"("billingDate");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_analystId_fkey" FOREIGN KEY ("analystId") REFERENCES "analysts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_analystId_fkey" FOREIGN KEY ("analystId") REFERENCES "analysts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "allocations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billings" ADD CONSTRAINT "billings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
