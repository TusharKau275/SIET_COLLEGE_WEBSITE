
const CREDENTIALS = {
  student: { id: 'STU2024001', pass: '123456',  name: 'Rahul Kumar',    role: 'B.Tech CSE – 3rd Year' },
  parent:  { id: 'PAR2024001', pass: 'parent@1', name: 'Mr. Suresh Kumar', role: 'Parent of Rahul Kumar' },
  admin:   { id: 'admin',      pass: 'admin@123', name: 'Dr. R.K. Sharma', role: 'Principal / Admin' },
};

let activePortal = 'student';   
let currentUser  = null;        

document.addEventListener('DOMContentLoaded', () => {

  /* Loading screen */
  setTimeout(() => {
    const el = document.getElementById('loading');
    if (el) { el.classList.add('hide'); setTimeout(() => el.remove(), 600); }
    setTimeout(showPopup, 900);
  }, 2100);

  /* Dark mode */
  const saved = localStorage.getItem('siet-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.querySelectorAll('.dark-btn').forEach(b => {
    b.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('siet-theme', next);
    });
  });

  /* Announcement bar close */
  const closeBar = document.querySelector('.ann-close');
  if (closeBar) closeBar.onclick = () => { const b = document.getElementById('ann-bar'); if (b) b.style.display = 'none'; };

  /* Navbar scroll */
  const nb = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nb && nb.classList.toggle('scrolled', scrollY > 50);
    const bt = document.getElementById('btt');
    bt && bt.classList.toggle('show', scrollY > 400);
    updateActiveNav();
  });

  /* Active nav */
  function updateActiveNav() {
    document.querySelectorAll('section[id]').forEach(sec => {
      if (scrollY >= sec.offsetTop - 110) {
        document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }

  /* Hamburger */
  const ham = document.querySelector('.hamburger');
  const mob = document.querySelector('.mob-nav');
  ham && ham.addEventListener('click', () => { ham.classList.toggle('open'); mob && mob.classList.toggle('open'); });
  document.querySelectorAll('.mob-nav a').forEach(a => a.addEventListener('click', () => { ham && ham.classList.remove('open'); mob && mob.classList.remove('open'); }));

  /* Back to top */
  document.getElementById('btt') && document.getElementById('btt').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Popup */
  function showPopup() { const o = document.getElementById('popup-ov'); o && o.classList.add('show'); }
  function closePopup() { const o = document.getElementById('popup-ov'); o && o.classList.remove('show'); }
  document.getElementById('popup-x')   && document.getElementById('popup-x').addEventListener('click', closePopup);
  document.getElementById('popup-dis') && document.getElementById('popup-dis').addEventListener('click', closePopup);
  document.getElementById('popup-ov')  && document.getElementById('popup-ov').addEventListener('click', e => { if (e.target === e.currentTarget) closePopup(); });

  /* Hero slideshow */
  const slides = document.querySelectorAll('.h-slide');
  if (slides.length) {
    let cur = 0;
    slides[0].classList.add('active');
    setInterval(() => {
      slides[cur].classList.remove('active'); slides[cur].classList.add('exit');
      const old = cur;
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('active');
      setTimeout(() => slides[old].classList.remove('exit'), 650);
    }, 3200);
  }

  /* Counter animation */
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = '1';
        e.target.querySelectorAll('[data-target]').forEach(animCount);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stats-bar .grid-4, .pl-stats, .hero-stats, .hero-wrap').forEach(el => cObs.observe(el));

  function animCount(el) {
    const target = +el.dataset.target, suf = el.dataset.suffix || '';
    const step = target / (2000 / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = Math.floor(cur).toLocaleString() + suf;
    }, 16);
  }

  /* Scroll reveal */
  const rObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => rObs.observe(el));

  /* Testimonials slider */
  const track = document.querySelector('.ts-track');
  const dots  = document.querySelectorAll('.sl-dot');
  const total = document.querySelectorAll('.ts-slide').length;
  let si = 0;
  function goSlide(i) {
    si = (i + total) % total;
    if (track) track.style.transform = `translateX(-${si * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === si));
  }
  dots.forEach((d, i) => d.addEventListener('click', () => goSlide(i)));
  document.querySelector('.sl-prev') && document.querySelector('.sl-prev').addEventListener('click', () => goSlide(si - 1));
  document.querySelector('.sl-next') && document.querySelector('.sl-next').addEventListener('click', () => goSlide(si + 1));
  if (total > 0) { goSlide(0); setInterval(() => goSlide(si + 1), 5000); }

  /* Star rating */
  let stars = 0;
  document.querySelectorAll('.star').forEach((s, i) => {
    s.addEventListener('mouseover',  () => hiliteStars(i + 1));
    s.addEventListener('mouseout',   () => hiliteStars(stars));
    s.addEventListener('click',      () => { stars = i + 1; hiliteStars(stars); });
  });
  function hiliteStars(n) { document.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('on', i < n)); }

  /* Contact form */
  const cf = document.getElementById('contact-form');
  cf && cf.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    cf.querySelectorAll('[required]').forEach(f => {
      const err = f.parentElement.querySelector('.err-msg');
      const bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      f.classList.toggle('err', bad);
      if (err) err.style.display = bad ? 'block' : 'none';
      if (bad) ok = false;
    });
    if (!ok) return;
    const btn = cf.querySelector('button[type=submit]');
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(() => {
      document.getElementById('form-ok').style.display = 'block';
      cf.reset(); hiliteStars(0); stars = 0;
      btn.textContent = 'Send Message'; btn.disabled = false;
      setTimeout(() => document.getElementById('form-ok').style.display = 'none', 5000);
    }, 1500);
  });

  /* Weather API */
  (async () => {
    try {
      const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.39&longitude=76.93&current_weather=true&hourly=relativehumidity_2m,windspeed_10m');
      const d = await r.json(); const w = d.current_weather;
      const iconMap = { 0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',61:'🌧️',63:'🌧️',80:'🌦️',95:'⛈️' };
      const descMap = { 0:'Clear Sky',1:'Mainly Clear',2:'Partly Cloudy',3:'Overcast',45:'Foggy',61:'Light Rain',63:'Rain',80:'Showers',95:'Thunderstorm' };
      const t = Math.round(w.temperature), wc = w.weathercode;
      const tmp  = document.querySelector('.w-temp');
      const dsc  = document.querySelector('.w-desc');
      const exs  = document.querySelectorAll('.w-extra span');
      if (tmp) tmp.textContent  = `${iconMap[wc]||'🌡️'} ${t}°C`;
      if (dsc) dsc.textContent  = (descMap[wc]||'') + ' · Nilokheri';
      if (exs[0]) exs[0].textContent = `💨 ${Math.round(w.windspeed)} km/h`;
      if (exs[1]) exs[1].textContent = `💧 ${d.hourly?.relativehumidity_2m[0]||'--'}%`;
    } catch { const t = document.querySelector('.w-temp'); if (t) t.textContent = '-- °C'; }
  })();

  /* Hacker News */
  (async () => {
    const feed = document.getElementById('tech-feed');
    if (!feed) return;
    try {
      const ids    = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(r => r.json());
      const stories = await Promise.all(ids.slice(0, 5).map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())));
      feed.innerHTML = stories.map(s => `
        <div class="n-item" onclick="window.open('${s.url||'#'}','_blank')">
          <div class="n-date">HN</div>
          <div><h5 style="font-size:.79rem">${(s.title||'').substring(0,68)}…</h5><p>⬆️ ${s.score||0} pts</p></div>
        </div>`).join('');
    } catch { if (feed) feed.innerHTML = '<p style="padding:.85rem;font-size:.82rem;color:var(--text-muted)">Unable to load news.</p>'; }
  })();

  /* Static notices */
  const NOTICES = [
    { date:'Jun 15', title:'B.Tech Admissions 2025-26 Open', desc:'Apply via HSTES portal. Last date: July 10', isNew:true },
    { date:'Jun 12', title:'Campus Placement – TCS & Infosys', desc:'Eligible: CSE, IT, ECE 2025 batch', isNew:true },
    { date:'Jun 10', title:'TECHNOVA 2025 – Register Now', desc:'Prizes worth ₹2 Lakhs. National level event', isNew:false },
    { date:'Jun 8',  title:'Mid-Term Exam Schedule Released', desc:'Check your department notice board', isNew:false },
    { date:'Jun 5',  title:'NPTEL Enrolment Open', desc:'Last date to register for online courses', isNew:false },
    { date:'Jun 1',  title:'Anti-Ragging Meeting',  desc:'Compulsory for all freshers', isNew:false },
  ];
  const nl = document.querySelector('.notice-list');
  if (nl) nl.innerHTML = NOTICES.map(n => `
    <div class="n-item">
      <div class="n-date">${n.date}</div>
      <div>
        <h5>${n.isNew ? '<span class="n-new">NEW</span> ' : ''}${n.title}</h5>
        <p>${n.desc}</p>
      </div>
    </div>`).join('');

  /* Newsletter */
  document.querySelectorAll('.nl-form').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const inp = f.querySelector('input');
    if (inp && /\S+@\S+\.\S+/.test(inp.value)) { inp.value = ''; toast('✅ Subscribed successfully!'); }
    else toast('⚠️ Enter a valid email.', true);
  }));

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); const off = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68; window.scrollTo({ top: t.offsetTop - off, behavior:'smooth' }); }
  }));

  /* ── Portal selector buttons ── */
  document.querySelectorAll('.ps-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ps-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      activePortal = btn.dataset.portal;
      updateLoginHints();
    });
  });

  function updateLoginHints() {
    const c = CREDENTIALS[activePortal];
    const hints = document.querySelectorAll('.demo-id-hint');
    hints.forEach(h => h.textContent = c.id);
    const ph = document.querySelectorAll('.demo-pw-hint');
    ph.forEach(p => p.textContent = c.pass);
    // Update placeholder text
    const idInput = document.getElementById('login-id');
    if (idInput) {
      const labels = { student:'Roll Number', parent:'Parent ID', admin:'Admin Username' };
      const placehold = { student:'e.g. STU2024001', parent:'e.g. PAR2024001', admin:'e.g. admin' };
      idInput.placeholder = placehold[activePortal] || '';
      const lbl = document.querySelector('.lf-id-label');
      if (lbl) lbl.textContent = labels[activePortal];
    }
  }

  /* ── Login form submit ── */
  const lf = document.getElementById('login-form');
  lf && lf.addEventListener('submit', e => {
    e.preventDefault();
    const id   = document.getElementById('login-id').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    const err  = document.getElementById('login-error');
    const cred = CREDENTIALS[activePortal];
    if (id === cred.id && pass === cred.pass) {
      currentUser = { ...cred, type: activePortal };
      err.style.display = 'none';
      showPortal(activePortal);
    } else {
      err.textContent = '❌ Invalid credentials. Please check the demo hints below.';
      err.style.display = 'block';
    }
  });

  /* ── Show portal page ── */
  window.showPortalLogin = function(type) {
    // Close mobile nav if open
    if (mob) mob.classList.remove('open');
    if (ham) ham.classList.remove('open');
    // Switch to login view
    document.getElementById('main-site').style.display = 'none';
    document.getElementById('login-section').style.display = 'flex';
    // Pre-select portal type
    document.querySelectorAll('.ps-btn').forEach(b => b.classList.toggle('selected', b.dataset.portal === type));
    activePortal = type;
    updateLoginHints();
  };

  window.goBackToSite = function() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
  };

  function showPortal(type) {
    document.getElementById('login-section').style.display = 'none';
    document.querySelectorAll('.portal-page').forEach(p => p.classList.remove('active'));
    const pg = document.getElementById(`portal-${type}`);
    if (pg) {
      pg.classList.add('active');
      // Set user name in topbar
      pg.querySelectorAll('.ptb-uname').forEach(el => el.textContent = currentUser.name);
      pg.querySelectorAll('.ptb-urole').forEach(el => el.textContent = currentUser.role);
      pg.querySelectorAll('.ptb-init').forEach(el => el.textContent = currentUser.name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase());
    }
  }

  /* ── Portal logout ── */
  window.portalLogout = function() {
    currentUser = null;
    document.querySelectorAll('.portal-page').forEach(p => p.classList.remove('active'));
    document.getElementById('main-site').style.display = 'block';
    
    const lf = document.getElementById('login-form');
    if (lf) lf.reset();
    const err = document.getElementById('login-error');
    if (err) err.style.display = 'none';
  };

  /* ── Portal sidebar navigation ── */
  document.querySelectorAll('.ps-link').forEach(link => {
    link.addEventListener('click', () => {
      const portal = link.closest('.portal-page');
      if (!portal) return;
      portal.querySelectorAll('.ps-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const target = link.dataset.tab;
      portal.querySelectorAll('.portal-tab').forEach(t => t.classList.toggle('hidden', t.dataset.tabcontent !== target));
    });
  });

  /* First tab active by default */
  document.querySelectorAll('.portal-page').forEach(pg => {
    const firstLink = pg.querySelector('.ps-link[data-tab]');
    const firstTab  = firstLink ? pg.querySelector(`.portal-tab[data-tabcontent="${firstLink.dataset.tab}"]`) : null;
    if (firstLink) firstLink.classList.add('active');
    if (firstTab) firstTab.classList.remove('hidden');
    pg.querySelectorAll('.portal-tab').forEach((t, i) => { if (i > 0) t.classList.add('hidden'); });
  });

  /* Init login hints */
  updateLoginHints();

});

/* ── Toast utility ──────────────────────────────────────────── */
function toast(msg, isErr = false) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  el.style.cssText = `background:${isErr ? '#ef4444' : '#16a34a'};color:#fff`;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .4s'; setTimeout(() => el.remove(), 400); }, 3000);
}
