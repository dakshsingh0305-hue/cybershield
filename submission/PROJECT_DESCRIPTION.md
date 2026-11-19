# CyberShield — Project Description

## Overview

CyberShield is a local-first cybersecurity awareness platform built with Next.js 16, React 19, and TypeScript. It combines a private URL inspector, fictional phishing simulations, and short lessons with quizzes in one responsive workspace. No account, backend, analytics, or remote storage is involved.

- **Live website:** https://cybershield-puce-one.vercel.app
- **GitHub repository:** https://github.com/dakshsingh0305-hue/cybershield

> CyberShield is an educational prototype. It is not antivirus, threat intelligence, or a security audit. Heuristic scores are indicators, not proof that a link is safe or malicious.

## Problem being addressed

People are expected to judge links and messages quickly, often under time pressure and on small screens. Security awareness training is frequently abstract, and many “check a link” services upload the submitted URL to a remote server. That teaches the wrong habit: the links people most need to inspect are often private, work-related, or sensitive.

There is a gap for a safe place to practise: something that lets someone examine a suspicious link without opening it, experience realistic phishing decisions with honest feedback, and build durable habits without creating an account.

## Target audience

- Students and first-time internet users learning to recognise phishing.
- Employees who want low-pressure practice outside mandatory corporate training.
- Educators and workshop facilitators looking for an offline-friendly teaching demo.
- Privacy-conscious users who do not want to submit links to a third-party service.

## Proposed solution

CyberShield provides a single workspace with four connected areas:

1. **URL scanner** — parses the URL text locally and explains the signals it finds.
2. **Phishing lab** — six fictional email, SMS, and direct-message scenarios with signal-by-signal feedback.
3. **Cyber academy** — five compact lessons, each ending in a three-question check.
4. **Dashboard** — an awareness score built from local practice, activity history, and recommendations.

Everything runs in the browser. Progress is saved in `localStorage` on the current device, and the interface clearly labels sample data so first-time visitors understand what is real and what is illustrative.

## Core features

- **Local-only URL analysis:** HTTP vs HTTPS, IP hosts, subdomain depth, domain extensions, `@` symbols, punycode, ports, redirect parameters, URL length, executable extensions, shorteners, and phishing-related keywords. Every triggered signal includes weight and a plain-English explanation.
- **Honest reporting:** risk bands, passed checks, and explicit language that heuristics are not a verdict. Submitted URLs are never fetched, resolved, visited, screenshotted, or transmitted.
- **Phishing lab:** flag suspicious details, choose a verdict, and receive a score with a review of correct flags, missed signals, and false alarms. Some realistic details are deliberately harmless.
- **Cyber academy:** objectives, practical callouts, key takeaways, and quizzes. A lesson counts as complete at 60% or higher; the best attempt is kept.
- **Awareness dashboard:** baseline plus academy, lab, and real URL practice points; seven-day activity; recent analyses; risk mix; recommendations.
- **Local persistence and reset:** saved progress survives refreshes on the same browser; “Reset local data” clears everything.
- **Responsive, accessible UI:** desktop sidebar and mobile drawer, keyboard-dismissable dialogs, reduced-motion support, and layouts verified from 390 px to 1440 px.

## Innovation and usefulness

The differentiator is restraint. CyberShield does not pretend to be a threat feed or a malware sandbox. It turns the scanner into a teaching instrument: the value is in the explanations, the transparent rule set, and the practice loop that connects a suspicious link to a phishing scenario and a short lesson. Because analysis is local, users can practise on realistic-looking URLs without handing them to a third party.

The phishing lab also avoids a common flaw in awareness training: every message is not a scam. Benign details and legitimate-looking scenarios are included, so precision matters alongside detection.

## Technology stack

- Next.js 16 (App Router, Turbopack builds)
- React 19 and TypeScript
- Tailwind CSS v4
- Framer Motion
- Recharts
- Lucide icons
- Fontsource variable fonts
- Browser `localStorage` for persistence
- Vercel for production hosting

## Privacy considerations

- The scanner never visits or fetches a submitted URL and makes no network requests. The analyzer is deterministic text parsing in `src/lib/analyzer.ts`.
- Phishing messages, links, and attachments are fictional and inert; nothing navigates or downloads.
- No account, server database, analytics, or remote logging is used.
- Progress and saved analyses remain in the browser on the current device. There is no cross-device sync.
- Sample dashboard data is clearly labelled and excluded from the awareness score.

## Expected impact

CyberShield aims to make link inspection a normal, repeatable habit rather than a one-off warning. A user who finishes the lessons and lab should be better at reading a real destination, pausing on manufactured urgency, and verifying through an independent channel. The project is designed to be usable in classrooms, workshops, and self-study without infrastructure or privacy trade-offs.
