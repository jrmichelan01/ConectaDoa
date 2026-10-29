 
import "dotenv/config";
import express from "express";
import { pool } from "./db.js";
import doadoresRouter from "./routes/doadores.js";
import itensRouter from "./routes/itens.js";
import doacoesRouter from "./routes/doacoes.js";
const app = express();

app.use(express.json());

// Verifica se a API e o banco de dados estão funcionando
app.get("/api/health", async (req, res) => {
  try {
    await pool.execute("SELECT 1");

    res.status(200).json({
      status: "ok",
      app: "ConectaDoa",
      banco: "conectado",
      hora: new Date().toISOString(),
    });
  } catch (erro) {
    console.error("Erro na verificação:", erro.message);

    res.status(500).json({
      status: "erro",
      app: "ConectaDoa",
      banco: "indisponível",
    });
  }
});

// Ativa as rotas de doadores
app.use("/api/doadores", doadoresRouter);
app.use("/api/itens", itensRouter);
app.use("/api/doacoes", doacoesRouter);
// Trata erros de JSON inválido
app.use((erro, req, res, next) => {
  if (erro instanceof SyntaxError && erro.status === 400 && "body" in erro) {
    return res.status(400).json({
      erro: "O JSON enviado é inválido.",
    });
  }

  console.error("Erro interno:", erro.message);

  res.status(500).json({
    erro: "Erro interno do servidor.",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
