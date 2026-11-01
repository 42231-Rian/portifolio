# Funcionalidades (em ordem de prioridade)

1. **Abertura/intro RIAN ENTERTAINMENT**
   - Tela inicial escura com animação original de aproximação/aparecimento do nome.
   - Duração curta e botão “Pular intro”.
   - Não bloquear o acesso ao conteúdo; respeitar `prefers-reduced-motion`.

2. **Menu de navegação temático**
   - Opções: Início, Sobre mim, Projetos e Contato.
   - Menu visível e fácil de usar; links levam às seções corretas.
   - Indicar visualmente a seção ativa quando possível.

3. **Seção Sobre mim**
   - Apresentar nome, idade, escola/curso técnico e trabalho na TWO.
   - Texto curto, verdadeiro e escrito em primeira pessoa.
   - Reservar espaço para foto apenas se Rian fornecer uma imagem.

4. **Galeria de projetos**
   - Apresentar o projeto LEFT 4 MIAMI 2.
   - Descrição: jogo 2D de navegador.
   - Link: https://42231-rian.github.io/Gugu-jogo/
   - Card com imagem/print do jogo (solicitar ao usuário se não houver imagem disponível).
   - Estrutura preparada para adicionar projetos futuros sem inventar projetos.

5. **Animações ao rolar**
   - Seções e cards surgem suavemente pelas laterais.
   - Usar IntersectionObserver e CSS, evitando bibliotecas pesadas.
   - Não esconder conteúdo se JavaScript estiver desativado.

6. **Seção Contato**
   - E-mail: rianferreiradelim@gmail.com
   - Telefone/WhatsApp: +55 19 98388-8369
   - Instagram: https://www.instagram.com/rian_ferr/
   - GitHub: https://github.com/42231-Rian
   - Links clicáveis e formulário com validação no navegador.

7. **Responsividade**
   - Layout adaptado para celular, tablet e computador.
   - Menu acessível por toque; cards em uma coluna no celular.
   - Testar larguras pequenas e orientação horizontal.

8. **Detalhes de qualidade**
   - Estado de foco visível, contraste adequado e textos alternativos.
   - Botão para pular a intro.
   - Rodapé com nome e ano.
   - Verificar se todos os links abrem corretamente.
