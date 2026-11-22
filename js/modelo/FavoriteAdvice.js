// Nicolas Minato Bellver e João Luca Benicio — Jogos Digitais, 2º semestre — 2026

class FavoriteAdvice extends Advice {
  #favoriteId;
  #category;
  #rating;
  #note;
  #createdAt;

  constructor({ favoriteId, id, text, category, rating, note, createdAt }) {
    super(id, text);
    this.favoriteId = favoriteId;
    this.category = category;
    this.rating = rating;
    this.note = note;
    this.createdAt = createdAt ?? new Date().toISOString();
  }

  get favoriteId() {
    return this.#favoriteId;
  }

  set favoriteId(valor) {
    if (!valor) {
      throw new Error("Favorito precisa de um identificador.");
    }
    this.#favoriteId = valor;
  }

  get category() {
    return this.#category;
  }

  set category(valor) {
    if (!CONFIG.CATEGORIAS.includes(valor)) {
      throw new Error("Selecione uma categoria válida.");
    }
    this.#category = valor;
  }

  get rating() {
    return this.#rating;
  }

  set rating(valor) {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 1 || numero > 5) {
      throw new Error("A nota deve ser um número inteiro entre 1 e 5.");
    }
    this.#rating = numero;
  }

  get note() {
    return this.#note;
  }

  set note(valor) {
    if (typeof valor !== "string" || valor.trim().length < 3) {
      throw new Error("Escreva ao menos 3 caracteres contando por que esse conselho importa.");
    }
    this.#note = valor.trim();
  }

  get createdAt() {
    return this.#createdAt;
  }

  set createdAt(valor) {
    this.#createdAt = valor;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      favoriteId: this.#favoriteId,
      category: this.#category,
      rating: this.#rating,
      note: this.#note,
      createdAt: this.#createdAt,
    };
  }

  static fromJSON(dados) {
    return new FavoriteAdvice({
      favoriteId: dados.favoriteId,
      id: dados.id,
      text: dados.text,
      category: dados.category,
      rating: dados.rating,
      note: dados.note,
      createdAt: dados.createdAt,
    });
  }
}
