# GAO Logística: protótipo

Protótipo navegável da plataforma do gestor (desktop) e do app do motorista (mobile), feito em HTML, CSS e JavaScript puros.

| | |
|---|---|
| Protótipo online | https://rayanearaujoc.github.io/gao-gestor/ |
| Fluxograma do projeto (Miro) | https://miro.com/app/board/uXjVEKidyUM=/?share_link_id=961828917513 |

Para ver localmente, abra o `index.html` no navegador. A primeira tela deixa escolher entre **Gestor** e **Motorista**.

---

## O CSS é o nosso design system

Este protótipo já foi desenhado com um design system, o **GAO Kit**. O CSS que está aqui é ele, e é o que garante que todas as telas tenham a mesma cara e o mesmo comportamento.

Para o projeto continuar consistente, a ideia é usar o kit como base na implementação:

- **Reutilize as classes e os tokens que já existem.** Antes de escrever CSS novo, confira se o componente já está no kit.
- **Use as variáveis em vez de valores soltos.** Cores, espaçamentos, raios, alturas de campo e fonte vêm de tokens (por exemplo `--primary`, `--space-4`, `--radius-md`, `--ctl-md`).
- **Precisa de um componente que não existe? Fale com a gente.** Assim ele entra no kit e passa a valer para todas as telas.
- **Dúvida sobre algum detalhe do visual?** O protótipo é a referência. Se algo não estiver claro, é só perguntar.

Os componentes do kit têm o prefixo `gk-` (botão, tabela, modal, card, filtro, aba etc.). O modo escuro funciona trocando os tokens pelo atributo `data-theme="dark"` no `<html>`.

### Arquivos de CSS

Na pasta `static/css/` (compartilhada):

| Arquivo | O que é |
|---|---|
| `kit.css` | O GAO Kit: tokens e todos os componentes `gk-`. É a base. Não editar direto |
| `app.css` | O que vale para todas as páginas: reset, menu lateral, topo, cabeçalho de página, rodapé e modo escuro |
| `gestor.css` | O que é exclusivo da plataforma do gestor |

Na pasta `motorista/static/css/`:

| Arquivo | O que é |
|---|---|
| `gk-app.css` | Leva o app do motorista para as mesmas medidas do kit do gestor |
| `home.css`, `carregar.css`, `rota.css`, `entrega.css`, `coleta.css`, `checkout.css`, `resumo.css`, `historico.css` | Um por tela ou etapa, só com o que é exclusivo dela |

---

## Estrutura do repositório

```
index.html              tela de escolha (gestor ou motorista)
*.html                  páginas da plataforma do gestor
static/
  css/                  design system e CSS compartilhado
  js/                   scripts do protótipo
  img/                  logo, flor da GAO e imagens de exemplo
  anim/                 animações Lottie
motorista/
  *.html                telas do app do motorista
  static/css/           CSS exclusivo do app do motorista
```
