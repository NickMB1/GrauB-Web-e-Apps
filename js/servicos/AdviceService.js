// Nicolas Minato Bellver e João Luca Benicio — Jogos Digitais, 2º semestre — 2026
//
// Traduz o JSON cru da API em instâncias de Advice. A interface nunca
// recebe o objeto "cru" da API, sempre um objeto do modelo.

class AdviceService {
  #api;

  constructor(api) {
    this.#api = api;
  }

  async obterConselhoAleatorio() {
    const dados = await this.#api.buscarConselhoAleatorio();
    return new Advice(dados.id, dados.advice);
  }

  async obterSugestoes(quantidade) {
    const lista = await this.#api.buscarVariosConselhosAleatorios(quantidade);
    return lista.map((dados) => new Advice(dados.id, dados.advice));
  }

  async pesquisar(termo) {
    const lista = await this.#api.buscarConselhosPorTermo(termo);
    return lista.map((dados) => new Advice(dados.id, dados.advice));
  }
}
