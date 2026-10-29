
import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET: listar todos os itens e suas categorias
router.get("/", async (req, res) => {
  try {
    const [itens] = await pool.execute(
      `SELECT
         i.id_item,
         i.nome,
         i.unidade,
         c.id_categoria,
         c.nome AS categoria
       FROM item AS i
       INNER JOIN categoria AS c
         ON i.id_categoria = c.id_categoria
       ORDER BY c.nome, i.nome`
    );

    res.status(200).json(itens);
  } catch (erro) {
    console.error("Erro ao listar itens:", erro.message);

    res.status(500).json({
      erro: "Não foi possível buscar os itens.",
    });
  }
});

export default router;
