/* Логика сайта. Данные по умолчанию — в content-defaults.js, правки владельца приходят из /api/content. */
(() => {
const D = window.DEF;
const T = D.T, PRICES = { ...D.PRICES };
let RATES = { ...D.RATES }, FAQ = D.FAQ, POSTS = D.POSTS;
let CONTACTS = {}, PHOTO = null;
const { MARQUEE, FACTS, WHO, LEVELS, FORMATS, STEPS, FORM_FORMATS, FORM_TIMES, CATS } = D;
const RICH = { 'hero.h1': 1, 'about.cert': 1 }; // первая строка обычная, вторая — выделенная

let lang = (() => { try { const s = localStorage.getItem('padel-lang'); if (['ro','en','uk'].includes(s)) return s; } catch (e) {}
  const n = (navigator.language || '').toLowerCase(); return n.startsWith('uk') ? 'uk' : n.startsWith('ro') ? 'ro' : n.startsWith('en') ? 'en' : 'ro'; })();
let level = 0, fmtSel = 0, timeSel = 2, faqOpen = 0, cat = 'all', sending = false;

const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = k => (T[k] && T[k][lang]) || '';
const group = n => n.toLocaleString('ru-RU').replace(/ /g, ' ');
const pick = (o, l) => (o && (o[l] || o.ro || o.uk || o.en)) || '';

function rich(v) {
  const [a, ...rest] = String(v).split('\n');
  return esc(a) + (rest.length ? '<br><span>' + esc(rest.join(' ')) + '</span>' : '');
}

/* ---------- правки владельца ---------- */
function applyContent(c, rates) {
  if (rates && rates.USD && rates.UAH) RATES = rates;
  if (!c) return;
  if (c.prices) for (const k of Object.keys(PRICES)) { const v = Number(c.prices[k]); if (v > 0) PRICES[k] = v; }
  if (c.texts) for (const k of Object.keys(c.texts)) {
    const o = c.texts[k] || {};
    T[k] = T[k] || { ro: '', en: '', uk: '' };
    for (const l of ['ro', 'en', 'uk']) if (o[l] && String(o[l]).trim()) T[k][l] = RICH[k] ? rich(o[l]) : esc(o[l]);
  }
  if (Array.isArray(c.faq) && c.faq.length) {
    const f = {};
    for (const l of ['ro', 'en', 'uk']) f[l] = c.faq.map(i => [esc(pick(i.q, l)), esc(pick(i.a, l))]);
    FAQ = f;
  }
  if (c.contacts) CONTACTS = c.contacts;
  if (c.photos && c.photos.coach) PHOTO = c.photos.coach;
  if (Array.isArray(c.posts) && c.posts.length) POSTS = c.posts;
}

/* ---------- цены ---------- */
function money(lei) {
  if (lang === 'en') { const v = Math.round(lei / RATES.USD); return { main: `≈ $${group(v)}`, sub: `${group(lei)} lei · ${t('payLei')}` }; }
  if (lang === 'uk') { const v = Math.round(lei / RATES.UAH / 10) * 10; return { main: `≈ ${group(v)} грн`, sub: `${group(lei)} lei · ${t('payLei')}` }; }
  return { main: `${group(lei)} lei`, sub: '' };
}

/* ---------- статьи ---------- */
function md(text, post) {
  return String(text || '').split(/\n\s*\n/).map(block => {
    const b = block.trim(); if (!b) return '';
    const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    if (b === '[video]') {
      const id = youtubeId(post && post.videoUrl);
      return id ? `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="Video" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`
                : `<div class="video">▶<br>${esc(post && post.video ? post.video : '')}</div>`;
    }
    if (b.startsWith('## ')) return `<h3>${inline(b.slice(3))}</h3>`;
    if (b.startsWith('> ')) return `<div class="tip">${inline(b.replace(/^>\s?/gm, '')).replace(/<strong>/, '<b>').replace(/<\/strong>/, '</b>')}</div>`;
    return `<p>${inline(b)}</p>`;
  }).join('');
}
function youtubeId(u) {
  if (!u) return null;
  const m = String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function cover(p) {
  const isVideo = !!(p.video || p.videoUrl);
  const play = isVideo ? `<span class="play" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>` : '';
  if (p.coverImg) return `<div class="cover"><img src="${esc(p.coverImg)}" alt="" loading="lazy">${play}</div>`;
  const n = p.cover || 1;
  const lines = {
    1: `<path d="M40 210 Q 180 20 330 120" stroke="#D4FF3A" stroke-width="3" stroke-dasharray="8 9" fill="none"/><circle cx="330" cy="120" r="14" fill="#D4FF3A"/>`,
    2: `<rect x="250" y="20" width="120" height="210" fill="none" stroke="#7FA8C9" stroke-opacity=".6" stroke-width="6"/><path d="M40 60 L 245 150 L 120 230" stroke="#D4FF3A" stroke-width="3" stroke-dasharray="8 9" fill="none"/>`,
    3: `<line x1="200" y1="0" x2="200" y2="250" stroke="#F2F1EA" stroke-width="5"/><path d="M60 200 Q 140 90 330 60" stroke="#D4FF3A" stroke-width="3" stroke-dasharray="8 9" fill="none"/>`,
    4: `<ellipse cx="200" cy="105" rx="70" ry="82" fill="none" stroke="#F2F1EA" stroke-width="4"/><rect x="190" y="186" width="20" height="56" rx="6" fill="#F2F1EA"/><g fill="#D4FF3A">${[0,1,2,3,4].map(r => [0,1,2].map(c => `<circle cx="${172 + c * 28}" cy="${62 + r * 22}" r="5"/>`).join('')).join('')}</g>`
  }[n] || '';
  return `<div class="cover"><svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="250" fill="#15180F"/><g stroke="#F2F1EA" stroke-opacity=".12" stroke-width="2" fill="none"><rect x="20" y="20" width="360" height="210"/><line x1="200" y1="20" x2="200" y2="230"/><line x1="20" y1="125" x2="380" y2="125"/></g>${lines}</svg>${play}</div>`;
}

const postText = (p, f) => pick({ ro: p.ro && p.ro[f], en: p.en && p.en[f], uk: p.uk && p.uk[f] }, lang);
const catName = c => (CATS[c] ? CATS[c][lang] : '');
const timeLabel = p => (p.video || p.videoUrl) ? `▶ ${p.video || ''} · ${t('video')}` : `${p.min || 3} ${t('readMin')}`;

function postCard(p) {
  return `<a class="post" href="#/blog/${encodeURIComponent(p.slug)}">${cover(p)}<div class="row"><span class="cat">${catName(p.cat)}</span><span class="time">${timeLabel(p)}</span></div><h3>${esc(postText(p, 't'))}</h3><p>${esc(postText(p, 'e'))}</p></a>`;
}

/* ---------- контакты ---------- */
function setLink(el, href, text) {
  if (!el) return;
  el.href = href || '#';
  if (text !== undefined) el.textContent = text;
  el.style.display = href || text ? '' : 'none';
}
function renderContacts() {
  const c = CONTACTS || {};
  const phone = (c.phone || '').trim(), wa = (c.whatsapp || c.phone || '').replace(/[^\d]/g, '');
  const tgU = (c.telegram || '').replace(/^@|https?:\/\/t\.me\//g, '').trim();
  const igU = (c.instagram || '').replace(/^@|https?:\/\/(www\.)?instagram\.com\//g, '').replace(/\/$/, '').trim();
  setLink($('#c-phone'), phone ? 'tel:' + phone.replace(/[^\d+]/g, '') : '', phone || '[+40 XXX XXX XXX]');
  setLink($('#c-tg'), tgU ? 'https://t.me/' + tgU : '', tgU ? '@' + tgU : '[@telegram]');
  setLink($('#c-ig'), igU ? 'https://instagram.com/' + igU : '', igU ? '@' + igU : '[@instagram]');
  $('#s-wa').href = wa ? 'https://wa.me/' + wa : '#';
  $('#s-tg').href = tgU ? 'https://t.me/' + tgU : '#';
  $('#s-ig').href = igU ? 'https://instagram.com/' + igU : '#';
  $('#c-map').href = c.map || '#';
  const ph = $('#coach-photo');
  if (PHOTO) { ph.classList.add('has-img'); ph.innerHTML = `<img src="${esc(PHOTO)}" alt="${esc(t('coachName').replace(/<[^>]+>/g, ''))}">`; }
  else { ph.classList.remove('has-img'); ph.innerHTML = t('about.photo'); }
}

/* ---------- отрисовка ---------- */
function render() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  document.querySelectorAll('[data-t]').forEach(el => { el.innerHTML = t(el.dataset.t); });

  const mq = MARQUEE[lang].map(w => `<span>${w}</span><span>●</span>`).join('');
  $('#marquee').innerHTML = mq + mq;
  $('#facts').innerHTML = FACTS[lang].map(f => `<div class="fact"><span class="big">${f[0]}</span><b>${f[1]}</b><span>${f[2]}</span></div>`).join('');
  $('#who').innerHTML = WHO[lang].map((w, i) => `<div class="card"><span class="num">0${i + 1}</span><h3>${w[0]}</h3><p>${w[1]}</p></div>`).join('');

  $('#levels').innerHTML = LEVELS[lang].map((l, i) => `<button type="button" class="chip-row" data-level="${i}" aria-pressed="${i === level}"><span>${l.l}</span><small>${l.tag}</small></button>`).join('');
  const L = LEVELS[lang][level];
  $('#rec-title').textContent = L.t; $('#rec-text').textContent = L.x;
  $('#rec-tags').innerHTML = L.f.map(x => `<span>${x}</span>`).join('');

  $('#stats').innerHTML = [1, 2, 3].map(i => `<div><b>${t('stat' + i + '.v')}</b><span>${t('stat' + i + '.l')}</span></div>`).join('');

  $('#prices').innerHTML = FORMATS[lang].map(f => {
    const m = money(PRICES[f[0]]); const dark = f[0] === 'pack';
    return `<div class="price-card${dark ? ' dark' : ''}">${f[5] ? `<span class="badge">${f[5]}</span>` : ''}<span class="tag">${f[1]}</span><h3>${f[2]}</h3><p>${f[3]}</p><div class="price"><span class="amt">${m.main}<em>${f[4]}</em></span>${m.sub ? `<span class="sub">${m.sub}</span>` : ''}</div></div>`;
  }).join('');
  const tr = money(PRICES.trial); $('#trial-amt').textContent = tr.main; $('#trial-sub').textContent = tr.sub;
  const note = t('rateNote');
  $('#rate-note').textContent = note && RATES.date ? `${note} (${RATES.date})` : note;

  $('#steps').innerHTML = STEPS[lang].map((s, i) => `<div class="step"><span class="n">0${i + 1}</span><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('');
  $('#tips-list').innerHTML = POSTS.slice(0, 3).map(postCard).join('');

  $('#faq-list').innerHTML = FAQ[lang].map((f, i) => `<div class="faq-item"><button type="button" class="faq-q" data-faq="${i}" aria-expanded="${i === faqOpen}"><span>${f[0]}</span><i aria-hidden="true">${i === faqOpen ? '−' : '+'}</i></button>${i === faqOpen ? `<p class="faq-a">${f[1]}</p>` : ''}</div>`).join('');

  $('#chips-format').innerHTML = FORM_FORMATS[lang].map((x, i) => `<button type="button" class="chip" data-fmt="${i}" aria-pressed="${i === fmtSel}">${x}</button>`).join('');
  $('#chips-time').innerHTML = FORM_TIMES[lang].map((x, i) => `<button type="button" class="chip" data-time="${i}" aria-pressed="${i === timeSel}">${x}</button>`).join('');
  $('#f-name').placeholder = { ro: 'Cum să-ți spun', en: 'What should I call you', uk: 'Як до тебе звертатися' }[lang];

  const cats = ['all', ...Object.keys(CATS)];
  $('#filters').innerHTML = cats.map(c => `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === cat}">${c === 'all' ? t('all') : CATS[c][lang]}</button>`).join('');
  const list = POSTS.filter(p => cat === 'all' || p.cat === cat);
  if (!list.length) { $('#feature').innerHTML = ''; $('#blog-grid').innerHTML = ''; }
  else {
    const f = list[0];
    $('#feature').innerHTML = `<a class="post feature" href="#/blog/${encodeURIComponent(f.slug)}">${cover(f)}<div style="display:flex;flex-direction:column;gap:14px"><span class="cat">${catName(f.cat)}</span><h3>${esc(postText(f, 't'))}</h3><p>${esc(postText(f, 'e'))}</p><span class="time">${timeLabel(f)}</span></div></a>`;
    $('#blog-grid').innerHTML = list.slice(1).map(postCard).join('');
  }
  renderContacts();
  route(false);
}

function route(scroll = true) {
  const h = location.hash;
  const show = id => ['home', 'blog', 'post'].forEach(v => { $('#view-' + v).hidden = v !== id; });
  const m = h.match(/^#\/blog\/(.+)$/);
  if (m) {
    const slug = decodeURIComponent(m[1]);
    const p = POSTS.find(x => x.slug === slug) || POSTS[0];
    if (!p) { show('blog'); return; }
    $('#post-cat').textContent = catName(p.cat);
    $('#post-title').textContent = postText(p, 't');
    const date = p.date ? new Date(p.date).toLocaleDateString(lang === 'uk' ? 'uk-UA' : lang === 'ro' ? 'ro-RO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    $('#post-info').innerHTML = `<span>${date}</span><span>${timeLabel(p)}</span><span>${t('coachName')}</span>`;
    $('#post-cover').innerHTML = cover(p);
    $('#post-body').innerHTML = md(postText(p, 'b'), p);
    $('#related').innerHTML = POSTS.filter(x => x !== p).slice(0, 3).map(postCard).join('');
    show('post'); if (scroll) window.scrollTo(0, 0); return;
  }
  if (h === '#/blog') { show('blog'); if (scroll) window.scrollTo(0, 0); return; }
  const wasHidden = $('#view-home').hidden;
  show('home');
  if (scroll && h && h.length > 1) { const el = document.getElementById(h.slice(1)); if (el) el.scrollIntoView({ behavior: wasHidden ? 'auto' : 'smooth' }); }
  else if (scroll && wasHidden) window.scrollTo(0, 0);
}

/* ---------- заявка ---------- */
async function sendLead() {
  if (sending) return;
  const err = $('#form-error');
  const contact = $('#f-contact').value.trim();
  const msgs = { ro: ['Lasă un telefon sau un Telegram.', 'Nu s-a trimis. Încearcă din nou sau scrie-mi direct.'],
                 en: ['Please leave a phone number or Telegram.', 'Couldn’t send. Try again or message me directly.'],
                 uk: ['Залиш телефон або Telegram.', 'Не вдалося надіслати. Спробуй ще раз або напиши напряму.'] }[lang];
  if (contact.length < 3) { err.textContent = msgs[0]; err.hidden = false; $('#f-contact').focus(); return; }
  err.hidden = true; sending = true; $('#submit').disabled = true;
  try {
    const r = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
      name: $('#f-name').value, contact, website: $('#f-website').value,
      format: FORM_FORMATS.ro[fmtSel], time: FORM_TIMES.ro[timeSel], lang }) });
    if (!r.ok) throw new Error();
    $('#form-fields').hidden = true; $('#thanks').hidden = false;
    $('#f-name').value = ''; $('#f-contact').value = '';
  } catch (e) { err.textContent = msgs[1]; err.hidden = false; }
  sending = false; $('#submit').disabled = false;
}

/* ---------- события ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (b) {
    if (b.dataset.lang) { lang = b.dataset.lang; try { localStorage.setItem('padel-lang', lang); } catch (_) {} render(); return; }
    if (b.dataset.level !== undefined) { level = +b.dataset.level; render(); return; }
    if (b.dataset.faq !== undefined) { const i = +b.dataset.faq; faqOpen = faqOpen === i ? -1 : i; render(); return; }
    if (b.dataset.fmt !== undefined) { fmtSel = +b.dataset.fmt; render(); return; }
    if (b.dataset.time !== undefined) { timeSel = +b.dataset.time; render(); return; }
    if (b.dataset.cat) { cat = b.dataset.cat; render(); return; }
    if (b.id === 'submit') { sendLead(); return; }
    if (b.id === 'again') { $('#form-fields').hidden = false; $('#thanks').hidden = true; return; }
    if (b.id === 'burger') { const m = $('#menu'); const o = m.classList.toggle('open'); b.setAttribute('aria-expanded', o); return; }
  }
  const a = e.target.closest('a');
  if (a && a.closest('#menu')) { $('#menu').classList.remove('open'); $('#burger').setAttribute('aria-expanded', 'false'); }
  if (a) { const href = a.getAttribute('href') || ''; if (href.startsWith('#') && !href.startsWith('#/') && href.length > 1 && href === location.hash) { e.preventDefault(); route(true); } }
});
window.addEventListener('hashchange', () => route(true));

render(); route(!!location.hash);
fetch('/api/content').then(r => r.ok ? r.json() : null).then(d => { if (d) { applyContent(d.content, d.rates); render(); } }).catch(() => {});
})();
