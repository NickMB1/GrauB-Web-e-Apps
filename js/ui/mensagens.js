// Nicolas Minato Bellver e João Luca Benicio — Jogos Digitais, 2º semestre — 2026

class MensagemFlutuante {
  #container;
  #temporizador;

  constructor(container) {
    this.#container = container;
    this.#temporizador = null;
  }

  mostrar(tipo, texto) {
    this.#container.innerHTML = "";

    const paragrafo = document.createElement("p");
    paragrafo.className = `mensagem mensagem--${tipo}`;
    paragrafo.textContent = texto;
    this.#container.appendChild(paragrafo);

    if (this.#temporizador) {
      window.clearTimeout(this.#temporizador);
    }
    this.#temporizador = window.setTimeout(() => {
      this.#container.innerHTML = "";
    }, 4500);
  }
}
