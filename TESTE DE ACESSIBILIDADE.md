---
title: TESTE DE ACESSIBILIDADE

---

**TESTE DE ACESSIBILIDADE DO SISTEMA HIDROCHAMADO**


Para testar essas três implementações (Skip Link, ARIA e Focus Visível) funcionando na prática, você não precisa de nenhuma ferramenta complexa. O teste mais eficiente é simular a experiência real do usuário utilizando apenas o seu teclado e as ferramentas nativas do navegador.
Aqui está o roteiro de testes passo a passo para o seu sistema:

**1. Testando o Focus Visível e o Skip Link (Apenas Teclado)**

Feche o mouse em uma gaveta ou use apenas o teclado.
• O Teste:
	1. Clique na barra de endereços do seu navegador e aperte Enter para recarregar a página do seu sistema.
	2. Aperte a tecla Tab uma única vez.
• O que deve acontecer:
	• O seu Skip Link deve aparecer imediatamente no topo da tela (ex: um botão escrito "Saltar para o conteúdo").
	• Aperte Enter com o Skip Link selecionado. O foco visual deve sumir do topo e ir direto para o início do seu conteúdo principal (<main>).
	• Continue apertando Tab. O Focus Visível (o contorno/borda) deve seguir uma ordem lógica e sequencial (da esquerda para a direita, de cima para baixo), destacando nitidamente cada link, botão e campo de formulário clicável.
	• Para voltar ao elemento anterior, aperte Shift + Tab.

**2. Testando os Atributos ARIA (Com Leitor de Tela)**

Para testar o ARIA, você precisa ouvir o seu site da mesma forma que um usuário com deficiência visual ouve.
• Ative o Leitor de Tela Nativo:
	• Windows: Aperte Ctrl + Windows + Enter (ativa o Narrador).
	• Mac: Aperte Command + F5 (ativa o VoiceOver).
• O Teste:
	• Navegue pelo seu sistema usando Tab ou as setas do teclado enquanto o leitor de tela fala.
• O que deve acontecer (Validação do ARIA):
	• Ao passar por um menu retrátil (dropdown), o leitor deve falar algo como "Menu, recolhido" ou "Menu, expandido". Se ele atualizar o status ao clicar, seu aria-expanded="true/false" está funcionando.
	• Ao abrir um modal de aviso ou disparar um erro, o leitor deve interromper o que estava fazendo e ler o aviso imediatamente. Isso valida o seu aria-live="assertive" ou role="alert".
	• Elementos visuais puramente icônicos (como um botão que é apenas o ícone de um carrinho de compras) devem ser lidos por extenso (ex: "Botão, Carrinho de compras"). Isso valida o seu aria-label.

**3. Testando via Ferramentas de Desenvolvedor (Inspecionar)**

Você pode validar a árvore de acessibilidade gerada pelo ARIA diretamente no código.
1. Abra o seu sistema no Google Chrome ou Microsoft Edge.
2. Aperte F12 (ou clique com o botão direito e vá em Inspecionar).
3. Na aba de elementos do código, procure por uma sub-aba chamada Acessibilidade (Accessibility) — se não encontrar, clique nas setinhas >> ao lado de Styles/Computed.
4. Inspecione seus componentes. Essa aba mostrará exatamente o "Nome Acessível" e a "Função" (Role) que o ARIA expôs para o navegador.

**🛠️ Dica de Ouro: Teste de Estresse Automático**

Para garantir que você não esqueceu nenhum detalhe técnico, abra o painel do desenvolvedor (F12), vá na aba Lighthouse e clique em Analyze page load selecionando apenas a caixinha Accessibility. Ele varrerá o seu HTML em segundos e gerará uma nota de 0 a 100, apontando falhas em IDs duplicados no ARIA ou problemas de contraste no seu focus.
Qual leitor de tela ou navegador você costuma usar para desenvolver? Se o seu sistema tiver algum componente complexo (como um menu hambúrguer ou um modal), posso te passar os comandos exatos de teclado para testá-los.

**As três técnicas que você implementou (skip link, ARIA e focus visível)** foram projetadas pensando, principalmente, em duas grandes categorias de deficiência: deficiência visual e deficiência motora (física).
Cada uma delas atende a necessidades muito específicas desses grupos:

**1. Deficiência Visual (Cegueira, Baixa Visão e Daltonismo)**

• Quem se beneficia: Usuários de leitores de tela (pessoas cegas ou com visão baixíssima) e pessoas com baixa visão que ainda conseguem enxergar a tela, mas precisam de apoios visuais.
• O papel das suas escolhas:
	• ARIA: É vital para quem é cego. O leitor de tela não consegue ler um elemento visual abstrato (como uma bolinha vermelha indicando erro). O ARIA traduz o design em código falado, dizendo ao usuário exatamente o que aquele elemento faz ou qual o status dele.
	• Focus Visível: É vital para quem tem baixa visão. Essas pessoas navegam olhando para a tela, mas precisam de um contorno muito nítido e forte para não perderem o cursor visual de vista enquanto pulam de um link para o outro.

**2. Deficiência Motora / Física**

• Quem se beneficia: Pessoas com paralisia, tremores severos (como Parkinson), amputações, sequelas de AVC ou qualquer condição que impeça ou dificulte o uso de um mouse convencional. Também inclui pessoas que utilizam tecnologias assistivas motoras, como acionadores (botões gigantes acionados com a cabeça ou pés) ou sistemas de rastreamento ocular.
• O papel das suas escolhas:
	• Skip Link & Focus Visível: Usuários com limitações motoras navegam exclusivamente pelo teclado (usando a tecla Tab). O Skip Link evita o desgaste físico de ter que apertar o botão dezenas de vezes para pular o menu em cada página. O Focus Visível permite que eles saibam exatamente onde estão na tela para poderem clicar (apertando Enter).

**Resumo de Impacto**

Embora tenham propósitos técnicos diferentes, essas escolhas se cruzam para criar uma navegação justa.
• O ARIA resolve a barreira da compreensão do conteúdo (Deficiência Visual).
• O Skip Link e o Focus Visível resolvem a barreira da interação e movimentação na tela (Deficiência Motora e Baixa Visão).
Além disso, essas melhorias acabam ajudando idosos (que frequentemente combinam perda gradual de visão e menor precisão motora) e até mesmo usuários temporariamente limitados (como alguém com o braço engessado ou cujo mouse quebrou).


