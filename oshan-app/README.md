# 🌊 Oshan Equity Insights

> **Catch the Big Fish – Discover Indian stocks that match your values and style through AI-native infotainment.**

---

# Table of Contents

1. [Vision &amp; Philosophy](#vision--philosophy)
2. [Product Overview](#product-overview)
3. [Brand &amp; UX Direction](#brand--ux-direction)
4. [Wireframes for Major Screens](#wireframes-for-major-screens)
5. [Tech Stack Overview](#tech-stack-overview)
6. [System Architecture](#system-architecture)
7. [Component-Level Design](#component-level-design)
8. [Data Layer &amp; File Management](#data-layer--file-management)
9. [Environment Variables](#environment-variables)
10. [Agile Epics, Stories &amp; Taskboard](#agile-epics-stories--taskboard)
11. [Security &amp; Compliance](#security--compliance)
12. [CI/CD &amp; Automation](#cicd--automation)
13. [Contributor Guide &amp; Next Steps](#contributor-guide--next-steps)
14. [Appendices: Data Dictionary, API Contracts, and More](#appendices)

---

# 1. Vision & Philosophy

Oshan is an **AI-powered infotainment app** for Indian equity market enthusiasts, designed for entertainment, education, and the thrill of discovery—NOT financial advice or brokerage. Every user journeys through curated stock stories, themes, and AI-driven insights that match their personal investing values and style.

**Guiding Principles:**

* True personalization: Every user profile shapes content delivery—values, sector preference, time horizon, and risk appetite.
* UX as delight: The oceanic theme, soft gradients, and micro-interactions create a premium, calming but engaging feel.
* Always-on AI: The virtual analyst is omnipresent, blending LLM-powered insights, reports, and context-aware chat.
* No portfolio or finance data: Privacy is core—no linking to brokers, no holdings, no rebalancing, no tax.
* Shareability & virality: Every report, chat or story is exportable for social or knowledge-sharing.
* Brand: “Catch the Big Fish”—the hunt for your next multibagger, with your values and beliefs front and center.

# 2. Product Overview

* **Target:** Indian HNIs, market enthusiasts, new-age equity explorers (esp. those who value discovery and infotainment over active trading)
* **Device:** Mobile-first (Expo/React Native); web in Next.js planned for phase 2
* **Revenue:** Premium subscription, no ads; core free tier with limited access, upsell for full features/reports
* **User Journey:**

  * Google Auth (Firebase) → Fun onboarding quiz → Personalized dashboard
  * Themes, curated stocks, persistent chat
  * Deep-dive stock pages, analyst chat, and downloadable reports
  * Share, save, explore—always context-aware, AI-driven
* **AI/NLP Focus:**

  * LangChain RAG over MongoDB+Qdrant, powered by OpenRouter LLMs
  * Precomputed AI signals, summaries, and narratives for stocks, news, themes
  * All chat/insight generation is LLM-native; deterministic rules for basic queries

# 3. Brand & UX Direction

* **Brand Mood:** Oceanic, flowing blue/teal, floating UI; minimal, elegant, modern, yet playful
* **Micro-interactions:**

  * Flip cards, carousels, hover/fade/floating effects, gentle pulsing CTAs
  * Persistent chat “bubble” on every page (docked/floating)
* **Storytelling:**

  * Each stock, theme, or news item = a “story” (not just data)
  * Theme badges (e.g., ESG, Multibagger, Tech, Green Energy)
  * Avatars and visual flourishes for major sections
* **Accessibility:**

  * WCAG AA for color contrast
  * Touch targets optimized for mobile; keyboard navigation for web
  * Font scaling, dark mode default

# 4. Wireframes for Major Screens

## a) Onboarding / Profile Quiz

```
+----------------------------------------------------+
|  🌊  Welcome to Oshan!                             |
|  Discover stocks that match your beliefs & style   |
|----------------------------------------------------|
|  [Google Login Button]                             |
|                                                    |
|  Question 1: What's your investing style?          |
|  ( ) 🎯 Value Hunter   ( ) 📈 Momentum             |
|  ( ) 🧘 Long-Term      ( ) 🥳 Speculator          |
|  [Next]                                            |
|                                                    |
+----------------------------------------------------+
```

* **Details:** Five-step quiz (investing style, sectors, values, risk tolerance, experience). Stores result in MongoDB, used for all personalization. Smooth transitions, Lottie animations, playful copywriting.

## b) Home Dashboard

```
+------------------ Oshan ---------------------------+
|  [Search]    [Your Avatar]   [Chat Bubble]         |
|----------------------------------------------------|
|     🎣 Catch the Big Fish (main CTA banner)        |
|  ------------------------------------------------  |
|   Your Themes    | Trending Now   | News Stories   |
|  [Carousel: e.g. “Ethical Growth”, “Green Energy”] |
|  ------------------------------------------------  |
|   Featured for You: [Horizontal stock cards]       |
|  ------------------------------------------------  |
|   [Flip cards: News/Stories, e.g., “Why IT’s Hot”] |
|  ------------------------------------------------  |
|   [Floating Chat: "Ask Oshan anything..."]         |
+----------------------------------------------------+
```

* **Details:**

  * “Big Fish” banner changes daily; deep links to theme picks.
  * Themes carousel is generated per user profile and recent market trends.
  * Trending stocks = daily AI-run selection; click-through to detail pages.
  * News/Stories = Flip-card UI, tap for summary/deep-dive.
  * Chat bubble persists at bottom right; launches full drawer.

## c) Stock Detail / Analyst Chat

```
+------------------ Stock Name: INFY ---------------+
|  [Back]     INFY  |  [Add to Watchlist]           |
|----------------------------------------------------|
|   Price, PE, Sector, Ratings                      |
|----------------------------------------------------|
|   Deep Dive Metrics                               |
|   - AI summary                                    |
|   - Charts                                        |
|----------------------------------------------------|
|   [Persistent Chat: Chat with Virtual Analyst]     |
|   User: "Will INFY benefit from GenAI?"           |
|   Analyst: "Based on the last 2 quarters..."       |
+----------------------------------------------------+
|   [Download/Share Report]                         |
+----------------------------------------------------+
```

* **Details:**

  * Tabs: Summary, Financials, Analyst Chat, News, Report
  * Charts: Interactive, swipe/zoom, 1Y/3Y/5Y toggle
  * All chat is context-aware (stock, sector, news, user quiz profile)
  * “Download” = Generate full markdown/PDF report, share sheet

## d) Theme Page / Stories

```
+----------------- Theme: Green Energy -------------+
|  [Back]         [Theme badge: ESG/Green]          |
|----------------------------------------------------|
|   AI-generated Theme Overview                     |
|----------------------------------------------------|
|   Related Stocks: [Horizontal cards]              |
|----------------------------------------------------|
|   Flip Cards: Stories/News                        |
|----------------------------------------------------|
|   [Chat: "What makes Green Energy hot?"]           |
+----------------------------------------------------+
```

* **Details:**

  * Themes generated from curated taxonomy + AI clustering
  * News/Stories = RAG summarization, AI-generated “narrative”
  * Theme performance charts, badge explanations

## e) Report Viewer/Generator

```
+------------------ Research Report ----------------+
|  [Back]          [Download]  [Share]              |
|----------------------------------------------------|
|  Title: INFY Deep Dive                            |
|  - Executive AI Summary                           |
|  - Financials Table (last 8 quarters)             |
|  - Promoter/Shareholding Trends                   |
|  - Key News & Narratives                          |
|  - AI Recommendations (not investment advice)     |
+----------------------------------------------------+
```

* **Details:**

  * Reports are LLM-composed, template-driven
  * Markdown > PDF pipeline; share/download via OS sheet
  * “Audit trail” of sources: links to news, filings, data

# 5. Tech Stack Overview

* **Frontend:** Expo (React Native, TypeScript)

  * EAS OTA updates, deep linking
  * Animated components: Lottie, Framer Motion for web
* **Web:** Next.js (SSR), share code with Expo
* **Auth:** Firebase (Google OAuth, phone/email as backup)
* **Backend:** Node.js (Express) or FastAPI

  * RESTful endpoints, OpenAPI doc
  * Secure JWT auth (token from Firebase)
* **Database:** MongoDB Atlas (fully managed, daily JSON ingests)
* **Vector DB:** Qdrant (RAG pipeline, semantic search)
* **LLM:** OpenRouter (API keys in env, multi-LLM fallback)
* **RAG:** LangChain (Node/Python), prompt orchestration
* **Analytics:** Posthog/Mixpanel for product/UX, Sentry for error logging
* **CI/CD:** GitHub Actions (lint, type-check, test, deploy), EAS for Expo
* **Monitoring:** Health checks, alerting on all critical endpoints

# 6. System Architecture

```
[Expo App]  <->  [API Server (Node.js/FastAPI)]
     |                             |
     v                             v
[Firebase Auth]              [MongoDB Atlas]
     |                             |
     v                             v
[Chat UI / Virtual Analyst]  [Qdrant Vector Search]
     |                             |
     v                             v
   [LangChain RAG Orchestration] -- [OpenRouter LLM]
```

* **API Gateway** for all mobile/web requests, centralizing auth, rate-limiting, and logging.
* **Data Refresh:** Nightly cron (Dockerized) parses daily JSON, updates MongoDB, runs embedding jobs into Qdrant.
* **Chat/RAG:** Each chat request first hits a Qdrant retrieval for context (stock, news, themes, user), then LLM completion.
* **Raw Data:** All uploaded/parsed JSONs stored in raw form, mapped to processed records (for audit, backfill, future features).

# 7. Component-Level Design

## Frontend (Expo/React Native)

* **AppProvider:** Global state (auth, theme, profile, chat session, network)
* **OnboardingQuizScreen:** Multi-step, animated, all states stored until submit
* **HomeScreen:**

  * Carousels (dynamic, swipeable)
  * Flip cards, news, stories (tap-to-expand)
  * Persistent chat drawer (swipe/dock)
* **StockDetailScreen:**

  * Summary tab: AI overview, price chart, key ratios, badges
  * Financials tab: Interactive table/chart, YoY/QoQ toggles
  * Chat tab: Analyst, historical chat context, sources
  * Report tab: Generate/share full report
* **ThemeScreen:**

  * Horizontal lists, theme badges, stories/news
  * Performance vs sector/market
  * Chat input (theme-aware)
* **ChatDrawer:** Page-aware, always accessible, floating dock/overlay
* **ReportScreen:** Render rich markdown, preview PDF, share/download
* **Settings/Account:** Profile, privacy, theme, subscription management
* **Notifications:** Push/OS, local scheduled, opt-in/opt-out
* **Offline Mode:** Data caching, last-sync state

## Backend (Node.js/FastAPI)

* **/auth:**

  * POST /auth/google (verifies token, issues JWT)
  * Middleware for token verification on all routes
* **/profile:**

  * GET/POST profile info (onboarding quiz, preferences, saved themes)
  * PATCH to update preferences, notification settings
* **/stocks:**

  * GET /stocks (search, filter, pagination, sector/theme filter)
  * GET /stocks/\:id (detail, with latest news, ratios, AI summary)
* **/themes:**

  * GET /themes (list, by profile)
  * GET /themes/\:id (detail, related stocks/news)
* **/news:**

  * GET /news (by theme, stock, recency, popularity)
* **/rag\_query:**

  * POST: { prompt, context (stock/theme/user) }
  * Retrieves context from Qdrant, runs through OpenRouter LLM, streams reply
* **/report:**

  * POST: { stock\_id/theme\_id, user\_id }
  * Triggers AI deep-dive, composes markdown, returns download/share link
* **/data\_ingest:**

  * Nightly cron job; parses daily JSON; backs up raw; updates Mongo/Qdrant
* **/admin:**

  * Auth-only: Data upload, backfill, analytics, error logs

# 8. Data Layer & File Management

## MongoDB Collections

* **user\_profiles:**

  * \_id, user\_id, onboarding answers, inferred preferences, saved themes
* **stocks:**

  * \_id, ticker, name, sector, financials (multi-year), ratios, news refs, badges
* **themes:**

  * \_id, name, tags, stock list, performance, AI summary, news/story refs
* **ai\_signals:**

  * \_id, stock\_id/theme\_id, generated summary, ratings, sentiment, updated\_at
* **news\_stories:**

  * \_id, headline, body, date, related stocks/themes, embedding vector
* **chat\_history:**

  * \_id, user\_id, session\_id, prompt/response pairs, context
* **raw\_json\_backup:**

  * \_id, upload\_date, source, raw file (GridFS/Blob), processed\_at

## Qdrant Vector Index

* Stocks: stock\_id, summary, tags, sector, embeddings
* Themes: theme\_id, summary, related stocks, embeddings
* News: news\_id, text, embedding, date, relevance
* Precompute all embeddings for new/updated records; store embedding version

## File/Data Ingestion Process

1. **Daily JSON Upload:** Admin/cron script uploads new JSON to backend.
2. **Parse & Transform:** Extracts stocks, themes, news, financials, mappings.
3. **Store Processed:** Upserts into MongoDB collections; maps references.
4. **Store Raw:** Backs up entire JSON (compressed) in Mongo GridFS (raw\_json\_backup).
5. **Embedding:** All new/updated text fields run through embedding model, stored in Qdrant.
6. **Audit Trail:** All changes timestamped, with reference to raw file and parser version.
7. **Schema Evolution:** All collections versioned for migration/future backfill.

# 9. Environment Variables

* `MONGODB_URI` — MongoDB Atlas URI, SRV connection string
* `OPENROUTER_API_KEY` — OpenRouter API key for LLM queries
* `QDRANT_URL`, `QDRANT_API_KEY` — Qdrant Vector DB API
* `FIREBASE_CONFIG` — Firebase config JSON for Expo
* `APP_ENV` — 'dev', 'staging', 'prod'
* `FRONTEND_URL`, `BACKEND_URL` — For CORS, deep linking
* `POSTHOG_API_KEY`, `SENTRY_DSN` — Product/error analytics
* `.env.sample` in repo for all needed vars (never commit real keys)

# 10. Agile Epics, Stories & Taskboard

## EPIC 1: User Onboarding & Profile

* [ ] Implement Google OAuth with Firebase (Expo)
* [ ] Five-step onboarding quiz, animated UI
* [x] Store quiz results in MongoDB
* [ ] Personalization: themes/stocks based on profile

## EPIC 2: Persistent Chat & Analyst Assistant

* [ ] Always-on chat, context-aware per page
* [ ] Integrate chat UI with backend /rag\_query endpoint
* [ ] Qdrant retrieval and LLM streaming output
* [ ] Handle markdown, links, rich cards in chat output

## EPIC 3: Dynamic Theming & Curation

* [ ] Generate themes from user profile + market trends
* [ ] Carousels and badges; responsive design

## EPIC 4: Infotainment Stories & Flip Cards

* [ ] Flip card components for news/story
* [ ] AI summarization for each story (precompute at ingest)

## EPIC 5: Stock Detail & Research Report

* [ ] Stock detail page: all tabs, chart interactions
* [ ] Virtual analyst chat, audit trail of sources
* [ ] Launch full report (Markdown/PDF generation, share sheet)

## EPIC 6: Backend Data Management & Updates

* [ ] Nightly cron for new data ingest
* [ ] JSON parsing, schema mapping, upsert logic
* [ ] Precompute embeddings for new stocks/news/themes

## EPIC 7: Security, Analytics & CI/CD

* [ ] Sentry for error monitoring
* [ ] Posthog/Mixpanel for user events
* [ ] GitHub Actions for build/test/deploy
* [ ] API rate limiting, abuse prevention

# 11. Security & Compliance

* **Data privacy:** No portfolio, tax, or financial account data stored/handled
* **Auth:** Google/Firebase token; JWT for backend API; all endpoints check for valid token
* **Env vars:** All keys stored in env files, never committed
* **HTTPS:** Forced on all endpoints, HSTS headers
* **Rate limiting:** Per-user and per-IP limits on API/LLM endpoints
* **Data retention:** Raw JSON backups stored for 90 days by default, rotate/compress
* **User disclosure:** App splash, About, and T\&Cs reinforce infotainment purpose
* \*\*Audit
