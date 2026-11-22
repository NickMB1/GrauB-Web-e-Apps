// Nicolas Minato Bellver e João Luca Benicio — Jogos Digitais, 2º semestre — 2026
//
// CRUD completo da coleção do usuário (favoritos), persistida em
// localStorage via JSON.stringify/JSON.parse, já que a API de conselhos
// só permite leitura.

class FavoritesService {
  #chave;
  #favoritos;

  constructor(chave) {
    this.#chave = chave;
    this.#favoritos = this.#carregar();
  }

  #carregar() {
    const bruto = localStorage.getItem(this.#chave);
    if (!bruto) {
      return [];
    }
    try {
      const lista = JSON.parse(bruto);
      return lista.map((item) => FavoriteAdvice.fromJSON(item));
    } catch (erro) {
      console.error("Não foi possível ler os favoritos salvos no localStorage.", erro);
      return [];
    }
  }

  #salvar() {
    const lista = this.#favoritos.map((favorito) => favorito.toJSON());
    localStorage.setItem(this.#chave, JSON.stringify(lista));
  }

  listarTodos() {
    return [...this.#favoritos];
  }

  jaExiste(id) {
    return this.#favoritos.some((favorito) => favorito.id === id);
  }

  criar({ id, text, category, rating, note }) {
    const favoriteId = `fav-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const favorito = new FavoriteAdvice({ favoriteId, id, text, category, rating, note });
    this.#favoritos.push(favorito);
    this.#salvar();
    return favorito;
  }

  atualizar(favoriteId, { category, rating, note }) {
    const favorito = this.#favoritos.find((item) => item.favoriteId === favoriteId);
    if (!favorito) {
      throw new Error("Favorito não encontrado.");
    }
    favorito.category = category;
    favorito.rating = rating;
    favorito.note = note;
    this.#salvar();
    return favorito;
  }

  excluir(favoriteId) {
    const tamanhoAnterior = this.#favoritos.length;
    this.#favoritos = this.#favoritos.filter((item) => item.favoriteId !== favoriteId);
    this.#salvar();
    return this.#favoritos.length < tamanhoAnterior;
  }

  calcularEstatisticas() {
    const favoritos = this.#favoritos;
    const total = favoritos.length;
    const somaNotas = favoritos.reduce((soma, item) => soma + item.rating, 0);
    const media = total > 0 ? somaNotas / total : 0;

    const contagemCategorias = favoritos.reduce((acumulado, item) => {
      acumulado[item.category] = (acumulado[item.category] ?? 0) + 1;
      return acumulado;
    }, {});

    const categoriasOrdenadas = Object.entries(contagemCategorias).sort((a, b) => b[1] - a[1]);
    const categoriaMaisFrequente = categoriasOrdenadas.length > 0 ? categoriasOrdenadas[0][0] : "—";

    const distribuicaoNotas = [1, 2, 3, 4, 5].map((nota) => ({
      nota,
      quantidade: favoritos.filter((item) => item.rating === nota).length,
    }));

    const distribuicaoCategorias = CONFIG.CATEGORIAS.map((categoria) => ({
      categoria,
      quantidade: contagemCategorias[categoria] ?? 0,
    })).filter((item) => item.quantidade > 0);

    return {
      total,
      media,
      categoriaMaisFrequente,
      distribuicaoNotas,
      distribuicaoCategorias,
    };
  }
}
