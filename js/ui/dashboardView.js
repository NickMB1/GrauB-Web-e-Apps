// Nicolas Minato Bellver e João Luca Benicio — Jogos Digitais, 2º semestre — 2026
//
// Desenha os cartões de indicadores e as barras de distribuição (HTML/CSS)
// a partir das estatísticas calculadas pelo FavoritesService.

class DashboardView {
  #containerIndicadores;
  #graficoNotas;
  #graficoCategorias;

  constructor({ containerIndicadores, graficoNotas, graficoCategorias }) {
    this.#containerIndicadores = containerIndicadores;
    this.#graficoNotas = graficoNotas;
    this.#graficoCategorias = graficoCategorias;
  }

  #criarCartaoIndicador(rotulo, valor) {
    const cartao = document.createElement("article");
    cartao.className = "cartao cartao-indicador";

    const numero = document.createElement("p");
    numero.className = "numero";
    numero.textContent = valor;

    const texto = document.createElement("p");
    texto.className = "rotulo";
    texto.textContent = rotulo;

    cartao.appendChild(numero);
    cartao.appendChild(texto);
    return cartao;
  }

  #criarLinhaBarra(rotulo, quantidade, total) {
    const porcentagem = total > 0 ? Math.round((quantidade / total) * 100) : 0;

    const linha = document.createElement("div");
    linha.className = "linha-barra";

    const textoRotulo = document.createElement("div");
    textoRotulo.className = "rotulo-barra";

    const nome = document.createElement("span");
    nome.textContent = rotulo;

    const valor = document.createElement("span");
    valor.textContent = `${quantidade} (${porcentagem}%)`;

    textoRotulo.appendChild(nome);
    textoRotulo.appendChild(valor);

    const trilha = document.createElement("div");
    trilha.className = "trilha-barra";

    const preenchimento = document.createElement("div");
    preenchimento.className = "preenchimento-barra";
    preenchimento.style.width = `${porcentagem}%`;

    trilha.appendChild(preenchimento);
    linha.appendChild(textoRotulo);
    linha.appendChild(trilha);
    return linha;
  }

  renderizar(estatisticas) {
    this.#containerIndicadores.innerHTML = "";
    this.#containerIndicadores.appendChild(
      this.#criarCartaoIndicador("Total de favoritos", estatisticas.total)
    );
    this.#containerIndicadores.appendChild(
      this.#criarCartaoIndicador("Nota média", estatisticas.media.toFixed(1))
    );
    this.#containerIndicadores.appendChild(
      this.#criarCartaoIndicador("Categoria mais frequente", estatisticas.categoriaMaisFrequente)
    );

    this.#graficoNotas.innerHTML = "";
    estatisticas.distribuicaoNotas.forEach((item) => {
      this.#graficoNotas.appendChild(
        this.#criarLinhaBarra(`${item.nota} estrela(s)`, item.quantidade, estatisticas.total)
      );
    });

    this.#graficoCategorias.innerHTML = "";
    if (estatisticas.distribuicaoCategorias.length === 0) {
      const vazio = document.createElement("p");
      vazio.className = "texto-status";
      vazio.textContent = "Salve favoritos para ver a distribuição por categoria.";
      this.#graficoCategorias.appendChild(vazio);
    } else {
      estatisticas.distribuicaoCategorias.forEach((item) => {
        this.#graficoCategorias.appendChild(
          this.#criarLinhaBarra(item.categoria, item.quantidade, estatisticas.total)
        );
      });
    }
  }
}
