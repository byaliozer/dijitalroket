# Dijital Roket — PRD

## Original Problem Statement
Build a premium corporate Turkish website for **Dijital Roket** — repositioned as a "DR AI destekli kurumsal dijital dönüşüm" company (NOT a social media agency). Target audience: medium/large enterprises, manufacturers with dealer networks, turizm/mobilya/halı/otomotiv/eğitim/sağlık/spor sectors. Core message: "Şirketinizi Dijitalde Roketliyoruz." Must convey trust + modern SaaS/AI startup feel.

## Architecture
- **Backend**: FastAPI + MongoDB (motor). JWT (HS256, 1-day) auth in `Authorization: Bearer`. Admin seeded on startup. bcrypt password hashing. All routes `/api/*`.
- **Frontend**: React 19 + React Router 7, Tailwind, framer-motion for controlled animations, lucide-react icons, Sonner for toasts. Fonts: Manrope (headings) + Inter (body). JWT stored as `dr_token` in localStorage.
- **DB collections**: `users`, `contacts`, `project_requests`, `blog_posts`, `case_studies`.

## User Personas
1. **Corporate decision-maker** — needs to evaluate Dijital Roket's capabilities, browse case studies, request a project brief.
2. **Existing partner / Roket Partner client** — checks ongoing services, contacts the team.
3. **Admin (Dijital Roket team)** — manages incoming leads, project briefs, blog content, and case studies.

