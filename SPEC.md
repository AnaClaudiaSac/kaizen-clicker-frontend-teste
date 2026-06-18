# Especificação Técnica — Kaizen Clicker

> Documento de planejamento técnico, elaborado antes da implementação.
> Baseado no desafio: `desafio-tecnico-junior-ana-claudia-kaizen-clicker-frontend.pdf`

## 0. Resumo do desafio

- Mini-game web no estilo idle/clicker, com tema de otimização de fábrica. A aplicação deve ter loop de jogo ativo, interatividade e sensação clara de progressão — não pode se comportar como uma tela estática.
- Prazo de entrega: **18/06/2026, 17h00 (BRT)**.
- **Critério eliminatório**: ausência de testes resulta em desclassificação. Cobertura de testes abaixo de 80% (statements/lines) resulta em desclassificação.
- **Critério eliminatório**: o arquivo `IA_LOG.md` deve ser escrito manualmente pela candidata. Conteúdo gerado pela IA nesse arquivo resulta em desclassificação.
- Itens proibidos: `any`, `as any`, `// @ts-ignore`, `// @ts-nocheck`, Redux clássico, componentes React com mais de 200 linhas, commits diretos na branch `main`.
- Itens obrigatórios: React 18+ com Vite, TypeScript com `strict: true`, Vitest para testes.
- Regras de integridade: uso de IA é permitido e documentado em `IA_LOG.md`; consulta a Stack Overflow, documentação oficial e artigos é permitida; **não é permitido** solicitar ajuda de outras pessoas, nem copiar um template pronto de jogo clicker. Este projeto é construído do zero, sem uso de boilerplate de clicker game pré-existente.

### Estado inicial da fábrica

| Indicador | Valor inicial |
|---|---|
| Produção | 1 peça/segundo |
| Taxa de defeito | 30% |
| OEE | 40% |

## 1. Arquitetura geral

A aplicação é dividida em duas camadas:

```
engine/   → lógica pura (TypeScript puro, sem dependência de React ou DOM). Concentra as regras do jogo.
ui/       → componentes React responsáveis por exibir o estado.
store/    → camada intermediária: mantém o estado global e expõe as ações disponíveis.
```

**Justificativa**: por ser composta apenas por funções que recebem dados e retornam dados, a camada `engine/` é simples de testar de forma isolada, sendo a principal fonte da cobertura de testes exigida (80%).

### Gerenciamento de estado: Zustand

Zustand é uma biblioteca de gerenciamento de estado leve, mantida fora da árvore de componentes React. Justificativa de uso:
- O loop do jogo (executado a cada tick) atualiza a store diretamente, sem depender do ciclo de renderização do React.
- Cada componente consome apenas o trecho de estado necessário, evitando re-renderizações desnecessárias a cada tick.
- É uma das opções permitidas pelo desafio (a restrição se aplica somente ao Redux clássico).

## 1.1 Boas práticas de código

- **Componentes pequenos, com responsabilidade única.** O limite estabelecido pelo desafio é 200 linhas; a meta interna deste projeto é mais conservadora (entre 30 e 80 linhas por componente, como referência). Componentes que acumulam múltiplas responsabilidades (busca de dado, cálculo e renderização) devem ser decompostos (ex.: `UpgradesList` organiza a lista; `UpgradeCard` trata um único item).
- **Lógica de negócio fora dos componentes.** Cálculos e regras residem em `engine/` (funções puras) ou em hooks customizados (`useGameLoop`, etc.); o componente é responsável apenas por consumir estado e renderizar JSX.
- **Nomenclatura de código em inglês**, seguindo convenção predominante da indústria; comentários e mensagens de commit em português.
- **Ausência de números mágicos**: valores como `1.5` (multiplicador de custo), `5` (máximo de compras) e `1000` (duração do tick em ms) são nomeados em `engine/constants.ts`.
- **Tipagem explícita** em props de componente, retorno de função e estado — sem uso de `any`/`as any`.
- **Ausência de duplicação**: lógica repetida em mais de um local é extraída para função ou hook compartilhado.
- **Comentários reservados para justificar decisões não óbvias** (ex.: motivo de uso de timestamp em vez de contagem de disparos do `setInterval`) — sem comentários descritivos do que o código já expressa por nomenclatura.
- **JSDoc de forma seletiva**: aplicado apenas às funções centrais de `engine/` que materializam uma regra de negócio do desafio (ex.: `advanceTicks`, `upsertRankingEntry`, `getUpgradeCost`), descrevendo a regra/motivação por trás da função — não os tipos de parâmetro e retorno, já garantidos pelo TypeScript em modo `strict`. Não é aplicado a componentes simples nem a funções triviais, para evitar documentação redundante.

