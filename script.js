/**
 * RIAN ENTERTAINMENT — Script Principal
 * Controle de intro cinematográfica estilo PS2, partículas, navegação temática e contato
 */

document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('intro-screen');
  const btnSkipIntro = document.getElementById('btn-skip-intro');
  const particlesCanvas = document.getElementById('intro-particles-canvas');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  let introDismissed = false;
  let particlesAnimationId = null;
  let introTimer = null;
  let safetyTimer = null;

  // Função para fechar a tela de abertura com transição suave
  function dismissIntro() {
    if (introDismissed) return;
    introDismissed = true;

    // Limpar os temporizadores ativos para evitar múltiplos disparos
    if (introTimer) {
      clearTimeout(introTimer);
      introTimer = null;
    }
    if (safetyTimer) {
      clearTimeout(safetyTimer);
      safetyTimer = null;
    }

    if (introScreen) {
      introScreen.classList.add('fade-out');
      // Aguardar o término da transição de opacidade (1.8s) antes de ocultar
      setTimeout(() => {
        introScreen.style.display = 'none';
        if (particlesAnimationId) {
          cancelAnimationFrame(particlesAnimationId);
          particlesAnimationId = null;
        }
      }, 1850);
    }
  }

  // Verificar preferência do usuário de movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Acessibilidade: remove imediatamente se o usuário tiver sensibilidade a movimento
    if (introScreen) {
      introScreen.style.display = 'none';
    }
    introDismissed = true;
  } else {
    // Inicializar partículas e poeira luminosa azul (estilo PS2 cosmos)
    if (particlesCanvas && particlesCanvas.getContext) {
      const ctx = particlesCanvas.getContext('2d');
      let width = (particlesCanvas.width = window.innerWidth);
      let height = (particlesCanvas.height = window.innerHeight);

      window.addEventListener('resize', () => {
        if (!introDismissed && particlesCanvas) {
          width = particlesCanvas.width = window.innerWidth;
          height = particlesCanvas.height = window.innerHeight;
        }
      });

      // Partículas em múltiplas camadas de profundidade com entrada gradual de opacidade global
      const particleCount = Math.min(Math.floor((width * height) / 10000), 90);
      const particles = [];
      const startTime = Date.now();

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 0.6,
          speedY: -(Math.random() * 0.32 + 0.1),
          speedX: (Math.random() - 0.5) * 0.28,
          alpha: Math.random() * 0.7 + 0.2,
          pulseSpeed: Math.random() * 0.015 + 0.005,
          hue: Math.random() > 0.35 ? 214 : 196
        });
      }

      function renderParticles() {
        if (introDismissed && !introScreen) return;
        ctx.clearRect(0, 0, width, height);

        // Entrada gradual da intensidade das partículas nos primeiros 3 segundos
        const elapsed = (Date.now() - startTime) / 1000;
        const globalFade = Math.min(1, elapsed / 2.5);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += p.speedY;
          p.x += p.speedX;
          p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.006;

          if (p.y < -15) p.y = height + 15;
          if (p.x < -15) p.x = width + 15;
          if (p.x > width + 15) p.x = -15;

          const currentAlpha = Math.max(0.12, Math.min(0.9, p.alpha)) * globalFade;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 85%, 72%, ${currentAlpha})`;
          ctx.shadowBlur = p.radius * 4;
          ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, ${currentAlpha})`;
          ctx.fill();
        }

        particlesAnimationId = requestAnimationFrame(renderParticles);
      }

      renderParticles();
    }

    // Botão discreto "PULAR INTRO"
    if (btnSkipIntro) {
      btnSkipIntro.addEventListener('click', dismissIntro);
    }

    // Pular com a tecla Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !introDismissed) {
        dismissIntro();
      }
    });

    // Pular com a rolagem deliberada do mouse
    window.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > 15 && !introDismissed) {
        dismissIntro();
      }
    }, { passive: true });

    // Duração total das 5 fases da introdução (11.5 segundos antes de iniciar a transição suave de 1.8s)
    introTimer = setTimeout(() => {
      dismissIntro();
    }, 11500);

    // Salvaguarda caso a aba fique em segundo plano
    safetyTimer = setTimeout(() => {
      if (!introDismissed) dismissIntro();
    }, 14500);
  }

  // Destacar link ativo conforme o scroll ou clique
  function setActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav);

  // Navegação suave ao clicar nos links do menu
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // ==========================================================================
  // VALIDAÇÃO LOCAL DO FORMULÁRIO DE CONTATO (ETAPA 4)
  // Sem promessa de envio backend falso: valida campos e gera link mailto ou feedback
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMessage = document.getElementById('error-message');
  const formFeedback = document.getElementById('form-feedback');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function clearErrors() {
    if (errorName) errorName.textContent = '';
    if (errorEmail) errorEmail.textContent = '';
    if (errorMessage) errorMessage.textContent = '';
    if (formFeedback) {
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';
      formFeedback.style.display = 'none';
    }
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) input.classList.remove('input-error');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Validação do Nome
      if (!nameVal || nameVal.length < 2) {
        if (errorName) errorName.textContent = 'Por favor, informe seu nome (mínimo 2 caracteres).';
        if (nameInput) nameInput.classList.add('input-error');
        isValid = false;
      }

      // Validação do E-mail
      if (!emailVal || !validateEmail(emailVal)) {
        if (errorEmail) errorEmail.textContent = 'Por favor, insira um endereço de e-mail válido.';
        if (emailInput) emailInput.classList.add('input-error');
        isValid = false;
      }

      // Validação da Mensagem
      if (!messageVal || messageVal.length < 8) {
        if (errorMessage) errorMessage.textContent = 'A mensagem deve conter pelo menos 8 caracteres.';
        if (messageInput) messageInput.classList.add('input-error');
        isValid = false;
      }

      if (isValid) {
        // Honestidade total: avisa o usuário e oferece abrir diretamente o app de e-mail com o texto preenchido
        const mailSubject = encodeURIComponent(`Contato de ${nameVal} — RIAN ENTERTAINMENT`);
        const mailBody = encodeURIComponent(`Nome: ${nameVal}\nE-mail: ${emailVal}\n\nMensagem:\n${messageVal}`);
        const mailtoLink = `mailto:rianferreiradelim@gmail.com?subject=${mailSubject}&body=${mailBody}`;

        if (formFeedback) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = `
            <strong>Dados validados com sucesso!</strong><br>
            Como este site não possui servidor backend próprio, clique no botão abaixo para abrir diretamente seu aplicativo de e-mail com a mensagem pré-preenchida para <strong>rianferreiradelim@gmail.com</strong>:<br><br>
            <a href="${mailtoLink}" class="btn btn-primary" style="padding: 0.6rem 1.2rem; font-size: 0.8rem; display: inline-flex;">Abrir e-mail com a mensagem</a>
          `;
          formFeedback.style.display = 'block';
        }
      }
    });
  }

  // ==========================================================================
  // ANIMAÇÕES DE ROLAGEM COM INTERSECTION OBSERVER (ETAPA 5)
  // Adiciona a classe no body para habilitar transição apenas se o JS estiver ativo
  // ==========================================================================
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('js-observer');
    
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Desobserva o elemento após animar para não repetir desnecessariamente
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));
  }
});
