 
import { Router } from "express";
import { pool } from "../db.js";
import { validarDoador } from "../validacao.js";

const router = Router();

// GET: listar todos os doadores
router.get("/", async (req, res) => {
  try {
    const [doadores] = await pool.execute(
      `SELECT id_doador, nome, email, telefone, data_cadastro
       FROM doador
       ORDER BY id_doador`
    );

    res.status(200).json(doadores);
  } catch (erro) {
    console.error("Erro ao listar doadores:", erro.message);
    res.status(500).json({ erro: "Erro ao buscar doadores." });
  }
});

// GET: buscar um doador pelo ID
router.get("/:id", async (req, res) => {
  try {
    const [doadores] = await pool.execute(
      `SELECT id_doador, nome, email, telefone, data_cadastro
       FROM doador
       WHERE id_doador = ?`,
      [req.params.id]
    );

    if (doadores.length === 0) {
      return res.status(404).json({ erro: "Doador não encontrado." });
    }

    res.status(200).json(doadores[0]);
  } catch (erro) {
    console.error("Erro ao buscar doador:", erro.message);
    res.status(500).json({ erro: "Erro ao buscar doador." });
  }
});

// POST: cadastrar um novo doador
router.post("/", async (req, res) => {
  const erros = validarDoador(req.body);

  if (erros.length > 0) {
    return res.status(400).json({ erro: erros[0] });
  }

  const { nome, email, telefone } = req.body;

  try {
    const [resultado] = await pool.execute(
      `INSERT INTO doador (nome, email, telefone)
       VALUES (?, ?, ?)`,
      [nome.trim(), email.trim(), telefone || null]
    );

    res.status(201).json({
      mensagem: "Doador cadastrado com sucesso.",
      id_doador: resultado.insertId,
    });
  } catch (erro) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        erro: "Já existe um doador cadastrado com esse e-mail.",
      });
    }

    console.error("Erro ao cadastrar doador:", erro.message);
    res.status(500).json({ erro: "Erro ao cadastrar doador." });
  }
});

// PUT: atualizar um doador
router.put("/:id", async (req, res) => {
  const erros = validarDoador(req.body);

  if (erros.length > 0) {
    return res.status(400).json({ erro: erros[0] });
  }

  const { nome, email, telefone } = req.body;

  try {
    const [resultado] = await pool.execute(
      `UPDATE doador
       SET nome = ?, email = ?, telefone = ?
       WHERE id_doador = ?`,
      [nome.trim(), email.trim(), telefone || null, req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Doador não encontrado." });
    }

    res.status(200).json({
      mensagem: "Doador atualizado com sucesso.",
    });
  } catch (erro) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        erro: "Já existe um doador cadastrado com esse e-mail.",
      });
    }

    console.error("Erro ao atualizar doador:", erro.message);
    res.status(500).json({ erro: "Erro ao atualizar doador." });
  }
});

// DELETE: excluir um doador
router.delete("/:id", async (req, res) => {
  try {
    const [resultado] = await pool.execute(
      "DELETE FROM doador WHERE id_doador = ?",
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Doador não encontrado." });
    }

    res.status(204).send();
  } catch (erro) {
    if (erro.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        erro: "Não é possível excluir um doador que possui doações.",
      });
    }

    console.error("Erro ao excluir doador:", erro.message);
    res.status(500).json({ erro: "Erro ao excluir doador." });
  }
});

export default router;
