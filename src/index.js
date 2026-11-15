/**
 * Сайт тренера по паделу — Cloudflare Worker.
 *
 * Привязки (bindings): DB (D1), IMAGES (KV), AI (Workers AI), ASSETS (статические файлы).
 * Секрет: TG_BOT_TOKEN — токен Telegram-бота от @BotFather.
 * Секрет: SETUP_CODE   — длинный код только из латиницы, цифр, _ и - (до 64 символов).
 *
 * Владелец сайта = Telegram ID в таблице kv (ключ "owner"). Передача прав — одноразовой ссылкой,
 * без изменения кода.
 */

const DAY = 86400;
const LANGS = ['ro', 'en', 'uk'];

/* ---------------- helpers ---------------- */

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });

const now = () => Math.floor(Date.now() / 1000);

function token(bytes = 24) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

let initialized = false;
async function init(env) {
  if (initialized) return;
  await env.DB.batch([
    env.DB.prepare('CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at INTEGER)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, kind TEXT NOT NULL, expires INTEGER NOT NULL)'),
    env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at INTEGER, name TEXT, contact TEXT, format TEXT, time TEXT, lang TEXT)'
    ),
  ]);
  initialized = true;
}

async function kvGet(env, key) {
  const row = await env.DB.prepare('SELECT value FROM kv WHERE key = ?').bind(key).first();
  if (!row) return null;
  try { return JSON.parse(row.value); } catch { return null; }
}

async function kvSet(env, key, value) {
  await env.DB.prepare(
    'INSERT INTO kv (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
  ).bind(key, JSON.stringify(value), now()).run();
}

async function kvDel(env, key) {
  await env.DB.prepare('DELETE FROM kv WHERE key = ?').bind(key).run();
}

async function newSession(env, kind, ttl) {
  const t = token();
  await env.DB.prepare('INSERT INTO sessions (token, kind, expires) VALUES (?, ?, ?)').bind(t, kind, now() + ttl).run();
  return t;
}

async function takeSession(env, t, kind) {
  if (!t || typeof t !== 'string' || t.length > 100) return false;
  const row = await env.DB.prepare('SELECT kind, expires FROM sessions WHERE token = ?').bind(t).first();
  if (!row || row.kind !== kind) return false;
  await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(t).run();
  return row.expires > now();
}

function getCookie(request, name) {
  const c = request.headers.get('cookie') || '';
  const m = c.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : null;
}

async function isAdmin(env, request) {
  const t = getCookie(request, 'pl_s');
  if (!t) return false;
  const row = await env.DB.prepare('SELECT kind, expires FROM sessions WHERE token = ?').bind(t).first();
  return !!row && row.kind === 'admin' && row.expires > now();
}

/* ---------------- Telegram ---------------- */

async function tg(env, method, payload) {
  if (!env.TG_BOT_TOKEN) return null;
  const r = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return r.json().catch(() => null);
}

async function siteOrigin(env, fallback) {
  return (await kvGet(env, 'origin')) || fallback;
}

async function loginLink(env, origin) {
  const t = await newSession(env, 'login', 15 * 60);
  return `${origin}/api/login?t=${t}`;
}

async function ownerMenu(env, chatId, origin, text) {
  const link = await loginLink(env, origin);
  await tg(env, 'sendMessage', {
    chat_id: chatId,
    text: text || 'Меню владельца сайта.\nСсылка на редактор действует 15 минут.',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Открыть редактор сайта', url: link }],
        [{ text: 'Последние заявки', callback_data: 'leads' }],
        [{ text: 'Открыть сайт', url: origin }],
      ],
    },
  });
}

async function sendLeads(env, chatId) {
  const { results } = await env.DB.prepare('SELECT * FROM leads ORDER BY id DESC LIMIT 5').all();
  if (!results.length) return tg(env, 'sendMessage', { chat_id: chatId, text: 'Заявок пока нет.' });
  const text = results
    .map((l) => `${new Date(l.created_at * 1000).toLocaleString('ru-RU', { timeZone: 'Europe/Bucharest' })}\n${l.name || '—'} · ${l.contact}\n${l.format || ''} · ${l.time || ''} · ${(l.lang || '').toUpperCase()}`)
    .join('\n\n');
  return tg(env, 'sendMessage', { chat_id: chatId, text: 'Последние заявки:\n\n' + text });
}