## 2. Estrutura de pastas

```
src/
  engine/
    types.ts              // tipos do estado do jogo
    constants.ts           // estado inicial + tabela de melhorias
    upgrades.ts             // custo geométrico + cálculo de efeitos acumulados
    tick.ts                  // avanço de produção por delta de tempo
    ranking.ts               // regras do ranking (unicidade de nome, atualização por score maior)
    persistence.ts            // leitura/escrita em localStorage (ranking e save do jogo)
    __tests__/
      upgrades.test.ts
      tick.test.ts
      ranking.test.ts
      persistence.test.ts

  store/
    useGameStore.ts          // store Zustand: estado + ações (comprarMelhoria, etc.)
    useGameLoop.ts            // hook responsável pelo tick e pela integração com a engine

  components/
    FactoryView/
      FactoryView.tsx         // contador de pontos + área de animação da peça
      PieceAnimation.tsx        // animação de produção de peça
    UpgradesList/
      UpgradesList.tsx
      UpgradeCard.tsx           // item individual de melhoria: nome, custo, botão de compra
    Dashboard/
      Dashboard.tsx
      ProductionChart.tsx        // gráfico de linha: produção acumulada
      DefectsChart.tsx            // gráfico de barra: defeitos por minuto
      OeeGauge.tsx                  // gauge: OEE
    Ranking/
      RankingScreen.tsx
      SaveScoreForm.tsx

  App.tsx
  main.tsx
```

Cada arquivo de componente permanece abaixo do limite de 200 linhas estabelecido pelo desafio, por meio da decomposição em unidades menores (ex.: `UpgradeCard` separado de `UpgradesList`).

## 3. Modelo de dados (TypeScript)

```ts
// engine/types.ts

export type UpgradeId = '5s' | 'kanban' | 'pokaYoke' | 'tpm' | 'andon' | 'heijunka'

export interface UpgradeDefinition {
  id: UpgradeId
  name: string
  baseCost: number
  maxPurchases: number // sempre 5
  description: string
}

export interface FactoryStats {
  productionRate: number  // peças/segundo, já com bônus de velocidade aplicados
  defectRate: number       // 0 a 1
  oee: number                // 0 a 1
}

export interface GameState {
  points: number                          // pontos Kaizen disponíveis
  totalProduced: number                     // peças boas acumuladas (histórico, não decresce)
  totalDefects: number                       // peças defeituosas acumuladas
  purchases: Record<UpgradeId, number>        // quantidade de compras por melhoria (0-5)
  lastTickTimestamp: number                    // epoch ms da última atualização — base das Regras 1 e 2
  history: { timestamp: number; produced: number; defects: number; oee: number }[]
  // ↑ utilizado para alimentar os gráficos do dashboard
}

export interface RankingEntry {
  name: string
  score: number
  savedAt: number // epoch ms
}
```

## 4. Custo geométrico das melhorias

### Custo base por melhoria

| Melhoria | Custo base |
|---|---|
| 5S | 50 pts |
| Kanban | 200 pts |
| Poka-Yoke | 500 pts |
| TPM | 1.500 pts |
| Andon | 4.000 pts |
| Heijunka | 10.000 pts |

### Fórmula de crescimento geométrico

```ts
// engine/upgrades.ts
export function getUpgradeCost(baseCost: number, purchasesSoFar: number): number {
  return Math.round(baseCost * Math.pow(1.5, purchasesSoFar))
}
```

Exemplo (5S, custo base 50): 50 → 75 → 113 → 169 → 253 (compras 0ª a 4ª, totalizando as 5 compras permitidas).

**Teste correspondente**: comparação de `getUpgradeCost(50, 0)`, `getUpgradeCost(50, 1)`, entre outros, com valores calculados manualmente.

## 5. Acúmulo dos efeitos das melhorias

O documento do desafio descreve o efeito de uma única compra, mas não especifica como acumular múltiplas compras (até 5x por melhoria). A seguir, as regras de acúmulo adotadas, registradas como decisões de design explícitas:

