# Roteiro de Teste Manual — Kaizen Clicker

> Documento de apoio para validação manual do projeto antes da entrega.
> Referência: `SPEC.md` (especificação técnica) e `desafio-tecnico-junior-ana-claudia-kaizen-clicker-frontend.pdf` (enunciado original).

Marque cada item como `[x]` conforme for validando. Em caso de falha, anote o comportamento observado na coluna de notas.

## 0. Preparação

| Item | Passo | Resultado esperado | OK? |
|---|---|---|---|
| 0.1 | Rodar `npm install` | Instala sem erros | [ ] |
| 0.2 | Rodar `npm run dev` | Aplicação abre em `localhost`, sem erros no console | [ ] |
| 0.3 | Rodar `npm run build` | Build conclui sem erros, gera pasta `dist/` | [ ] |
| 0.4 | Rodar `npm run test -- --coverage` | Todos os testes passam; cobertura ≥ 80% em statements/lines | [ ] |

## 1. Tela principal e loop de jogo

| Item | Passo | Resultado esperado | OK? |
|---|---|---|---|
| 1.1 | Abrir a aplicação | Contador de pontos visível, começa em 0 (ou valor salvo, se houver save anterior) | [ ] |
| 1.2 | Observar a tela por ~5 segundos, sem interagir | Pontos aumentam automaticamente, aproximadamente 1 a cada segundo (ajustado pela taxa de defeito inicial) | [ ] |
| 1.3 | Observar a animação durante a produção | Há uma animação visível a cada peça produzida (não é uma tela parada) | [ ] |
| 1.4 | Deixar a aplicação rodando por 1 minuto corrido | O contador de pontos continua subindo de forma consistente, sem acelerar nem travar | [ ] |

## 2. Melhorias (upgrades)

| Item | Passo | Resultado esperado | OK? |
|---|---|---|---|
| 2.1 | Com poucos pontos (ex.: logo ao abrir), observar o botão "Comprar" do 5S | Botão aparece desabilitado (não é possível comprar sem pontos suficientes) | [ ] |
| 2.2 | Esperar até ter pontos suficientes para comprar o 5S (50 pts) | Botão habilita automaticamente assim que o saldo é suficiente | [ ] |
| 2.3 | Comprar o 5S uma vez | Pontos são debitados; custo exibido da próxima compra sobe (≈75 pts) | [ ] |
| 2.4 | Comprar o 5S até a 5ª vez | A partir da 5ª compra, a melhoria fica indisponível para novas compras (limite de 5x respeitado) | [ ] |
| 2.5 | Após comprar 5S e/ou Kanban, observar a velocidade de produção | A produção visivelmente acelera (mais pontos por segundo do que no início) | [ ] |
| 2.6 | Após comprar Poka-Yoke e/ou TPM, observar o indicador de defeito no dashboard | Taxa de defeito exibida diminui | [ ] |
| 2.7 | Comprar uma melhoria de custo alto (ex.: Andon, Heijunka) | Pontos debitados corretamente; efeito aplicado no OEE | [ ] |

## 3. Dashboard (gráficos em tempo real)

| Item | Passo | Resultado esperado | OK? |
|---|---|---|---|
| 3.1 | Observar o gráfico de produção acumulada | Gráfico de linha, crescente, atualizando em tempo real | [ ] |
| 3.2 | Observar o gráfico de defeitos por minuto | Gráfico de barra (ou linha) refletindo os defeitos gerados | [ ] |
| 3.3 | Observar o indicador de OEE | Gauge (ou linha) com o valor atual de OEE, atualizando conforme melhorias são compradas | [ ] |
| 3.4 | Comprar uma melhoria que afete OEE/defeito | Os gráficos correspondentes refletem a mudança pouco depois da compra | [ ] |

## 4. Ranking e formulário de pontuação

| Item | Passo | Resultado esperado | OK? |
|---|---|---|---|
| 4.1 | Abrir a tela de Ranking pela primeira vez (sem nenhum registro salvo) | Lista vazia ou mensagem indicando ausência de registros | [ ] |
| 4.2 | Preencher o formulário "Salvar pontuação" com um nome válido e enviar | Registro aparece na tela de Ranking, com o nome e a pontuação no momento do salvamento | [ ] |
| 4.3 | Tentar salvar com o campo nome vazio | Formulário rejeita o envio (validação impede nome vazio) | [ ] |
| 4.4 | Tentar salvar com um nome muito longo (ex.: 100 caracteres) | Nome é limitado/truncado, sem quebrar a interface | [ ] |
| 4.5 | Salvar novamente usando o **mesmo nome** já salvo, com pontuação **menor** que a anterior | Registro existente **não** é alterado (mantém a pontuação mais alta) | [ ] |
| 4.6 | Salvar novamente usando o **mesmo nome**, com pontuação **maior** que a anterior | Registro existente **é atualizado** com a nova pontuação maior | [ ] |
| 4.7 | Salvar pontuações com 11 ou mais nomes diferentes | A tela de Ranking exibe apenas o **top 10** por pontuação | [ ] |