## Core Requirements (static)
- 11 public pages + admin (login + dashboard with 5 tabs).
- Brand-strict color palette (Deep Space Navy #07111F, Roket Blue #2563EB, Electric Cyan #22D3EE).
- Dark hero / light body hybrid with glassmorphism navbar.
- Forms persist to MongoDB; admin can view, edit, delete.
- Seeded content (5 blog posts + 4 case studies) so the site is never empty.
- Turkish content throughout. Forbidden terms ("ChatGPT", "OpenAI", "Emergent", "no-code", "prompt") not present; AI capability is referenced as "DR AI Üretim Sistemi".

## What's Been Implemented (2026-06-11) — Batch 2
- **Editor enhancements**: Blog & Project admin forms now have Tag chip input, SEO title + SEO description fields. Markdown content editor has %100/%75/%50 image-size buttons (append `{w=NN}` to image markdown). `Markdown.jsx` renders sized images + raw HTML blocks.
- **Brand Management ("Markalar (AI)" admin tab)**: CRUD for brands — name, slug, logo upload, brand color, 9-point logo-position grid, plain-text (admin-visible) portal email/password, monthly credits. Usage/audit modal with monthly generation summary (for billing).
- **DR AI Image Engine 2.0 (gpt-image-2)**: Brand portal at `/firma/giris` → `/firma/panel` (ChatGPT-like). Generates Post (1080x1350→1088x1344) / Story (1080x1920→1088x1920) images; logo composited natively by the model into the brand's grid slot (NO PIL). AI caption (gpt-4o vision) per image, copy + download. 1 credit per generation, deducted only on success; monthly auto-reset; 402 "Kredi yetersiz" when exhausted; full audit log.
- **Auth**: Separate brand JWT (`dr_brand_token`, type=brand, 7d). Token isolation enforced (admin↔brand 401). Backend `OPENAI_API_KEY` from .env used for image+caption.
- **Testing**: 15/15 new + 18/18 existing pytest pass; frontend flows 100% (iteration_2.json). Generation gracefully handles OpenAI 502.
- **KNOWN BLOCKER**: OpenAI account returns `billing_hard_limit_reached` → live generation needs the user to add billing/credit to their OpenAI account. Code is correct & ready.
- **(2026-06-11 update) RESOLVED**: User added OpenAI billing. End-to-end VALIDATED live: gpt-image-2 edits 200 OK with native logo placement (DR logo composited bottom-right, no PIL), gpt-4o Turkish caption + hashtags, 1088x1920 story + 1088x1344 post. Generation takes ~90-150s which exceeds the 60s ingress gateway limit, so generation was refactored to an **async job pattern**: `POST /api/brand/generate` reserves 1 credit + returns `{job_id}` instantly; a background task runs the generation; `GET /api/brand/generation/{job_id}` is polled by the frontend (every 3s, up to 4min). Credit is refunded on failure. Admin audit + history count only completed (image_url != "") generations.
- **(2026-06-11) Image Edit / Regenerate**: Brand portal can now edit/regenerate any generated image via natural-language instruction ("logoyu büyüt", "daha minimal yap" etc.). `POST /api/brand/edit {source_id, instruction}` → gpt-image-2 edits passing the previous image + brand logo (`image[]` multipart), preserves format, regenerates caption, costs 1 credit (same async job + polling, refund on failure). Frontend: edit panel under the result card with quick-suggestion chips + free-text input; history thumbnails are clickable to reload an older image for editing. VALIDATED live end-to-end.
- **(2026-06-11) Navbar**: Added "Portal Girişi" button next to "Talebim Var" (desktop + mobile) linking to /firma/giris. Also added "Blog" link to the main nav.
- **(2026-06-11) Upload serving fix (production-critical)**: Uploaded files are now served by the backend at `GET /api/uploads/{filename}` and upload endpoints return `/api/uploads/...` URLs (works behind production ingress where frontend is static). Added `_local_upload_path` helper resolving both old `/uploads/` and new `/api/uploads/` URLs. Fixed admin/gallery image inputs from `type="url"` → `type="text"` (relative paths failed native URL validation). NOTE: uploads live on backend disk — recommend persistent volume / object storage for prod durability.
- **(2026-06-11) Brand Settings + 'Firma Hakkında' + password change**: Brand portal has an "Ayarlar" modal (logo upload via `POST /api/brand/upload`, name, website, brand color, "Firma Hakkında" sector/about text) saved via `PUT /api/brand/settings`, plus self-service `POST /api/brand/change-password` (validates current). Admin BrandForm also has the "Firma Hakkında" field; admin can change brand password via the visible password field. `about` is injected into the AI generate + edit prompts so images suit the company's sector. Tested 11/11 backend + full UI flow (iteration_3.json).
- **(2026-06-17) Brand self-registration + admin approval + Resend email + KVKK/Terms**: Firms self-register at /firma/giris (toggle "Kayıt Ol"): required full_name/phone/email/password, optional company/website/instagram/about, mandatory KVKK + Kullanıcı Sözleşmesi consent checkboxes (viewable in a modal; texts in `frontend/src/data/legalTexts.js`). `POST /api/brand/register` creates brand status="pending" (credits 0); firm sees "Firmanız onay bekliyor". `brand_login` blocks pending(403)/rejected(403) with Turkish messages. Admin "Markalar (AI)" tab shows an "Onay Bekleyen Başvurular" section → Approve (admin enters monthly credits) / Reject. `POST /api/admin/brands/{id}/approve` sets status+credits and sends a Resend approval email ("Dijital Roket hesabınız onaylanmıştır"); `/reject` sets rejected. Email: Resend via `RESEND_API_KEY` + `SENDER_EMAIL` (onboarding@resend.dev), `_send_approval_email` (asyncio.to_thread), graceful skip if no key. **LIVE-VALIDATED**: real approval email delivered. NOTE: Resend test mode only delivers to the account owner's email — to email arbitrary firms in prod, verify dijitalroket.com domain in Resend and set SENDER_EMAIL to noreply@dijitalroket.com. Tested 7/7 backend + full UI (iteration_4.json).

- **(2026-06-19) Object Storage geçişi (P0 — kırık görsel kalıcı çözümü)**: Tüm yüklemeler (admin upload, marka logo upload, AI üretilen + düzenlenen görseller) artık ephemeral local disk yerine kalıcı **Emergent Object Storage**'a yazılıyor. `server.py`'a `_init_storage`/`_storage_put`/`_storage_get` + `_save_upload_bytes` + `_read_image_bytes` yardımcıları eklendi (`EMERGENT_LLM_KEY` ile, app-prefix=`dijital-roket/uploads/`). URL şeması korundu (`/api/uploads/{name}`); `serve_upload` önce object storage'tan, bulunamazsa legacy diskten servis ediyor. AI generate/edit fonksiyonları logo & kaynak görseli artık buluttan okuyor (asenkron Job+Polling mimarisi korundu). **VALIDATED**: admin+brand upload → object storage'a yazılıyor (diskte yok), `/api/uploads/{name}` 200 + image/png ile servis ediliyor. Deploy/pod restart sonrası görseller artık kaybolmayacak. Not: önceki kırık linkler için markaların logolarını bir kez yeniden yüklemesi gerekir.

- **(2026-06-19) SEO altyapısı (robots.txt + sitemap + noindex/canonical)**: Üretimde GSC "robots.txt geçerli değil (nginx HTML dönüyordu)" ve 404 sayfasının indekslenmesi sorunları çözüldü. Eklendi: geçerli `public/robots.txt` (admin/firma/api disallow + Sitemap satırları), statik `public/sitemap.xml` (ana sayfalar), dinamik `GET /api/sitemap.xml` (yayındaki tüm proje + blog URL'leri otomatik). `SEO.jsx`'e `noindex` + self-referencing `canonical` + og:url/og:title/og:description desteği; 404 (`NotFound`) sayfası artık `noindex, nofollow`. **VALIDATED** (testing_agent iteration_5, backend 7/7 pytest + frontend Playwright %100). Pytest: `/app/backend/tests/test_seo.py`. Not: değişikliklerin dijitalroket.com'da yayına girmesi için REDEPLOY + GSC'de sitemap yeniden gönderimi gerekir.

- **(2026-06-19) AEO/GEO — AI asistan keşfedilebilirliği (llms.txt + JSON-LD + proje SSS)**: Yapay zekâların (ChatGPT/Gemini/Claude) Dijital Roket'i tanıyıp önermesi için: (1) statik `public/llms.txt` (H1 + hizmet/link özeti) + dinamik `GET /api/llms-full.txt` (yayındaki TÜM proje & blog içeriği + proje SSS'leri, yeni eklenenler otomatik dahil, `text/markdown`). (2) **JSON-LD yapısal veri**: global Organization+WebSite (`OrganizationSchema.jsx`, SiteLayout'ta tüm sayfalarda; hizmet listesi=knowsAbout+makesOffer, Bursa/TR, areaServed Türkiye, sosyal sameAs), proje detayda Article+BreadcrumbList+FAQPage, blog detayda Article+BreadcrumbList (`JsonLd.jsx` ile head'e enjekte). (3) Projelere **düzenlenebilir SSS alanı** (`CaseStudy.faq: List[dict]` {q,a}; admin ProjectForm'da SSS editörü; ProjectDetail'de görünür SSS bölümü + FAQPage şeması). (4) Erişilebilirlik: footer ikon-linklere aria-label + sr-only. **VALIDATED** (testing_agent iteration_6, backend 6/6 pytest + frontend Playwright %100). Pytest: `/app/backend/tests/test_aeo.py`. NOT: FAQ item anahtarları {q, a}. Yayına girmesi için REDEPLOY gerekir.

- **(2026-06-19) AEO/GEO faz-2 (AI FAQ üretimi + blog SSS + OG + buton fix)**: (1) BUG FIX: "Roket Partner Görüşmesi Planlayın" butonu `/roket-partner` (404) yerine `/proje-talep`'e yönleniyor (`RoketPartnerSection.jsx`). (2) **AI ile SSS üretimi**: `POST /api/admin/generate-faq` (gpt-5.4-mini, Emergent LLM key, emergentintegrations) proje/blog içeriğine göre 10 Türkçe soru-cevap üretir; admin ProjectForm & BlogForm'da paylaşılan `FaqEditor` + "AI ile 10 SSS Üret" butonu (`ai-generate-faq-btn`). Helper `dr_generate_faq` + `_parse_faq_json`. (3) **Blog SSS**: `BlogPost.faq` alanı + BlogDetail'de görünür SSS + FAQPage şeması; `llms-full.txt` blog SSS satırlarını içerir. (4) Organization JSON-LD → `["Organization","ProfessionalService"]` + `contactPoint` (telefon/e-posta). (5) OG/Twitter: `public/og-image.jpg` (üretildi) + index.html'e og:image/og:site_name/og:locale/twitter:card; `SEO.jsx`'e `image` prop (proje/blog kapak görseli paylaşım kartı). Tüm 6 proje + 5 blog yazısı 5'er AI SSS ile dolduruldu. **VALIDATED** (testing_agent iteration_7, backend 6/6 + frontend 7/7 %100). Pytest: `/app/backend/tests/test_faq_ai.py`.

- **(2026-06-19) AEO/GEO faz-3 (Şirket düzeyi SSS + tam denetim)**: En büyük GEO eksiği kapatıldı: ana sayfaya **şirket düzeyinde SSS** eklendi (`HomeFaq.jsx` accordion + FAQPage JSON-LD id=jsonld-home-faq). "Dijital Roket ne yapar / nerede / hangi hizmetler" gibi AI'ya en çok sorulan kurumsal sorular. `DEFAULT_SETTINGS.home_faq` (8 varsayılan), `get_settings` artık `{**DEFAULT_SETTINGS, **doc}` merge yapıyor (eski dokümanlarda da yeni anahtarlar görünür), `update_settings` whitelist'e `home_faq` eklendi. `generate-faq` artık `kind='company'` destekliyor; admin "Site Ayarları" sekmesinde `FaqEditor` + "AI ile 10 SSS Üret". Denetim sonucu: H1 tüm sayfalarda mevcut (PageHero/Hero <h1>), başlık/meta benzersiz ve doğru, canonical/robots/sitemap/llms/şemalar tam. **VALIDATED** (testing_agent iteration_8, backend 10/10 + frontend %100). Pytest: `/app/backend/tests/test_home_faq.py`.
- **(2026-06-19) Canonical alan adı www'ya hizalandı**: Production'da hem `dijitalroket.com` hem `www.dijitalroket.com` 200 dönüyordu (duplicate content riski). Kullanıcı GSC'de www'yu doğruladı; tüm sabit alan adı referansları `https://dijitalroket.com` → `https://www.dijitalroket.com` yapıldı (backend `SITE_URL` default + llms-full linkleri; `OrganizationSchema.jsx` SITE_URL; `robots.txt`, `sitemap.xml`, `llms.txt`, `index.html` og/twitter). `SEO.jsx` canonical & og:url artık `window.location.origin` yerine sabit `https://www.dijitalroket.com` + pathname kullanıyor (www'suz/preview ziyaretçileri www'ya konsolide olur). Curl ile doğrulandı. NOT: Kullanıcının yapması gerekenler — (1) GSC Kaldırmalar'daki `https://www.dijitalroket.com/*` geçici kaldırma isteğini İPTAL et (tüm siteyi gizler!), (2) non-www→www 301 yönlendirmesi (host/DNS ayarı, Emergent Destek), (3) Redeploy.


## What's Been Implemented (2026-05-13)
- **Backend**: JWT auth (login, me), contact + project-request submission, blog/projects CRUD (admin), public listing endpoints, admin stats, brute-force-not-implemented (flagged), seed admin + 5 blog posts + 4 case studies on startup.
- **Frontend pages**: Home (11 sections), DR AI System, Kurumsal Çözümler, Sprint Modeli, Projeler (+ detail), Roket Partner, Hakkımızda, İletişim, Blog (+ detail), Proje Talep Formu, Admin Login + Admin Dashboard (overview, contacts, requests, projects, blog tabs with CRUD modals).
- **Animations**: Framer-motion entrance + scroll reveals, floating dashboard mockup, animated gradient orbs, glow-pulse CTA, animated timeline dots — all controlled, no bouncy effects.
- **Testing**: 18/18 backend pytest passing, 100% of critical frontend flows verified via Playwright by testing_agent_v3.

## Prioritized Backlog
### P1 (next polish)
- Make blog/project cards entirely clickable (currently only the inner link).
- Add data-testid to admin BlogForm/ProjectForm inputs for richer test automation.
- Newsletter sign-up in footer + lead-magnet PDF on Roket Partner page.
- OG/Twitter image generation (currently meta title/desc only).

### P2 (growth)
- Auto-generate hero/section images via gpt-image-2 (key already in .env) for refresh cycle.
- Blog post search + tag filter on /blog.
- Brute-force lockout on /auth/login (5 attempts / 15 min).
- HttpOnly cookie auth instead of localStorage for admin (higher security).
- E-posta bildirimi (Resend/SendGrid) when new contact / project-request comes in.
- Admin: ability to mark contact as "responded".

### P3 (future)
- Multi-author Blog: add `User` role-based access.
- Public case study filtering by industry on URL (deep-link).
- Light/Dark mode toggle on public site.

## What's Been Implemented (2026-06-19 → devam) — AI-Search / Citation-Ready faz-5
ChatGPT 3. denetim (AI Search / entity clarity / citability) listesindeki eksikler kapatıldı:
- **Merkezi NAP (tek adres kaynağı)**: `DEFAULT_SETTINGS`'e tam gerçek adres + `address_street/locality/region/country` eklendi; DB settings dokümanı güncellendi. Footer, İletişim ve `OrganizationSchema` (PostalAddress) artık aynı tek kaynaktan besleniyor. Adres: Panayır Mah. 400. Sk. Okumuşlar Plaza No:2 İç Kapı No:12, Osmangazi/Bursa.
- **First-Party Knowledge Module + Kaynaklar**: `BlogPost`/`BlogPostCreate` modeline `expert_insight`, `project_example`, `methodology`, `sources[{title,url}]` eklendi (update whitelist + llms-full.txt export dahil). Admin BlogForm'a "Dijital Roket Deneyimi (First-Party / E-E-A-T)" bölümü + `SourcesEditor`. Blog detayda yalnızca doldurulmuşsa görünen "Dijital Roket Deneyimi" + `Sources` bileşeni. Uçtan uca curl testi geçti (create→fetch→llms→delete).
- **Reusable bileşenler**: `components/DirectAnswer.jsx` (AEO doğrudan cevap kutusu) + `components/Sources.jsx` (kaynak listesi).
- **Author E-E-A-T zenginleştirme**: Gerçek yazar fotoğrafı (Ali Özer, object storage `/api/uploads/64c720e8891a4d719539266a2a6db482.jpg`) blog detayda + `authorData.js`'e `image` + `sameAs`; BlogPosting `author` = `Person` (image + sameAs + jobTitle + worksFor Organization).
- **Agent-friendly formlar**: İletişim + Proje Talep formlarına `autocomplete` (name/organization/tel/email), `aria-required`, başarı mesajlarına `role=status aria-live=polite`; Proje Talep bölümleri `fieldset/legend`.
- **/arastirmalar**: Kullanıcı isteğiyle ATLANDI (gerçek araştırma verisi olduğunda yapılacak).
- **Zaten mevcut olanlar (denetimde ✓)**: robots.txt'de OAI-SearchBot + tüm AI crawler'ları Allow; sameAs yalnızca gerçek hesaplar; FAQ görünür+schema; blog tarih/yazar; internal link engine. GA4 kurulu değil (ChatGPT referral için bozulacak bir şey yok).
- **VALIDATED**: Admin blog formu (first-party + sources) render + kaydet; blog yazar fotoğrafı yükleniyor; footer/iletişim tam NAP; backend round-trip curl %100.

## What's Been Implemented (2026-06-19 → devam) — Google Search Görünümü & Sitelink faz-6
ChatGPT "Google Search görünümü / sitelink" listesi uygulandı (testing_agent iteration_11 %100):
- **Benzersiz SEO metadata (5 ana sayfa)**: Home/Hizmetler/Projeler/Hakkımızda/İletişim'e verilen tam title + meta description + self-referencing canonical (www) explicit prop olarak geçildi. Duplicate yok.
- **404 / wildcard**: NotFound title "404 - Sayfa Bulunamadı | Dijital Roket" + noindex,nofollow; `/*` SPA'da noindex, sitemap dışı.
- **Favicon**: Gerçek dosyalar (favicon.ico + 32/48/192/512 png + apple-touch-icon 180 + favicon.svg + manifest.json), index.html link tag'leri, tümü HTTP 200 kalıcı URL.
- **Organization logo schema**: `ImageObject` (favicon-512x512.png, 512x512). Favicon≠logo ayrımı korundu.
- **Navbar sırası**: Ana Sayfa, Hizmetler, Projeler, Hakkımızda, Blog, İletişim (Kurumsal Çözümler üst nav'dan çıkarıldı; route+footer korundu).
- **Homepage**: Hizmetler bölümü Projeler'den ÖNCE; Hero CTA + SolutionsGrid'den `/hizmetler`'e güçlü internal link.
- **H1'ler**: Projeler/Hakkımızda/İletişim/Hizmetler benzersiz ve kompakt.
- NOT: Yayına girmesi için REDEPLOY gerekir.

## What's Been Implemented (2026-06-19 → devam) — "DR AI ile Üret" interaktif AI lead sayfası (faz-7)
Reklam kampanyaları için premium, dönüşüm odaklı AI deneyim sayfası (testing_agent iteration_12: backend 6/6, frontend %100):
- **Sayfa** `/dr-ai-ile-uret` (`pages/DrAiUret.jsx`): idle→analyzing→questions→building→blueprint→(mockup)→form→success state machine. Yaşayan gradient aurora, glassmorphism, döngüsel placeholder, floating örnek kartlar, canlı Project Blueprint (staggered reveal), Framer Motion. Menüye "DR AI ile Üret" eklendi (Hizmetler ile Projeler arası). Alt imza "Powered by Dijital Roket AI".
- **Backend** (`server.py`): `POST /api/dr-ai/questions` (gpt-5.4-mini, 3-5 akıllı soru+seçenek), `/api/dr-ai/blueprint` (yapılandırılmış proje taslağı JSON), `/api/dr-ai/mockup` (gpt-image-2, logosuz UI mockup, 2 görsel paralel, object storage'a kaydeder), `/api/dr-ai/lead` (MongoDB `ai_leads`), admin `GET/DELETE /api/admin/ai-leads`.
- **Admin**: Yeni "DR AI Talepleri" sekmesi (`AiLeadsAdmin`) — talep listesi + detay modal (fikir, soru-cevap, blueprint, üretilen görseller, geri bildirim).
- Model: gpt-5.4-mini (metin) + gpt-image-2 (görsel), Emergent/OpenAI key. E-posta bildirimi kurulmadı (kullanıcı tercihi — admin panelinden takip).
- NOT: Production'da görünmesi için REDEPLOY gerekir.

## What's Been Implemented (2026-06-19 → devam) — DR AI mockup marka watermark (faz-8)
- `/api/dr-ai/mockup` ile üretilen her görsele, üretimden SONRA Pillow ile marka watermark ekleniyor: sağ altta yarı saydam koyu pill içinde **Dijital Roket logosu (favicon-512) + "www.dijitalroket.com"**. `_brand_mockup()` helper (`server.py`). Model'e bıraktırmak yerine deterministik composite — her zaman net ve doğru yazılıyor. Görsel olarak doğrulandı.
- Ayrıca DR AI ile Üret hero alt metni güncellendi ("...Ama ne kadar uzun anlatırsanız o kadar iyi geliştiririz projeyi.").

## What's Been Implemented (2026-06-19 → devam) — E-posta bildirimleri (faz-9)
- Yeni **DR AI ile Üret talebi** VE yeni **Proje Brief'i** geldiğinde `byaliozer@gmail.com` adresine otomatik bildirim e-postası gönderiliyor (Resend). Helper `_send_admin_notification()` + `_kv_rows()`/`_esc()` (`server.py`); `NOTIFY_EMAIL` env (fallback byaliozer@gmail.com). DR AI maili: müşterinin fikri + iletişim + blueprint + modüller + soru-cevap özeti. Brief maili: tüm form alanları. Gerçek gönderim log'la doğrulandı (Resend message ID döndü, 200).
- DR AI ile Üret formunda **Ad Soyad + Telefon zorunlu** (hem frontend validasyon hem backend kontrolü — zaten mevcuttu, teyit edildi).
- NOT: Gönderen `onboarding@resend.dev` (Resend test/onboarding). Delivery byaliozer@gmail.com'a çalışıyor. Kurumsal görünüm ve tüm adreslere gönderim için ileride `dijitalroket.com` alan adı Resend'de doğrulanmalı.

## BUG FIX (faz-10) — Canlı site açılmıyordu: sonsuz yönlendirme döngüsü
- **Belirti**: www.dijitalroket.com tarayıcıda açılmıyordu (timeout). curl 200 görüyordu çünkü JS çalıştırmıyor.
- **Kök neden**: Cloudflare `www.dijitalroket.com` → 308 → `dijitalroket.com` (non-www) yönlendiriyor; `public/index.html` içindeki inline `<script>` ise non-www'yi tekrar `www`'ye zorluyordu → **sonsuz redirect döngüsü**.
- **Düzeltme**: index.html'deki host-forcing JS redirect bloğu kaldırıldı. Yönlendirme artık yalnızca Cloudflare edge'de (tek yön). testing_agent iteration_13 %100 (preview temiz, script yok, navigasyon OK, konsol hatasız).
- **AKSİYON**: Production'a yansıması için REDEPLOY gerekir. Ayrıca canonical tutarlılığı için (tüm SEO www kullanıyor ama Cloudflare non-www'ye yönlendiriyor) primary domain kararı: ya Cloudflare'i non-www→www'ye çevir, ya da canonical'ları non-www yap.

## Next Tasks
- Optional UX: large clickable cards on listings.
- Optional: e-mail notifications when forms arrive.

## What's Been Implemented (2026-06-19 → devam) — Topical Authority faz-4 (Eksik kapatma)
ChatGPT SEO/topical authority denetim listesindeki atlanan maddeler tamamlandı:
- **Bursa Local Landing Page** (`/bursa-web-tasarim`, `pages/BursaLanding.jsx`): GERÇEK adres (Panayır Mah. Okumuşlar Plaza, Osmangazi/Bursa), ProfessionalService (LocalBusiness) + BreadcrumbList + FAQPage JSON-LD, Google Maps iframe, telefon/WhatsApp CTA, hizmet grid internal linkleri, ilgili projeler, 5 yerel-niyet SSS. Doorway page değil, tek güçlü sayfa. Sitemap (statik+dinamik), llms.txt/llms-full.txt ve footer'a eklendi.
- **Blog Topic Clusters** (`pages/Blog.jsx`): Kategori filtre çipleri (client-side, ayrı URL üretmez → thin/duplicate index sorunu yok). Kategoriler post'lardan dinamik türetiliyor.
- **Internal Link Engine** (`lib/related.js` paylaşımlı yardımcılar): Blog detay → ilgili hizmet + ilgili proje + ilgili yazı; Proje detay → ilgili hizmet + ilgili yazı; Hizmet detay → ilgili blog yazıları. Anchor text doğal ("... çözümlerimizi inceleyin").
- **Blog E-E-A-T** (`data/authorData.js`, `pages/BlogDetail.jsx`): GERÇEK yazar Ali Özer (Kurucu & CEO, byaliozer.com); hero'da yazar + görünür yayın tarihi + güncelleme tarihi + okuma süresi; yazı sonunda yazar kutusu (bio + link); JSON-LD author artık `Person` (worksFor Organization).
- **Metin değişikliği**: HomeFaq alt başlığı → "Dijital Roket'in hizmetleri, özel yazılım çözümleri ve proje süreçleri hakkında en çok merak edilen soruların yanıtları."
- **Organization JSON-LD**: PostalAddress'e gerçek streetAddress + Osmangazi eklendi (local SEO).
- **Yazar bilgisi**: Ali Özer — CEO — https://www.byaliozer.com/ — 0543 793 41 01 (gerçek, uydurma değil).
- **VALIDATED** (screenshot smoke): Bursa H1/map/6 hizmet/5 SSS; Blog detay yazar(1)+ilgili hizmet(1)+proje(2)+yazı(3)+tarihler; Blog filtre(6) çalışıyor; Hizmet ilgili blog(1)+ilgili proje(4). Derleme hatasız.
- NOT: Değişikliklerin dijitalroket.com'da görünmesi için REDEPLOY + GSC sitemap yeniden gönderimi gerekir.

## What's Been Implemented (2026-06-19 → devam) — "DR AI ile Üret" interaktif AI lead sayfası (faz-7)
Reklam kampanyaları için premium, dönüşüm odaklı AI deneyim sayfası (testing_agent iteration_12: backend 6/6, frontend %100):
- **Sayfa** `/dr-ai-ile-uret` (`pages/DrAiUret.jsx`): idle→analyzing→questions→building→blueprint→(mockup)→form→success state machine. Yaşayan gradient aurora, glassmorphism, döngüsel placeholder, floating örnek kartlar, canlı Project Blueprint (staggered reveal), Framer Motion. Menüye "DR AI ile Üret" eklendi (Hizmetler ile Projeler arası). Alt imza "Powered by Dijital Roket AI".
- **Backend** (`server.py`): `POST /api/dr-ai/questions` (gpt-5.4-mini, 3-5 akıllı soru+seçenek), `/api/dr-ai/blueprint` (yapılandırılmış proje taslağı JSON), `/api/dr-ai/mockup` (gpt-image-2, logosuz UI mockup, 2 görsel paralel, object storage'a kaydeder), `/api/dr-ai/lead` (MongoDB `ai_leads`), admin `GET/DELETE /api/admin/ai-leads`.
- **Admin**: Yeni "DR AI Talepleri" sekmesi (`AiLeadsAdmin`) — talep listesi + detay modal (fikir, soru-cevap, blueprint, üretilen görseller, geri bildirim).
- Model: gpt-5.4-mini (metin) + gpt-image-2 (görsel), Emergent/OpenAI key. E-posta bildirimi kurulmadı (kullanıcı tercihi — admin panelinden takip).
- NOT: Production'da görünmesi için REDEPLOY gerekir.

## What's Been Implemented (2026-06-19 → devam) — DR AI mockup marka watermark (faz-8)
- `/api/dr-ai/mockup` ile üretilen her görsele, üretimden SONRA Pillow ile marka watermark ekleniyor: sağ altta yarı saydam koyu pill içinde **Dijital Roket logosu (favicon-512) + "www.dijitalroket.com"**. `_brand_mockup()` helper (`server.py`). Model'e bıraktırmak yerine deterministik composite — her zaman net ve doğru yazılıyor. Görsel olarak doğrulandı.
- Ayrıca DR AI ile Üret hero alt metni güncellendi ("...Ama ne kadar uzun anlatırsanız o kadar iyi geliştiririz projeyi.").

## What's Been Implemented (2026-06-19 → devam) — E-posta bildirimleri (faz-9)
- Yeni **DR AI ile Üret talebi** VE yeni **Proje Brief'i** geldiğinde `byaliozer@gmail.com` adresine otomatik bildirim e-postası gönderiliyor (Resend). Helper `_send_admin_notification()` + `_kv_rows()`/`_esc()` (`server.py`); `NOTIFY_EMAIL` env (fallback byaliozer@gmail.com). DR AI maili: müşterinin fikri + iletişim + blueprint + modüller + soru-cevap özeti. Brief maili: tüm form alanları. Gerçek gönderim log'la doğrulandı (Resend message ID döndü, 200).
- DR AI ile Üret formunda **Ad Soyad + Telefon zorunlu** (hem frontend validasyon hem backend kontrolü — zaten mevcuttu, teyit edildi).
- NOT: Gönderen `onboarding@resend.dev` (Resend test/onboarding). Delivery byaliozer@gmail.com'a çalışıyor. Kurumsal görünüm ve tüm adreslere gönderim için ileride `dijitalroket.com` alan adı Resend'de doğrulanmalı.

## BUG FIX (faz-10) — Canlı site açılmıyordu: sonsuz yönlendirme döngüsü
- **Belirti**: www.dijitalroket.com tarayıcıda açılmıyordu (timeout). curl 200 görüyordu çünkü JS çalıştırmıyor.
- **Kök neden**: Cloudflare `www.dijitalroket.com` → 308 → `dijitalroket.com` (non-www) yönlendiriyor; `public/index.html` içindeki inline `<script>` ise non-www'yi tekrar `www`'ye zorluyordu → **sonsuz redirect döngüsü**.
- **Düzeltme**: index.html'deki host-forcing JS redirect bloğu kaldırıldı. Yönlendirme artık yalnızca Cloudflare edge'de (tek yön). testing_agent iteration_13 %100 (preview temiz, script yok, navigasyon OK, konsol hatasız).
- **AKSİYON**: Production'a yansıması için REDEPLOY gerekir. Ayrıca canonical tutarlılığı için (tüm SEO www kullanıyor ama Cloudflare non-www'ye yönlendiriyor) primary domain kararı: ya Cloudflare'i non-www→www'ye çevir, ya da canonical'ları non-www yap.

## Next Tasks (archive below)

## Admin Credentials
See `/app/memory/test_credentials.md`.