| Melhoria | Efeito por compra | Regra de acúmulo |
|---|---|---|
| 5S | −5% defeito, +10% velocidade | Ambos os efeitos somam linearmente por compra |
| Kanban | +20% velocidade | Soma linearmente por compra |
| Poka-Yoke | −15% defeito | Soma linearmente por compra |
| TPM | +15% OEE, −10% defeito | Soma linearmente por compra |
| Andon | desbloqueia auto-recovery em paradas | +5% OEE por compra (decisão registrada abaixo — **definido: versão simplificada**) |
| Heijunka | nivela produção, +25% OEE | OEE soma linearmente; "nivelar produção" permanece descritivo, sem mecânica adicional nesta etapa (**definido: versão simplificada**) |

Regra de cálculo final:
```
defectRate = clamp(0.30 - somaDeTodasReduçõesDeDefeito, 0, 1)
oee        = clamp(0.40 + somaDeTodosBônusDeOee, 0, 1)
speedMultiplier = 1 + somaDeTodosBônusDeVelocidade   // ex: 0.10 + 0.20 = +30% → multiplica produção por 1.30
productionRate = 1 * speedMultiplier
```

**Decisão registrada (2026-06-17): versão simplificada para Andon e Heijunka.**
O enunciado original não define um valor numérico para esses dois efeitos ("desbloqueia auto-recovery em paradas" e "nivela produção" são descrições, não mecânicas com parâmetros explícitos). Para preservar o prazo de 24h e priorizar os critérios eliminatórios, ambos foram tratados como os demais upgrades nesta primeira versão: aplicam um valor numérico direto ao indicador correspondente (Andon: +5% OEE por compra; Heijunka: +25% OEE por compra, conforme valor já presente no enunciado), sem sistema adicional de paradas ou variação aleatória. Essa abordagem atende integralmente aos requisitos obrigatórios e eliminatórios, incluindo o teste de aplicação dos efeitos de cada melhoria nos indicadores.

A versão mais elaborada (mecânica completa) permanece documentada como item de extensão futura — ver seção 13.1, "Extensão futura: mecânica de Andon/Heijunka".

## 6. Tick do jogo (Regras 1 e 2)

```ts
// engine/tick.ts
export interface TickResult {
  ticksElapsed: number
  goodPieces: number
  defectivePieces: number
}

export function advanceTicks(
  lastTimestamp: number,
  now: number,
  stats: FactoryStats
): TickResult {
  const TICK_MS = 1000
  const ticksElapsed = Math.floor((now - lastTimestamp) / TICK_MS)
  if (ticksElapsed <= 0) return { ticksElapsed: 0, goodPieces: 0, defectivePieces: 0 }

  const totalPieces = ticksElapsed * stats.productionRate
  const defectivePieces = totalPieces * stats.defectRate
  const goodPieces = totalPieces - defectivePieces

  return { ticksElapsed, goodPieces, defectivePieces }
}
```

