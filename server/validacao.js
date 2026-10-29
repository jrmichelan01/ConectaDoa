
export function validarDoador(dados) {
  const erros = [];

  if (
    typeof dados.nome !== "string" ||
    dados.nome.trim() === ""
  ) {
    erros.push("O nome é obrigatório.");
  } else if (dados.nome.trim().length > 150) {
    erros.push("O nome deve ter no máximo 150 caracteres.");
  }

  if (
    typeof dados.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)
  ) {
    erros.push("Informe um e-mail válido.");
  }

  if (
    dados.telefone !== undefined &&
    dados.telefone !== null &&
    (
      typeof dados.telefone !== "string" ||
      dados.telefone.length > 20
    )
  ) {
    erros.push("O telefone deve ter no máximo 20 caracteres.");
  }

  return erros;
}

export function validarDoacao(dados) {
  const erros = [];

  if (
    !Number.isInteger(Number(dados.id_doador)) ||
    Number(dados.id_doador) < 1
  ) {
    erros.push("Informe um ID de doador válido.");
  }

  if (
    typeof dados.data_doacao !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dados.data_doacao)
  ) {
    erros.push("A data deve estar no formato AAAA-MM-DD.");
  }

  if (!Array.isArray(dados.itens) || dados.itens.length === 0) {
    erros.push("A doação deve conter pelo menos um item.");
  } else {
    const idsItens = [];

    dados.itens.forEach((item, indice) => {
      if (
        !Number.isInteger(Number(item.id_item)) ||
        Number(item.id_item) < 1
      ) {
        erros.push(`O item ${indice + 1} possui um ID inválido.`);
      }

      if (
        !Number.isInteger(Number(item.quantidade)) ||
        Number(item.quantidade) < 1
      ) {
        erros.push(`O item ${indice + 1} possui uma quantidade inválida.`);
      }

      idsItens.push(Number(item.id_item));
    });

    if (new Set(idsItens).size !== idsItens.length) {
      erros.push("Não é permitido repetir o mesmo item na doação.");
    }
  }

  return erros;
}