## 5. Persistência (localStorage)

| Item | Passo | Resultado esperado | OK? |
|---|---|---|---|
| 5.1 | Salvar uma pontuação no ranking, depois recarregar a página (F5) | O ranking salvo continua visível após o reload | [ ] |
| 5.2 | Acumular pontos e comprar ao menos uma melhoria, depois recarregar a página | O progresso do jogo (pontos, melhorias compradas) é restaurado após o reload | [ ] |
| 5.3 | Abrir o DevTools → Application → Local Storage e inspecionar as chaves salvas | Chaves de ranking e de save do jogo presentes, com dados em formato JSON legível | [ ] |
| 5.4 | Editar manualmente um valor no localStorage para um formato inválido (ex.: trocar um número por texto) e recarregar a página | A aplicação não quebra; lida com o dado inválido de forma controlada (ex.: reinicia aquele trecho do estado, sem tela em branco/erro) | [ ] |

## 6. Regra 1 — Tickrate 1Hz independente do render

| Item | Passo | Resultado esperado | OK? |
|---|---|---|---|
| 6.1 | Com a aba em foco, observar a produção por 30 segundos | Produção avança de forma constante, sem picos de velocidade | [ ] |
| 6.2 | Trocar de aba (deixar o jogo em segundo plano) por ~1 minuto, sem fechar a aba | Ao voltar, a produção reflete o tempo decorrido (não travou, não "pulou" tempo demais) | [ ] |

## 7. Regra 2 — Produção contínua em background

| Item | Passo | Resultado esperado | OK? |
|---|---|---|---|
| 7.1 | Anotar o total de pontos atual | — | [ ] |
| 7.2 | Minimizar o navegador (ou trocar para outra aba) e aguardar **5 minutos reais** | — | [ ] |
| 7.3 | Voltar para a aba do jogo | O total de pontos avançou de forma compatível com ~300 segundos de produção (considerando taxa de produção e defeito vigentes), não ficou estagnado no valor anotado em 7.1 | [ ] |

## 8. Regra 3 — Unicidade de nome no ranking

> Já coberto em detalhe nos itens 4.5 e 4.6 acima. Repetir aqui apenas se algum dos dois falhar, para isolar o cenário:

| Item | Passo | Resultado esperado | OK? |
|---|---|---|---|
| 8.1 | Salvar nome "Teste" com 200 pontos | Registro criado com 200 pontos | [ ] |
| 8.2 | Salvar nome "Teste" novamente com 100 pontos | Registro permanece com 200 pontos (não regride) | [ ] |
| 8.3 | Salvar nome "Teste" novamente com 500 pontos | Registro atualizado para 500 pontos | [ ] |

## 9. Critérios eliminatórios (checagem final)

| Item | Verificação | OK? |
|---|---|---|
| 9.1 | `npm run test -- --coverage` executa e reporta cobertura ≥ 80% (statements/lines) | [ ] |
| 9.2 | Relatório de cobertura está disponível no repositório (ou print no README) | [ ] |
| 9.3 | `IA_LOG.md` está presente, escrito manualmente, condizente com o histórico de commits | [ ] |
| 9.4 | Busca no código por `any`, `as any`, `@ts-ignore`, `@ts-nocheck` não retorna nenhuma ocorrência | [ ] |
| 9.5 | Nenhum componente React ultrapassa 200 linhas | [ ] |
| 9.6 | Histórico do Git não tem commit direto na `main` fora dos merges de PR | [ ] |
| 9.7 | `tsconfig.json` tem `"strict": true` | [ ] |

## 10. Entrega

| Item | Verificação | OK? |
|---|---|---|
| 10.1 | Repositório público no GitHub acessível (testar em aba anônima) | [ ] |
| 10.2 | Link de deploy (Netlify) acessível e funcional (testar em aba anônima) | [ ] |
| 10.3 | README completo conforme estrutura definida na seção 13.2 do `SPEC.md` | [ ] |
| 10.4 | Mensagem de entrega no LinkedIn preparada, com os dois links e observações sobre itens não concluídos (se houver) | [ ] |
