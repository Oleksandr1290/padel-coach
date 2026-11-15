/* Тексты и данные сайта по умолчанию. Всё, что владелец меняет в редакторе (/admin),
   хранится в базе и накладывается поверх этих значений. */
window.DEF = (() => {
/* ============================================================
   КУРС ВАЛЮТ (RON за 1 единицу). В рабочей версии сайт будет
   брать его автоматически раз в день у Национального банка
   Румынии (BNR). Здесь — демо-значения.
   ============================================================ */
const RATES = { USD: 4.5791, UAH: 0.1029 };

/* Цены — ТОЛЬКО в леях. Это то, что тренер будет менять в редакторе. */
const PRICES = { private: 200, split: 130, group: 90, pack: 1800, trial: 100 };

const T = {
  coachName:{ro:`Vladyslav Zribniak`,en:`Vladyslav Zribniak`,uk:`Владислав Зрібняк`},
  'nav.about':{ro:`Despre mine`,en:`About`,uk:`Про мене`},
  'nav.formats':{ro:`Formate și prețuri`,en:`Formats & prices`,uk:`Формати й ціни`},
  'nav.first':{ro:`Primul antrenament`,en:`First session`,uk:`Перше тренування`},
  'nav.blog':{ro:`Blog`,en:`Blog`,uk:`Блог`},
  'nav.faq':{ro:`Întrebări`,en:`FAQ`,uk:`Питання`},
  'nav.contact':{ro:`Contact`,en:`Contact`,uk:`Контакти`},
  'nav.book':{ro:`Programează-te`,en:`Book now`,uk:`Записатися`},
  'hero.badge':{ro:`Antrenor certificat · [FEDERAȚIE / NIVEL]`,en:`Certified coach · [FEDERATION / LEVEL]`,uk:`Сертифікований тренер · [ФЕДЕРАЦІЯ / РІВЕНЬ]`},
  'hero.h1':{ro:`Padelul e simplu.<br><span>Dacă înveți corect.</span>`,en:`Padel is simple.<br><span>If you learn it right.</span>`,uk:`Падел — це просто.<br><span>Якщо вчитися правильно.</span>`},
  'hero.lead':{ro:`Antrenamente de la zero și pentru cei care joacă deja. Îți pun loviturile la punct, te învăț să joci cu peretele și să gândești pe teren ca o echipă — fără teorie inutilă, din prima oră.`,en:`Lessons from scratch and for people who already play. I'll fix your strokes, teach you to use the glass and think like a pair on court — no fluff, from the very first session.`,uk:`Тренування з нуля і для тих, хто вже грає. Поставлю удари, навчу грати зі склом і мислити на корті як пара — без зайвої теорії, з першого заняття.`},
  'hero.cta1':{ro:`Antrenament de probă`,en:`Trial session`,uk:`Пробне тренування`},
  'hero.meta1':{ro:`[CLUB], București`,en:`[CLUB], Bucharest`,uk:`[КЛУБ], Бухарест`},
  'hero.meta2':{ro:`Individual · în doi · grupe`,en:`Private · pairs · groups`,uk:`Індивідуально · удвох · групи`},
  'shot.k':{ro:`LOVITURA ZILEI`,en:`SHOT OF THE DAY`,uk:`УДАР ДНЯ`},
  'shot.name':{ro:`Bandeja`,en:`Bandeja`,uk:`Бандеха`},
  'shot.desc':{ro:`lovitură peste cap, cu efect tăiat`,en:`a sliced overhead`,uk:`удар над головою зі зрізкою`},
  'why.h2':{ro:`Cel mai rapid sport de care te poți îndrăgosti într-o oră`,en:`The fastest sport you can fall in love with in an hour`,uk:`Найшвидший спорт, у який можна закохатися за годину`},
  'why.p':{ro:`Rachetă fără corzi, teren cu pereți de sticlă și mereu doi contra doi. Schimburile sunt lungi, iar progresul se vede din primele antrenamente.`,en:`A stringless racket, a court with glass walls and always two against two. Rallies are long and progress shows from the very first sessions.`,uk:`Ракетка без струн, корт зі скляними стінами і завжди двоє на двоє. Розіграші довгі, а прогрес помітний уже з перших занять.`},
  'who.label':{ro:`PENTRU CINE`,en:`WHO IT'S FOR`,uk:`ДЛЯ КОГО`},
  'picker.label':{ro:`ALEGE ÎN 10 SECUNDE`,en:`PICK IN 10 SECONDS`,uk:`ПІДБІР ЗА 10 СЕКУНД`},
  'picker.h2':{ro:`Ce nivel ai?`,en:`What's your level?`,uk:`Який у тебе рівень?`},
  'rec.label':{ro:`RECOMANDAREA MEA`,en:`MY RECOMMENDATION`,uk:`МОЯ РЕКОМЕНДАЦІЯ`},
  'rec.cta':{ro:`Programează-te la acest format`,en:`Book this format`,uk:`Записатися на цей формат`},
  'about.label':{ro:`DESPRE MINE`,en:`ABOUT ME`,uk:`ПРО МЕНЕ`},
  'about.h2':{ro:`Salut, sunt Vladyslav`,en:`Hi, I'm Vladyslav`,uk:`Привіт, я Владислав`},
  'about.p1':{ro:`[2–3 propoziții despre tine: cum ai ajuns la padel, de câți ani joci, ce îți place cel mai mult pe teren.]`,en:`[2–3 sentences about you: how you got into padel, how long you've played, what you love on court.]`,uk:`[2–3 речення про себе: як прийшов у падел, скільки років граєш, що найбільше любиш на корті.]`},
  'about.p2':{ro:`[Abordarea ta: de exemplu — „Explic simplu, arăt pe exemple și îți dau un exercițiu de lucrat între antrenamente".]`,en:`[Your approach: e.g. "I explain simply, show by example and give you a drill to practise between sessions."]`,uk:`[Твій підхід: наприклад — «Пояснюю просто, показую на прикладах і даю вправу, яку можна відпрацювати між заняттями».]`},
  'about.photo':{ro:`[FOTO ANTRENOR PE TEREN]<br>vertical, 4:5, în mișcare`,en:`[COACH PHOTO ON COURT]<br>portrait, 4:5, in action`,uk:`[ФОТО ТРЕНЕРА НА КОРТІ]<br>вертикальне, 4:5, у русі`},
  'about.cert':{ro:`Certificat de antrenor<br><span>[ORGANIZAȚIE], [AN]</span>`,en:`Coaching certificate<br><span>[ORGANISATION], [YEAR]</span>`,uk:`Сертифікат тренера<br><span>[ОРГАНІЗАЦІЯ], [РІК]</span>`},
  'formats.p':{ro:`Terenul [este / nu este] inclus în preț. Rachete și mingi pentru primul antrenament — [le am eu / la club].`,en:`Court fee [included / not included]. Rackets and balls for your first session — [I bring them / at the club].`,uk:`Корт [входить / не входить] у вартість. Ракетки й м'ячі на перше тренування — [є в мене / у клубі].`},
  'trial.t':{ro:`Primul antrenament de probă —`,en:`First trial session —`,uk:`Перше пробне тренування —`},
  'first.h2':{ro:`Ce se întâmplă când vii pe teren`,en:`What happens when you come to court`,uk:`Що буде, коли ти прийдеш на корт`},
  'tips.label':{ro:`SFATURI DE ANTRENOR`,en:`COACH'S TIPS`,uk:`ПОРАДИ ТРЕНЕРА`},
  'tips.h2':{ro:`Învață padel și între antrenamente`,en:`Keep learning between sessions`,uk:`Вчися паделу й між тренуваннями`},
  'tips.all':{ro:`Toate articolele →`,en:`All articles →`,uk:`Усі статті →`},
  'faq.h2':{ro:`Înainte de primul antrenament`,en:`Before your first session`,uk:`Перед першим тренуванням`},
  'faq.p':{ro:`N-ai găsit răspunsul? Scrie-mi, îți răspund personal.`,en:`Didn't find your answer? Message me — I'll reply personally.`,uk:`Не знайшов відповіді — просто напиши, відповім особисто.`},
  'book.h2':{ro:`Ne vedem pe teren?`,en:`See you on court?`,uk:`Побачимось на корті?`},
  'book.p':{ro:`Lasă-mi un contact — îți scriu în [TIMP] și găsim o oră potrivită. Sau scrie-mi direct.`,en:`Leave your contact — I'll reply within [TIME] and we'll find a slot. Or message me directly.`,uk:`Залиш контакт — напишу протягом [ЧАС] і підберемо зручний час. Або пиши одразу в месенджер.`},
  'form.name':{ro:`Nume`,en:`Name`,uk:`Ім'я`},
  'form.contact':{ro:`Telefon sau Telegram`,en:`Phone or Telegram`,uk:`Телефон або нік у Telegram`},
  'form.format':{ro:`Format`,en:`Format`,uk:`Формат`},
  'form.time':{ro:`Când îți convine`,en:`Preferred time`,uk:`Коли зручно`},
  'form.submit':{ro:`Programează proba`,en:`Book a trial`,uk:`Записатися на пробне`},
  'form.consent':{ro:`Apăsând butonul, ești de acord să te contactez la datele lăsate.`,en:`By pressing the button you agree that I'll contact you using these details.`,uk:`Натискаючи кнопку, ти погоджуєшся, що я зв'яжуся з тобою за вказаним контактом.`},
  'form.thanksH':{ro:`Am primit cererea!`,en:`Got it!`,uk:`Заявка в мене!`},
  'form.thanksP':{ro:`Îți scriu în curând. Până atunci — pregătește niște adidași de teren.`,en:`I'll message you soon. Meanwhile — find a pair of court shoes.`,uk:`Напишу найближчим часом. А поки — знайди зручні кросівки для корту.`},
  'form.again':{ro:`Trimite încă una`,en:`Send another`,uk:`Надіслати ще одну`},
  'blog.home':{ro:`← Acasă`,en:`← Home`,uk:`← На головну`},
  'blog.h1':{ro:`Tehnică, tactică și echipament — pe scurt`,en:`Technique, tactics and gear — in plain words`,uk:`Техніка, тактика й спорядження — простими словами`},
  'post.back':{ro:`← Toate articolele`,en:`← All articles`,uk:`← Усі статті`},
  'post.cta':{ro:`Vrei să exersezi asta pe teren?`,en:`Want to practise this on court?`,uk:`Хочеш відпрацювати це на корті?`},
  'post.related':{ro:`CITEȘTE ȘI`,en:`READ NEXT`,uk:`ЧИТАЙ ТАКОЖ`},
  'foot.where':{ro:`UNDE NE ANTRENĂM`,en:`WHERE WE TRAIN`,uk:`ДЕ ТРЕНУЄМОСЬ`},
  'foot.club':{ro:`[NUMELE CLUBULUI]`,en:`[CLUB NAME]`,uk:`[НАЗВА КЛУБУ]`},
  'foot.addr':{ro:`[Adresă], București`,en:`[Address], Bucharest`,uk:`[Адреса], Бухарест`},
  'foot.map':{ro:`Deschide pe hartă →`,en:`Open in maps →`,uk:`Відкрити на карті →`},
  'foot.contact':{ro:`CONTACT`,en:`CONTACT`,uk:`ЗВ'ЯЗОК`},
  'foot.sched':{ro:`PROGRAM`,en:`SCHEDULE`,uk:`РОЗКЛАД`},
  'foot.s1':{ro:`[Lu–Vi 7:00–22:00]`,en:`[Mon–Fri 7:00–22:00]`,uk:`[Пн–Пт 7:00–22:00]`},
  'foot.s2':{ro:`[Sâ–Du 9:00–20:00]`,en:`[Sat–Sun 9:00–20:00]`,uk:`[Сб–Нд 9:00–20:00]`},
  'foot.copy':{ro:`© 2026 Vladyslav Zribniak · Antrenor de padel`,en:`© 2026 Vladyslav Zribniak · Padel coach`,uk:`© 2026 Владислав Зрібняк · Тренер з паделу`},
  rateNote:{ro:``,en:`Prices are set in lei; dollar amounts are approximate, at the BNR rate. Payment in lei.`,uk:`Ціни встановлені в леях, суми в гривнях — приблизні, за курсом BNR. Оплата в леях.`},
  payLei:{ro:``,en:`paid in lei`,uk:`оплата в леях`},
  readMin:{ro:`min de citit`,en:`min read`,uk:`хв читання`},
  video:{ro:`video`,en:`video`,uk:`відео`},
  all:{ro:`Toate`,en:`All`,uk:`Усі`}
};

const MARQUEE = {
  ro:['BANDEJA','VÍBORA','CHIQUITA','GLOBO','REMATE','VOLEU','BAJADA'],
  en:['BANDEJA','VÍBORA','CHIQUITA','LOB','REMATE','VOLLEY','BAJADA'],
  uk:['БАНДЕХА','ВІБОРА','ЧІКІТА','ГЛОБО','РЕМАТЕ','ВОЛЕЙ','БАХАДА']
};

const FACTS = {
  ro:[['20×10','metri — tot terenul','De două ori mai mic decât cel de tenis: alergi mai puțin, joci mai mult.'],['2×2','mereu joc de dublu','Padelul înseamnă comunicare și tactică în echipă, nu un duel.'],['Pereții','fac parte din joc','Mingea se joacă și după ricoșeul din sticlă — asta te învăț separat.'],['De jos','serviciul sub talie','Nu ai nevoie de un serviciu puternic ca în tenis — intri ușor în joc.']],
  en:[['20×10','metres — the whole court','Half the size of a tennis court: less running, more playing.'],['2×2','always doubles','Padel is about communication and teamwork, not a duel.'],['Walls','are part of the game','You can play the ball after it bounces off the glass — I teach this separately.'],['Underhand','serve below the waist','No need for a big tennis serve — it is easy to get into the game.']],
  uk:[['20×10','метрів — увесь корт','Удвічі менший за тенісний: менше бігаєш, більше граєш.'],['2×2','завжди парна гра','Падел — це спілкування і командна тактика, а не дуель.'],['Стіни','частина гри','М’яч можна дограти після відскоку від скла — цього я вчу окремо.'],['Знизу','подача нижче пояса','Не потрібна потужна подача, як у тенісі, — увійти в гру легко.']]
};

const WHO = {
  ro:[['N-ai jucat niciodată','Începem cu priza și loviturile de bază. După câteva antrenamente vei juca sigur pe tine cu prietenii.'],['Joci, dar ai stagnat','Corectăm greșelile, adăugăm bandeja și víbora și învățăm să ocupi fileul.'],['Vii din tenis','Scurtăm mișcarea și învățăm jocul cu peretele — baza de tenis accelerează progresul.'],['Prieteni și colegi','Antrenamente de grup și team building: distractiv, activ și clar chiar de la zero.']],
  en:[['Never played','We start with the grip and basic strokes. After a few sessions you’ll play confidently with friends.'],['You play but feel stuck','We fix mistakes, add the bandeja and víbora, and learn to take the net.'],['Coming from tennis','We shorten your swing and learn to play off the glass — your tennis base speeds things up.'],['Friends and colleagues','Group sessions and team building: fun, active and easy to follow even from zero.']],
  uk:[['Ніколи не грав','Почнемо з хвату й базових ударів. За кілька занять упевнено гратимеш із друзями.'],['Граєш, але застряг','Розберемо помилки, додамо бандеху й вібору, навчимося займати сітку.'],['Прийшов із тенісу','Скоротимо замах і навчимося грати від скла — тенісна база пришвидшить прогрес.'],['Компанії та колеги','Групові тренування й тимбілдинги: весело, активно й зрозуміло навіть з нуля.']]
};

const LEVELS = {
  ro:[
    {l:'N-am ținut niciodată o rachetă',tag:'ÎNCEPĂTOR',t:'Probă + 5 antrenamente individuale',x:'Punem la punct priza și loviturile de bază unu la unu — așa apare cel mai repede încrederea să joci cu prietenii.',f:['Priza','Forehand și backhand','Serviciul','Ricoșeul din sticlă']},
    {l:'Am jucat de câteva ori cu prietenii',tag:'BAZĂ',t:'Split — antrenamente în doi',x:'Vino cu un partener: corectăm greșelile, învățăm jocul cu pereții și să vă înțelegeți pe teren.',f:['Jocul cu sticla','Voleu la fileu','Poziția în pereche']},
    {l:'Joc regulat',tag:'MEDIU',t:'Individual sau pachet de 10',x:'Adăugăm loviturile peste cap și tactica: cum câștigi fileul și închizi punctul.',f:['Bandeja','Víbora','Globo','Tactică']},
    {l:'Vreau să joc cu prietenii sau colegii',tag:'GRUP',t:'Antrenament de grup',x:'Vă grupez după nivel: multe situații de joc, schimburi lungi și multă distracție.',f:['Reguli și scor','Schimburi','Joc în pereche']}
  ],
  en:[
    {l:'Never held a racket',tag:'BEGINNER',t:'Trial + 5 private sessions',x:'We build your grip and basic strokes one-on-one — the fastest way to feel confident playing with friends.',f:['Grip','Forehand & backhand','Serve','Glass rebounds']},
    {l:'Played a few times with friends',tag:'BASIC',t:'Split — sessions for two',x:'Bring a partner: we fix mistakes, learn to use the walls and understand each other on court.',f:['Playing the glass','Net volleys','Pair positioning']},
    {l:'I play regularly',tag:'INTERMEDIATE',t:'Private or 10-session pack',x:'We add overheads and tactics: how to win the net and close out points.',f:['Bandeja','Víbora','Lob','Tactics']},
    {l:'I want to play with friends or colleagues',tag:'GROUP',t:'Group session',x:'I group you by level: lots of game situations, long rallies and plenty of fun.',f:['Rules & scoring','Rallies','Playing as a pair']}
  ],
  uk:[
    {l:'Ніколи не тримав ракетку',tag:'НОВАЧОК',t:'Пробне + 5 індивідуальних',x:'Ставимо хват і базові удари один на один — так найшвидше з’являється впевненість, щоб грати з друзями.',f:['Хват','Удар праворуч і ліворуч','Подача','Відскок від скла']},
    {l:'Грав кілька разів із друзями',tag:'БАЗОВИЙ',t:'Спліт — тренування вдвох',x:'Приходь із партнером: виправимо помилки, навчимося працювати зі стінами й розуміти одне одного на корті.',f:['Гра зі склом','Волей біля сітки','Позиція в парі']},
    {l:'Граю регулярно',tag:'СЕРЕДНІЙ',t:'Індивідуально або пакет 10',x:'Додаємо удари над головою і тактику: як забрати сітку й закривати очки.',f:['Бандеха','Вібора','Глобо','Тактика']},
    {l:'Хочу грати з друзями чи колегами',tag:'ГРУПА',t:'Групове тренування',x:'Підберу групу за рівнем: багато ігрових ситуацій, довгі розіграші й багато фану.',f:['Правила й рахунок','Розіграші','Гра в парі']}
  ]
};

const STATS = {
  ro:[['[ANI]','ani în padel'],['[NIVEL]','nivelul certificatului'],['RO · UA · EN','limbile antrenamentelor']],
  en:[['[YEARS]','years in padel'],['[LEVEL]','certificate level'],['RO · UA · EN','coaching languages']],
  uk:[['[РОКІВ]','років у паделі'],['[РІВЕНЬ]','категорія сертифіката'],['RO · UA · EN','мови тренувань']]
};

const FORMATS = {
  ro:[['private','1 LA 1','Individual','Atenție maximă: tehnica se pune cel mai repede.','/ 60 min'],['split','ÎN DOI','Split','Cu un prieten sau partenerul de pereche.','/ pers.'],['group','3–4 PERSOANE','Grupă','Grupe după nivel, multe situații de joc.','/ pers.'],['pack','ABONAMENT','Pachet 10','10 antrenamente individuale cu plan de progres.','/ 10','Mai avantajos']],
  en:[['private','1-ON-1','Private','Full attention: technique improves fastest.','/ 60 min'],['split','FOR TWO','Split','With a friend or your doubles partner.','/ person'],['group','3–4 PEOPLE','Group','Grouped by level, lots of game situations.','/ person'],['pack','PACKAGE','10-pack','10 private sessions with a progress plan.','/ 10','Best value']],
  uk:[['private','1 НА 1','Індивідуально','Максимум уваги: техніка ставиться найшвидше.','/ 60 хв'],['split','УДВОХ','Спліт','З другом або партнером по парі.','/ особу'],['group','3–4 ОСОБИ','Група','Групи за рівнем, багато ігрових ситуацій.','/ особу'],['pack','АБОНЕМЕНТ','Пакет 10','10 індивідуальних тренувань із планом прогресу.','/ 10','Вигідніше']]
};

const STEPS = {
  ro:[['Cunoaștere și încălzire','Aflu experiența și obiectivele tale.'],['Priza și loviturile de bază','Forehand, backhand, serviciu de jos, poziția corectă.'],['Jocul cu sticla','Diferența principală față de tenis: cum citești ricoșeul.'],['Puncte și plan','Jucăm puncte reale, iar tu pleci cu un plan clar.']],
  en:[['Intro and warm-up','I learn about your experience and goals.'],['Grip and basic strokes','Forehand, backhand, underhand serve, ready position.'],['Playing the glass','The key difference from tennis: reading the rebound.'],['Points and a plan','We play real points and you leave with a clear plan.']],
  uk:[['Знайомство й розминка','Дізнаюся твій досвід і цілі.'],['Хват і базові удари','Удар праворуч і ліворуч, подача знизу, правильна стійка.'],['Гра зі склом','Головна відмінність від тенісу: як читати відскок.'],['Розіграші й план','Граємо справжні очки, а ти йдеш із чітким планом.']]
};

const FAQ = {
  ro:[['Am nevoie de rachetă proprie?','Nu. Pentru primele antrenamente [îți dau eu rachetă și mingi / le poți lua de la club]. Te ajut să-ți alegi una când îți înțelegem stilul.'],['Pot veni singur, fără partener?','Da. Poți face antrenamente individuale, iar pentru grupe îți găsesc parteneri de nivelul tău.'],['Cât durează un antrenament?','[60 sau 90] de minute, cu încălzire și puncte jucate la final.'],['Ce să port?','Haine sport comode și adidași de teren — cei de alergare alunecă pe gazonul artificial cu nisip.'],['Cum anulez sau reprogramez?','[Regula de anulare, de ex.: gratuit cu cel puțin 24 de ore înainte.]']],
  en:[['Do I need my own racket?','No. For your first sessions [I’ll lend you a racket and balls / you can borrow them at the club]. I’ll help you choose your own once we know your style.'],['Can I come alone, without a partner?','Yes. You can take private sessions, and for groups I’ll match you with players at your level.'],['How long is a session?','[60 or 90] minutes, including warm-up and points at the end.'],['What should I wear?','Comfortable sportswear and court shoes — running shoes slip on sand-filled artificial grass.'],['How do I cancel or reschedule?','[Your cancellation rule, e.g.: free up to 24 hours before.]']],
  uk:[['Потрібна власна ракетка?','Ні. На перші тренування [ракетку й м’ячі дам я / можна взяти в клубі]. Свою допоможу вибрати, коли зрозуміємо твій стиль.'],['Можна прийти одному, без пари?','Так. Можна займатися індивідуально, а для групових тренувань я підберу партнерів твого рівня.'],['Скільки триває тренування?','[60 або 90] хвилин, з розминкою та ігровими розіграшами наприкінці.'],['Що вдягнути?','Зручний спортивний одяг і кросівки для корту — бігові ковзають на штучній траві з піском.'],['Як перенести чи скасувати?','[Правило скасування, наприклад: безкоштовно — не пізніше ніж за 24 години.]']]
};

const FORM_FORMATS = {ro:['Individual','În doi','Grupă','Pachet 10'],en:['Private','For two','Group','10-pack'],uk:['Індивідуально','Удвох','Група','Пакет 10']};
const FORM_TIMES = {ro:['Dimineața','Ziua','Seara','Weekend'],en:['Morning','Daytime','Evening','Weekend'],uk:['Ранок','День','Вечір','Вихідні']};

const CATS = {
  technique:{ro:'TEHNICĂ',en:'TECHNIQUE',uk:'ТЕХНІКА'},
  tactics:{ro:'TACTICĂ',en:'TACTICS',uk:'ТАКТИКА'},
  gear:{ro:'ECHIPAMENT',en:'GEAR',uk:'СПОРЯДЖЕННЯ'},
  beginners:{ro:'ÎNCEPĂTORI',en:'BEGINNERS',uk:'НОВАЧКАМ'}
};

/* ===== СТАТЬИ (примеры) ===== */
const POSTS = [
 {slug:'bandeja',cat:'technique',min:4,date:'2026-11-12',cover:1,
  ro:{t:'Bandeja: lovitura care te ține la fileu',e:'De ce în padel nu lovești peste cap din toate puterile și cum faci din bandeja lovitura ta cea mai sigură.',b:`Când adversarul îți aruncă un lob (globo), începătorii vor instinctiv să dea un smash din toată puterea. În padel asta e adesea o greșeală: mingea puternică ricoșează din peretele din spate, iar adversarul o joacă liniștit. Bandeja rezolvă altă problemă — nu să câștigi punctul imediat, ci să-ți păstrezi poziția la fileu.

## Ce este bandeja

O lovitură controlată peste cap, cu efect tăiat. Mingea nu zboară repede, ci precis — adânc în terenul adversarului, ricoșând jos din sticlă. Cât timp adversarul o returnează, tu revii la fileu.

## Trei chei ale tehnicii

**Poziție laterală.** Întoarce-te cu umărul spre fileu și arată mingea cu mâna liberă — te ajută să prinzi momentul loviturii.

**Racheta în spate, la nivelul capului.** Mișcarea e scurtă, racheta nu coboară în spatele spatelui ca la serviciul de tenis.

**Lovești în fața corpului, tăiat.** Lovești puțin în față, „tăind" mingea de sus în jos și înainte. După lovitură, racheta merge spre umărul opus.

> **Greșeala începătorului:** bandeja dată cu toată forța. Scopul e precizia și adâncimea, nu viteza.

## Cum o exersezi

Începe cu loburi lente de la partener: 10 bandeje la rând în jumătatea din spate a terenului, fără grabă. Când nimerești constant, adaugă deplasarea înapoi și revenirea la fileu după fiecare lovitură.`},
  en:{t:'The bandeja: the shot that keeps you at the net',e:'Why padel overheads aren’t about power — and how to make the bandeja your most reliable shot.',b:`When your opponent throws up a lob, beginners instinctively want to smash it as hard as they can. In padel that’s often a mistake: a hard ball bounces off the back glass and your opponent calmly plays it back. The bandeja solves a different problem — not winning the point right away, but keeping your position at the net.

## What the bandeja is

A controlled, sliced overhead. The ball doesn’t travel fast, it travels precisely — deep into your opponent’s court, bouncing low off the glass. While they return it, you get back to the net.

## Three keys to the technique

**Side-on stance.** Turn your shoulder to the net and point at the ball with your free hand — it helps you time the contact.

**Racket behind, at head height.** The swing is short; the racket doesn’t drop behind your back like a tennis serve.

**Contact in front, with slice.** Hit slightly in front of your body, "cutting" the ball from top to bottom and forward. After contact, the racket finishes towards the opposite shoulder.

> **Beginner’s mistake:** hitting the bandeja at full power. The goal is accuracy and depth, not speed.

## How to practise

Start with slow lobs from a partner: 10 bandejas in a row into the back half of the court, no rush. Once you’re consistent, add moving back and returning to the net after every shot.`},
  uk:{t:'Бандеха: удар, який тримає тебе біля сітки',e:'Чому в паделі над головою не б’ють щосили і як зробити бандеху своїм найнадійнішим ударом.',b:`Коли суперник кидає свічку (глобо), новачки інстинктивно хочуть пробити смеш щосили. У паделі це часто помилка: сильний м’яч відскакує від заднього скла, і суперник спокійно його доводить. Бандеха вирішує інше завдання — не виграти очко одразу, а зберегти позицію біля сітки.

## Що таке бандеха

Це контрольований удар над головою зі зрізкою. М’яч летить не швидко, а точно — глибоко в корт суперника, низько відскакуючи від скла. Поки суперник відбиває, ти встигаєш повернутися до сітки.

## Три ключі техніки

**Бокова стійка.** Розвернися плечем до сітки, вільною рукою вкажи на м’яч — це допомагає вивірити момент удару.

**Ракетка ззаду на рівні голови.** Замах короткий, ракетка не опускається за спину, як при подачі в тенісі.

**Удар перед собою, зі зрізкою.** Б’єш трохи попереду тіла, «ріжучи» м’яч згори вниз і вперед. Після удару ракетка йде до протилежного плеча.

> **Помилка новачка:** бити бандеху на повну силу. Мета — точність і глибина, а не швидкість.

## Як відпрацювати

Почни з повільних свічок від партнера: 10 бандех поспіль у задню половину корту, без поспіху. Коли влучаєш стабільно — додай рух назад і повернення до сітки після кожного удару.`}
 },
 {slug:'serve',cat:'tactics',video:'0:45',date:'2026-11-10',cover:3,
  ro:{t:'Sfatul săptămânii: serviciul după care e greu să ataci',e:'Video scurt: unde să servești ca adversarul să nu preia inițiativa.',b:`[video]

În padel serviciul se dă de jos, după ce mingea sare o dată, și trebuie să intre în careul în diagonală. Dar nu e important doar să intre.

Țintește adânc — aproape de sticla laterală sau pe centru, în corpul adversarului. Așa îi e mai greu să răspundă cu un atac, iar tu ai timp să urci la fileu.

> **Ține minte:** după serviciu mergi imediat în față — în padel fileul decide aproape tot.`},
  en:{t:'Tip of the week: a serve that’s hard to attack',e:'Short video: where to serve so your opponent can’t take the initiative.',b:`[video]

In padel you serve underhand, after letting the ball bounce once, and it must land in the diagonal box. But landing it is only half the job.

Aim deep — close to the side glass or down the middle, into your opponent’s body. That makes it harder for them to attack, and gives you time to move up to the net.

> **Remember:** after serving, move forward straight away — in padel the net decides almost everything.`},
  uk:{t:'Порада тижня: подача, після якої важко атакувати',e:'Коротке відео: куди подавати, щоб суперник не перехопив ініціативу.',b:`[video]

Подача в паделі — знизу, після відскоку м’яча, і має влучити в діагональний квадрат. Але важливо не лише влучити.

Цілься глибоко — ближче до бокового скла або в центр, у тіло суперника. Так йому складніше відповісти атакою, а ти встигаєш вийти до сітки.

> **Пам’ятай:** після подачі одразу рухайся вперед — сітка в паделі вирішує майже все.`}
 },
 {slug:'glass-mistakes',cat:'beginners',min:3,date:'2026-11-06',cover:2,
  ro:{t:'5 greșeli de începător lângă sticlă',e:'Sticla îi sperie pe toți cei care încep padelul. Iată ce te împiedică să joci mingea — și cum corectezi.',b:`Pereții sunt diferența principală dintre padel și tenis. Iată greșelile pe care le văd cel mai des.

**1. Lovești înainte de sticlă.** Începătorii se grăbesc să lovească mingea până să ajungă la perete. Las-o să ricoșeze — după sticlă mingea e mai lentă și mai ușor de jucat.

**2. Stai lipit de perete.** Lasă-ți spațiu: cam un pas, un pas și jumătate de sticlă.

**3. Te uiți la adversar, nu la minge.** Urmărește mingea până la ricoșeu.

**4. Nu te întorci.** Pune-te lateral față de sticlă, ca la o lovitură obișnuită — atunci ricoșeul nu te ia prin surprindere.

**5. Lovești din toate puterile.** După sticlă e suficient să trimiți mingea adânc sau să ridici un lob — forța nu e esențială aici.

> **Exercițiu:** partenerul aruncă mingea în sticla din spate, tu o lași să ricoșeze și o prinzi cu mâna. Apoi la fel — cu racheta.`},
  en:{t:'5 beginner mistakes at the glass',e:'The glass scares everyone new to padel. Here’s what stops you from playing the ball — and how to fix it.',b:`The walls are the main difference between padel and tennis. These are the mistakes I see most often.

**1. Hitting before the glass.** Beginners rush to hit the ball before it reaches the wall. Let it bounce — after the glass the ball is slower and easier to play.

**2. Standing right against the wall.** Give yourself room: about a step to a step and a half from the glass.

**3. Watching your opponent, not the ball.** Follow the ball all the way to the rebound.

**4. Not turning.** Stand side-on to the glass, as for a normal stroke — then the rebound won’t surprise you.

**5. Hitting as hard as you can.** Off the glass it’s enough to send the ball deep or play a lob — power isn’t the point here.

> **Drill:** your partner throws the ball into the back glass; you let it bounce and catch it with your hand. Then do the same with the racket.`},
  uk:{t:'5 помилок новачка біля скла',e:'Скло лякає всіх, хто приходить у падел. Ось що заважає дограти м’яч — і як це виправити.',b:`Стіни — головна відмінність паделу від тенісу. Ось помилки, які я бачу найчастіше.

**1. Бити до скла.** Новачки поспішають відбити м’яч, поки він не долетів до стіни. Дай йому відскочити — після скла м’яч повільніший і простіший.

**2. Стояти впритул до стіни.** Залиш собі місце: приблизно крок-півтора від скла.

**3. Дивитися на суперника, а не на м’яч.** Стеж за м’ячем до самого відскоку.

**4. Не розвертатися.** Стань боком до скла, як для звичайного удару, — тоді відскок не застане зненацька.

**5. Відбивати з усієї сили.** Після скла достатньо спрямувати м’яч глибоко або підняти свічку — сила тут не головне.

> **Вправа:** партнер кидає м’яч у заднє скло, ти даєш йому відскочити й ловиш рукою. Потім те саме — з ракеткою.`}
 },
 {slug:'first-racket',cat:'gear',min:3,date:'2026-11-02',cover:4,
  ro:{t:'Cum îți alegi prima rachetă',e:'Rotundă, lacrimă sau diamant? Ce contează cu adevărat când abia începi.',b:`Racheta de padel nu are corzi: are un miez din spumă și găuri. Pentru început contează trei lucruri.

## Forma

**Rotundă** — cea mai mare zonă de lovire bună și cel mai bun control. Cea mai bună alegere pentru începători. **Lacrimă** — echilibru între control și putere. **Diamant** — pentru putere, dar iartă mai puțin greșelile.

## Greutatea

Majoritatea rachetelor cântăresc între 350 și 375 g. La început alege una mai ușoară — mâna obosește mai puțin, iar tehnica se pune mai ușor.

## Duritatea

Spuma mai moale (EVA soft) dă mai mult „recul" și e mai ușor de jucat la loviturile lente — comod la început.

> **Sfat:** nu cumpăra din prima o rachetă scumpă. Încearcă mai multe la club — și împreună îți vom înțelege stilul.`},
  en:{t:'How to choose your first racket',e:'Round, teardrop or diamond? What actually matters when you’re just starting.',b:`A padel racket has no strings: it has a foam core and holes. To start with, three things matter.

## Shape

**Round** — the biggest sweet spot and the best control. The best choice for beginners. **Teardrop** — a balance of control and power. **Diamond** — for power, but less forgiving of mistakes.

## Weight

Most rackets weigh between 350 and 375 g. Start with a lighter one — your arm tires less and technique is easier to build.

## Stiffness

Softer foam (soft EVA) gives more "bounce" and is easier on slow shots — comfortable when you’re starting out.

> **Tip:** don’t buy an expensive racket straight away. Try a few at the club — and together we’ll figure out your style.`},
  uk:{t:'Як вибрати першу ракетку',e:'Кругла, крапля чи ромб? Що насправді важливо, коли ти тільки починаєш.',b:`Ракетка в паделі — без струн: у неї пінопластове осердя й отвори. Для старту важливі три речі.

## Форма

**Кругла** — найбільша зона вдалого удару й найкращий контроль. Найкращий вибір для новачка. **Крапля** — баланс між контролем і силою. **Ромб** — для сили, але менше прощає помилки.

## Вага

Більшість ракеток важать 350–375 г. Для початку обирай легшу — рука менше втомлюється, а техніку ставити простіше.

## Жорсткість

М’якша піна (EVA soft) дає більше «віддачі» і легше грається на повільних ударах — це зручно на старті.

> **Порада:** не купуй дорогу ракетку одразу. Спершу пограй кількома в клубі — і ми разом зрозуміємо твій стиль.`}
 }
];


// карточки «лет в паделе / уровень / языки» — как обычные тексты, чтобы их можно было править
STATS.ro.forEach((_, i) => { T['stat'+(i+1)+'.v'] = {ro:STATS.ro[i][0], en:STATS.en[i][0], uk:STATS.uk[i][0]}; T['stat'+(i+1)+'.l'] = {ro:STATS.ro[i][1], en:STATS.en[i][1], uk:STATS.uk[i][1]}; });
return { RATES, PRICES, T, MARQUEE, FACTS, WHO, LEVELS, FORMATS, STEPS, FAQ, FORM_FORMATS, FORM_TIMES, CATS, POSTS };
})();
