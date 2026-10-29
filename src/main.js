 
import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <header class="topo">
    <div class="container">
      <h1>Conecta<span>Doa</span></h1>
      <p>Conectando pessoas, transformando vidas.</p>
      <div class="status">Status da API: <strong id="status">Verificando...</strong></div>
    </div>
  </header>

  <main class="container">
    <section class="resumo">
      <article class="cartao-resumo">
        <span>Doadores cadastrados</span>
        <strong id="total-doadores">0</strong>
      </article>
      <article class="cartao-resumo">
        <span>Itens disponíveis</span>
        <strong id="total-itens">0</strong>
      </article>
      <article class="cartao-resumo">
        <span>Doações registradas</span>
        <strong id="total-doacoes">0</strong>
      </article>
    </section>

    <div id="mensagem" role="status" aria-live="polite"></div>

    <section class="painel">
      <h2>Cadastrar doador</h2>
      <form id="form-doador">
        <div class="campos">
          <label>Nome completo
            <input name="nome" required maxlength="120" placeholder="Nome do doador">
          </label>
          <label>E-mail
            <input name="email" type="email" maxlength="100" placeholder="email@exemplo.com">
          </label>
          <label>Telefone
            <input name="telefone" maxlength="20" placeholder="(14) 99999-9999">
          </label>
        </div>
        <button type="submit">Cadastrar doador</button>
      </form>
    </section>

    <section class="painel">
      <h2>Registrar doação</h2>
      <form id="form-doacao">
        <div class="campos">
          <label>Doador
            <select id="doador-doacao" name="id_doador" required>
              <option value="">Selecione um doador</option>
            </select>
          </label>
          <label>Data da doação
            <input id="data-doacao" name="data_doacao" type="date" required>
          </label>
          <label class="campo-largo">Observação
            <input name="observacao" maxlength="255" placeholder="Ex.: Arrecadação de alimentos">
          </label>
        </div>

        <h3>Itens da doação</h3>
        <div class="campos campos-item">
          <label>Item
            <select id="item-doacao">
              <option value="">Selecione um item</option>
            </select>
          </label>
          <label>Quantidade
            <input id="quantidade-item" type="number" min="1" step="1" value="1">
          </label>
          <div class="botao-adicionar">
            <button id="adicionar-item" type="button" class="secundario">Adicionar item</button>
          </div>
        </div>

        <ul id="lista-itens-selecionados" class="lista-itens">
          <li class="vazio">Nenhum item adicionado.</li>
        </ul>
        <button type="submit">Registrar doação</button>
      </form>
    </section>

    <section class="painel">
      <h2>Doadores cadastrados</h2>
      <div class="tabela-responsiva">
        <table>
          <thead>
            <tr><th>Nome</th><th>E-mail</th><th>Telefone</th></tr>
          </thead>
          <tbody id="tabela-doadores">
            <tr><td colspan="3">Carregando...</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="painel">
      <h2>Histórico de doações</h2>
      <div id="historico-doacoes">
        <p>Carregando doações...</p>
      </div>
    </section>
  </main>

  <footer>
    <p>ConectaDoa · Projeto Integrador Extensionista II</p>
  </footer>
