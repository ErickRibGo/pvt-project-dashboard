import { app } from "./app.js";

/**
 * Define a porta da aplicação.
 * Caso PORT não exista no arquivo .env, usa 3333.
 */
const port = Number(process.env.PORT) || 3333;

/**
 * Inicia o servidor HTTP.
 *
 * O arquivo server.ts tem uma única responsabilidade:
 * iniciar a aplicação.
 *
 * As configurações, middlewares e rotas ficam em app.ts.
 */
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});