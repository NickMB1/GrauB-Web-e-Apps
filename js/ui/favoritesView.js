// Nicolas Minato Bellver e João Luca Benicio — Jogos Digitais, 2º semestre — 2026
//
// Controla o formulário de criar/editar favorito e a tabela de favoritos
// (busca, filtro, ordenação, paginação, edição e exclusão com confirmação).

class FavoritesView {
  #servico;
  #mensagens;
  #aoAlterarFavoritos;

  #elementos;

  #favoritoEmEdicao;
  #conselhoPendente;
  #paginaAtual;
  #idsConfirmandoExclusao;

  constructor({ servico, mensagens, aoAlterarFavoritos, elementos }) {
    this.#servico = servico;
    this.#mensagens = mensagens;
    this.#aoAlterarFavoritos = aoAlterarFavoritos;
    this.#elementos = elementos;

    this.#favoritoEmEdicao = null;
    this.#conselhoPendente = null;
    this.#paginaAtual = 1;
    this.#idsConfirmandoExclusao = new Set();

    this.#popularSelectsDeCategoria();
    this.#carregarFiltrosSalvos();
    this.#registrarEventos();
    this.renderizarTabela();
  }

  #popularSelectsDeCategoria() {
    CONFIG.CATEGORIAS.forEach((categoria) => {
      const opcaoForm = document.createElement("option");
      opcaoForm.value = categoria;
      opcaoForm.textContent = categoria;
      this.#elementos.campoCategoria.appendChild(opcaoForm);

      const opcaoFiltro = document.createElement("option");
      opcaoFiltro.value = categoria;
      opcaoFiltro.textContent = categoria;
      this.#elementos.filtroCategoria.appendChild(opcaoFiltro);
    });
  }

  #carregarFiltrosSalvos() {
    const bruto = localStorage.getItem(CONFIG.CHAVE_FILTROS);
    if (!bruto) {
      return;
    }
    try {
      const filtros = JSON.parse(bruto);
      this.#elementos.campoBuscaFavoritos.value = filtros.busca ?? "";
      this.#elementos.filtroCategoria.value = filtros.categoria ?? "";
      this.#elementos.ordenarFavoritos.value = filtros.ordenar ?? "recente";
    } catch (erro) {
      console.error("Não foi possível ler os filtros salvos.", erro);
    }
  }

  #salvarFiltros() {
    const filtros = {
      busca: this.#elementos.campoBuscaFavoritos.value,
      categoria: this.#elementos.filtroCategoria.value,
      ordenar: this.#elementos.ordenarFavoritos.value,
    };
    localStorage.setItem(CONFIG.CHAVE_FILTROS, JSON.stringify(filtros));
  }

  #registrarEventos() {
    this.#elementos.formFavorito.addEventListener("submit", (evento) => {
      evento.preventDefault();
      this.#tratarSubmissaoFormulario();
    });

    this.#elementos.botaoCancelarEdicao.addEventListener("click", () => {
      this.#sairDoModoEdicao();
    });

    this.#elementos.formFiltros.addEventListener("submit", (evento) => evento.preventDefault());

    ["input", "change"].forEach((evento) => {
      this.#elementos.campoBuscaFavoritos.addEventListener(evento, () => this.#tratarMudancaFiltros());
      this.#elementos.filtroCategoria.addEventListener(evento, () => this.#tratarMudancaFiltros());
      this.#elementos.ordenarFavoritos.addEventListener(evento, () => this.#tratarMudancaFiltros());
    });

    this.#elementos.corpoTabela.addEventListener("click", (evento) => this.#tratarCliqueNaTabela(evento));
  }

  #tratarMudancaFiltros() {
    this.#paginaAtual = 1;
    this.#salvarFiltros();
    this.renderizarTabela();
  }

  // ---------- Fluxo de criação a partir de um conselho da API ----------

  iniciarCriacaoComConselho(advice) {
    if (this.#servico.jaExiste(advice.id)) {
      this.#mensagens.mostrar("erro", "Esse conselho já está nos seus favoritos.");
      return;
    }

    this.#favoritoEmEdicao = null;
    this.#conselhoPendente = advice;

    this.#elementos.legendaForm.textContent = "Salvar conselho como favorito";
    this.#elementos.botaoSalvarFavorito.textContent = "Salvar favorito";
    this.#elementos.botaoCancelarEdicao.hidden = true;
    this.#elementos.campoTextoFavorito.value = advice.text;
    this.#elementos.campoCategoria.value = "";
    this.#elementos.campoNota.value = "";
    this.#elementos.campoNotaPessoal.value = "";
    this.#limparErrosDoFormulario();

    this.#elementos.formFavorito.scrollIntoView({ behavior: "smooth", block: "start" });
    this.#elementos.campoCategoria.focus();
  }

  #iniciarEdicao(favorito) {
    this.#conselhoPendente = null;
    this.#favoritoEmEdicao = favorito.favoriteId;

    this.#elementos.legendaForm.textContent = "Editar favorito";
    this.#elementos.botaoSalvarFavorito.textContent = "Salvar alterações";
    this.#elementos.botaoCancelarEdicao.hidden = false;
    this.#elementos.campoTextoFavorito.value = favorito.text;
    this.#elementos.campoCategoria.value = favorito.category;
    this.#elementos.campoNota.value = String(favorito.rating);
    this.#elementos.campoNotaPessoal.value = favorito.note;
    this.#limparErrosDoFormulario();

    this.#elementos.formFavorito.scrollIntoView({ behavior: "smooth", block: "start" });
    this.#elementos.campoCategoria.focus();
  }

  #sairDoModoEdicao() {
    this.#favoritoEmEdicao = null;
    this.#conselhoPendente = null;
    this.#elementos.legendaForm.textContent = "Salvar conselho como favorito";
    this.#elementos.botaoSalvarFavorito.textContent = "Salvar favorito";
    this.#elementos.botaoCancelarEdicao.hidden = true;
    this.#elementos.formFavorito.reset();
    this.#limparErrosDoFormulario();
  }

  // ---------- Validação e submissão ----------

  #limparErrosDoFormulario() {
    this.#elementos.erroTexto.textContent = "";
    this.#elementos.erroCategoria.textContent = "";
    this.#elementos.erroNota.textContent = "";
    this.#elementos.erroNotaPessoal.textContent = "";
  }

  #validarFormulario({ texto, categoria, nota, notaPessoal }) {
    this.#limparErrosDoFormulario();
    let valido = true;

    if (!texto) {
      this.#elementos.erroTexto.textContent = "Escolha um conselho acima antes de salvar.";
      valido = false;
    }

    if (!categoria) {
      this.#elementos.erroCategoria.textContent = "Selecione uma categoria.";
      valido = false;
    }

    if (!nota) {
      this.#elementos.erroNota.textContent = "Escolha uma nota de 1 a 5.";
      valido = false;
    }

    if (notaPessoal.trim().length < 3) {
      this.#elementos.erroNotaPessoal.textContent = "Escreva ao menos 3 caracteres.";
      valido = false;
    }

    return valido;
  }

  #tratarSubmissaoFormulario() {
    const dados = {
      texto: this.#elementos.campoTextoFavorito.value.trim(),
      categoria: this.#elementos.campoCategoria.value,
      nota: this.#elementos.campoNota.value,
      notaPessoal: this.#elementos.campoNotaPessoal.value,
    };

    if (!this.#validarFormulario(dados)) {
      return;
    }

    try {
      if (this.#favoritoEmEdicao) {
        this.#servico.atualizar(this.#favoritoEmEdicao, {
          category: dados.categoria,
          rating: dados.nota,
          note: dados.notaPessoal,
        });
        this.#mensagens.mostrar("sucesso", "Favorito atualizado com sucesso.");
      } else {
        this.#servico.criar({
          id: this.#conselhoPendente.id,
          text: this.#conselhoPendente.text,
          category: dados.categoria,
          rating: dados.nota,
          note: dados.notaPessoal,
        });
        this.#mensagens.mostrar("sucesso", "Conselho salvo nos seus favoritos.");
      }
    } catch (erro) {
      this.#mensagens.mostrar("erro", erro.message);
      return;
    }

    this.#sairDoModoEdicao();
    this.renderizarTabela();
    this.#aoAlterarFavoritos();
  }

  // ---------- Tabela: busca, filtro, ordenação, paginação ----------

  #obterFavoritosFiltrados() {
    const termo = this.#elementos.campoBuscaFavoritos.value.trim().toLowerCase();
    const categoria = this.#elementos.filtroCategoria.value;
    const ordenacao = this.#elementos.ordenarFavoritos.value;

    let lista = this.#servico.listarTodos();

    if (termo) {
      lista = lista.filter(
        (favorito) =>
          favorito.text.toLowerCase().includes(termo) || favorito.note.toLowerCase().includes(termo)
      );
    }

    if (categoria) {
      lista = lista.filter((favorito) => favorito.category === categoria);
    }

    const comparadores = {
      recente: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      "nota-desc": (a, b) => b.rating - a.rating,
      "nota-asc": (a, b) => a.rating - b.rating,
      categoria: (a, b) => a.category.localeCompare(b.category),
    };
    lista = [...lista].sort(comparadores[ordenacao] ?? comparadores.recente);

    return lista;
  }

  #criarLinhaFavorito(favorito) {
    const linha = document.createElement("tr");

    const celulaTexto = document.createElement("td");
    celulaTexto.textContent = favorito.text;

    const celulaCategoria = document.createElement("td");
    celulaCategoria.textContent = favorito.category;

    const celulaNota = document.createElement("td");
    celulaNota.textContent = `${favorito.rating} / 5`;

    const celulaNotaPessoal = document.createElement("td");
    celulaNotaPessoal.textContent = favorito.note;

    // Células de tabela não recebem "display: flex" diretamente, então o
    // alinhamento dos botões fica num <div> dentro do <td>.
    const celulaAcoes = document.createElement("td");
    const envoltorioAcoes = document.createElement("div");
    envoltorioAcoes.className = "celula-acoes";
    celulaAcoes.appendChild(envoltorioAcoes);

    if (this.#idsConfirmandoExclusao.has(favorito.favoriteId)) {
      const textoConfirmacao = document.createElement("span");
      textoConfirmacao.textContent = "Excluir?";

      const botaoConfirmar = document.createElement("button");
      botaoConfirmar.type = "button";
      botaoConfirmar.className = "botao-perigo";
      botaoConfirmar.textContent = "Confirmar";
      botaoConfirmar.dataset.acao = "confirmar-exclusao";
      botaoConfirmar.dataset.id = favorito.favoriteId;

      const botaoCancelar = document.createElement("button");
      botaoCancelar.type = "button";
      botaoCancelar.className = "botao-secundario";
      botaoCancelar.textContent = "Cancelar";
      botaoCancelar.dataset.acao = "cancelar-exclusao";
      botaoCancelar.dataset.id = favorito.favoriteId;

      envoltorioAcoes.appendChild(textoConfirmacao);
      envoltorioAcoes.appendChild(botaoConfirmar);
      envoltorioAcoes.appendChild(botaoCancelar);
    } else {
      const botaoEditar = document.createElement("button");
      botaoEditar.type = "button";
      botaoEditar.className = "botao-secundario";
      botaoEditar.textContent = "Editar";
      botaoEditar.dataset.acao = "editar";
      botaoEditar.dataset.id = favorito.favoriteId;

      const botaoExcluir = document.createElement("button");
      botaoExcluir.type = "button";
      botaoExcluir.className = "botao-perigo";
      botaoExcluir.textContent = "Excluir";
      botaoExcluir.dataset.acao = "pedir-exclusao";
      botaoExcluir.dataset.id = favorito.favoriteId;

      envoltorioAcoes.appendChild(botaoEditar);
      envoltorioAcoes.appendChild(botaoExcluir);
    }

    linha.appendChild(celulaTexto);
    linha.appendChild(celulaCategoria);
    linha.appendChild(celulaNota);
    linha.appendChild(celulaNotaPessoal);
    linha.appendChild(celulaAcoes);
    return linha;
  }

  #tratarCliqueNaTabela(evento) {
    const botao = evento.target.closest("button");
    if (!botao) {
      return;
    }

    const { acao, id } = botao.dataset;
    const favorito = this.#servico.listarTodos().find((item) => item.favoriteId === id);

    if (acao === "editar" && favorito) {
      this.#iniciarEdicao(favorito);
    } else if (acao === "pedir-exclusao") {
      this.#idsConfirmandoExclusao.add(id);
      this.renderizarTabela();
    } else if (acao === "cancelar-exclusao") {
      this.#idsConfirmandoExclusao.delete(id);
      this.renderizarTabela();
    } else if (acao === "confirmar-exclusao") {
      this.#servico.excluir(id);
      this.#idsConfirmandoExclusao.delete(id);
      if (this.#favoritoEmEdicao === id) {
        this.#sairDoModoEdicao();
      }
      this.#mensagens.mostrar("sucesso", "Favorito excluído.");
      this.renderizarTabela();
      this.#aoAlterarFavoritos();
    }
  }

  #renderizarPaginacao(totalPaginas) {
    this.#elementos.paginacao.innerHTML = "";
    if (totalPaginas <= 1) {
      return;
    }

    const botaoAnterior = document.createElement("button");
    botaoAnterior.type = "button";
    botaoAnterior.textContent = "Anterior";
    botaoAnterior.disabled = this.#paginaAtual === 1;
    botaoAnterior.addEventListener("click", () => {
      this.#paginaAtual -= 1;
      this.renderizarTabela();
    });

    const indicador = document.createElement("span");
    indicador.textContent = `Página ${this.#paginaAtual} de ${totalPaginas}`;

    const botaoProxima = document.createElement("button");
    botaoProxima.type = "button";
    botaoProxima.textContent = "Próxima";
    botaoProxima.disabled = this.#paginaAtual === totalPaginas;
    botaoProxima.addEventListener("click", () => {
      this.#paginaAtual += 1;
      this.renderizarTabela();
    });

    this.#elementos.paginacao.appendChild(botaoAnterior);
    this.#elementos.paginacao.appendChild(indicador);
    this.#elementos.paginacao.appendChild(botaoProxima);
  }

  renderizarTabela() {
    const listaFiltrada = this.#obterFavoritosFiltrados();
    const totalPaginas = Math.max(1, Math.ceil(listaFiltrada.length / CONFIG.ITENS_POR_PAGINA));
    this.#paginaAtual = Math.min(this.#paginaAtual, totalPaginas);

    const inicio = (this.#paginaAtual - 1) * CONFIG.ITENS_POR_PAGINA;
    const paginaDeFavoritos = listaFiltrada.slice(inicio, inicio + CONFIG.ITENS_POR_PAGINA);

    this.#elementos.corpoTabela.innerHTML = "";

    if (paginaDeFavoritos.length === 0) {
      const linhaVazia = document.createElement("tr");
      linhaVazia.className = "linha-vazia";
      const celula = document.createElement("td");
      celula.colSpan = 5;
      celula.textContent = "Nenhum favorito encontrado.";
      linhaVazia.appendChild(celula);
      this.#elementos.corpoTabela.appendChild(linhaVazia);
    } else {
      paginaDeFavoritos.forEach((favorito) => {
        this.#elementos.corpoTabela.appendChild(this.#criarLinhaFavorito(favorito));
      });
    }

    this.#renderizarPaginacao(totalPaginas);
  }
}
