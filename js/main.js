/* ==========================================================================
   Portfólio · Leandro Carvalho
   JavaScript puro (vanilla), sem dependências.
   Cada recurso é uma função independente, inicializada no final do arquivo.
   ========================================================================== */

(function () {
  'use strict';

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Tema claro/escuro (preferência salva no localStorage)
     ------------------------------------------------------------------------ */
  function initTheme() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Tema efetivo: o escolhido pelo usuário ou, na falta dele, o do sistema
    const currentTheme = () =>
      root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');

    const updateLabel = () => {
      const next = currentTheme() === 'dark' ? 'claro' : 'escuro';
      btn.setAttribute('aria-label', `Ativar tema ${next}`);
    };

    btn.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* armazenamento indisponível */ }
      updateLabel();
    });

    systemDark.addEventListener('change', updateLabel);
    updateLabel();
  }

  /* ------------------------------------------------------------------------
     2. Cabeçalho: muda de estilo ao rolar
     ------------------------------------------------------------------------ */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------------
     3. Menu hambúrguer (mobile)
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const list = document.getElementById('nav-list');
    if (!toggle || !list) return;

    const desktop = window.matchMedia('(min-width: 60em)');

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      list.classList.toggle('is-open', open);
      document.body.classList.toggle('no-scroll', open);
      // No mobile, os links do menu fechado não devem receber foco pelo Tab
      list.querySelectorAll('a').forEach((a) => {
        if (open || desktop.matches) a.removeAttribute('tabindex');
        else a.setAttribute('tabindex', '-1');
      });
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Fecha ao escolher um link
    list.addEventListener('click', (e) => {
      if (e.target.closest('a') && !desktop.matches) setOpen(false);
    });

    // Fecha com a tecla Esc e devolve o foco ao botão
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && list.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Ao passar para o desktop, garante que o menu volte ao estado normal
    desktop.addEventListener('change', () => setOpen(false));
    setOpen(false);
  }

  /* ------------------------------------------------------------------------
     4. Destaque do link ativo conforme a seção visível (IntersectionObserver)
     ------------------------------------------------------------------------ */
  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll('.nav-link'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    const map = new Map();
    links.forEach((link) => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) map.set(section, link);
    });
    // "Cursos e certificações" não tem link próprio; destaca "Formação"
    const certs = document.getElementById('certificacoes');
    const formLink = links.find((l) => l.getAttribute('href') === '#formacao');
    if (certs && formLink) map.set(certs, formLink);

    const setActive = (link) => {
      links.forEach((l) => {
        const active = l === link;
        l.classList.toggle('is-active', active);
        if (active) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
    };

    // Considera "ativa" a seção que cruza uma faixa estreita no meio da tela
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(map.get(entry.target));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    map.forEach((_, section) => observer.observe(section));

    // No hero nenhum link fica ativo
    const hero = document.getElementById('inicio');
    if (hero) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActive(null);
      }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
    }
  }

  /* ------------------------------------------------------------------------
     5. Animações sutis de entrada (respeita prefers-reduced-motion)
     ------------------------------------------------------------------------ */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Pequeno atraso escalonado entre irmãos, para um efeito mais elegante
    items.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal'));
      const index = siblings.indexOf(el);
      el.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     6. Contadores animados (seção "Sobre")
     ------------------------------------------------------------------------ */
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length || prefersReducedMotion || !('IntersectionObserver' in window)) return;

    const DURATION = 1600;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / DURATION, 1);
        el.textContent = Math.round(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    // O valor final já está no HTML (bom para SEO e sem JS); zera só antes de animar
    counters.forEach((el) => { el.textContent = '0'; });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------------
     7. Filtro de projetos por categoria
     ------------------------------------------------------------------------ */
  function initProjectFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    const status = document.getElementById('filter-status');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });

        let visible = 0;
        cards.forEach((card) => {
          const categories = (card.dataset.category || '').split(' ');
          const show = filter === 'todos' || categories.includes(filter);
          card.classList.toggle('is-hidden', !show);
          if (show) {
            visible++;
            card.classList.add('is-visible'); // garante que cards recém-exibidos apareçam
          }
        });

        // Anuncia o resultado para leitores de tela
        if (status) status.textContent = `${visible} projeto${visible === 1 ? '' : 's'} exibido${visible === 1 ? '' : 's'}.`;
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. Formulário de contato: validação e envio
     ------------------------------------------------------------------------ */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // Regras de validação de cada campo
    const rules = {
      nome: (v) => (v.length < 2 ? 'Informe seu nome.' : ''),
      email: (v) => (!v ? 'Informe seu e-mail.' : !EMAIL_RE.test(v) ? 'Informe um e-mail válido.' : ''),
      mensagem: (v) => (v.length < 10 ? 'Escreva uma mensagem com pelo menos 10 caracteres.' : ''),
    };

    const validateField = (input) => {
      const rule = rules[input.name];
      if (!rule) return true;
      const message = rule(input.value.trim());
      const field = input.closest('.field');
      const error = document.getElementById(`${input.id}-erro`);
      field.classList.toggle('has-error', !!message);
      input.setAttribute('aria-invalid', String(!!message));
      if (error) error.textContent = message;
      return !message;
    };

    // Valida ao sair do campo e, depois de um erro, enquanto o usuário digita
    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.field').classList.contains('has-error')) validateField(input);
      });
    });

    const setStatus = (msg, type) => {
      status.textContent = msg;
      status.className = `form-status${type ? ` is-${type}` : ''}`;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const inputs = Object.keys(rules).map((n) => form.elements[n]);
      const results = inputs.map(validateField);
      const firstInvalid = inputs[results.indexOf(false)];
      if (firstInvalid) {
        firstInvalid.focus();
        setStatus('Revise os campos destacados.', 'error');
        return;
      }

      // Anti-spam: se o campo isca foi preenchido, ignora silenciosamente
      if (form.elements._gotcha && form.elements._gotcha.value) return;

      submitBtn.disabled = true;
      setStatus('Enviando…');

      try {
        const result = await sendForm(form);
        if (result === 'mailto') {
          setStatus('Abrimos seu programa de e-mail com a mensagem pronta. É só enviar!', 'success');
        } else {
          form.reset();
          setStatus('Mensagem enviada! Obrigado pelo contato, responderei em breve.', 'success');
        }
      } catch (err) {
        setStatus('Não foi possível enviar agora. Tente pelo e-mail ou pelo WhatsApp.', 'error');
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /**
   * Envia os dados do formulário.
   *
   * OPÇÃO A: FORMSPREE (padrão, sem bibliotecas)
   *   1. Crie um formulário em https://formspree.io
   *   2. No index.html, troque o action "https://formspree.io/f/SEU_ID" pelo seu endpoint.
   *   Pronto: o código abaixo envia via fetch e recebe a resposta em JSON.
   *
   * OPÇÃO B: EMAILJS
   *   1. Crie uma conta em https://www.emailjs.com, um serviço de e-mail e um template
   *      com as variáveis {{nome}}, {{email}} e {{mensagem}}.
   *   2. Adicione no index.html, antes do main.js:
   *        <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   *   3. Substitua o corpo desta função por:
   *        emailjs.init({ publicKey: 'SUA_PUBLIC_KEY' });
   *        return emailjs.sendForm('SEU_SERVICE_ID', 'SEU_TEMPLATE_ID', form);
   *
   * Enquanto nada estiver configurado, abre o programa de e-mail do visitante (mailto).
   */
  async function sendForm(form) {
    const endpoint = form.getAttribute('action') || '';

    if (endpoint.includes('SEU_ID')) {
      const data = new FormData(form);
      const subject = encodeURIComponent(`Contato pelo portfólio: ${data.get('nome')}`);
      const body = encodeURIComponent(`${data.get('mensagem')}\n\n${data.get('nome')} <${data.get('email')}>`);
      window.location.href = `mailto:lcarvalho.leandro@gmail.com?subject=${subject}&body=${body}`;
      return 'mailto';
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Falha no envio (${response.status})`);
    return 'sent';
  }

  /* ------------------------------------------------------------------------
     9. Detalhes: foto com fallback e ano atual no rodapé
     ------------------------------------------------------------------------ */
  function initProfilePhoto() {
    const img = document.querySelector('.hero-photo img');
    if (!img) return;
    const useFallback = () => {
      if (img.dataset.fallback && !img.src.endsWith(img.dataset.fallback)) img.src = img.dataset.fallback;
    };
    img.addEventListener('error', useFallback, { once: true });
    // A imagem pode ter falhado antes do script carregar
    if (img.complete && img.naturalWidth === 0) useFallback();
  }

  function initYear() {
    const el = document.getElementById('ano');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------------
     Inicialização
     ------------------------------------------------------------------------ */
  initTheme();
  initHeaderScroll();
  initMobileNav();
  initScrollSpy();
  initReveal();
  initCounters();
  initProjectFilter();
  initContactForm();
  initProfilePhoto();
  initYear();
})();
