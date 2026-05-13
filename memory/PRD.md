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
