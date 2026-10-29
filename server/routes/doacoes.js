 
import { Router } from "express";
import { pool } from "../db.js";
import { validarDoacao } from "../validacao.js";

const router = Router();

// GET: listar as doações e seus respectivos itens
router.get("/", async (req, res) => {
  try {
    const [linhas] = await pool.execute(
      `SELECT
         d.id_doacao,
         d.id_doador,
         doad.nome AS nome_doador,
         d.data_doacao,
         d.observacao,
         d.criado_em,
         di.id_item,
         i.nome AS nome_item,
         i.unidade,
         di.quantidade
       FROM doacao AS d
       INNER JOIN doador AS doad
         ON d.id_doador = doad.id_doador
       LEFT JOIN doacao_item AS di
         ON d.id_doacao = di.id_doacao
       LEFT JOIN item AS i
         ON di.id_item = i.id_item
       ORDER BY d.data_doacao DESC, d.id_doacao, i.nome`
    );

    // Agrupa os itens que pertencem a cada doação
    const mapa = new Map();

    for (const linha of linhas) {
      if (!mapa.has(linha.id_doacao)) {
        mapa.set(linha.id_doacao, {
          id_doacao: linha.id_doacao,
          id_doador: linha.id_doador,
          nome_doador: linha.nome_doador,
          data_doacao: linha.data_doacao,
          observacao: linha.observacao,
          criado_em: linha.criado_em,
          itens: [],
        });
      }

      // Adiciona os itens à doação correspondente
      if (linha.id_item !== null) {
        mapa.get(linha.id_doacao).itens.push({
          id_item: linha.id_item,
          nome: linha.nome_item,
          unidade: linha.unidade,
          quantidade: linha.quantidade,
        });
      }
    }

    res.status(200).json([...mapa.values()]);
  } catch (erro) {
    console.error("Erro ao listar doações:", erro.message);

    res.status(500).json({
      erro: "Não foi possível buscar as doações.",
    });
  }
});

// POST: cadastrar uma doação com seus itens
router.post("/", async (req, res) => {
  const erros = validarDoacao(req.body);

  if (erros.length > 0) {
    return res.status(400).json({ erro: erros[0] });
  }

  const { id_doador, data_doacao, observacao, itens } = req.body;
  let conexao;

  try {
    conexao = await pool.getConnection();

    // Inicia a transação
    await conexao.beginTransaction();

    // Cadastra a doação
    const [resultadoDoacao] = await conexao.execute(
      `INSERT INTO doacao (id_doador, data_doacao, observacao)
       VALUES (?, ?, ?)`,
      [id_doador, data_doacao, observacao || null]
    );

    const idDoacao = resultadoDoacao.insertId;

    // Cadastra cada item relacionado à doação
    for (const item of itens) {
      await conexao.execute(
        `INSERT INTO doacao_item (id_doacao, id_item, quantidade)
         VALUES (?, ?, ?)`,
        [idDoacao, item.id_item, item.quantidade]
      );
    }

    // Confirma todas as operações
    await conexao.commit();

    return res.status(201).json({
      mensagem: "Doação cadastrada com sucesso.",
      id_doacao: idDoacao,
    });
  } catch (erro) {
    // Desfaz as operações se ocorrer um erro
    if (conexao) {
      try {
        await conexao.rollback();
      } catch (erroRollback) {
        console.error("Erro ao desfazer transação:", erroRollback.message);
      }
    }

    if (erro.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        erro: "O doador ou algum item informado não existe.",
      });
    }

    console.error("Erro ao cadastrar doação:", erro.message);

    return res.status(500).json({
      erro: "Não foi possível cadastrar a doação.",
    });
  } finally {
    // Libera a conexão com o banco
    if (conexao) {
      conexao.release();
    }
  }
});

export default router;
