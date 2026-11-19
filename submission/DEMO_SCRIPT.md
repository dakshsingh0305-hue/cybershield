# CyberShield — Demo Script

**Live site:** https://cybershield-puce-one.vercel.app

**Suggested length:** 3–4 minutes. Everything below is implemented and can be demonstrated without an account.

## 1. Introduction (20 seconds)

“CyberShield is a local-first cybersecurity awareness platform. It lets you inspect a suspicious link without opening it, practise phishing decisions in fictional scenarios, and build habits through short lessons. Nothing you type is uploaded — analysis happens in the browser.”

Mention the disclaimer: “This is an educational prototype, not antivirus or threat intelligence.”

## 2. The problem (20 seconds)

“Most ‘check this link’ tools send the URL to a remote service. The links people most need to inspect are often private or work-related. Awareness training also tends to be abstract: people read advice but never practise a decision.”

## 3. Landing page (20 seconds)

- Open the landing page and scroll through the feature sections.
- Point out the clearly labelled sample metrics and the entry points: **Open app** / **Launch dashboard**, **Try the URL scanner**, and **Enter the lab**.

## 4. URL scanner (60 seconds)

1. Open **URL scanner** from the sidebar.
2. Demo empty submit: the form explains that a URL is required and that nothing is fetched.
3. Enter an invalid value such as `not a url` and submit — the scanner tells the user that URLs cannot contain spaces.
4. Enter a suspicious example: `http://secure-login-verify-account.xyz/signin?token=abc123`.
5. Walk through the report:
   - High-risk band and score.
   - Signals such as unencrypted HTTP, the `.xyz` extension, and account/urgency keywords.
   - Each signal has a weight and a plain-English explanation.
   - Passed checks and the explicit “heuristic, not verdict” wording.
6. Open **What we look at** to show the rule categories.

**Scanner limitations to state clearly:** “The scanner reads URL text only. It does not visit the link, follow redirects, load the page, validate TLS, or contact any reputation service. A low score does not mean a site is safe, and a high score does not prove malice.”

## 5. Phishing lab (60 seconds)

1. Open **Phishing lab** and point out six scenarios across email, SMS, and direct message.
2. Start **CloudVault invoice** (intermediate).
3. Flag three signals: “within 24 hours”, the `Invoice_CV-88213.pdf.exe` attachment, and the sender address `billing@cloudvault-invoices.help`.
4. Choose **Looks like phishing** and submit.
5. Show the result: score, correct verdict, signal-by-signal review, missed signals, and the “if this were real” next action.
6. Note that links and attachments are inert and that some scenarios include harmless details on purpose, so precision matters.

## 6. Cyber academy (50 seconds)

1. Open **Cyber academy** and show the five lesson paths.
2. Open **Spot the hook: phishing fundamentals**.
3. Scroll to the **Recall check**, answer the three questions, and submit.
4. Show the score, per-question explanations, and the completion state. A 60% pass marks the lesson complete and the best attempt is kept.

## 7. Dashboard and persistence (30 seconds)

1. Open the **Security dashboard**.
2. Show the awareness score breakdown, lessons completed, lab scenarios analysed, real URLs analysed, best lab score, and recent analyses.
3. Point out that sample data is labelled and excluded from the score.
4. Refresh the page and show that progress remains — it is stored in this browser only.

## 8. Reset and closing (20 seconds)

- Mention **Reset local data** in the footer for a clean demo state.
- Close with: “CyberShield makes link inspection and phishing judgement something you practise locally, without sending private URLs anywhere. The goal is a habit, not a score.”

## Optional: mobile view

Resize to a phone width (390 px) and show the mobile drawer navigation and stacked layouts. The same routes and features work without horizontal scrolling.
