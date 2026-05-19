// ===== MÁSCARA DE TELEFONE =====
function maskPhone(input) {
  input.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else {
      v = v.replace(/^(\d{0,2})$/, '($1');
    }
    this.value = v;
  });
}

// Aplica máscara nos dois formulários
const phoneMain = document.getElementById('phone');
const phoneHero = document.getElementById('heroPhone');
if (phoneMain) maskPhone(phoneMain);
if (phoneHero) maskPhone(phoneHero);


// ===== FORMULÁRIO HERO — redireciona para WhatsApp =====
const heroForm = document.getElementById('heroForm');
if (heroForm) {
  heroForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome    = this.querySelector('input[name="nome"]').value.trim();
    const wpp     = this.querySelector('input[name="whatsapp"]').value.trim();
    const servico = this.querySelector('select[name="servico"]').value;

    const servicoLabel = servico
      ? this.querySelector(`option[value="${servico}"]`).textContent
      : 'Não informado';

    const msg = encodeURIComponent(
      `Olá! Me chamo ${nome}.\n` +
      `Preciso de ajuda com: ${servicoLabel}.\n` +
      `Meu WhatsApp: ${wpp}`
    );

    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Abrindo WhatsApp...';
    btn.disabled = true;

    setTimeout(() => {
      window.open(`https://wa.me/5511999999999?text=${msg}`, '_blank');
      btn.textContent = 'Quero análise gratuita →';
      btn.disabled = false;
      heroForm.reset();
    }, 600);
  });
}


// ===== FORMULÁRIO CONTATO (seção inferior) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Troca por fetch para Formspree quando tiver conta:
    // fetch('https://formspree.io/f/SEU_ID', { method: 'POST', body: new FormData(this) })
    setTimeout(() => {
      this.classList.add('hidden');
      document.getElementById('formSuccess').classList.remove('hidden');
    }, 1200);
  });
}


// ===== THEME SWITCHER =====
const themeToggle  = document.getElementById('themeToggle');
const themePanel   = document.getElementById('themePanel');
const overlayRange = document.getElementById('overlayRange');
const BASE_URL     = 'https://images.unsplash.com/photo-';
const SUFFIX       = '?auto=format&fit=crop&w=1920&q=80';

let currentOverlay = 85;
let currentPhoto   = '1454165804606-c3d57bc86b40';

function applyTheme(photo, opacity) {
  const pct = opacity / 100;
  document.body.style.backgroundImage =
    `linear-gradient(rgba(8,8,8,${pct}),rgba(8,8,8,${pct})),` +
    `url('${BASE_URL}${photo}${SUFFIX}')`;
}

// Toggle painel
themeToggle.addEventListener('click', () => {
  themePanel.classList.toggle('is-open');
});

// Fechar ao clicar fora
document.addEventListener('click', e => {
  const switcher = document.getElementById('themeSwitcher');
  if (!switcher.contains(e.target)) {
    themePanel.classList.remove('is-open');
  }
});

// Trocar foto
document.querySelectorAll('.theme-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    currentPhoto = btn.dataset.photo;
    applyTheme(currentPhoto, currentOverlay);
    document.querySelectorAll('.theme-opt').forEach(b => b.classList.remove('theme-opt--active'));
    btn.classList.add('theme-opt--active');
  });
});

// Slider de overlay
overlayRange.addEventListener('input', function () {
  currentOverlay = parseInt(this.value);
  applyTheme(currentPhoto, currentOverlay);
});

// Aplica tema inicial
applyTheme(currentPhoto, currentOverlay);

// ===== FAQ: fecha outros ao abrir um =====
document.querySelectorAll('.faq__item').forEach(item => {
  item.addEventListener('toggle', function () {
    if (this.open) {
      document.querySelectorAll('.faq__item').forEach(other => {
        if (other !== this) other.open = false;
      });
    }
  });
});


// ===== HEADER: oculta floating WA quando o hero está visível =====
// (evita duplicação visual de dois botões WA ao mesmo tempo)
const floatWa = document.querySelector('.float-wa');
if (floatWa) {
  const heroSection = document.querySelector('.hero');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // Enquanto o hero estiver visível, deixa o botão flutuante com opacidade reduzida
      floatWa.style.opacity = entry.isIntersecting ? '0' : '1';
      floatWa.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0.3 });

  if (heroSection) observer.observe(heroSection);
}
