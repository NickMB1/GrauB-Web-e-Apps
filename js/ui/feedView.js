// Nicolas Minato Bellver e João Luca Benicio — Jogos Digitais, 2º semestre — 2026
//
// Mostra o conselho do dia, as sugestões aleatórias e os resultados da
// busca na API. Nunca usa innerHTML com texto vindo da API.

class FeedView {
  #textoConselhoDoDia;
  #listaSugestoes;
  #statusBusca;
  #aoSalvarFavorito;

  constructor({ textoConselhoDoDia, listaSugestoes, statusBusca, aoSalvarFavorito }) {
    this.#textoConselhoDoDia = textoConselhoDoDia;
    this.#listaSugestoes = listaSugestoes;
    this.#statusBusca = statusBusca;
    this.#aoSalvarFavorito = aoSalvarFavorito;
  }

  mostrarCarregandoConselhoDoDia() {
    this.#textoConselhoDoDia.textContent = "Carregando…";
  }

  mostrarConselhoDoDia(advice) {
    this.#textoConselhoDoDia.textContent = advice.text;
  }

  mostrarErroConselhoDoDia(mensagem) {
    this.#textoConselhoDoDia.textContent = mensagem;
  }

  #criarCartaoConselho(advice) {
    const cartao = document.createElement("article");
    cartao.className = "cartao";

    const texto = document.createElement("p");
    texto.textContent = advice.text;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "Salvar como favorito";
    botao.addEventListener("click", () => this.#aoSalvarFavorito(advice));

    cartao.appendChild(texto);
    cartao.appendChild(botao);
    return cartao;
  }

  mostrarCarregandoSugestoes() {
    this.#listaSugestoes.innerHTML = "";
    const aviso = document.createElement("p");
    aviso.className = "texto-status";
    aviso.textContent = "Carregando sugestões…";
    this.#listaSugestoes.appendChild(aviso);
  }

  mostrarErroSugestoes(mensagem) {
    this.#listaSugestoes.innerHTML = "";
    const aviso = document.createElement("p");
    aviso.className = "texto-status";
    aviso.textContent = mensagem;
    this.#listaSugestoes.appendChild(aviso);
  }

  renderizarSugestoes(lista) {
    this.#listaSugestoes.innerHTML = "";
    lista.forEach((advice) => {
      this.#listaSugestoes.appendChild(this.#criarCartaoConselho(advice));
    });
  }

  mostrarCarregandoBusca() {
    this.#statusBusca.textContent = "Buscando na API…";
  }

  renderizarResultadosBusca(lista, termo) {
    this.#listaSugestoes.innerHTML = "";

    if (lista.length === 0) {
      this.#statusBusca.textContent = `Nenhum conselho encontrado para "${termo}".`;
      return;
    }

    this.#statusBusca.textContent = `${lista.length} conselho(s) encontrado(s) para "${termo}".`;
    lista.forEach((advice) => {
      this.#listaSugestoes.appendChild(this.#criarCartaoConselho(advice));
    });
  }

  mostrarErroBusca(mensagem) {
    this.#statusBusca.textContent = mensagem;
  }
}
