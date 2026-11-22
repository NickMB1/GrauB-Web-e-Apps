// Nicolas Minato Bellver e João Luca Benicio — Jogos Digitais, 2º semestre — 2026
//
// Ponto de entrada: instancia api/serviços/views, faz a carga inicial em
// paralelo com Promise.all e liga os eventos da tela.

document.addEventListener("DOMContentLoaded", () => {
  const api = new AdviceApi(CONFIG.API_BASE_URL);
  const adviceService = new AdviceService(api);
  const favoritesService = new FavoritesService(CONFIG.CHAVE_FAVORITOS);
  const mensagens = new MensagemFlutuante(document.getElementById("area-mensagens"));

  const dashboardView = new DashboardView({
    containerIndicadores: document.getElementById("cartoes-indicadores"),
    graficoNotas: document.getElementById("grafico-notas"),
    graficoCategorias: document.getElementById("grafico-categorias"),
  });

  const textoConselhoDoDia = document.getElementById("texto-conselho-do-dia");

  const feedView = new FeedView({
    textoConselhoDoDia,
    listaSugestoes: document.getElementById("lista-sugestoes"),
    statusBusca: document.getElementById("status-busca-api"),
    aoSalvarFavorito: (advice) => favoritesView.iniciarCriacaoComConselho(advice),
  });

  const favoritesView = new FavoritesView({
    servico: favoritesService,
    mensagens,
    aoAlterarFavoritos: () => dashboardView.renderizar(favoritesService.calcularEstatisticas()),
    elementos: {
      formFavorito: document.getElementById("form-favorito"),
      legendaForm: document.getElementById("legenda-form-favorito"),
      campoTextoFavorito: document.getElementById("campo-texto-favorito"),
      campoCategoria: document.getElementById("campo-categoria"),
      campoNota: document.getElementById("campo-nota"),
      campoNotaPessoal: document.getElementById("campo-nota-pessoal"),
      botaoSalvarFavorito: document.getElementById("botao-salvar-favorito"),
      botaoCancelarEdicao: document.getElementById("botao-cancelar-edicao"),
      erroTexto: document.getElementById("erro-texto-favorito"),
      erroCategoria: document.getElementById("erro-categoria"),
      erroNota: document.getElementById("erro-nota"),
      erroNotaPessoal: document.getElementById("erro-nota-pessoal"),
      formFiltros: document.getElementById("form-filtros-favoritos"),
      campoBuscaFavoritos: document.getElementById("campo-busca-favoritos"),
      filtroCategoria: document.getElementById("filtro-categoria"),
      ordenarFavoritos: document.getElementById("ordenar-favoritos"),
      corpoTabela: document.getElementById("corpo-tabela-favoritos"),
      paginacao: document.getElementById("paginacao-favoritos"),
    },
  });

  dashboardView.renderizar(favoritesService.calcularEstatisticas());

  // ---------- Conselho do dia ----------

  const botaoNovoConselho = document.getElementById("botao-novo-conselho");
  const botaoSalvarConselhoDoDia = document.getElementById("botao-salvar-conselho-do-dia");
  let conselhoDoDiaAtual = null;

  async function carregarNovoConselhoDoDia() {
    botaoNovoConselho.disabled = true;
    feedView.mostrarCarregandoConselhoDoDia();
    try {
      conselhoDoDiaAtual = await adviceService.obterConselhoAleatorio();
      feedView.mostrarConselhoDoDia(conselhoDoDiaAtual);
    } catch (erro) {
      conselhoDoDiaAtual = null;
      feedView.mostrarErroConselhoDoDia(erro.message);
      mensagens.mostrar("erro", erro.message);
    } finally {
      botaoNovoConselho.disabled = false;
    }
  }

  botaoNovoConselho.addEventListener("click", carregarNovoConselhoDoDia);

  botaoSalvarConselhoDoDia.addEventListener("click", () => {
    if (!conselhoDoDiaAtual) {
      mensagens.mostrar("erro", "Espere o conselho do dia carregar antes de salvar.");
      return;
    }
    favoritesView.iniciarCriacaoComConselho(conselhoDoDiaAtual);
  });

  // ---------- Sugestões (Promise.all) ----------

  async function carregarSugestoes() {
    feedView.mostrarCarregandoSugestoes();
    try {
      const sugestoes = await adviceService.obterSugestoes(CONFIG.QUANTIDADE_SUGESTOES);
      feedView.renderizarSugestoes(sugestoes);
    } catch (erro) {
      feedView.mostrarErroSugestoes(erro.message);
      mensagens.mostrar("erro", erro.message);
    }
  }

  // ---------- Busca na API ----------

  const formBuscaApi = document.getElementById("form-busca-api");
  const botaoBuscaApi = document.getElementById("botao-busca-api");
  const campoBuscaApi = document.getElementById("campo-busca-api");

  formBuscaApi.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const termo = campoBuscaApi.value.trim();
    if (termo.length < 2) {
      return;
    }

    botaoBuscaApi.disabled = true;
    feedView.mostrarCarregandoBusca();
    try {
      const resultados = await adviceService.pesquisar(termo);
      feedView.renderizarResultadosBusca(resultados, termo);
    } catch (erro) {
      feedView.mostrarErroBusca(erro.message);
      mensagens.mostrar("erro", erro.message);
    } finally {
      botaoBuscaApi.disabled = false;
    }
  });

  // ---------- Carga inicial em paralelo ----------

  Promise.all([carregarNovoConselhoDoDia(), carregarSugestoes()]);
});