async function handleTelegram(request, env) {
  if (!env.SETUP_CODE || request.headers.get('x-telegram-bot-api-secret-token') !== env.SETUP_CODE) {
    return new Response('forbidden', { status: 403 });
  }
  const update = await request.json().catch(() => null);
  if (!update) return new Response('ok');
  const origin = await siteOrigin(env, new URL(request.url).origin);
  const owner = await kvGet(env, 'owner');

  if (update.callback_query) {
    const cq = update.callback_query;
    await tg(env, 'answerCallbackQuery', { callback_query_id: cq.id });
    if (owner && cq.from.id === owner.id && cq.data === 'leads') await sendLeads(env, cq.from.id);
    return new Response('ok');
  }

  const msg = update.message;
  if (!msg || !msg.text || msg.chat.type !== 'private') return new Response('ok');
  const from = msg.from;
  const [cmd, payload = ''] = msg.text.trim().split(/\s+/, 2);
  const isOwner = owner && owner.id === from.id;
  const name = [from.first_name, from.last_name].filter(Boolean).join(' ');

  if (cmd === '/start' && payload.startsWith('claim_')) {
    const ok = await takeSession(env, payload.slice(6), 'claim');
    if (!ok) {
      await tg(env, 'sendMessage', { chat_id: from.id, text: 'Ссылка передачи прав недействительна или устарела.' });
      return new Response('ok');
    }
    await kvSet(env, 'owner', { id: from.id, name });
    await env.DB.prepare("DELETE FROM sessions WHERE kind IN ('admin','login','claim')").run();
    if (owner && owner.id !== from.id) {
      await tg(env, 'sendMessage', { chat_id: owner.id, text: `Права владельца сайта переданы: ${name}. Ваш доступ к редактору закрыт.` });
    }
    await ownerMenu(env, from.id, origin, 'Готово! Теперь вы владелец сайта: только вы можете его редактировать, и заявки с сайта будут приходить сюда.');
    return new Response('ok');
  }

  if (cmd === '/start' && !owner && payload && payload === env.SETUP_CODE) {
    await kvSet(env, 'owner', { id: from.id, name });
    await ownerMenu(env, from.id, origin, 'Вы — владелец сайта. Заявки с сайта будут приходить сюда.');
    return new Response('ok');
  }

  if (isOwner && ['/start', '/menu', '/editor', '/login'].includes(cmd)) {
    await ownerMenu(env, from.id, origin);
    return new Response('ok');
  }
  if (isOwner && cmd === '/leads') {
    await sendLeads(env, from.id);
    return new Response('ok');
  }

  await tg(env, 'sendMessage', {
    chat_id: from.id,
    text: `Привет! Это бот сайта тренера по паделу.\nЗаписаться на тренировку: ${origin}/#booking`,
  });
  return new Response('ok');
}

/* ---------------- курс BNR ---------------- */

async function refreshRates(env) {
  const r = await fetch('https://www.bnr.ro/nbrfxrates.xml', { cf: { cacheTtl: 600 } });
  if (!r.ok) throw new Error('BNR ' + r.status);
  const xml = await r.text();
  const out = {};
  for (const m of xml.matchAll(/<Rate currency="(USD|UAH)"(?:\s+multiplier="(\d+)")?>([\d.]+)<\/Rate>/g)) {
    out[m[1]] = parseFloat(m[3]) / (m[2] ? parseInt(m[2], 10) : 1);
  }
  const d = xml.match(/<Cube date="([\d-]+)"/);
  if (!out.USD || !out.UAH) throw new Error('BNR parse');
  const rates = { USD: out.USD, UAH: out.UAH, date: d ? d[1] : null, fetched: now() };
  await kvSet(env, 'rates', rates);
  return rates;
}

/* ---------------- обработчики API ---------------- */

const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

