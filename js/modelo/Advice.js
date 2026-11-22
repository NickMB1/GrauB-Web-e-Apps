// Nicolas Minato Bellver e João Luca Benicio — Jogos Digitais, 2º semestre — 2026

class Advice {
  #id;
  #text;

  constructor(id, text) {
    this.id = id;
    this.text = text;
  }

  get id() {
    return this.#id;
  }

  set id(valor) {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 0) {
      throw new Error("Id do conselho inválido.");
    }
    this.#id = numero;
  }

  get text() {
    return this.#text;
  }

  set text(valor) {
    if (typeof valor !== "string" || valor.trim().length === 0) {
      throw new Error("O texto do conselho não pode ser vazio.");
    }
    this.#text = valor.trim();
  }

  toJSON() {
    return { id: this.#id, text: this.#text };
  }
}
