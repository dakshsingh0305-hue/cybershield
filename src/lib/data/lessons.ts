import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "spot-the-hook",
    title: "Spot the hook: phishing fundamentals",
    description:
      "Learn how phishing messages are engineered, from spoofed senders to manufactured urgency, and build a repeatable habit for checking any link before you click.",
    category: "Phishing",
    duration: 8,
    level: "Beginner",
    objectives: [
      "Recognise the four core ingredients of a phishing message",
      "Read a URL's true destination instead of its display text",
      "Know what to do before and after you click a bad link",
    ],
    sections: [
      {
        heading: "Phishing is a trust trick, not a technology trick",
        paragraphs: [
          "Phishing is a social engineering attack that impersonates someone or something you trust in order to make you take an action: open an attachment, share a password, approve a payment or sign in on a fake page.",
          "Modern phishing rarely looks obviously fake. Attackers copy a real brand's design, use correct logos and write in the same tone as the companies they imitate. The tell is usually not the visual finish — it is a mismatch between the story and the details.",
        ],
        callout: {
          type: "info",
          title: "Phishing works at scale",
          body: "Most campaigns are designed to fool anyone who is distracted for three seconds. Being cautious by habit beats trying to identify every new scam manually.",
        },
      },
      {
        heading: "The anatomy of a phishing message",
        paragraphs: [
          "Look for these four ingredients. You will not find all of them every time, but a message that combines several deserves a slow second look.",
        ],
        bullets: [
          "A borrowed identity: a company, a bank, a colleague or a delivery service. Check the actual address, not only the display name.",
          "Manufactured urgency: wording like “within 24 hours”, “your account will be locked” or “final notice”. Urgency is designed to bypass deliberate thinking.",
          "A directional request: click this link, scan this QR code, open this attachment, share this one-time code or pay using gift cards.",
          "A mismatch: a reply-to domain that differs from the sender, a lookalike website, an unexpected attachment, or a request that breaks normal process.",
        ],
      },
      {
        heading: "Read the link, not the label",
        paragraphs: [
          "Link text can say anything. The destination is the address at the bottom of your browser or behind the button. On a phone, press and hold a link to preview its destination instead of opening it.",
          "Read the address from right to left until the first single slash. That chunk is the registrable domain — the part that decides where you will actually land. In `https://nexa-bank.com.account-verify.xyz/login`, the real site is `account-verify.xyz`, not `nexa-bank.com`.",
        ],
        callout: {
          type: "tip",
          title: "Navigate, don't click",
          body: "For anything involving money, passwords or identity, open a new tab and type the organisation's known address yourself. If the message is real, the action will be waiting for you there.",
        },
      },
      {
        heading: "If you clicked: act, don't panic",
        paragraphs: [
          "Clicking a link is not the end of the world. What matters is what you do in the next few minutes. Do not enter credentials on a page that opened unexpectedly.",
          "If you did enter a password, change it immediately on the real site and anywhere you reused it. Turn on two-factor authentication, sign out other sessions if possible, and tell the affected organisation's support team. For a payment or bank detail, call the number on your card or statement — not a number in the message.",
        ],
        bullets: [
          "Disconnect the page and close the tab; do not download or open attachments.",
          "Change exposed passwords from a known-good device.",
          "Check account sign-in history and recent payment activity.",
          "Report the message using your mail provider's report option, then delete it.",
        ],
      },
    ],
    takeaways: [
      "Phishing attacks trust in people, not software vulnerabilities.",
      "Urgency plus a link or attachment request is a reason to stop and verify.",
      "The registrable domain before the first slash is the real destination.",
      "If you clicked, contain the damage quickly instead of hiding it.",
    ],
    quiz: [
      {
        question:
          "An email says your account will be closed in 12 hours and asks you to “sign in here”. What is the strongest next step?",
        options: [
          "Click the link quickly so you do not lose access",
          "Reply to the email asking whether it is real",
          "Open the company's site yourself and check your account there",
          "Forward it to a friend to see what they think",
        ],
        answer: 2,
        explanation:
          "Opening the service independently avoids the supplied link entirely. Urgency is a manipulation technique, and replying only confirms that your address is active.",
      },
      {
        question: "Which part of `https://secure-paypal.com.verify-billing.xyz/login` is the real destination?",
        options: ["secure-paypal.com", "paypal.com", "verify-billing.xyz", "login"],
        answer: 2,
        explanation:
          "Read from right to left: the registrable domain is `verify-billing.xyz`. “secure-paypal.com” is only a subdomain placed there to look reassuring.",
      },
      {
        question: "You entered your password on a suspicious page. What should you do first?",
        options: [
          "Delete the browser history and hope for the best",
          "Change the password on the legitimate site from a trusted device",
          "Wait to see whether anything happens",
          "Send your password to the company so they can block it",
        ],
        answer: 1,
        explanation:
          "Containment comes first: change the password on the real service, then enable two-factor authentication and review recent account activity. Never send a password to anyone.",
      },
    ],
  },
  {
    slug: "passwords-that-hold",
    title: "Passwords that hold the line",
    description:
      "Move beyond password-strength meters. Learn how credential stuffing works, why unique passwords matter more than complex ones, and how to set up passkeys or two-factor authentication without friction.",
    category: "Passwords",
    duration: 7,
    level: "Beginner",
    objectives: [
      "Understand why password reuse is the real risk",
      "Use a password manager to create and store unique credentials",
      "Choose a phishing-resistant second factor",
    ],
    sections: [
      {
        heading: "The breach you don't see",
        paragraphs: [
          "When a company is breached, attackers often get away with large lists of email addresses and passwords — sometimes hashed, sometimes in plain text. Those lists are traded and tested against other services in a process called credential stuffing.",
          "This is why a “strong” password reused across five sites is not strong. It only needs to leak once. The goal is not a password nobody could guess; it is a different password for every account, plus a second layer that still works if one is stolen.",
        ],
        callout: {
          type: "warning",
          title: "Longer beats complicated",
          body: "A four-word passphrase like “copper-lantern-orbit-moss” is easier to remember and harder to crack than a short string of random symbols. Length creates more possibilities; reuse creates the real shortcut.",
        },
      },
      {
        heading: "Let a manager do the remembering",
        paragraphs: [
          "A password manager is an encrypted vault that generates unique passwords and fills them in for you. You only need to remember one strong master password or passphrase — and the vault does the rest.",
          "Reputable browsers now include password managers, and standalone managers add features such as secure sharing, breach alerts and passkey storage. Choose a tool you trust, protect it with a strong master passphrase and turn on its second factor. The point is to stop reusing credentials, not to collect every password in your head.",
        ],
        bullets: [
          "Generate a unique 16+ character password for every important account.",
          "Keep the recovery email and phone number current — losing access is the other failure mode.",
          "Export an encrypted backup of your vault, and store it offline.",
          "Never store your master password in a note, spreadsheet or chat message.",
        ],
      },
      {
        heading: "Two factors, and why SMS is not the finish line",
        paragraphs: [
          "Two-factor authentication (2FA) adds a second proof of identity. It is the single highest-impact account upgrade you can make, but not all factors are equal.",
          "SMS codes can be intercepted through SIM-swapping, and codes can be phished by a fake login page in real time. Authenticator apps are better. Hardware security keys and passkeys are stronger still because they are bound to the real website's origin and cannot be entered on a lookalike site.",
        ],
        bullets: [
          "Use passkeys or a hardware key where supported, especially for email and banking.",
          "Otherwise use an authenticator app with push or time-based codes.",
          "Keep recovery codes offline, and remove old phone numbers.",
          "Never read a one-time code to anyone who calls or messages you.",
        ],
      },
      {
        heading: "After a breach, sequence matters",
        paragraphs: [
          "If a service tells you it was breached, assume the affected passwords are exposed. Change that password first, then change it anywhere it was reused. Do not reuse the replacement password on other sites.",
          "Check whether the service offers forced sign-out or active-session management, and review recent activity. If you used the same password for email, change the email password first — email is the reset key to almost everything else.",
        ],
        callout: {
          type: "tip",
          title: "A 15-minute account reset",
          body: "Pick your three most valuable accounts: email, bank and primary social login. Give each a unique password, add 2FA, and store recovery codes offline. That small set covers most of your digital risk.",
        },
      },
    ],
    takeaways: [
      "Reuse is the biggest password risk; uniqueness matters more than raw complexity.",
      "A password manager makes unique passwords practical.",
      "Prefer passkeys or hardware keys, then authenticator apps; SMS is better than nothing.",
      "Never share one-time codes, even with someone claiming to be support.",
    ],
    quiz: [
      {
        question: "Why is reusing one strong password risky?",
        options: [
          "Websites will slow down",
          "A breach at one site can unlock every other site using it",
          "Strong passwords cannot be reused for technical reasons",
          "Password managers refuse to store them",
        ],
        answer: 1,
        explanation:
          "Credential stuffing turns one stolen database into access to many accounts. Unique passwords contain the damage to a single service.",
      },
      {
        question: "Which second factor is generally the most phishing-resistant?",
        options: ["An SMS code", "A passkey or hardware security key", "A security question", "A four-digit PIN"],
        answer: 1,
        explanation:
          "Passkeys and hardware keys are bound to the real site's origin, so they do not work on a lookalike phishing domain. SMS codes can be phished or intercepted.",
      },
      {
        question: "A service you use reports a breach. What should you do first?",
        options: [
          "Close your account and ignore it",
          "Change that password and any place you reused it",
          "Post the email publicly",
          "Wait for the company to reset it for you",
        ],
        answer: 1,
        explanation:
          "Change the exposed password first, then every account that reused it. Prioritise email if it shared the password, since it can reset everything else.",
      },
    ],
  },
  {
    slug: "trust-but-verify",
    title: "Trust, but verify: social engineering",
    description:
      "Understand pretexting, authority bias and business email compromise — then practise a simple out-of-band verification habit that defeats most impersonation attempts.",
    category: "Social Engineering",
    duration: 6,
    level: "Intermediate",
    objectives: [
      "Identify the psychological levers attackers use",
      "Separate identity claims from verified identity",
      "Verify unusual requests through an independent channel",
    ],
    sections: [
      {
        heading: "The attack does not need malware",
        paragraphs: [
          "Social engineering is any attempt to manipulate a person into revealing information or taking an action. It targets human tendencies — helpfulness, respect for authority, fear of consequences, curiosity and the desire to avoid embarrassment.",
          "Pretexting is the story used to justify the request. A convincing pretext explains why the request is unusual: the CFO is in a meeting, the system migration needs a quick favour, the refund is waiting but the form failed. The story is the attack surface.",
        ],
      },
      {
        heading: "The levers to notice",
        paragraphs: ["You do not need to memorise scams. Notice when a conversation is using one of these levers, especially when combined with a request for money, credentials or access."],
        bullets: [
          "Authority: “I'm from IT”, “the CEO asked for this directly”. Authority discourages questions.",
          "Urgency: a deadline that makes verification feel like a delay. Real emergencies still allow a callback.",
          "Secrecy: “don't tell anyone yet” isolates you from the colleague who would spot the problem.",
          "Flattery or familiarity: shared jargon and personal details can create false rapport.",
          "Small initial asks: a harmless question or file builds momentum before the real request.",
        ],
        callout: {
          type: "info",
          title: "AI makes the voice sound right",
          body: "Cloned voices and polished messages are now easy to produce. A familiar voice or a perfect writing style is no longer proof of identity. Verify the request, not the accent.",
        },
      },
      {
        heading: "Out-of-band verification",
        paragraphs: [
          "The antidote is a simple rule: verify through a channel you chose, not one the requester supplied. Call the person back on a number you already have. Open the customer portal yourself. Ask for a signed process instead of a direct message.",
          "For money requests, require two people to approve new payees and confirm changed bank details by phone. A short delay is a feature, not an insult.",
        ],
        bullets: [
          "Hang up and call the organisation's published number; do not dial the number in the message.",
          "For a colleague, use your internal directory or a known mobile number.",
          "When you cannot verify, escalate to a manager or security team rather than guessing.",
          "Never let a caller remotely install software or read you a one-time code.",
        ],
      },
      {
        heading: "When you are the target",
        paragraphs: [
          "Attackers rely on embarrassment to keep victims quiet. Acknowledge the attempt, stop engaging, and report it. In a workplace, fast reporting lets the security team warn others and block the sender.",
          "If you shared credentials, change them immediately. If you approved a payment, contact your bank's fraud line now — early reports can sometimes recall transactions. If you installed a remote-access tool, disconnect from the internet and get help from a trusted technician.",
        ],
        callout: {
          type: "tip",
          title: "Say this out loud",
          body: "“I need to verify this independently and call you back.” It is a complete sentence. It requires no technical knowledge and defeats most impersonation scripts.",
        },
      },
    ],
    takeaways: [
      "Social engineering exploits helpfulness, authority and urgency.",
      "A convincing style or voice is not proof of identity.",
      "Verify using an independent channel that you choose.",
      "Report quickly; embarrassment protects attackers, not you.",
    ],
    quiz: [
      {
        question: "You receive an urgent voicemail from “IT support” asking you to install a remote-access tool. What should you do?",
        options: [
          "Install it while they are on the line",
          "Call the internal IT number from your company directory to verify",
          "Reply to the voicemail with your password",
          "Ignore every future IT request",
        ],
        answer: 1,
        explanation:
          "Verify out-of-band using a number you already trust. Urgency plus remote access is a classic pretext for account takeover.",
      },
      {
        question: "Which request should raise the most concern?",
        options: [
          "A colleague asks a routine question in the team channel",
          "A “CEO” asks you to buy gift cards and keep it secret",
          "A customer sends a support email through the public form",
          "A calendar invite arrives from a known colleague",
        ],
        answer: 1,
        explanation:
          "Secrecy plus an unusual payment method is a strong business email compromise pattern. Follow your finance process and verify by phone.",
      },
      {
        question: "What makes out-of-band verification effective?",
        options: [
          "It is faster than replying",
          "It uses a channel the attacker has not supplied or controlled",
          "It proves the message was written by a human",
          "It only works for phone calls",
        ],
        answer: 1,
        explanation:
          "Starting a new channel prevents the attacker from controlling both sides of the conversation. Verify with a number or portal you already trust.",
      },
    ],
  },
  {
    slug: "public-wifi-playbook",
    title: "The public Wi-Fi playbook",
    description:
      "Airport, café and hotel networks are convenient but not private. Learn how evil twins and captive portals work, what HTTPS does and does not protect, and how to travel with safer defaults.",
    category: "Public Wi-Fi",
    duration: 6,
    level: "Beginner",
    objectives: [
      "Tell the difference between a legitimate hotspot and an evil twin",
      "Understand HTTPS limits on shared networks",
      "Set device defaults that reduce exposure while travelling",
    ],
    sections: [
      {
        heading: "What is actually risky",
        paragraphs: [
          "On any shared network, other devices can see some of your traffic metadata — which sites you connect to and when — even if HTTPS encrypts the content. The bigger risks are fake hotspots that impersonate a venue and capture your login, and malicious captive portals that ask for unnecessary permissions.",
          "A network being open (no password) is not automatically malicious. Most cafés and airports run open networks with a portal page. The question is whether you connected to the real one and whether you are doing something sensitive.",
        ],
      },
      {
        heading: "Spot an evil twin",
        paragraphs: [
          "An evil twin is a hotspot that copies a venue's name to get you to connect. The attacker may serve a fake login page and capture your credentials, or use the network to monitor unencrypted traffic.",
          "Confirm the exact network name with staff rather than choosing the strongest lookalike. Be suspicious of a network that appears only when you are near a specific person, or a portal that asks for your email password to “activate Wi-Fi”.",
        ],
        bullets: [
          "Confirm the SSID with venue staff, including spelling and capitalisation.",
          "Disable auto-join for public networks, and forget networks you no longer use.",
          "Turn off file sharing and AirDrop-style discovery in public places.",
          "Never install a “certificate” or configuration profile just to get Wi-Fi.",
        ],
        callout: {
          type: "warning",
          title: "The portal should not need your bank login",
          body: "A captive portal may ask for a room number, email or voucher code. It should never ask for your banking password, a one-time code or permission to install software.",
        },
      },
      {
        heading: "HTTPS is necessary but not magic",
        paragraphs: [
          "HTTPS encrypts the content of a page and verifies that you are talking to the certificate holder. That stops someone on the same Wi-Fi from reading your password in transit. It does not protect you if the site itself is a phishing clone, or if you have been tricked into installing a malicious profile.",
          "Watch for certificate warnings instead of clicking through them. A warning on a site you visit regularly can mean interception, a misconfigured network or a compromised connection. Do not proceed until you understand which.",
        ],
        callout: {
          type: "tip",
          title: "Travel default: tunnel",
          body: "A reputable VPN hides your traffic from the local network. If you use one, choose a provider you trust and keep it updated. If you don't, avoid sensitive logins on unknown networks and use mobile data for banking.",
        },
      },
      {
        heading: "A safer travel setup",
        paragraphs: [
          "You can lower your exposure without becoming a network engineer. Use your phone's mobile hotspot for banking and email when you are unsure. Keep the device's operating system and browser current, and use a password manager so you are not typing credentials into unfamiliar pages.",
          "When you finish using a public network, forget it. The less your device automatically reconnects to, the smaller the chance of silently joining an impostor later.",
        ],
        bullets: [
          "Prefer mobile data for banking, work email and anything with payment details.",
          "Check that the site uses HTTPS before entering credentials, and verify the domain.",
          "Use a VPN on open networks if you already trust one; skip free pop-up VPN apps.",
          "Log out of sensitive sites afterwards, especially on borrowed devices.",
        ],
      },
    ],
    takeaways: [
      "Fake hotspots and phishing portals are the main public Wi-Fi risks.",
      "HTTPS protects content in transit but cannot make a fake site legitimate.",
      "Confirm network names and never install profiles to get online.",
      "Use mobile data for truly sensitive tasks while travelling.",
    ],
    quiz: [
      {
        question: "At a café, two networks look similar: `CafeGuest` and `CafeGuest_Free`. What is the safest action?",
        options: [
          "Join the one with the stronger signal",
          "Join `CafeGuest_Free` because free is listed in the name",
          "Ask staff for the exact network name, or use mobile data",
          "Join both to compare speeds",
        ],
        answer: 2,
        explanation:
          "A lookalike name is a common evil-twin trick. Verify the SSID with staff, and use mobile data for anything sensitive.",
      },
      {
        question: "What does HTTPS protect you from on public Wi-Fi?",
        options: [
          "Phishing websites pretending to be your bank",
          "Someone reading the content of your traffic in transit",
          "Malware already installed on your laptop",
          "Every risk on a shared network",
        ],
        answer: 1,
        explanation:
          "HTTPS encrypts content between your browser and the site. It cannot verify the site's intentions or clean an infected device.",
      },
      {
        question: "A hotel Wi-Fi portal asks you to install a new certificate before you can browse. What should you do?",
        options: [
          "Install it — portals need certificates",
          "Install it, then delete it after checkout",
          "Do not install it; use mobile data or ask the front desk",
          "Disable your browser security so the page loads",
        ],
        answer: 2,
        explanation:
          "Legitimate captive portals should not require a certificate profile for basic access. A certificate can intercept encrypted traffic; decline it.",
      },
    ],
  },
  {
    slug: "privacy-footprint",
    title: "Shrink your data footprint",
    description:
      "Privacy is not about having nothing to hide — it is about reducing the information available to people who can misuse it. Audit permissions, apps and public profiles in one focused pass.",
    category: "Privacy",
    duration: 7,
    level: "Beginner",
    objectives: [
      "Audit app permissions and account access",
      "Reduce oversharing in profiles and posts",
      "Use practical privacy defaults without disappearing online",
    ],
    sections: [
      {
        heading: "Think in data, not secrecy",
        paragraphs: [
          "Your data footprint is the collection of details about you that exist online: contact details, location history, purchase patterns, photos, connections and the inferences that companies draw from them. Privacy work is simply deciding which of those details need to exist, where, and for how long.",
          "This is not about hiding wrongdoing. It is about limiting how easily a stranger can impersonate you, track your location, guess your passwords or target you with a scam.",
        ],
      },
      {
        heading: "Audit access to your accounts",
        paragraphs: [
          "Start with the accounts that can unlock everything else: your primary email, your phone's cloud account and your financial services. Review connected apps and active sessions. Remove anything you do not recognise or no longer use.",
          "Old apps often keep read access to your email or drive long after you stopped opening them. That access is a supply chain risk if the app's vendor is breached.",
        ],
        bullets: [
          "Review “Apps with access” or “Connected apps” in your main accounts and revoke unused ones.",
          "Sign out of devices you no longer use; check sign-in history for unfamiliar locations.",
          "Remove old email addresses and phone numbers from recovery settings.",
          "Turn on login alerts for email and banking.",
        ],
        callout: {
          type: "tip",
          title: "The 20-minute privacy pass",
          body: "Revoke three old app connections, sign out of old devices, and set your main social profile to friends-only. Three small changes can reduce years of accumulated exposure.",
        },
      },
      {
        heading: "Share less by default",
        paragraphs: [
          "Public posts reveal more than the message itself. Photos can expose your street, workplace badge or school run; birthday posts hand over a common security-question answer; travel updates advertise an empty home.",
          "You do not have to quit social media. Change the default audience to friends, review tags before they appear, and avoid posting real-time location while you are away. For children's photos and sensitive family details, think beyond your follower list — friends can screenshot.",
        ],
        bullets: [
          "Set new accounts to private by default, then opt into visibility where useful.",
          "Turn off precise location in photo metadata or strip it before posting.",
          "Do not use easily researchable facts as security-question answers.",
          "Review profile fields: birth date, phone number and workplace are commonly harvested.",
        ],
      },
      {
        heading: "Control the quiet tracking",
        paragraphs: [
          "Much of the data trail is mundane tracking: ad identifiers, cookie syncing and app analytics. You can reduce it without blocking everything. Limit app permissions to what a feature actually needs, reset your advertising ID periodically, and use your browser's privacy controls.",
          "Read permission requests in context. A flashlight app does not need your contacts. A navigation app needs location while in use — not all the time and not your microphone. Denying a permission rarely breaks the core feature if you are honest about what you use it for.",
        ],
        callout: {
          type: "info",
          title: "Breach checks are awareness, not diagnosis",
          body: "Breach-notification services can tell you that an email appeared in a known leak. Use the result to change unique passwords and enable 2FA; do not panic or paste sensitive data into random “security score” sites.",
        },
      },
    ],
    takeaways: [
      "Privacy is about reducing available data, not hiding wrongdoing.",
      "Review account access and active sessions at least twice a year.",
      "Default to a smaller audience for personal posts and location data.",
      "Grant permissions only for features you actively use.",
    ],
    quiz: [
      {
        question: "Which account should you secure first?",
        options: ["A shopping loyalty account", "Your primary email", "An unused forum account", "A streaming profile"],
        answer: 1,
        explanation:
          "Email is the reset path for most other accounts. Securing it with a unique password and strong 2FA protects everything connected to it.",
      },
      {
        question: "A photo-sharing app requests contacts access to apply filters. What is the best response?",
        options: [
          "Allow it — filters are useful",
          "Deny it; the filter feature does not need your contact list",
          "Allow it only on Wi-Fi",
          "Share contacts but delete the app later",
        ],
        answer: 1,
        explanation:
          "Permissions should match the feature's actual need. Filters do not require your contacts, so deny the request and keep the app useful.",
      },
      {
        question: "What is a sensible use of a data-breach notification?",
        options: [
          "Share the alert publicly with your email visible",
          "Change the affected unique password and enable 2FA",
          "Click every link in the alert to investigate",
          "Assume all other accounts are compromised",
        ],
        answer: 1,
        explanation:
          "A breach notice is a cue to rotate the exposed password and strengthen account security. Verify links through the service directly rather than clicking alert links.",
      },
    ],
  },
];

export const lessonCategories: Array<Lesson["category"] | "All"> = [
  "All",
  "Phishing",
  "Passwords",
  "Social Engineering",
  "Public Wi-Fi",
  "Privacy",
];

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getNextLesson(slug: string): Lesson | undefined {
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  return index >= 0 ? lessons[index + 1] : undefined;
}
