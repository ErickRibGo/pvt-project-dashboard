import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { listProjects } from "./services/projects-api";
import type {
  ProjectDashboardItem,
  ProjectHealthStatus
} from "./types/project";

type HealthFilter = "TODOS" | ProjectHealthStatus;

const healthLabels: Record<ProjectHealthStatus, string> = {
  SAUDAVEL: "Saudável",
  ATENCAO: "Atenção",
  CRITICO: "Crítico"
};

const hoursFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function formatHours(value: number): string {
  return `${hoursFormatter.format(value)}h`;
}

function getStatusClass(status: ProjectHealthStatus): string {
  return `status status--${status.toLowerCase()}`;
}

function App() {
  const [projects, setProjects] = useState<ProjectDashboardItem[]>([]);
  const [selectedFilter, setSelectedFilter] =
    useState<HealthFilter>("TODOS");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadProjects() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await listProjects();

      setProjects(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Não foi possível carregar os dados. Confirme se a API está rodando na porta 3333."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedFilter === "TODOS") {
      return projects;
    }

    return projects.filter(
      (project) => project.healthStatus === selectedFilter
    );
  }, [projects, selectedFilter]);

  const summary = useMemo(() => {
    return {
      total: projects.length,
      healthy: projects.filter((project) => project.healthStatus === "SAUDAVEL")
        .length,
      attention: projects.filter((project) => project.healthStatus === "ATENCAO")
        .length,
      critical: projects.filter((project) => project.healthStatus === "CRITICO")
        .length
    };
  }, [projects]);

  const filters: Array<{ value: HealthFilter; label: string }> = [
    { value: "TODOS", label: "Todos" },
    { value: "SAUDAVEL", label: "Saudáveis" },
    { value: "ATENCAO", label: "Atenção" },
    { value: "CRITICO", label: "Críticos" }
  ];

  return (
    <main className="dashboard">
      <div className="dashboard__content">
        <header className="dashboard__header">
          <div>
            <p className="eyebrow">PVT Software & Serviços</p>
            <h1>Painel de Projetos</h1>
            <p className="subtitle">
              Visão consolidada de horas, evolução e saúde dos projetos.
            </p>
          </div>

          <button
            className="refresh-button"
            type="button"
            onClick={loadProjects}
            disabled={isLoading}
          >
            {isLoading ? "Atualizando..." : "Atualizar dados"}
          </button>
        </header>

        <section className="summary-grid" aria-label="Resumo dos projetos">
          <article className="summary-card">
            <span>Total de projetos</span>
            <strong>{summary.total}</strong>
          </article>

          <article className="summary-card summary-card--healthy">
            <span>Saudáveis</span>
            <strong>{summary.healthy}</strong>
          </article>

          <article className="summary-card summary-card--attention">
            <span>Em atenção</span>
            <strong>{summary.attention}</strong>
          </article>

          <article className="summary-card summary-card--critical">
            <span>Críticos</span>
            <strong>{summary.critical}</strong>
          </article>
        </section>

        <section className="projects-section">
          <div className="projects-section__header">
            <div>
              <h2>Projetos</h2>
              <p>
                Exibindo {filteredProjects.length} de {projects.length} projeto(s).
              </p>
            </div>

            <div className="filters" aria-label="Filtrar projetos por saúde">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  className={
                    selectedFilter === filter.value
                      ? "filter-button filter-button--active"
                      : "filter-button"
                  }
                  onClick={() => setSelectedFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="feedback-card">
              Carregando projetos do PostgreSQL...
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="feedback-card feedback-card--error">
              <p>{errorMessage}</p>
              <button type="button" onClick={loadProjects}>
                Tentar novamente
              </button>
            </div>
          )}

          {!isLoading && !errorMessage && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Projeto</th>
                    <th>Horas</th>
                    <th>Saldo</th>
                    <th>Físico</th>
                    <th>Financeiro</th>
                    <th>Saúde</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <div className="project-info">
                          <strong>{project.name}</strong>
                          <span>
                            {project.code} · {project.clientName}
                          </span>
                        </div>
                      </td>

                      <td>
                        <strong>
                          {formatHours(project.approvedHours)} /{" "}
                          {formatHours(project.hoursSold)}
                        </strong>
                        <span className="secondary-text">
                          {project.hoursConsumptionPercent}% consumido
                        </span>
                      </td>

                      <td>
                        <strong
                          className={
                            project.hoursBalance <= 0
                              ? "negative-value"
                              : undefined
                          }
                        >
                          {formatHours(project.hoursBalance)}
                        </strong>
                        <span className="secondary-text">
                          Planejado: {formatHours(project.hoursPlanned)}
                        </span>
                      </td>

                      <td>
                        <div className="progress-value">
                          {project.physicalProgressPercent}%
                        </div>
                        <div className="progress-track">
                          <div
                            className="progress-fill progress-fill--physical"
                            style={{
                              width: `${Math.min(
                                project.physicalProgressPercent,
                                100
                              )}%`
                            }}
                          />
                        </div>
                      </td>

                      <td>
                        <div className="progress-value">
                          {project.financialProgressPercent}%
                        </div>
                        <div className="progress-track">
                          <div
                            className="progress-fill progress-fill--financial"
                            style={{
                              width: `${Math.min(
                                project.financialProgressPercent,
                                100
                              )}%`
                            }}
                          />
                        </div>
                        <span className="secondary-text">
                          {currencyFormatter.format(project.billedAmount)}
                        </span>
                      </td>

                      <td>
                        <span className={getStatusClass(project.healthStatus)}>
                          {healthLabels[project.healthStatus]}
                        </span>

                        <ul className="health-reasons">
                          {project.healthReasons.map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}

                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-state">
                        Nenhum projeto encontrado para este filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;