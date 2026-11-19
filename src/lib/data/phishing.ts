import type { PhishingChannel, PhishingScenario } from "../types";

/**
 * Every message below is fictional and exists only for training.
 * Company names, addresses and URLs are invented. Links are rendered as
 * inert text — the app never navigates to them.
 */
export const phishingScenarios: PhishingScenario[] = [
  {
    id: "cloudvault-invoice",
    channel: "email",
    senderName: "CloudVault Billing",
    senderAddress: "billing@cloudvault-invoices.help",
    subject: "ACTION REQUIRED: Invoice #CV-88213 could not be processed",
    preview: "Update your payment method within 24 hours to avoid workspace suspension…",
    receivedAt: "Today, 09:42",
    difficulty: "Intermediate",
    isPhishing: true,
    attachment: "Invoice_CV-88213.pdf.exe",
    body: [
      { type: "hotspot", spotId: "greeting", text: "Hi there," },
      { type: "break" },
      { type: "text", text: "Our records show that your payment method for CloudVault Workspace failed on 12 November. To avoid suspending access for 14 team members, please update your billing details " },
      { type: "hotspot", spotId: "urgency", text: "within 24 hours" },
      { type: "text", text: "." },
      { type: "break" },
      { type: "text", text: "Review the attached invoice and " },
      { type: "hotspot", spotId: "billing-link", text: "update payment details here" },
      { type: "text", text: ". A late fee may apply if your account remains past due." },
      { type: "break" },
      { type: "text", text: "Regards," },
      { type: "break" },
      { type: "text", text: "The CloudVault Billing Team" },
      { type: "break" },
      { type: "text", text: "Need help? Reply to " },
      { type: "hotspot", spotId: "sender-domain", text: "billing@cloudvault-invoices.help" },
      { type: "text", text: "." },
    ],
    hotspots: [
      {
        id: "attachment",
        text: "Invoice_CV-88213.pdf.exe",
        suspicious: true,
        explanation:
          "The file name ends in .pdf.exe. Windows may hide the .exe extension, making it look like a PDF while it is actually an executable. Unexpected executables are a serious red flag.",
      },
      {
        id: "sender-domain",
        text: "billing@cloudvault-invoices.help",
        suspicious: true,
        explanation:
          "CloudVault's real domain would be cloudvault.com (fictional). “cloudvault-invoices.help” merely contains the brand name and uses a cheap .help extension. Read the part after the @.",
      },
      {
        id: "urgency",
        text: "within 24 hours",
        suspicious: true,
        explanation:
          "A one-day deadline is designed to prevent you from checking through normal channels. Legitimate billing teams send statements and reminders; they do not pressure you into a same-day payment update.",
      },
      {
        id: "billing-link",
        text: "update payment details here",
        suspicious: true,
        explanation:
          "The destination is a lookalike domain (cloudvault-billing.secure-payments.help) that combines a brand name with security words. The registrable domain is secure-payments.help, not cloudvault.com.",
      },
      {
        id: "greeting",
        text: "Hi there,",
        suspicious: false,
        explanation:
          "A generic greeting can be a clue that a sender does not actually know you, but many legitimate automated messages also use one. Treat it as weak supporting evidence, not a verdict.",
      },
    ],
    verdictExplanation:
      "This is a Credential and Payment Phish. The sender domain is a lookalike, the link goes to a different domain than the brand, the message invents a 24-hour suspension threat, and the attachment uses a double extension (.pdf.exe) to disguise an executable.",
    safeAction:
      "Do not open the attachment. Open CloudVault by typing its address in a new tab and check billing there. Report the message, then delete it.",
    lessonSlug: "spot-the-hook",
  },
  {
    id: "parcel-redelivery",
    channel: "sms",
    senderName: "ParcelPath",
    senderAddress: "+1 (415) 555-0132",
    subject: "ParcelPath delivery notice",
    preview: "Your parcel is on hold — a $1.99 redelivery fee is required…",
    receivedAt: "Today, 14:08",
    difficulty: "Beginner",
    isPhishing: true,
    body: [
      { type: "text", text: "ParcelPath: Your parcel is on hold at our depot because a $1.99 redelivery fee was not paid." },
      { type: "break" },
      { type: "text", text: "Pay now: " },
      { type: "hotspot", spotId: "fee-link", text: "prclpath-delivery.cc/PAY" },
      { type: "text", text: " — fees expire " },
      { type: "hotspot", spotId: "sms-urgency", text: "in 6 hours" },
      { type: "text", text: "." },
      { type: "break" },
      { type: "text", text: "Reference: PP-51209-4891. Reply STOP to opt out." },
      { type: "break" },
      { type: "text", text: "Sender: " },
      { type: "hotspot", spotId: "sender-number", text: "+1 (415) 555-0132" },
    ],
    hotspots: [
      {
        id: "fee-link",
        text: "prclpath-delivery.cc/PAY",
        suspicious: true,
        explanation:
          "The domain copies a shortened version of the brand and uses .cc, a cheap extension. It is not the carrier's official domain. Legitimate carriers also direct you to their own app or website rather than a random payment page.",
      },
      {
        id: "sms-urgency",
        text: "in 6 hours",
        suspicious: true,
        explanation:
          "A short countdown is pressure to pay before thinking. Delivery scams use tiny fees to get card details and then add recurring charges.",
      },
      {
        id: "sender-number",
        text: "+1 (415) 555-0132",
        suspicious: false,
        explanation:
          "An unfamiliar or alphanumeric sender ID is not proof of a scam; SMS sender IDs are easy to spoof and many businesses use them. Verify the delivery through the carrier's official app instead of trusting the message.",
      },
    ],
    verdictExplanation:
      "This is a Smishing (SMS phishing) delivery-fee scam. The fake tracking reference and $1.99 fee create a believable micro-transaction. The link leads to a card-details harvesting page, not a parcel depot.",
    safeAction:
      "Do not pay through the link. Track the parcel only in the carrier's official app or website. Report the SMS as spam and block the sender.",
    lessonSlug: "spot-the-hook",
  },
  {
    id: "nexa-bank-alert",
    channel: "email",
    senderName: "Nexa Bank Security",
    senderAddress: "alerts@nexa-bank-security.support",
    replyTo: "helpdesk@mail-auth.ru",
    subject: "Your online banking has been temporarily restricted",
    preview: "We detected 3 failed sign-in attempts. Restore access within 24 hours…",
    receivedAt: "Yesterday, 22:17",
    difficulty: "Intermediate",
    isPhishing: true,
    body: [
      { type: "hotspot", spotId: "generic-greeting", text: "Dear Valued Customer," },
      { type: "break" },
      { type: "text", text: "We detected " },
      { type: "text", text: "3 failed sign-in attempts on your account. For your safety, online banking has been temporarily limited." },
      { type: "break" },
      { type: "text", text: "To restore full access, please " },
      { type: "hotspot", spotId: "restore-link", text: "confirm your identity within 24 hours" },
      { type: "text", text: ". You will need your customer ID, password and a one-time passcode." },
      { type: "break" },
      { type: "text", text: "If you did not request this, ignore this email. Your account will remain restricted until identity confirmation." },
      { type: "break" },
      { type: "text", text: "Nexa Bank Security Operations" },
      { type: "break" },
      { type: "text", text: "Sent from a monitored mailbox. Replies go to " },
      { type: "hotspot", spotId: "reply-to", text: "helpdesk@mail-auth.ru" },
      { type: "text", text: "." },
      { type: "break" },
      { type: "text", text: "Sender: " },
      { type: "hotspot", spotId: "sender-domain", text: "alerts@nexa-bank-security.support" },
    ],
    hotspots: [
      {
        id: "generic-greeting",
        text: "Dear Valued Customer,",
        suspicious: true,
        explanation:
          "Banks that know you usually address you by name. A generic greeting is not proof, but it suggests a bulk message sent without real account context.",
      },
      {
        id: "reply-to",
        text: "helpdesk@mail-auth.ru",
        suspicious: true,
        explanation:
          "A reply-to address on an unrelated domain is a major mismatch. Legitimate bank mail should come from and reply through its official domain.",
      },
      {
        id: "restore-link",
        text: "confirm your identity within 24 hours",
        suspicious: true,
        explanation:
          "The line passes through a fake “identity confirmation” page designed to collect your customer ID, password and one-time code. A bank does not ask for a full password and OTP to lift a restriction.",
      },
      {
        id: "sender-domain",
        text: "alerts@nexa-bank-security.support",
        suspicious: true,
        explanation:
          "The domain contains the brand name but is not nexa-bank.com. Scammers append security words and use cheap extensions to look official.",
      },
    ],
    verdictExplanation:
      "This bank phishing email uses a spoofed lookalike domain, a mismatched reply-to address, urgency and a request for a password plus one-time passcode. The “restricted account” story is designed to create fear, and the generic greeting shows it was not built around a real customer.",
    safeAction:
      "Do not click. Open your banking app directly or call the number on the back of your card. If you already entered details, call the bank now and change your credentials.",
    lessonSlug: "spot-the-hook",
  },
  {
    id: "figtree-workshop",
    channel: "email",
    senderName: "Maya Chen",
    senderAddress: "maya.chen@figtree.design",
    subject: "You're invited: Figtree brand workshop (Thu, 15:00)",
    preview: "A small workshop for the new identity system — calendar invite attached…",
    receivedAt: "Today, 08:31",
    difficulty: "Advanced",
    isPhishing: false,
    attachment: "Brand-workshop.ics",
    body: [
      { type: "text", text: "Hi Sam," },
      { type: "break" },
      { type: "text", text: "I'm putting together a small workshop for the new identity system and would love your input. We'll meet Thursday at 15:00 in Studio B — " },
      { type: "hotspot", spotId: "calendar", text: "calendar invite attached" },
      { type: "text", text: "." },
      { type: "break" },
      { type: "text", text: "If you can't make it, the shared notes are here: " },
      { type: "hotspot", spotId: "notes-link", text: "figtree.design/workshops/brand-notes" },
      { type: "text", text: ". They're restricted to the design team, so you may be asked for your " },
      { type: "hotspot", spotId: "sign-in", text: "usual Figtree sign-in" },
      { type: "text", text: " if prompted." },
      { type: "break" },
      { type: "text", text: "Thanks," },
      { type: "break" },
      { type: "text", text: "Maya Chen" },
      { type: "text", text: " · Brand Systems · Figtree Design" },
    ],
    hotspots: [
      {
        id: "attachment",
        text: "Brand-workshop.ics",
        suspicious: false,
        explanation:
          "An .ics file is a standard calendar invite. It is not executable, and the invitation matches the workshop context. Calendar files can still contain links, but this one aligns with the story.",
      },
      {
        id: "calendar",
        text: "calendar invite attached",
        suspicious: false,
        explanation:
          "An .ics calendar attachment is a normal meeting invite format. It does not need to execute code. The context matches an internal workshop you were expecting.",
      },
      {
        id: "notes-link",
        text: "figtree.design/workshops/brand-notes",
        suspicious: false,
        explanation:
          "The link sits on figtree.design, the same domain as the sender. There is no redirect parameter or lookalike host. Links are not inherently suspicious when the domain and context line up.",
      },
      {
        id: "sign-in",
        text: "usual Figtree sign-in",
        suspicious: false,
        explanation:
          "Being asked to sign in to a restricted internal resource is normal. The key detail is that the request happens on the known domain. If the link had gone to figtree-sso.verify.support, that would be different.",
      },
    ],
    verdictExplanation:
      "This message is legitimate. The sender address, link domain and company context agree. The attachment is a standard calendar invite, and the sign-in request happens on the known company domain. Phishing awareness is not the same as treating every message as malicious.",
    safeAction:
      "You can accept the calendar invite. Before clicking any link, you can still confirm the domain is figtree.design — a two-second habit that costs nothing.",
    lessonSlug: "spot-the-hook",
  },
  {
    id: "crypto-double",
    channel: "dm",
    senderName: "CryptoDesk Support",
    senderAddress: "@cryptodesk_help",
    subject: "Winner selection — 2x ETH giveaway",
    preview: "Congratulations! Our team selected your wallet for the 2x ETH giveaway…",
    receivedAt: "Today, 11:56",
    difficulty: "Beginner",
    isPhishing: true,
    body: [
      { type: "text", text: "Congratulations! Our team selected your wallet for the " },
      { type: "hotspot", spotId: "giveaway", text: "2x ETH giveaway" },
      { type: "text", text: "." },
      { type: "break" },
      { type: "text", text: "To claim, validate your wallet by " },
      { type: "hotspot", spotId: "seed-phrase", text: "sharing your 12-word recovery phrase with our agent" },
      { type: "text", text: ". This is required for identity verification." },
      { type: "break" },
      { type: "text", text: "Offer ends " },
      { type: "hotspot", spotId: "dm-urgency", text: "in 30 minutes" },
      { type: "text", text: ". Reply " },
      { type: "hotspot", spotId: "dm-handle", text: "@cryptodesk_help" },
      { type: "text", text: " to continue." },
    ],
    hotspots: [
      {
        id: "seed-phrase",
        text: "sharing your 12-word recovery phrase with our agent",
        suspicious: true,
        explanation:
          "A recovery phrase is the master key to a crypto wallet. No legitimate support agent, giveaway or exchange will ever ask for it. Sharing it lets an attacker empty the wallet instantly.",
      },
      {
        id: "giveaway",
        text: "2x ETH giveaway",
        suspicious: true,
        explanation:
          "Unexpected winnings from an account you did not follow or enter are a classic crypto lure. If you did not enter a giveaway, you did not win one.",
      },
      {
        id: "dm-urgency",
        text: "in 30 minutes",
        suspicious: true,
        explanation:
          "A short deadline is designed to stop you from checking the account or asking someone else. Real promotions do not perish within minutes.",
      },
      {
        id: "dm-handle",
        text: "@cryptodesk_help",
        suspicious: true,
        explanation:
          "An underscore variant of a brand's handle is a common impersonation trick. Check the account's history and official support channels; verified badges can also be faked in screenshots.",
      },
    ],
    verdictExplanation:
      "This is a crypto giveaway scam. The warning sign is absolute: a recovery phrase request. No legitimate service needs your seed phrase for verification, and urgency pushes victims to act before verifying the account.",
    safeAction:
      "Do not reply or share any wallet information. Block and report the account. Move funds only through your wallet's official app and never enter a seed phrase into a website or chat.",
    lessonSlug: "trust-but-verify",
  },
  {
    id: "omnivex-ceo",
    channel: "email",
    senderName: "Anika Rao (CEO)",
    senderAddress: "anika.rao@omnivex-corp.co",
    subject: "Quick favour before the board meeting",
    preview: "Can you grab $500 in gift cards for client thank-yous? Keep this between us…",
    receivedAt: "Today, 07:12",
    difficulty: "Advanced",
    isPhishing: true,
    body: [
      { type: "text", text: "Hi Priya," },
      { type: "break" },
      { type: "text", text: "I'm heading into the board meeting and need a quick favour. Can you pick up " },
      { type: "hotspot", spotId: "gift-cards", text: "$500 in gift cards" },
      { type: "text", text: " for client thank-yous? I'll reimburse you today." },
      { type: "break" },
      { type: "hotspot", spotId: "secrecy", text: "Please keep this between us until the announcement." },
      { type: "text", text: " I don't want the team speculating yet." },
      { type: "break" },
      { type: "text", text: "Send me the " },
      { type: "hotspot", spotId: "codes", text: "codes here as soon as you have them" },
      { type: "text", text: "." },
      { type: "break" },
      { type: "text", text: "Thanks — sent from my iPhone" },
      { type: "break" },
      { type: "hotspot", spotId: "lookalike-domain", text: "Anika Rao · anika.rao@omnivex-corp.co" },
    ],
    hotspots: [
      {
        id: "lookalike-domain",
        text: "Anika Rao · anika.rao@omnivex-corp.co",
        suspicious: true,
        explanation:
          "The company domain is omnivex.com; this address is omnivex-corp.co. Adding “-corp” and changing the extension is a common business email compromise trick. The display name is not the address.",
      },
      {
        id: "gift-cards",
        text: "$500 in gift cards",
        suspicious: true,
        explanation:
          "Gift cards are untraceable and irreversible. No legitimate executive request for client gifts relies on an employee buying cards personally and sending codes.",
      },
      {
        id: "secrecy",
        text: "Please keep this between us until the announcement.",
        suspicious: true,
        explanation:
          "Requesting secrecy isolates you from colleagues who might recognise the scam. Real sensitive projects still have finance and approval processes.",
      },
      {
        id: "codes",
        text: "codes here as soon as you have them",
        suspicious: true,
        explanation:
          "Once the attacker has the card codes, the money is gone. The request also bypasses normal reimbursement and procurement controls.",
      },
      {
        id: "iphone-footer",
        text: "sent from my iPhone",
        suspicious: false,
        explanation:
          "A mobile signature is not evidence either way. Attackers copy these details, and legitimate executives send them. Judge the request and the domain, not the sign-off.",
      },
    ],
    verdictExplanation:
      "This is a CEO impersonation / business email compromise attempt. The sender domain is a lookalike, the request bypasses finance, asks for untraceable gift cards, demands secrecy and asks for the codes immediately. Authority plus urgency plus secrecy is the classic trio.",
    safeAction:
      "Do not buy anything or reply. Verify with Anika using the internal directory or a number you already have. Report the email to your security team so they can warn other employees.",
    lessonSlug: "trust-but-verify",
  },
];

export const phishingChannelLabels: Record<PhishingChannel, string> = {
  email: "Email",
  sms: "SMS",
  dm: "Direct message",
};

export function getScenario(id: string): PhishingScenario | undefined {
  return phishingScenarios.find((scenario) => scenario.id === id);
}

export function getNextScenario(id: string): PhishingScenario | undefined {
  const index = phishingScenarios.findIndex((scenario) => scenario.id === id);
  return index >= 0 ? phishingScenarios[index + 1] : undefined;
}
