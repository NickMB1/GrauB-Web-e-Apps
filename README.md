# ConselhoDash — Painel de Conselhos

Trabalho Final da disciplina de Desenvolvimento Web (Grau B) — dashboard web responsivo em HTML, CSS
e JavaScript puro (Vanilla), sem frameworks nem bibliotecas.

## Tema e opção escolhida

**Opção B (API só de leitura).** O tema é "conselhos do dia": o painel consome a Advice Slip API para
mostrar um conselho aleatório e permitir buscas por palavra-chave. Como essa API só tem endpoints de
leitura (GET), o CRUD completo acontece sobre uma coleção própria do usuário — **Meus Favoritos** —
guardada no `localStorage`. O usuário salva os conselhos que gosta, dando uma categoria e uma nota de
1 a 5, e pode criar, listar/filtrar, editar e excluir esses favoritos livremente.

As 4 operações do CRUD (sobre a coleção de favoritos):

1. **Criar** — a partir de um conselho mostrado na tela (conselho do dia, sugestões ou resultado de
   busca), o usuário clica em "Salvar como favorito" e preenche categoria, nota e uma nota pessoal.
2. **Ler** — a seção "Meus Favoritos" lista os itens salvos, com busca por texto e filtro por
   categoria, além de ordenação (mais recentes, maior/menor nota, categoria) e paginação.
3. **Atualizar** — o botão "Editar" de cada linha da tabela abre o mesmo formulário em modo edição,
   com um botão para cancelar.
4. **Excluir** — o botão "Excluir" pede confirmação (vira "Confirmar/Cancelar" na própria linha) antes
   de remover o favorito.

## API usada

[Advice Slip API](https://api.adviceslip.com/) — pública, sem necessidade de chave de acesso, CORS
liberado (`Access-Control-Allow-Origin: *`). Endpoints consumidos:

- `GET /advice` — conselho aleatório.
- `GET /advice/search/{termo}` — busca de conselhos por palavra-chave.

## Como rodar o projeto

1. Baixe/extraia a pasta do projeto.
2. Abra o arquivo `index.html` diretamente no navegador (duplo clique) **ou** sirva a pasta com a
   extensão Live Server do VS Code.
3. Não é necessário instalar nada: não há `node_modules`, build step ou dependências.
4. É preciso estar conectado à internet, já que o painel consome a Advice Slip API em tempo real.

## Estrutura do código

```
index.html
css/style.css          -> CSS mobile-first com 2 media queries (600px e 992px)
js/config.js           -> URL da API, chaves de localStorage, categorias e constantes
js/api/ApiError.js     -> erro próprio (extends Error)
js/api/AdviceApi.js    -> único lugar com fetch() (async/await, try/catch, resposta.ok, Promise.all)
js/modelo/Advice.js          -> classe de modelo (atributos #privados, get/set)
js/modelo/FavoriteAdvice.js  -> herança (extends Advice) + toJSON()
js/servicos/AdviceService.js    -> transforma o JSON da API em objetos do modelo
js/servicos/FavoritesService.js -> CRUD dos favoritos no localStorage + estatísticas do painel
js/ui/mensagens.js       -> mensagens de sucesso/erro na tela
js/ui/dashboardView.js   -> cartões indicadores e barras de distribuição (HTML/CSS)
js/ui/feedView.js        -> conselho do dia, sugestões e resultados de busca na API
js/ui/favoritesView.js   -> formulário de favorito (criar/editar/validar) e tabela (buscar/filtrar/
                            ordenar/paginar/excluir)
js/app.js                -> liga tudo e inicia a aplicação
```

## Quem fez o quê

- **Nicolas Minato Bellver** — [preencher com a divisão real de tarefas do grupo antes de entregar]
- **João Luca Benicio** — [preencher com a divisão real de tarefas do grupo antes de entregar]

## Recursos usados fora do conteúdo das aulas

- `fetch(url, { cache: "no-store" })`: o segundo parâmetro de `fetch` evita que o navegador reaproveite
  do cache HTTP duas chamadas quase simultâneas ao mesmo endpoint de conselho aleatório (o que faria o
  "conselho aleatório" repetir sempre o mesmo resultado ao usar `Promise.all`). Sem isso, as sugestões
  do dia podiam vir todas iguais.

## Curso

Jogos Digitais — 2º semestre — 2026.