No React, um hook (`useGameLoop`) invoca `advanceTicks` periodicamente (por exemplo, a cada 250ms, para manter fluidez na animação) e também:
- Ao montar a aplicação, recupera o `lastTickTimestamp` salvo e calcula o tempo decorrido enquanto a aba esteve fechada ou em segundo plano (Regra 2).
- Utiliza a [Page Visibility API](https://developer.mozilla.org/pt-BR/docs/Web/API/Page_Visibility_API) (`document.visibilityState`) para detectar o retorno de foco à aba e forçar um recálculo imediato.

**Fundamentação técnica**: a abordagem resolve as Regras 1 e 2 simultaneamente porque independe de o navegador atrasar ou pausar o timer — a cada execução, compara-se `now` com o `lastTickTimestamp` salvo e aplica-se o tempo real decorrido, em vez de contar disparos do temporizador.

**Teste correspondente**: simulação de `lastTimestamp` e `now` com diferença de 5 minutos (300.000ms), validando que `ticksElapsed === 300`.

## 7. Regra do ranking (Regra 3)

```ts
// engine/ranking.ts
export function upsertRankingEntry(
  ranking: RankingEntry[],
  newEntry: RankingEntry
): RankingEntry[] {
  const existingIndex = ranking.findIndex(e => e.name === newEntry.name)
  if (existingIndex === -1) {
    return [...ranking, newEntry]
  }
  if (newEntry.score > ranking[existingIndex].score) {
    const updated = [...ranking]
    updated[existingIndex] = newEntry
    return updated
  }
  return ranking // score novo não supera o existente; entrada não é alterada
}
```

O top 10 é obtido via `ranking.sort((a, b) => b.score - a.score).slice(0, 10)`, aplicado no momento da exibição — não há necessidade de armazenar a lista já truncada.

**Teste correspondente**: inserção de nome novo; atualização de nome existente apenas quando o score é maior; manutenção do registro quando o score novo é menor ou igual.

## 8. Persistência (localStorage)

Chaves definidas:
```
kaizen-clicker:ranking      → RankingEntry[]
kaizen-clicker:save         → GameState (save do progresso do jogo entre reloads — requisito de base, não item de extensão)
```

Ao montar a aplicação, `useGameLoop` recupera `kaizen-clicker:save` (quando existente) para restaurar `points`, `purchases`, `totalProduced`, entre outros campos, utilizando o `lastTickTimestamp` salvo para calcular os ticks decorridos durante o período em que a aplicação esteve fechada (mesma lógica de recuperação da Regra 2, estendida ao cenário de aplicação fechada).

Toda leitura e escrita em `localStorage` é isolada em `engine/persistence.ts`, com tratamento de erro (ex.: JSON inválido, indisponibilidade de `localStorage`) e validação de formato dos dados lidos (ver seção 11.1) — os componentes não acessam `localStorage` diretamente, e os testes podem substituir essa camada por uma implementação simulada.

### Extensão futura: anti-cheat simples
Armazenar, junto ao ranking, um hash de verificação (ex.: checksum dos dados serializados). No carregamento, recalcular o hash e comparar com o valor salvo — divergência indica edição manual do `localStorage` fora do fluxo do jogo. A medida não impede a alteração, mas permite detectá-la.

## 9. Dashboard (gráficos)

Biblioteca: **Recharts**.
- Produção acumulada → `LineChart`, alimentado por `history[]`.
- Defeitos por minuto → `BarChart`, com agregação de `history[]` em janelas de 1 minuto.
- OEE → `RadialBarChart` (representação tipo gauge) exibindo o valor atual.

O array `history`, em `GameState`, armazena um ponto por tick (ou a cada N ticks, para limitar o crescimento) no formato `{ timestamp, produced, defects, oee }`.

## 10. Estilo visual

**Tailwind CSS** — classes utilitárias que facilitam a implementação de transições e animações (`transition`, `animate-bounce`, `animate-pulse`), contribuindo para a sensação de progressão exigida pelo desafio.

## 11. Plano de testes (Vitest)

| Arquivo | Cobertura |
|---|---|
| `upgrades.test.ts` | custo geométrico; acúmulo de efeitos (defeito/velocidade/OEE) |
| `tick.test.ts` | avanço por delta de tempo; cenário "5 minutos em background = 300 ticks"; tick nulo quando não há tempo decorrido |
| `ranking.test.ts` | inserção de nome novo; atualização condicionada a score maior; manutenção quando score é menor ou igual |
| `persistence.test.ts` | gravação/leitura em localStorage; comportamento diante de dado corrompido ou com formato inválido; limite máximo de entradas do ranking |

Comando de cobertura: `npm run test -- --coverage` (configurado em `vitest.config.ts` com threshold mínimo de 80%, de modo a falhar a execução caso a cobertura fique abaixo do limite).

## 11.1 Considerações de segurança

A aplicação não possui backend, autenticação nem dados sensíveis, o que reduz consideravelmente a superfície de ataque. Ainda assim, os pontos a seguir são tratados como requisitos de implementação:

- **Validação do nome do jogador**: o campo do formulário "Salvar pontuação" deve aplicar `trim()`, limite máximo de caracteres (ex.: 20) e rejeitar valor vazio antes de persistir. Adicionalmente, a renderização do nome em qualquer parte da interface deve ocorrer exclusivamente via JSX padrão (`{nome}`) — o uso de `dangerouslySetInnerHTML` é proibido neste projeto, preservando o escape automático de conteúdo feito pelo React.
- **Validação de formato dos dados lidos do `localStorage`**: como o conteúdo de `localStorage` pode ser editado manualmente pelo usuário fora do fluxo da aplicação, `engine/persistence.ts` deve validar o tipo e o formato dos dados antes de aplicá-los ao estado (ex.: confirmar que `points` é `number`, que `purchases` é um objeto com as chaves esperadas), descartando e reiniciando o estado correspondente quando o formato for inválido, em vez de propagar um erro ou um estado inconsistente para a aplicação.
- **Limite de entradas armazenadas no ranking**: embora a interface exiba apenas o top 10, o array `RankingEntry[]` persistido deve ter um teto de armazenamento (ex.: 50 entradas, mantendo as de maior pontuação), evitando crescimento ilimitado do `localStorage`.
- **Higiene de dependências**: manter o número de dependências de terceiros (Zustand, Recharts, Tailwind) restrito ao necessário, e executar `npm audit` antes da entrega final, registrando e tratando vulnerabilidades críticas eventualmente reportadas.

## 12. Fluxo Git

- Repositório remoto já criado: `git@github.com:AnaClaudiaSac/kaizen-clicker-frontend-teste.git`.
- Inicialização local e configuração do remoto.
- Uma branch por unidade lógica do checklist (seção 13), originada sempre a partir de `main`. Dentro de cada branch, múltiplos commits pequenos e atômicos — não um único commit por branch —, cada um representando uma unidade lógica de progresso.
- Ao final de cada branch: abertura de Pull Request para `main`, com mesclagem via **merge commit** (sem squash), preservando o histórico de commits atômicos na branch principal — atende à restrição de "commit direto na main" e preserva o histórico de evolução do projeto.
- **Decisão registrada (2026-06-17)**: por se tratar de projeto individual, a mesclagem dos Pull Requests é realizada diretamente pela IA, sem etapa de revisão manual no GitHub a cada PR, priorizando o prazo de 24h. A candidata pode revisar o resultado a qualquer momento.
- **Cada Pull Request com título claro e descrição objetiva**: o título resume a entrega (ex.: "Engine: cálculo de custo e efeitos das melhorias") e a descrição detalha o que foi implementado, a motivação e os testes adicionados — sem títulos genéricos ou descrições vazias.

### 12.1 Tabela de branches

| Branch | Conteúdo entregue | Itens do checklist (seção 13) |
|---|---|---|
| `feat/setup-projeto` | Scaffold do projeto (Vite, React, TS strict, Vitest, Tailwind, ESLint) | 1 |
| `feat/engine-upgrades` | Custo geométrico e efeitos acumulados das melhorias, com testes | 2, 3 |
| `feat/engine-tick` | Sistema de tick por delta de tempo (Regras 1 e 2), com testes | 4 |
| `feat/engine-ranking-persistencia` | Regra do ranking e persistência em localStorage (ranking e save), com testes | 5, 6 |
| `feat/store-game-loop` | Store Zustand e hook do game loop, integrando UI à engine | 7 |
| `feat/tela-principal` | Tela principal: contador, lista de melhorias, botão de compra | 8 |
| `feat/animacao-producao` | Animação de produção de peça | 9 |
| `feat/dashboard` | Dashboard com os três gráficos | 10 |
| `feat/ranking-tela` | Tela de Ranking e formulário "salvar pontuação" | 11 |
| `chore/cobertura-readme` | Verificação de cobertura de testes e documentação no README | 12, 13 |
| `chore/deploy` | Configuração de deploy | 14 |

Branches adicionais são criadas conforme itens de extensão (seção 13, itens 15 e 16) forem implementados, seguindo o mesmo padrão de nomenclatura (`feat/` ou `chore/` seguido de descrição curta).

### 12.2 Padrão de mensagens de commit

Mensagens em português, claras e objetivas — sem mensagens genéricas como "update files" e sem uso de inglês.

| Prefixo | Quando usar | Exemplo |
|---|---|---|
| `feat:` | Nova funcionalidade implementada | `feat: adiciona cálculo de custo geométrico das melhorias` |
| `test:` | Testes adicionados ou ajustados | `test: cobre regra de atualização do ranking` |
| `fix:` | Correção de comportamento incorreto | `fix: corrige acúmulo de bônus de velocidade` |
| `chore:` | Configuração, infraestrutura ou manutenção | `chore: configura ESLint e Prettier` |
| `docs:` | Alteração em documentação | `docs: atualiza README com instruções de cobertura` |
| `refactor:` | Reorganização de código sem alteração de comportamento | `refactor: extrai cálculo de efeitos para função compartilhada` |

## 13. Ordem de execução / checklist

1. [ ] Scaffold: Vite + React + TS strict + Vitest + Tailwind + ESLint
2. [ ] `engine/types.ts`, `engine/constants.ts` (estado inicial, tabela de melhorias)
3. [ ] `engine/upgrades.ts` + testes (custo geométrico, efeitos acumulados)
4. [ ] `engine/tick.ts` + testes (delta de tempo, recuperação de estado em background)
5. [ ] `engine/ranking.ts` + testes
6. [ ] `engine/persistence.ts` + testes (ranking e save do jogo)
7. [ ] `store/useGameStore.ts` + `store/useGameLoop.ts`
8. [ ] Tela principal: contador, lista de melhorias, botão de compra (desabilitado sem pontos suficientes)
9. [ ] Animação de produção de peça
10. [ ] Dashboard com os três gráficos
11. [ ] Tela de Ranking + formulário "salvar pontuação"
12. [ ] Verificação de cobertura ≥ 80%, geração de relatório, documentação no README
13. [ ] README com documentação completa do projeto — ver subseção 13.2
14. [ ] Deploy (Netlify) — build local (`npm run build`) gerando a pasta `dist/`, publicação manual pela candidata via painel da Netlify (conta já criada em 2026-06-18)
15. [ ] (Caso o prazo permita) Extensões: CI no GitHub Actions, anti-cheat, efeitos visuais e sonoros adicionais
16. [ ] (Caso o prazo permita) Extensão: mecânica completa de Andon/Heijunka — ver subseção 13.1
17. [ ] Revisão do `IA_LOG.md` (redigido pela candidata)

### 13.1 Extensão futura: mecânica de Andon/Heijunka

Caso o prazo permita, após a conclusão e validação de todos os itens obrigatórios, os efeitos de Andon e Heijunka podem ser estendidos para incluir mecânica própria, em vez de aplicar apenas um valor fixo:

- **Andon — paradas de produção**: a cada tick, calcular uma probabilidade de interrupção da produção naquele intervalo, proporcional à taxa de defeito atual (ex.: `defectRate * 0.1`). Sem Andon adquirido, uma interrupção zera a produção do tick correspondente. Com Andon adquirido (uma compra é suficiente), a interrupção não se concretiza — o que corresponde ao conceito de "auto-recovery" descrito no enunciado.
- **Heijunka — nivelamento de produção**: introduzir uma variação aleatória na produção por tick (ex.: ±10%, com finalidade visual). Sem Heijunka, a produção oscila; com Heijunka adquirido, a produção permanece no valor exato (nivelada), além do bônus de +25% OEE já previsto.
- **Consideração de testabilidade**: a função responsável por decidir a ocorrência de uma interrupção ou variação não deve invocar `Math.random()` diretamente — o valor aleatório deve ser recebido como parâmetro de entrada, permitindo testes determinísticos (ex.: `shouldStoppageOccur(defectRate: number, roll: number): boolean`).

### 13.2 Estrutura do README

O `README.md` documenta o projeto como um todo, não apenas os comandos de execução. Estrutura definida:

1. **Título e descrição** — o que é o Kaizen Clicker, contexto do desafio (eKaizen, vaga de Frontend Junior).
2. **Funcionalidades implementadas** — lista objetiva (loop de produção, melhorias compráveis, dashboard, ranking, persistência).
3. **Stack tecnológica** — React, Vite, TypeScript, Zustand, Recharts, Tailwind, Vitest, com a versão de cada uma.
4. **Arquitetura** — resumo curto da separação `engine/` / `store/` / `components/`, com link para `SPEC.md` para o detalhamento completo.
5. **Como rodar localmente** — `npm install`, `npm run dev`, requisitos (Node version).
6. **Como rodar os testes e a cobertura** — comando exato (`npm run test -- --coverage`), e onde encontrar o relatório gerado.
7. **Relatório de cobertura** — percentual atingido por categoria (statements/branches/functions/lines), em texto ou print, conforme exigido pelo desafio.
8. **Decisões de design relevantes** — resumo das principais (ex.: acúmulo de efeitos das melhorias, simplificação de Andon/Heijunka), com link para as seções correspondentes do `SPEC.md`.
9. **Link do deploy** (Netlify).
10. **Itens não implementados / limitações conhecidas** — bônus que não entraram por restrição de prazo, registrados com transparência.

## 14. Decisões registradas

1. Mecânica de Andon e Heijunka — **definido (2026-06-17)**: versão simplificada na entrega inicial; mecânica completa de paradas/variação tratada como extensão futura (ver seção 13.1).
2. Save do jogo persistente — **definido (2026-06-17)**: incluído no escopo de base, junto com a implementação da Regra 2.
3. Nome do repositório/pasta — **definido**: `kaizen-clicker-frontend-teste`.

Todas as decisões pendentes na elaboração deste documento foram resolvidas. Revisão final do documento prevista para o encerramento do projeto, antes da entrega.
