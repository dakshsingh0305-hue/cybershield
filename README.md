# CyberShield

A local-first cybersecurity awareness platform built as a hackathon-ready MVP. CyberShield helps people inspect suspicious links without opening them, practise phishing detection in safe simulations, and build lasting security habits through short lessons and quizzes.

> **Educational prototype.** CyberShield is not antivirus, threat intelligence, or a security audit. Heuristic results can be wrong in both directions. Never treat a score as proof that a site or message is safe or malicious.

## What’s inside

- **Landing page** — product story, feature overview, clearly labelled demo metrics, FAQ, and entry points into the workspace.
- **Security dashboard** — awareness score breakdown, seven-day practice chart, recent analyses, recommendations, scan risk mix, and academy progress.
- **URL scanner** — fully local URL parsing and rule-based analysis with Low / Medium / High classification, per-signal explanations, passed checks, scan history, search, risk filters, and copyable reports.
- **Phishing lab** — six fictional email, SMS, and direct-message scenarios. Flag suspicious details, choose a verdict, then read a signal-by-signal report with scoring.
- **Cyber academy** — five complete lessons with objectives, practical callouts, key takeaways, sticky table of contents, and three-question knowledge checks.
- **Responsive workspace** — desktop sidebar and mobile drawer, keyboard-dismissable dialogs, reduced-motion support, and layouts verified from 390 px through desktop widths.

## Privacy by design

- Submitted URLs are **never fetched, resolved, visited, screenshotted, or sent to a third party**. The scanner only parses the text you paste.
- Phishing emails, links, and attachments are fictional and inert. Nothing in the lab navigates or downloads.
- Progress, quiz scores, saved analyses, and settings live in `localStorage` under `cybershield.progress.v1`.
- No account, server database, analytics, or remote persistence is used.
- First-time visitors receive **clearly labelled sample data** so the dashboard can be explored. Samples are excluded from the awareness score and can be removed from the dashboard or scanner.
- “Reset local data” clears everything, including sample history, and leaves a clean 10-point starting state.

## Awareness score

The score is an educational progress metric, not a device audit:

| Component | Points |
| --- | --- |
| Starting baseline | 10 |
| Academy lessons | up to 40 |
| Phishing lab coverage and accuracy | up to 35 |
| Real URL analyses (max 3) | up to 15 |

A lesson is marked complete at **60% or higher** on its quiz; the best attempt is kept. Demo activity never contributes.

## Tech stack

- [Next.js 16](https://nextjs.org/) App Router with React 19 and TypeScript
- Tailwind CSS v4
- Framer Motion
- Recharts
- Lucide icons
- Fontsource variable fonts (Inter, Space Grotesk, JetBrains Mono)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production checks

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing landing page |
| `/dashboard` | Awareness score and activity overview |
| `/scanner` | Local URL scanner and analysis history |
| `/phishing` | Phishing lab catalogue |
| `/phishing/[id]` | Individual fictional simulation |
| `/academy` | Lesson library and progress |
| `/academy/[slug]` | Lesson reader and quiz |

## Project structure

```text
src/
  app/                 App Router pages, layout, and 404
  components/
    academy/           Lesson library and quiz reader
    dashboard/         Score, activity, scan mix, recommendations
    marketing/         Landing page sections
    phishing/          Lab catalogue and simulator
    scanner/           Scanner form, reports, and history
    ui/                Shared primitives
  lib/
    analyzer.ts        Local URL heuristics (no network access)
    progress-store.tsx Local persistence and demo seeding
    score.ts           Awareness score calculation
    data/              Lesson and phishing scenario content
```

## Limitations

- Heuristics inspect URL text only. They cannot verify page content, TLS certificates, ownership, malware, or real-world reputation.
- Phishing scenarios are teaching material, not reproductions of real campaigns.
- Browser storage is per-device and can be cleared by the user or the browser.
- The project is intended for education and demonstration, not production security decisions.
