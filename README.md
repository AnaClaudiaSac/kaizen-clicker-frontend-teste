# Kaizen Clicker

Mini-game web no estilo idle/clicker com tema de otimização de fábrica, desenvolvido como desafio técnico para a vaga de **Desenvolvedor Front-end Júnior** na eKaizen.

O jogador gerencia uma linha de produção que começa ineficiente — muitos defeitos, produção lenta, OEE baixo — e investe os pontos acumulados em melhorias inspiradas em ferramentas reais de melhoria contínua (5S, Kanban, Poka-Yoke, TPM, Andon, Heijunka), que alteram em tempo real os indicadores da fábrica.

## Funcionalidades implementadas

- Loop de produção contínuo, com 1 peça produzida por segundo (ajustado pelas melhorias), independente do ciclo de render do React.
- Contador de pontos Kaizen com animação visível a cada peça produzida.
- 6 melhorias compráveis, com custo crescendo geometricamente e limite de 5 compras cada.
- Dashboard em tempo real com produção acumulada (gráfico de linha), defeitos por minuto (gráfico de barra) e OEE (gauge radial).
- Tela de Ranking com os 10 melhores jogadores e formulário para salvar pontuação.
- Persistência em `localStorage`: ranking e progresso do jogo sobrevivem a reload da página e a fechamento do navegador.
- Produção continua sendo calculada mesmo com a aba em segundo plano ou o app fechado, recuperando o tempo decorrido ao retomar.

## Stack tecnológica

- [React 19](https://react.dev/) com [Vite 8](https://vite.dev/)
- [TypeScript ~6.0](https://www.typescriptlang.org/) com `strict: true`
- [Zustand 5](https://github.com/pmndrs/zustand) para gerenciamento de estado
- [Recharts 3](https://recharts.org/) para os gráficos do dashboard
- [Tailwind CSS 4](https://tailwindcss.com/) para estilização
- [Vitest 4](https://vitest.dev/) + [Testing Library](https://testing-library.com/) para os testes

## Arquitetura

O projeto separa a lógica do jogo da camada visual:

```
src/
  engine/      → lógica pura (sem React/DOM): custo das melhorias, tick por delta de
                 tempo, regra do ranking, persistência em localStorage
  store/       → Zustand: liga a engine ao React (useGameStore, useGameLoop)
  components/  → telas e componentes de UI
```

O detalhamento completo das decisões de arquitetura está em [`SPEC.md`](./SPEC.md).

## Como rodar localmente

Requer [Node.js](https://nodejs.org/) 20+.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

Outros comandos úteis:

```bash
npm run build     # build de produção (gera a pasta dist/)
npm run lint      # ESLint
npm run preview   # serve o build de produção localmente
```

## Como rodar os testes e a cobertura

```bash
npm run test            # roda os testes uma vez
npm run test:watch      # roda os testes em modo watch
npm run test:coverage   # roda os testes com relatório de cobertura
```

A cobertura mínima exigida (80% em statements/lines) é configurada como threshold em `vitest.config.ts` — a execução falha automaticamente se a cobertura cair abaixo disso.

## Relatório de cobertura

Resultado da última execução de `npm run test:coverage` (67+ testes, todos passando):

```
% Coverage report from v8
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   97.38 |    93.33 |     100 |   99.39 |
-------------------|---------|----------|---------|---------|
```

Acima do mínimo de 80% exigido pelo desafio. Os testes cobrem prioritariamente a lógica de jogo (`src/engine/`): cálculo de custo geométrico, aplicação dos efeitos de cada melhoria, avanço de tick por delta de tempo (incluindo o cenário de 5 minutos em segundo plano) e a regra de atualização do ranking.

## Decisões de design relevantes

- **Andon e Heijunka** usam uma versão simplificada nesta entrega (bônus de OEE fixo por compra), já que o enunciado não define um valor numérico para "paradas" e "nivelamento de produção". A mecânica completa está documentada como extensão futura na seção 13.1 do `SPEC.md`.
- **Pontuação do ranking** usa a produção total acumulada (`totalProduced`), não o saldo de pontos disponíveis — assim, comprar melhorias nunca reduz a pontuação salva.
- **Tick desacoplado do render**: o avanço de produção é calculado a partir de timestamps reais (`Date.now()`), nunca pela contagem de disparos de `setInterval`, resolvendo tanto o tickrate fixo de 1Hz quanto a produção contínua em segundo plano com o mesmo mecanismo.

Mais detalhes e o raciocínio completo de cada decisão estão em [`SPEC.md`](./SPEC.md).

## Deploy

_(link a ser adicionado após a publicação no Netlify)_

## Itens não implementados / limitações conhecidas

- Mecânica completa de paradas (Andon) e variação de produção (Heijunka) — ver seção 13.1 do `SPEC.md`.
- CI no GitHub Actions e anti-cheat de ranking não foram implementados nesta entrega, por restrição de prazo (itens de bônus, não eliminatórios).
