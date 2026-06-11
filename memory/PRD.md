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
