# Inklyuziv AI Super App

100% Onlayn AI Inklyuziv Muloqot va Tayyorlov Platformasi. Barcha uchun teng imkoniyatli muloqot va Tayyorlov kurslari platformasi.
Tizim React, Vite, Express, WebSockets va Google Gemini AI texnologiyalarida qurilgan.

## WCAG 2.1 & a11y Muvofiqlik Tekshiruv Jadvali

Platformaning barcha toifadagi foydalanuvchilar uchun mosligi to‘liq tekshirildi:

| Qulaylik / Imkoniyat Guruhi | Integratsiya qilingan Funksiyalar | WCAG Me'yori |
| :--- | :--- | :--- |
| **Ko'zi Ojizlar (Blind)** | Web Speech Narrator (TTS), LiveAssistVision (Mening Ko'zim AI tasviri), TayyorlovExamCenter (Ovozli STT imtihon), SocialFeed (AI Alt-Text). | **WCAG 2.1 Level AAA** |
| **Zaif Ko'ruvchilar (Low Vision)** | Yuqori kontrastli qora-sariq (yellow-black) va yorug' (high-light) mavzular, A / A+ / A++ shrift masshtabi, aniq ko'rinuvchi fokus halqasi (`:focus-visible`). | **WCAG 2.1 Level AAA** |
| **Karlar va Zaif Eshituvchilar (Deaf)** | RealTimeChat (matnlarni ishora belgilariga ajratish), SignLanguageVision (AI kamera orqali imo-ishoralarni tahlil qilish), SignLanguageDictionary. | **WCAG 2.1 Level AA** |
| **Nutqida Nuqsoni Borlar (Mute)** | Avtomatik matn grammatika tahriri (`/api/ai/correct-text`), chat orqali tayyorlov viktorinalarini topshirish, InklyuzivBandlik orqali masofaviy ish topish. | **WCAG 2.1 Level AA** |

## Asosiy Modullar
- Real-vaqt chat va Auto-correct
- Ijtimoiy tarmoq (Social Feed) va AI Alt-text
- Ishora Tili Lug'ati va AI Translator (CV)
- Atrof-muhitni aniqlovchi "Mening Ko'zim" AI (Live Assist)
- Inklyuziv Bandlik (Vakansiyalar)
- Psixologik hamjamiyat va anonim yordam
- Ovozli imtihon markazi (Tayyorlov)

## O'rnatish

```bash
npm install
npm run dev
```

Platforma lokal manzilda ishga tushadi: `http://localhost:3001`
PWA (Progressive Web App) xususiyati tayyor. Oflayn rejimda ishlash uchun xizmat ko'rsatish ishchisi (Service Worker) faollashtirilgan.

## 4. WebSocket va Audio Kesh Xavfsizlik Qoidalari

- **WSS (Secure WebSockets)**: Ishlab chiqarish muhitida NGINX yoki Cloud Load Balancer orqali HTTPS/WSS trafigi Upgrade va Connection "Upgrade" sarlavhalari bilan to‘g‘ri proksi qilinishi ta'minlanadi.
- **Rate Limiting**: WebSockets orqali yuborilayotgan xabarlar va Gemini AI tahlil so‘rovlariga (`/api/ai/live-assist`, `/api/ai/sign-translate`) spamdan himoya qiluvchi cheklovlar o‘rnatiladi.
- **Audio Caching**: Tez-tez takrorlanadigan tayyorlov darslari audio ma'ruzalari mahalliy keshda saqlanib, qayta yuklanish va tarmoq trafigi tejaladi.

## Master Rejaning Bajarilgan Holati

