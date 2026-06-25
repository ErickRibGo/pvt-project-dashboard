import { prisma } from "../lib/prisma.js";

async function main() {
  const [totalClients, totalProjects, totalAnalysts] = await Promise.all([
    prisma.client.count(),
    prisma.project.count(),
    prisma.analyst.count()
  ]);

  console.table([
    {
      clientes: totalClients,
      projetos: totalProjects,
      analistas: totalAnalysts
    }
  ]);
}

main()
  .catch((error) => {
    console.error("Falha ao consultar o banco de dados:");
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });