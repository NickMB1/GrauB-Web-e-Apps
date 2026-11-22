// Nicolas Minato Bellver e João Luca Benicio — Jogos Digitais, 2º semestre — 2026

class ApiError extends Error {
  #status;

  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.#status = status;
  }

  get status() {
    return this.#status;
  }
}
