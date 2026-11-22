// Nicolas Minato Bellver e João Luca Benicio — Jogos Digitais, 2º semestre — 2026
//
// Único lugar da aplicação que chama fetch(). A interface e os serviços
// nunca conversam direto com a API: tudo passa por aqui.

class AdviceApi {
  #baseUrl;

  constructor(baseUrl) {
    this.#baseUrl = baseUrl;
  }

  async #requisitar(caminho) {
    let resposta;

    try {
      // "no-store" evita que o navegador reaproveite do cache HTTP duas
      // chamadas a /advice feitas quase ao mesmo tempo (Promise.all), o que
      // faria "conselhos aleatórios" repetirem sempre o mesmo resultado.
      resposta = await fetch(`${this.#baseUrl}${caminho}`, { cache: "no-store" });
    } catch (erroDeRede) {
      throw new ApiError(
        "Não foi possível conectar à API de conselhos. Verifique sua internet e tente novamente.",
        0
      );
    }

    if (!resposta.ok) {
      throw new ApiError(
        `A API de conselhos respondeu com erro (status ${resposta.status}).`,
        resposta.status
      );
    }

    try {
      return await resposta.json();
    } catch (erroDeFormato) {
      throw new ApiError("A API respondeu num formato inesperado.", resposta.status);
    }
  }

  async buscarConselhoAleatorio() {
    const dados = await this.#requisitar("/advice");
    return dados.slip;
  }

  // Dispara várias buscas de conselho aleatório em paralelo com Promise.all,
  // usado para montar as "Sugestões do dia" ao abrir a página.
  async buscarVariosConselhosAleatorios(quantidade) {
    const pedidos = [];
    for (let i = 0; i < quantidade; i += 1) {
      pedidos.push(this.buscarConselhoAleatorio());
    }
    return Promise.all(pedidos);
  }

  async buscarConselhosPorTermo(termo) {
    const dados = await this.#requisitar(`/advice/search/${encodeURIComponent(termo)}`);
    if (!dados.slips) {
      return [];
    }
    return dados.slips;
  }
}
