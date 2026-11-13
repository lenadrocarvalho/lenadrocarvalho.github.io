# Portfólio · Leandro Carvalho

Site pessoal profissional feito com **HTML5, CSS3 e JavaScript puro**: sem frameworks, sem build e sem dependências.

## Estrutura

```
/
├── index.html                      # Página única com todas as seções
├── css/style.css                   # Estilos (variáveis, mobile-first, temas claro/escuro)
├── js/main.js                      # Interatividade (menu, tema, animações, filtro, formulário)
├── assets/img/profile.jpg          # Sua foto (adicione; se faltar, usa o placeholder)
├── assets/img/profile-placeholder.svg
├── assets/img/favicon.svg          # Favicon com as iniciais "LC"
├── assets/cv/CV_Leandro_Carvalho.pdf   # Seu currículo (adicione)
└── README.md
```

## Pendências (procure por `TODO` no código)

- [x] Foto em `assets/img/profile.jpg`
- [x] Currículo em `assets/cv/CV_Leandro_Carvalho.pdf`
- [x] URL do GitHub (github.com/lenadrocarvalho) no rodapé e no contato
- [x] Link "Código ↗" do card "Este portfólio"
- [x] `canonical`, `og:url` e `og:image` apontando para https://lenadrocarvalho.github.io/
- [ ] Imagens e links (demo/repositório) dos projetos
- [ ] Configurar o Formspree (ou o EmailJS) no formulário de contato

## Rodar localmente

### Com o Live Server (VS Code)
1. Instale a extensão **Live Server** (Ritwick Dey) no VS Code.
2. Abra a pasta do projeto no VS Code.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**
   (ou clique em **Go Live** na barra de status).
4. O site abre em `http://127.0.0.1:5500` e recarrega sozinho a cada alteração.

### Sem extensão
Abrir o `index.html` direto no navegador também funciona. Outra opção, com Python instalado:
```bash
python -m http.server 8000
# acesse http://localhost:8000
```

## Formulário de contato

O envio já está preparado para o **Formspree**:
1. Crie uma conta gratuita em https://formspree.io e um novo formulário.
2. Copie o endpoint (ex.: `https://formspree.io/f/abcdwxyz`).
3. Em `index.html`, troque `https://formspree.io/f/SEU_ID` pelo seu endpoint.

Enquanto isso não for feito, o formulário abre o programa de e-mail do visitante com a mensagem preenchida.
Para usar o **EmailJS**, siga o comentário da função `sendForm()` em `js/main.js`.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub. Se o nome for `SEU-USUARIO.github.io`, o site fica na raiz desse domínio.
2. Envie os arquivos:
   ```bash
   git init
   git add .
   git commit -m "Primeira versão do portfólio"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```
3. No repositório, acesse **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`. Depois clique em **Save**.
5. Em um ou dois minutos o site estará em `https://SEU-USUARIO.github.io/SEU-REPO/`.

Os caminhos do site são relativos, então ele funciona tanto na raiz quanto em um subcaminho.

## Publicar na Netlify

- **Arrastar e soltar:** acesse https://app.netlify.com/drop e arraste a pasta do projeto.
- **Via GitHub:** em **Add new site → Import an existing project**, selecione o repositório.
  Deixe o *Build command* vazio e use `.` como *Publish directory*.
  Cada `git push` passa a publicar o site automaticamente.

## Personalização rápida

- **Cores, fontes e espaçamentos:** variáveis no topo de `css/style.css` (`:root`).
- **Cor de destaque:** `--color-accent` (tema claro) e o valor correspondente no bloco do tema escuro.
- **Projetos:** cada card em `index.html` tem `data-category` (`desenvolvimento`, `dados`, `infraestrutura`,
  separados por espaço), que é usado pelo filtro.
