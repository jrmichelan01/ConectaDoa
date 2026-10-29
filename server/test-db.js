
import { pool } from "./db.js";

try {
  const [resultado] = await pool.query("SELECT 1 AS teste");
  console.log("Conexão com o MySQL funcionando!");
  console.log(resultado);
} catch (erro) {
  console.error("Erro ao conectar com o MySQL:");
  console.error(erro.message);
} finally {
  await pool.end();
}