async function handleLead(request, env, ctx) {
  const b = await request.json().catch(() => null);
  if (!b) return json({ ok: false }, 400);
  if (b.website) return json({ ok: true }); // ловушка для ботов
  const lead = {
    name: clip(b.name, 80),
    contact: clip(b.contact, 80),
    format: clip(b.format, 40),
    time: clip(b.time, 40),
    lang: LANGS.includes(b.lang) ? b.lang : 'ro',
  };
  if (lead.contact.length < 3) return json({ ok: false, error: 'contact' }, 400);
  await env.DB.prepare('INSERT INTO leads (created_at, name, contact, format, time, lang) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(now(), lead.name, lead.contact, lead.format, lead.time, lead.lang).run();
  const owner = await kvGet(env, 'owner');
  if (owner) {
    ctx.waitUntil(tg(env, 'sendMessage', {
      chat_id: owner.id,
      text: `Новая заявка с сайта\n\nИмя: ${lead.name || '—'}\nКонтакт: ${lead.contact}\nФормат: ${lead.format || '—'}\nВремя: ${lead.time || '—'}\nЯзык сайта: ${lead.lang.toUpperCase()}`,
    }));
  }
  return json({ ok: true });
}

async function handleContent(env, ctx) {
  const [content, rates] = await Promise.all([kvGet(env, 'content'), kvGet(env, 'rates')]);
  if (!rates || now() - (rates.fetched || 0) > 2 * DAY) ctx.waitUntil(refreshRates(env).catch(() => {}));
  return json({ content: content || {}, rates: rates || null }, 200, { 'cache-control': 'no-cache' });
}

async function translate(env, text, from, to) {
  if (!text || !text.trim()) return '';
  // переводим построчно, чтобы сохранить разметку (## заголовки, > советы, пустые строки)
  const lines = text.split('\n');
  const out = [];
  for (const line of lines) {
    const m = line.match(/^(\s*(?:##\s+|>\s+)?)(.*)$/);
    const prefix = m[1];
    const body = m[2];
    if (!body.trim()) { out.push(line); continue; }
    const r = await env.AI.run('@cf/meta/m2m100-1.2b', { text: body, source_lang: from, target_lang: to });
    out.push(prefix + ((r && r.translated_text) || body));
  }
  return out.join('\n');
}

async function handleAdmin(request, env, url) {
  const path = url.pathname;

  if (path === '/api/admin/me') {
    const owner = await kvGet(env, 'owner');
    return json({ ok: true, owner: owner ? owner.name : null });
  }

  if (path === '/api/admin/content' && request.method === 'PUT') {
    const text = await request.text();
    if (text.length > 900_000) return json({ ok: false, error: 'too_big' }, 413);
    let data;
    try { data = JSON.parse(text); } catch { return json({ ok: false, error: 'json' }, 400); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ ok: false }, 400);
    await kvSet(env, 'content', data);
    return json({ ok: true });
  }

  if (path === '/api/admin/image' && request.method === 'POST') {
    const type = request.headers.get('content-type') || '';
    if (!/^image\/(jpeg|png|webp)$/.test(type)) return json({ ok: false, error: 'type' }, 415);
    const body = await request.arrayBuffer();
    if (body.byteLength > 5 * 1024 * 1024) return json({ ok: false, error: 'too_big' }, 413);
    const id = crypto.randomUUID();
    await env.IMAGES.put('img:' + id, body, { metadata: { type } });
    return json({ ok: true, url: '/img/' + id });
  }

  if (path === '/api/admin/translate' && request.method === 'POST') {
    const b = await request.json().catch(() => null);
    if (!b || !LANGS.includes(b.from) || typeof b.text !== 'string' || b.text.length > 8000) return json({ ok: false }, 400);
    const result = {};
    try {
      for (const to of LANGS) if (to !== b.from) result[to] = await translate(env, b.text, b.from, to);
    } catch (e) {
      return json({ ok: false, error: 'ai' }, 502);
    }
    return json({ ok: true, result });
  }

  if (path === '/api/admin/leads') {
    const { results } = await env.DB.prepare('SELECT * FROM leads ORDER BY id DESC LIMIT 100').all();
    return json({ ok: true, leads: results });
  }

  if (path === '/api/admin/transfer' && request.method === 'POST') {
    const bot = await kvGet(env, 'bot');
    if (!bot) return json({ ok: false, error: 'bot' }, 400);
    await env.DB.prepare("DELETE FROM sessions WHERE kind = 'claim'").run();
    const t = await newSession(env, 'claim', DAY);
    return json({ ok: true, link: `https://t.me/${bot.username}?start=claim_${t}` });
  }

  if (path === '/api/admin/rates' && request.method === 'POST') {
    try { return json({ ok: true, rates: await refreshRates(env) }); }
    catch { return json({ ok: false }, 502); }
  }

  return json({ ok: false, error: 'not_found' }, 404);
}

async function handleSetup(request, env, url) {
  const code = url.searchParams.get('code');
  if (!env.SETUP_CODE || code !== env.SETUP_CODE) return new Response('Неверный код', { status: 403 });
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(env.SETUP_CODE)) {
    return new Response('SETUP_CODE должен быть 16–64 символа: латиница, цифры, _ и -', { status: 400 });
  }
  if (!env.TG_BOT_TOKEN) return new Response('Не задан секрет TG_BOT_TOKEN', { status: 400 });
  await init(env);
  const origin = url.origin;
  await kvSet(env, 'origin', origin);
  const me = await tg(env, 'getMe', {});
  if (!me || !me.ok) return new Response('Telegram не принял токен бота — проверь TG_BOT_TOKEN', { status: 400 });
  await kvSet(env, 'bot', { username: me.result.username });
  const wh = await tg(env, 'setWebhook', {
    url: origin + '/tg',
    secret_token: env.SETUP_CODE,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: true,
  });
  await tg(env, 'setMyCommands', {
    commands: [
      { command: 'menu', description: 'Меню владельца' },
      { command: 'leads', description: 'Последние заявки' },
    ],
  });
  let ratesNote = '';
  try { const r = await refreshRates(env); ratesNote = `Курс BNR загружен: 1 USD = ${r.USD} lei, 1 UAH = ${r.UAH} lei (${r.date}).`; }
  catch { ratesNote = 'Курс BNR пока не загрузился — попробуется автоматически позже.'; }
  const owner = await kvGet(env, 'owner');
  const claim = `https://t.me/${me.result.username}?start=${env.SETUP_CODE}`;
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<body style="font-family:system-ui;background:#0B0D0A;color:#F2F1EA;padding:32px;line-height:1.6;max-width:640px;margin:auto">
<h1 style="font-size:26px">Настройка завершена</h1>
<p>Бот: <b>@${me.result.username}</b> · вебхук: ${wh && wh.ok ? 'подключён' : 'ошибка'}</p>
<p>${ratesNote}</p>
${owner ? `<p>Владелец уже назначен: <b>${owner.name}</b>. Чтобы войти в редактор — напиши боту /menu.</p>`
  : `<p style="font-size:18px"><b>Последний шаг:</b> открой ссылку ниже в Telegram и нажми «Start» — ты станешь владельцем сайта.</p>
<p><a style="display:inline-block;background:#D4FF3A;color:#0B0D0A;padding:14px 22px;border-radius:999px;font-weight:700;text-decoration:none" href="${claim}">Стать владельцем</a></p>`}
<p style="color:#A3A69A">Эту страницу можно открывать повторно — она ничего не ломает.</p></body>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}

/* ---------------- маршрутизация ---------------- */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname;

    if (p === '/setup') return handleSetup(request, env, url);

    if (p.startsWith('/img/')) {
      const id = p.slice(5);
      if (!/^[0-9a-f-]{36}$/.test(id)) return new Response('Not found', { status: 404 });
      const { value, metadata } = await env.IMAGES.getWithMetadata('img:' + id, { type: 'arrayBuffer' });
      if (!value) return new Response('Not found', { status: 404 });
      return new Response(value, {
        headers: { 'content-type': (metadata && metadata.type) || 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable' },
      });
    }

    if (p === '/tg' && request.method === 'POST') {
      await init(env);
      return handleTelegram(request, env);
    }

    if (p.startsWith('/api/')) {
      await init(env);
      if (p === '/api/content') return handleContent(env, ctx);
      if (p === '/api/lead' && request.method === 'POST') return handleLead(request, env, ctx);

      if (p === '/api/login') {
        const ok = await takeSession(env, url.searchParams.get('t'), 'login');
        if (!ok) return new Response('Ссылка недействительна или устарела. Напиши боту /menu, чтобы получить новую.', { status: 403, headers: { 'content-type': 'text/plain; charset=utf-8' } });
        const s = await newSession(env, 'admin', 30 * DAY);
        return new Response(null, {
          status: 302,
          headers: { location: '/admin', 'set-cookie': `pl_s=${s}; Path=/; Max-Age=${30 * DAY}; HttpOnly; Secure; SameSite=Lax` },
        });
      }

      if (p === '/api/logout' && request.method === 'POST') {
        const t = getCookie(request, 'pl_s');
        if (t) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(t).run();
        return json({ ok: true }, 200, { 'set-cookie': 'pl_s=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax' });
      }

      if (p.startsWith('/api/admin/')) {
        if (!(await isAdmin(env, request))) {
          const bot = await kvGet(env, 'bot');
          return json({ ok: false, error: 'auth', bot: bot ? bot.username : null }, 401);
        }
        return handleAdmin(request, env, url);
      }
      return json({ ok: false, error: 'not_found' }, 404);
    }

    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env, ctx) {
    await init(env);
    ctx.waitUntil(refreshRates(env).catch((e) => console.log('rates error', e.message)));
  },
};