- [x] **1-bosqich**: Texnik audit, TypeScript tiplar modeli (`types.ts`) va Node.js Express server arxitekturasi.
- [x] **2-bosqich**: WCAG 2.1 AAA a11y konteksti (`AccessibilityContext.tsx`), yuqori kontrastli UI va WebSockets sinxron chat (`RealTimeChat.tsx`).
- [x] **3-bosqich**: Tayyorlov kurslari bazasi (`tayyorlovCoursesData.ts`), interaktiv darsliklar (`TayyorlovKurslari.tsx`), ishora tili AI lug‘ati (`SignLanguageDictionary.tsx`) va [AI_O'qituvchi] paneli.
- [x] **4-bosqich**: Multimodal Computer Vision (`SignLanguageVision.tsx`), Jonli ko‘rish assistenti (`LiveAssistVision.tsx`) va AI Alt-Textli ijtimoiy lenta (`SocialFeed.tsx`).
- [x] **5-bosqich**: "Ish Bor" bandlik markazi (`InklyuzivBandlik.tsx`), psixologik ko‘mak (`PsychologyCommunity.tsx`), ovozli imtihon markazi (`TayyorlovExamCenter.tsx`) va boshqaruv yadrosi (`App.tsx`).
- [x] **6-bosqich**: PWA Service Worker, oflayn rejim, WCAG 2.1 muvofiqlik tekshiruvi va production build.
- [x] **7-bosqich**: Docker konteynerlashtirish, Docker Compose va to‘liq avtomatlashtirilgan server deploy tizimi.

## Tezkor Tugmalar Yo'riqnomasi

| Tugmalar Birikmasi | Funksiya | Mos keluvchi Foydalanuvchi Guruhlari |
| :--- | :--- | :--- |
| **Alt + C** | Real-Vaqt Chat va Muloqot xonasi | Barcha foydalanuvchilar |
| **Alt + T** | Tayyorlov Kurslari va Darsliklar | O'quvchilar va tinglovchilar |
| **Alt + S** | Ishora Tili Lug'ati va AI Generator | Karlar va zaif eshituvchilar |
| **Alt + V** | Computer Vision Imo-ishora Tarjimoni | Karlar va surdo-tarjimonlar |
| **Alt + L** | "Mening Ko'zim" Jonli Atrof-muhit Assistenti | Ko'zi ojizlar va zaif ko'ruvchilar |
| **Alt + E** | Ovozli va Vizual Imtihon Markazi | Sertifikat oluvchi o'quvchilar |
| **Alt + R** | Ovozli Narratorni yoqish / o'chirish | Screen Reader foydalanuvchilari |
| **Alt + K** | Sariq-qora yuqori kontrast rejimiga o'tish | Zaif ko'ruvchilar |

## Loyihaning To'liq Xulosasi va Foydalanishga Topshirish

Loyiha noldan boshlab to'liq siklda muvaffaqiyatli qurildi va topshirildi:
- **Arxitektura & Backend**: Node.js, Express, WebSockets (`ws`), doimiy ma'lumotlar bazasi va Gemini Multimodal AI integratsiyasi.
- **Sun'iy Intellekt**: O'zbek tilidagi matnlarni grammatik to'g'rilash, imo-ishoralarni Computer Vision orqali aniqlash, ko'zi ojizlar uchun kadrlar va postlarga avtomatik AI Alt-Text yaratish hamda interaktiv `[AI_O'qituvchi]`.
- **Inklyuzivlik**: WCAG 2.1 AAA darajasi, to'liq klaviatura boshqaruvi, yuqori kontrast, Web Speech API (STT/TTS).
- **Infratuzilma**: Docker, Docker-compose, PWA (oflayn kesh), Nginx teskari proksi va GitHub Actions CI/CD pipeline.

## Ekotizimning Barcha Imkoniyatlari Xaritasi

Platforma quyidagi to‘liq arxitektura bo‘yicha topshirildi:
- **Muloqot va Sinxronizatsiya**: WebSockets orqali kechikishsiz chat, Speech-to-Text (STT) mikrofoni, Text-to-Speech (TTS) ma'ruza o‘qish.
- **Multimodal Sun'iy Intellekt**: Gemini Vision bilan imo-ishoralarni tahlil qilish (`SignLanguageVision`), ko‘zi ojizlar uchun jonli muhit tavsifi (`LiveAssistVision`) va postlarga avtomatik `ai_alt_text`.
- **Ta'lim va Inklyuzivlik**: "Tayyorlov Kurslari", interaktiv viktorinalar, `[AI_O'qituvchi]` assistenti va ovozli yakuniy imtihon markazi.
- **Ijtimoiy Integratsiya**: "Ish Bor" bandlik birjasi, psixologik ko‘mak va motivatsion tajribalar tarmog‘i.
- **Infratuzilma va Xavfsizlik**: PWA oflayn kesh, WCAG 2.1 AAA a11y, Docker va CI/CD deploy quvurlari.
