# Сайт тренера по паделу — Владислав Зрібняк

Cloudflare Worker: сайт (RO / EN / UA), редактор владельца `/admin`, заявки в Telegram, курс BNR.

## Что внутри

| Файл | Что это |
|---|---|
| `public/index.html` | Сайт |
| `public/app.js` | Логика сайта (языки, цены, блог, заявка) |
| `public/content-defaults.js` | Тексты и статьи по умолчанию |
| `public/admin.html` | Редактор владельца |
| `src/index.js` | Сервер: API, база, Telegram-бот, курс валют |
| `wrangler.jsonc` | Настройки Cloudflare (сюда вставляются ID базы и KV) |

## Запуск (только через сайт GitHub и дашборд Cloudflare)

1. **Telegram-бот.** В Telegram открой @BotFather → `/newbot` → придумай имя → сохрани **токен**.
2. **GitHub.** Создай репозиторий `padel-coach` → «uploading an existing file» → перетащи **содержимое** папки (файлы и папки `public`, `src`), не саму папку → Commit.
3. **База D1.** Cloudflare → Storage & Databases → D1 → Create → имя `padel-coach` → скопируй **Database ID**.
4. **Хранилище фото KV.** Storage & Databases → KV → Create → имя `padel-coach-images` → скопируй **ID**.
5. **Вставь ID.** В GitHub открой `wrangler.jsonc` → карандаш → замени `ВСТАВЬ_ID_БАЗЫ_D1` и `ВСТАВЬ_ID_KV` → Commit.
6. **Worker.** Cloudflare → Workers & Pages → Create → Import a repository → `padel-coach` → Deploy (настройки сборки не трогать).
7. **Секреты.** Открой Worker → Settings → Variables and Secrets → Add:
   - `TG_BOT_TOKEN` (тип Secret) — токен бота;
   - `SETUP_CODE` (тип Secret) — 20–64 символа: латиница, цифры, `_` и `-`.
8. **Подключение.** Открой `https://padel-coach.<твой-поддомен>.workers.dev/setup?code=<SETUP_CODE>` → нажми «Стать владельцем» → в Telegram нажми **Start**.

Готово. Редактор: напиши боту `/menu` → «Открыть редактор сайта».

## Передача прав

Редактор → вкладка «Владелец» → «Создать ссылку передачи» → отправь ссылку новому владельцу. Когда он нажмёт Start, редактор и заявки перейдут к нему, твой доступ закроется. Код не меняется.

## Обновления кода

Любой commit в ветку `main` на GitHub — Cloudflare сам пересоберёт и выложит сайт. Правки владельца (цены, тексты, фото, статьи) хранятся в базе и при обновлении кода не пропадают.