`;

const $ = (seletor) => document.querySelector(seletor);

let doadores = [];
let itensDisponiveis = [];
let doacoes = [];
let itensSelecionados = [];

function mostrarMensagem(texto, tipo = "sucesso") {
  const mensagem = $("#mensagem");
  mensagem.textContent = texto;
  mensagem.className = tipo;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,
    headers: {
      ...(opcoes.body ? { "Content-Type": "application/json" } : {}),
      ...opcoes.headers,
    },
  });

  if (resposta.status === 204) return null;

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Não foi possível concluir a operação.");
  }

  return dados;
}

function preencherSelect(seletor, registros, campoId, campoNome, textoInicial) {
  const select = $(seletor);
  const valorAtual = select.value;

  select.replaceChildren(new Option(textoInicial, ""));

  registros.forEach((registro) => {
    select.add(new Option(registro[campoNome], registro[campoId]));
  });

  if (registros.some((registro) => String(registro[campoId]) === valorAtual)) {
    select.value = valorAtual;
  }
}

function escapar(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[caractere]);
}

function atualizarResumo() {
  $("#total-doadores").textContent = doadores.length;
  $("#total-itens").textContent = itensDisponiveis.length;
  $("#total-doacoes").textContent = doacoes.length;
}

function renderizarDoadores() {
  const tabela = $("#tabela-doadores");

  if (doadores.length === 0) {
    tabela.innerHTML = '<tr><td colspan="3">Nenhum doador cadastrado.</td></tr>';
    return;
  }

  tabela.innerHTML = doadores.map((doador) => `
    <tr>
      <td>${escapar(doador.nome)}</td>
      <td>${escapar(doador.email || "—")}</td>
      <td>${escapar(doador.telefone || "—")}</td>
    </tr>
  `).join("");
}

function renderizarItensSelecionados() {
  const lista = $("#lista-itens-selecionados");

  if (itensSelecionados.length === 0) {
    lista.innerHTML = '<li class="vazio">Nenhum item adicionado.</li>';
    return;
  }

  lista.innerHTML = itensSelecionados.map((selecionado, indice) => {
    const item = itensDisponiveis.find(
      (registro) => Number(registro.id_item) === selecionado.id_item
    );

    return `
      <li>
        <span>${escapar(item?.nome || "Item")} — ${selecionado.quantidade} ${escapar(item?.unidade || "unidade(s)")}</span>
        <button type="button" class="remover-item" data-indice="${indice}" aria-label="Remover item">Remover</button>
      </li>
    `;
  }).join("");
}

function renderizarDoacoes() {
  const historico = $("#historico-doacoes");

  if (doacoes.length === 0) {
    historico.innerHTML = "<p>Nenhuma doação registrada.</p>";
    return;
  }

  historico.innerHTML = doacoes.map((doacao) => {
    const data = String(doacao.data_doacao).slice(0, 10).split("-").reverse().join("/");
    const nomeDoador = doacao.doador?.nome || doacao.nome_doador || "Não informado";

    const listaItens = (doacao.itens || []).map((item) => `
      <li>${escapar(item.nome)}: ${item.quantidade} ${escapar(item.unidade || "unidade(s)")}</li>
    `).join("");

    return `
      <article class="doacao">
        <div class="doacao-cabecalho">
          <strong>Doação #${escapar(doacao.id_doacao)}</strong>
          <span>${escapar(data)}</span>
        </div>
        <p><strong>Doador:</strong> ${escapar(nomeDoador)}</p>
        <ul>${listaItens}</ul>
        ${doacao.observacao ? `<p><strong>Observação:</strong> ${escapar(doacao.observacao)}</p>` : ""}
      </article>
    `;
  }).join("");
}

async function carregarDados() {
  try {
    const [dadosDoadores, dadosItens, dadosDoacoes] = await Promise.all([
      requisicao("/api/doadores"),
      requisicao("/api/itens"),
      requisicao("/api/doacoes"),
    ]);

    doadores = dadosDoadores;
    itensDisponiveis = dadosItens;
    doacoes = dadosDoacoes;

    preencherSelect("#doador-doacao", doadores, "id_doador", "nome", "Selecione um doador");
    preencherSelect("#item-doacao", itensDisponiveis, "id_item", "nome", "Selecione um item");

    renderizarDoadores();
    renderizarDoacoes();
    renderizarItensSelecionados();
    atualizarResumo();

    $("#status").textContent = "Conectada";
    $("#status").className = "online";
  } catch (erro) {
    $("#status").textContent = "Erro de conexão";
    $("#status").className = "offline";
    mostrarMensagem(erro.message, "erro");
  }
}

$("#form-doador").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const formulario = new FormData(evento.currentTarget);
  const dados = Object.fromEntries(formulario.entries());

  dados.nome = dados.nome.trim();
  dados.email = dados.email.trim() || null;
  dados.telefone = dados.telefone.trim() || null;

  try {
    await requisicao("/api/doadores", {
      method: "POST",
      body: JSON.stringify(dados),
    });

    evento.currentTarget.reset();
    await carregarDados();
    mostrarMensagem("Doador cadastrado com sucesso!");
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
});

$("#adicionar-item").addEventListener("click", () => {
  const idItem = Number($("#item-doacao").value);
  const quantidade = Number($("#quantidade-item").value);

  if (!idItem) {
    mostrarMensagem("Selecione um item.", "erro");
    return;
  }

  if (!Number.isInteger(quantidade) || quantidade < 1) {
    mostrarMensagem("Informe uma quantidade inteira maior que zero.", "erro");
    return;
  }

  if (itensSelecionados.some((item) => item.id_item === idItem)) {
    mostrarMensagem("Esse item já foi adicionado. Escolha outro item.", "erro");
    return;
  }

  itensSelecionados.push({ id_item: idItem, quantidade });
  renderizarItensSelecionados();
  $("#item-doacao").value = "";
  $("#quantidade-item").value = "1";
  $("#mensagem").textContent = "";
  $("#mensagem").className = "";
});

$("#lista-itens-selecionados").addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-indice]");
  if (!botao) return;

  itensSelecionados.splice(Number(botao.dataset.indice), 1);
  renderizarItensSelecionados();
});

$("#form-doacao").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  if (itensSelecionados.length === 0) {
    mostrarMensagem("Adicione pelo menos um item à doação.", "erro");
    return;
  }

  const formulario = new FormData(evento.currentTarget);

  const dados = {
    id_doador: Number(formulario.get("id_doador")),
    data_doacao: formulario.get("data_doacao"),
    observacao: formulario.get("observacao").trim() || null,
    itens: itensSelecionados.map((item) => ({ ...item })),
  };

  try {
    await requisicao("/api/doacoes", {
      method: "POST",
      body: JSON.stringify(dados),
    });

    evento.currentTarget.reset();
    $("#data-doacao").value = new Date().toLocaleDateString("en-CA");
    itensSelecionados = [];

    await carregarDados();
    renderizarItensSelecionados();
    mostrarMensagem("Doação registrada com sucesso!");
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
});

$("#data-doacao").value = new Date().toLocaleDateString("en-CA");

carregarDados();
