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

## Next Tasks
- Optional UX: large clickable cards on listings.
- Optional: e-mail notifications when forms arrive.

## Admin Credentials
See `/app/memory/test_credentials.md`.
