uso de IA: Claude Sonnet 4.6 Code, pra planejar a especificacao tecnica, implementar o codigo, revisar antes de cada commit e tirar duvidas.

Por etapa:

1 - especificacao (SPEC.md): li o desafio e construi a especificacao junto com a IA, em varias rodadas. pedi explicacao de um item do edital, escolhi entre duas abordagens, pedi analise de seguranca pra incluir na spec, corrigi a ordem das secoes, pedi linguagem mais formal em um trecho, decidi cortar duas secoes que nao faziam sentido. perguntei sobre JSDoc e decidi usar so onde fizer sentido.

2 - fluxo de git: perguntei como branches e commits seriam tratados, decidi que a IA mesclaria as PRs sem eu revisar manualmente, exceto mudancas visuais.

3 - implementacao: pedi pra implementar a spec inteira, com testes, cobertura de 80%+ e arquitetura separando logica pura de interface.

4 - redesign visual: trouxe um mockup HTML feito por mim com IA, pedi pra usar como referencia, com a condicao de nao commitar nem dar push antes de eu testar.

5 - verificacao antes de commitar: pedi pra confirmar que tudo funciona antes de cada commit, rodando o app de verdade no navegador. isso pegou um bug real (graficos quebrando com poucos dados) que os testes automatizados nao tinham detectado.

6 - ajustes visuais: o gauge de OEE nao estava centralizado (apontei duas vezes até ficar certo), as colunas do dashboard nao tinham a mesma altura.

7 - ranking com podio: trouxe um segundo mockup, escolhi manter o ranking como aba separada em vez de juntar num layout de 3 colunas, e deixar a aba em largura total.

8- cobertura de testes: notei uma linha vermelha no relatorio de cobertura (persistence.ts) e pedi pra investigar, resultou em testes novos.

9 - botao de reiniciar: pedi a funcionalidade, dei liberdade de nome/estilo. depois de testar, pedi pra trocar o confirm nativo do navegador por um modal customizado.

10 - remocao do OEE duplicado: pedi opiniao sobre a duplicacao entre a barra de estatisticas e o grafico, decidi manter so no grafico.

11 - tooltip dos graficos: notei numeros ilegiveis (cinza claro), pedi pra traduzir pro portugues e tirar o espaco antes dos dois-pontos, depois pedi arredondamento e horario legivel. pedi pra evitar o tipo unknown no codigo.

12 - testado manualmente antes de aceitar: [contar aqui se teve algum outro momento que testar no navegador pegou algo importante]
