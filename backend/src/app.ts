import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { routes } from "./routes";

// Carrega variáveis do arquivo .env para process.env.
dotenv.config();

// Cria a aplicação Express.
const app = express();

// Permite que o frontend em outra porta consuma esta API.
app.use(cors());

// Permite receber JSON no corpo das requisições.
app.use(express.json());

/**
 * Endpoint simples para verificar se a API está disponível.
 *
 * GET /health
 */
app.get("/health", (_request: Request, response: Response) => {
  return response.status(200).json({
    status: "ok",
    message: "PVT Project Dashboard API está funcionando.",
    timestamp: new Date().toISOString()
  });
});

/**
 * Todas as rotas de negócio da API ficarão abaixo de /api/v1.
 *
 * Isso permite criar uma futura versão v2 sem quebrar consumidores antigos.
 */
app.use("/api/v1", routes);

/**
 * Resposta padrão para rotas que não existem.
 */
app.use((request: Request, response: Response) => {
  return response.status(404).json({
    message: `Rota ${request.method} ${request.originalUrl} não encontrada.`
  });
});

/**
 * Middleware global de erro.
 *
 * Mesmo que ainda não tenhamos erros customizados,
 * essa estrutura evita respostas inconsistentes no futuro.
 */
app.use(
  (
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction
  ) => {
    console.error(error);

    return response.status(500).json({
      message: "Ocorreu um erro interno no servidor."
    });
  }
);

export { app };