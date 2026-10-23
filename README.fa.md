<div align="center" dir="rtl">

<img src="docs/logo.svg" alt="ToonFlow Logo" width="104" height="104">

# ToonFlow (`v1.0.0`) — راهنمای کامل فارسی

**موتور بین‌المللی ساخت انیمیشن‌های کمیک و استیک‌من دو-لایه برای ویدیوهای آموزشی یوتیوب (`16:9`)، مستندهای تاریخی و ریلزهای وایرال اینستاگرام (`9:16`).**

🌍 **[English Documentation (README.md)](README.md)**

<br>

<a href="docs/media/toonflow-showcase-en.mp4">
  <img src="docs/media/toonflow-showcase.gif" alt="ToonFlow v1.0.0 Live Demo" width="920">
</a>

<p align="center">
  <a href="docs/media/toonflow-showcase-en.mp4"><b>▶ تماشا / دانلود ویدیوی دموی کامل انگلیسی با کیفیت 1080p و صدای استودیویی (<code>toonflow-showcase-en.mp4</code>)</b></a>
</p>

</div>

---

<div dir="rtl">

## معرفی `ToonFlow v1.0.0`

**ToonFlow (`v1.0.0`)** یک موتور انیمیشن‌سازی کمیک دوبعدی مبتنی بر کد (Remotion 4) و اسکیل هوشمند (AI Agent / Claude Code Skill) است که هر سناریو، متن، فایل زیرنویس (`.srt`) یا صدای ضبط‌شده را به ویدیوهای انیمیشنی حرفه‌ای در دو فرمت **افقی یوتیوب (`1920×1080`)** و **عمودی ریلز اینستاگرام / شورتس (`1080×1920`)** تبدیل می‌کند.

### ویژگی‌های کلیدی

1. **موتور کاراکتر کمیک دو-لایه بدون درز (`assets/engine/stick.tsx`)**:
   - ترسیم پیوستهٔ کاراکترها در دو مرحله (`PASS 1`: خط دور مشکی `16px` + `PASS 2`: رنگ درونی زنده `11px` در سر، تنه، دست‌ها و پاها) بدون هیچ‌گونه درز مفصلی.
   - دارای سایهٔ تماس با زمین، چرخهٔ راه رفتن و دویدن خودکار (`walkCycle`, `runCycle`)، چشم‌های بیضی کارتونی، پلک زدن خودکار و ۶ حالت چهره (`happy`, `sad`, `angry`, `shock`, `smirk`, `meh`).
2. **طراحی کامل و حرفه‌ای شخصیت بانوان (`hat="ponytail"`) و آقایان**:
   - شامل تاج موی حجم‌دار، چتریِ فرق‌کج، طرهٔ کنار گوش، گوشوارهٔ میخی طلایی، دم‌اسبیِ پرپشت S-شکل با کش موی طلایی، مژه‌های کارتونی، برق مردمک چشم، رژگونه و **پیراهن/دامن کمیک دو-لایه (A-Line)** با کمربند طلایی یکپارچه.
3. **تشخیص خودکار زبان فارسی (`RTL`) و انگلیسی (`LTR`)**:
   - تمامی کامپوننت‌های متنی (`<Slam>`, `<Card>`, `<Stamp>`, `<StatBar>`, `<Captions>`, `<Actor>`) به‌طور خودکار زبان متن را تشخیص داده و جهت چیدمان راست‌به‌چپ یا چپ‌به‌راست را تنظیم می‌کنند.
4. **معماری اختصاصی Safe Zone ریلز اینستاگرام ۲۰۲۶ (`1080×1920`)**:
   - خط زمین اختصاصی عمودی (`V_GROUND_Y = 1220`)، زیرنویس در `bottom = 480` و تیترهای دو-طبقه در `y = 265..335` تا هیچ بخشی از انیمیشن زیر دکمه‌ها یا کپشن اینستاگرام قرار نگیرد.
5. **۵ پروژهٔ کامل و آماده در پوشهٔ `examples/`**:
   - `00-english-wealth-explainer-16x9`: ویدیوی دموی انگلیسی (`1920×1080` — مقایسهٔ ۱۰ هزار دلار در بانک با طلا و دارایی)
   - `01-bank-vs-gold-reel-9x16`: ریلز عمودی «پس‌انداز بانکی در برابر طلا و دارایی» (`1080×1920`)
   - `02-fomo-market-trap-reel-9x16`: ریلز عمودی «تله خرید در اوج هیجان (FOMO) و خرید ۳ پله‌ای» + `Covers.tsx`
   - `03-iran-iraq-war-documentary-16x9`: مستند افقی «جنگ ایران و عراق» (`1920×1080`)
   - `04-christopher-columbus-16x9`: مستند افقی «سفر کریستف کلمب» (`1920×1080`)

---

## گالری نمونه‌کارهای موجود در مخزن

### ۱. ریلزهای عمودی `9:16` و کاورهای استاندارد اینستاگرام (`1080×1920`)
<p align="center">
  <img src="docs/media/showcase-9x16-reels.png" alt="9:16 Vertical Reels Showcase" width="920">
</p>

### ۲. ویدیوی دموی انگلیسی `16:9` (`1920×1080`)
<p align="center">
  <img src="docs/media/showcase-16x9-en.png" alt="16:9 English Explainer Showcase" width="920">
</p>

### ۳. مستندهای تاریخی و ژئوپلیتیک `16:9` (`1920×1080`)
<p align="center">
  <img src="docs/media/showcase-16x9-documentary.png" alt="16:9 Documentary Showcase" width="920">
</p>

---

## نصب و راه‌اندازی سریع

```bash
git clone https://github.com/ZALPRO/toonflow.git ~/.claude/skills/toonflow
pip install -r ~/.claude/skills/toonflow/requirements.txt
```

ساخت پروژهٔ جدید:

```bash
python3 scripts/setup_project.py --dir ./my-toonflow-studio --create
python3 scripts/new_video.py --project ./my-toonflow-studio --slug reel-01 --size 1080x1920
```

</div>
