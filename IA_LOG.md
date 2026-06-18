Uso de IA:
Claude Sonnet 4.6 Code, pra planejar a especificação técnica, implementar o código, revisar antes de cada commit e tirar dúvidas.

Por etapa:

1 - Especificação (SPEC.md): li o desafio e construí a especificação junto com a IA, em várias rodadas. pedi explicação de um item do edital, escolhi entre duas abordagens, pedi análise de segurança pra incluir na spec, corrigi a ordem das seções, pedi linguagem mais formal em um trecho, decidi cortar duas seções que não faziam sentido. perguntei sobre JSDoc e decidi usar só onde fizer sentido.

2 - Fluxo de git: perguntei como branches e commits seriam tratados, decidi que a IA mesclaria as PRs sem eu revisar manualmente, exceto mudanças visuais.

3 - Implementação: pedi pra implementar a spec inteira, com testes, cobertura de 80%+ e arquitetura separando lógica pura de interface.

4 - Redesign visual: trouxe um mockup HTML feito por mim com IA, pedi pra usar como referência, com a condição de não commitar nem dar push antes de eu testar.

5 - Verificação antes de commitar: pedi pra confirmar que tudo funciona antes de cada commit, rodando o app de verdade no navegador. isso pegou um bug real (gráficos quebrando com poucos dados) que os testes automatizados não tinham detectado.

6 - Ajustes visuais: o gauge de OEE não estava centralizado (apontei duas vezes até ficar certo), as colunas do dashboard não tinham a mesma altura.

7 - Ranking com pódio: trouxe um segundo mockup, escolhi manter o ranking como aba separada em vez de juntar num layout de 3 colunas, e deixar a aba em largura total.

8 - Cobertura de testes: notei uma linha vermelha no relatório de cobertura (persistence.ts) e pedi pra investigar, resultou em testes novos.

9 - Botão de reiniciar: pedi a funcionalidade, dei liberdade de nome/estilo. depois de testar, pedi pra trocar o confirm nativo do navegador por um modal customizado.

10 - Remoção do OEE duplicado: pedi opinião sobre a duplicação entre a barra de estatísticas e o gráfico, decidi manter só no gráfico.

11 - Tooltip dos gráficos: notei números ilegíveis (cinza claro), pedi pra traduzir pro português e tirar o espaço antes dos dois-pontos, depois pedi arredondamento e horário legível. pedi pra evitar o tipo unknown no código.

12 - testado manualmente antes de aceitar: [contar aqui se teve algum outro momento que testar no navegador pegou algo importante]
