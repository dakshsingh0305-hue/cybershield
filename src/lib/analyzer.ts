import type {
  AnalyzeOutcome,
  PassedCheck,
  RiskLevel,
  ScanIndicator,
  ScanResult,
} from "./types";

/**
 * CyberShield URL heuristics.
 *
 * This module is intentionally self-contained and synchronous. It never makes
 * a network request, never follows redirects and never executes page content.
 * It inspects the *shape* of a URL for patterns commonly used in phishing.
 *
 * A low score is not a safety guarantee. A high score is not proof of malice.
 */

const SUSPICIOUS_TLDS = new Map<string, string>([
  ["zip", "frequently used in file-themed phishing"],
  ["mov", "frequently used in file-themed phishing"],
  ["xyz", "commonly used for throwaway phishing domains"],
  ["top", "commonly used for throwaway phishing domains"],
  ["click", "commonly used for throwaway phishing domains"],
  ["link", "commonly used for throwaway phishing domains"],
  ["work", "commonly used for throwaway phishing domains"],
  ["buzz", "commonly used for throwaway phishing domains"],
  ["rest", "commonly used for throwaway phishing domains"],
  ["monster", "commonly used for throwaway phishing domains"],
  ["fit", "commonly used for throwaway phishing domains"],
  ["download", "often used for file-themed scams"],
  ["stream", "often used for media-themed scams"],
  ["gq", "low-cost domain extension often abused by scammers"],
  ["tk", "low-cost domain extension often abused by scammers"],
  ["ml", "low-cost domain extension often abused by scammers"],
  ["ga", "low-cost domain extension often abused by scammers"],
  ["cf", "low-cost domain extension often abused by scammers"],
]);

const URL_SHORTENERS = new Set([
  "bit.ly",
  "buff.ly",
  "cutt.ly",
  "goo.gl",
  "is.gd",
  "ow.ly",
  "rebrand.ly",
  "shorturl.at",
  "t.co",
  "tiny.cc",
  "tinyurl.com",
  "tr.im",
]);

const BRANDS: Array<{ token: string; domains: string[] }> = [
  { token: "paypal", domains: ["paypal.com", "paypal.me"] },
  { token: "google", domains: ["google.com", "google.co.uk", "google.co.in", "gmail.com"] },
  { token: "gmail", domains: ["gmail.com", "google.com"] },
  { token: "microsoft", domains: ["microsoft.com", "live.com", "outlook.com"] },
  { token: "outlook", domains: ["outlook.com", "microsoft.com"] },
  { token: "apple", domains: ["apple.com", "icloud.com"] },
  { token: "icloud", domains: ["icloud.com", "apple.com"] },
  { token: "amazon", domains: ["amazon.com", "amazon.in", "amazon.co.uk"] },
  { token: "netflix", domains: ["netflix.com"] },
  { token: "facebook", domains: ["facebook.com", "fb.com"] },
  { token: "instagram", domains: ["instagram.com"] },
  { token: "whatsapp", domains: ["whatsapp.com", "wa.me"] },
  { token: "telegram", domains: ["telegram.org", "t.me"] },
  { token: "binance", domains: ["binance.com"] },
  { token: "coinbase", domains: ["coinbase.com"] },
  { token: "metamask", domains: ["metamask.io"] },
  { token: "sbi", domains: ["sbi.co.in", "onlinesbi.sbi", "onlinesbi.com"] },
  { token: "hdfc", domains: ["hdfcbank.com"] },
  { token: "icici", domains: ["icicibank.com"] },
  { token: "steam", domains: ["steampowered.com", "steamcommunity.com"] },
  { token: "discord", domains: ["discord.com", "discord.gg"] },
  { token: "linkedin", domains: ["linkedin.com"] },
  { token: "dropbox", domains: ["dropbox.com"] },
  { token: "adobe", domains: ["adobe.com"] },
  { token: "dhl", domains: ["dhl.com"] },
  { token: "fedex", domains: ["fedex.com"] },
  { token: "usps", domains: ["usps.com"] },
];

const BAIT_WORDS = [
  "login",
  "log-in",
  "signin",
  "sign-in",
  "verify",
  "verification",
  "account",
  "secure",
  "security",
  "update",
  "confirm",
  "unlock",
  "recover",
  "password",
  "wallet",
  "billing",
  "invoice",
  "payment",
  "refund",
  "prize",
  "bonus",
  "gift",
  "support",
];

const DANGEROUS_EXTENSIONS = [
  ".exe",
  ".scr",
  ".apk",
  ".bat",
  ".cmd",
  ".msi",
  ".jar",
  ".ps1",
  ".vbs",
  ".js",
  ".docm",
  ".xlsm",
  ".hta",
];

const REDIRECT_PARAMS = ["url", "redirect", "redirect_uri", "next", "target", "dest", "destination", "continue", "return"];

const MULTI_PART_SUFFIXES = new Set([
  "co.uk",
  "org.uk",
  "ac.uk",
  "gov.uk",
  "co.in",
  "net.in",
  "org.in",
  "co.jp",
  "com.au",
  "net.au",
  "co.nz",
  "com.br",
  "com.mx",
  "co.za",
]);

const ENTROPY_CHARS = /^[a-z0-9-]+$/;

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `scan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function riskLevel(score: number): RiskLevel {
  if (score >= 55) return "high";
  if (score >= 25) return "medium";
  return "low";
}

export function riskLabel(level: RiskLevel): string {
  return level === "high" ? "High risk" : level === "medium" ? "Suspicious" : "Low risk";
}

function registrableDomain(hostname: string): string {
  const clean = hostname.replace(/\.$/, "").toLowerCase();
  const labels = clean.split(".").filter(Boolean);
  if (labels.length <= 2) return clean;
  const lastTwo = labels.slice(-2).join(".");
  if (MULTI_PART_SUFFIXES.has(lastTwo)) {
    return labels.slice(-3).join(".");
  }
  return lastTwo;
}

function isOfficialBrandDomain(hostname: string, brandDomains: string[]): boolean {
  const domain = registrableDomain(hostname);
  return brandDomains.some((official) => domain === official || domain.endsWith(`.${official}`));
}

/** Map common lookalike substitutions back to letters before brand matching. */
function deLeet(value: string): string {
  return value
    .replace(/0/g, "o")
    .replace(/1/g, "l")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/@/g, "a")
    .replace(/\$/g, "s");
}

function formatHost(hostname: string): string {
  if (hostname.length > 56) return `${hostname.slice(0, 53)}…`;
  return hostname;
}

function cleanDisplay(value: string): string {
  // Strip control, bidi and zero-width characters that can disguise a URL.
  return value.replace(/[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, "");
}

export function analyzeUrl(rawInput: string, options?: { demo?: boolean; analyzedAt?: string }): AnalyzeOutcome {
  const input = cleanDisplay(rawInput).trim();
  if (!input) {
    return { ok: false, error: "Enter a URL to analyze." };
  }
  if (input.length > 2048) {
    return { ok: false, error: "That URL is too long to analyze (2,048 character limit)." };
  }
  if (/\s/.test(input)) {
    return { ok: false, error: "URLs cannot contain spaces. Check that you pasted the full address." };
  }

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(input);
  if (hasScheme && !/^https?:\/\//i.test(input)) {
    return { ok: false, error: "Only http:// and https:// addresses can be analyzed." };
  }
  const candidate = hasScheme ? input : `https://${input}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, error: "That does not look like a valid URL. Try something like example.com/login." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http:// and https:// addresses can be analyzed." };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!hostname) {
    return { ok: false, error: "That URL has no hostname. Include a domain, such as example.com." };
  }

  const rawLower = input.toLowerCase();
  const hostNoDot = hostname.replace(/\.$/, "");
  const labels = hostNoDot.split(".").filter(Boolean);
  const domain = registrableDomain(hostNoDot);
  const fullPath = `${parsed.pathname}${parsed.search}`;
  const decodedPath = (() => {
    try {
      return decodeURIComponent(fullPath);
    } catch {
      return fullPath;
    }
  })();
  const indicators: ScanIndicator[] = [];
  const passed: PassedCheck[] = [];

  const add = (indicator: ScanIndicator) => indicators.push(indicator);

  // Transport ---------------------------------------------------------------
  if (parsed.protocol === "http:") {
    add({
      id: "insecure-transport",
      label: "Unencrypted connection (HTTP)",
      severity: "medium",
      weight: 24,
      category: "transport",
      detail: "The address uses http://, so traffic is not encrypted with TLS.",
      explanation:
        "Sensitive information sent over HTTP can be read or altered in transit. Legitimate sign-in pages should use HTTPS.",
    });
  } else {
    passed.push({
      label: "Encrypted transport",
      detail: "The URL uses HTTPS. Note that attackers can also obtain certificates, so this is not proof of legitimacy.",
    });
  }

  // Hosting / domain -------------------------------------------------------
  const ipv4 = /^\d{1,3}(\.\d{1,3}){3}$/;
  const ipv6 = hostname.includes(":") || hostname.startsWith("[");
  if (ipv4.test(hostNoDot) || ipv6) {
    add({
      id: "ip-host",
      label: "Raw IP address instead of a domain",
      severity: "high",
      weight: 22,
      category: "domain",
      detail: `The link points directly at ${formatHost(hostname)} rather than a named website.`,
      explanation:
        "Phishing pages are often hosted on temporary IP addresses because domains can be blocked or taken down. This is uncommon for consumer services.",
    });
  } else {
    passed.push({
      label: "Named domain host",
      detail: "The destination uses a domain name rather than a bare IP address.",
    });
  }

  if (parsed.username || parsed.password) {
    add({
      id: "userinfo",
      label: "Embedded credentials before '@'",
      severity: "high",
      weight: 24,
      category: "structure",
      detail: "The URL contains text before an @ symbol in the authority section.",
      explanation:
        "Browsers may hide this prefix. Attackers use it to make a link look like it points to a trusted site while the real destination comes after the @.",
    });
  } else {
    passed.push({
      label: "No hidden authority prefix",
      detail: "The URL does not embed credentials or an @ symbol before the hostname.",
    });
  }

  if (hostname.startsWith("xn--") || labels.some((label) => label.startsWith("xn--"))) {
    add({
      id: "punycode",
      label: "Punycode domain",
      severity: "high",
      weight: 18,
      category: "domain",
      detail: "The hostname contains a punycode (xn--) label.",
      explanation:
        "Punycode can represent non-Latin characters, enabling visually similar lookalike domains. Many legitimate sites also use it, so this is a red flag—not a verdict.",
    });
  } else if (/[^\u0000-\u007f]/.test(hostname)) {
    add({
      id: "unicode-host",
      label: "Non-Latin characters in hostname",
      severity: "medium",
      weight: 10,
      category: "domain",
      detail: "The hostname contains international characters.",
      explanation:
        "Some phishing campaigns use lookalike Unicode characters to imitate brands. Only a concern if the domain is unfamiliar.",
    });
  } else {
    passed.push({
      label: "Plain ASCII hostname",
      detail: "The domain uses standard Latin characters with no punycode label.",
    });
  }

  if (labels.length > 3) {
    add({
      id: "subdomain-depth",
      label: "Unusually deep subdomain chain",
      severity: "medium",
      weight: 10,
      category: "domain",
      detail: `The hostname has ${labels.length} labels: ${formatHost(hostname)}.`,
      explanation:
        "Long chains like secure.login.account.example.xyz can bury the real domain and mislead readers. Use the registrable domain before the first single slash as the true destination.",
    });
  } else {
    passed.push({
      label: "Simple hostname structure",
      detail: "The hostname does not stack an unusual number of subdomains.",
    });
  }

  const tld = labels[labels.length - 1] ?? "";
  if (SUSPICIOUS_TLDS.has(tld)) {
    add({
      id: "tld",
      label: `.${tld} domain extension`,
      severity: "medium",
      weight: 14,
      category: "domain",
      detail: `The site uses .${tld}, ${SUSPICIOUS_TLDS.get(tld)}.`,
      explanation:
        "Some extensions are cheap or free to register and disproportionately appear in scam campaigns. Plenty of benign sites use them too, so treat this as one signal among several.",
    });
  }

  const brandParts = deLeet(hostNoDot.replace(/[^a-z0-9.-]/g, ""))
    .split(/[.-]/)
    .filter(Boolean);
  const brandHit = BRANDS.find((brand) => brandParts.includes(brand.token)) ?? BRANDS.find((brand) => brandParts.some((part) => part.includes(brand.token) && part.length <= brand.token.length + 3));
  if (brandHit && !isOfficialBrandDomain(hostNoDot, brandHit.domains)) {
    add({
      id: "brand-lookalike",
      label: `Possible ${brandHit.token} impersonation`,
      severity: "high",
      weight: 22,
      category: "domain",
      detail: `The hostname mentions “${brandHit.token}”, but the registrable domain is “${domain}”.`,
      explanation:
        "A trusted brand placed in a subdomain or hyphenated domain does not make the site official. Verify the core domain carefully—characters like a lowercase l and the digit 1 can look identical.",
    });
  } else if (brandHit) {
    passed.push({
      label: "Brand matches its official domain",
      detail: "The hostname sits on a known official domain for the brand it mentions.",
    });
  }

  const officialHost = brandHit ? isOfficialBrandDomain(hostNoDot, brandHit.domains) : false;
  const baitFound = BAIT_WORDS.filter((word) => rawLower.includes(word));
  if (baitFound.length > 0) {
    const weight = officialHost ? 2 : Math.min(12, baitFound.length * 4);
    add({
      id: "bait-keywords",
      label: "Account and urgency keywords",
      severity: officialHost ? "info" : "low",
      weight,
      category: "content",
      detail: `Found ${baitFound.slice(0, 4).map((word) => `“${word}”`).join(", ")}${baitFound.length > 4 ? " and more" : ""}.`,
      explanation: officialHost
        ? "Account-related words are normal on legitimate service domains. On unfamiliar domains, they are frequently used to create urgency around signing in or verifying details."
        : "Phishers use words like “verify”, “unlock” and “billing” to push you toward an urgent action. Keywords alone are weak evidence—context and domain matter.",
    });
  } else {
    passed.push({
      label: "No common bait keywords",
      detail: "The URL does not contain obvious account, urgency or payment keywords.",
    });
  }

  if (URL_SHORTENERS.has(domain)) {
    add({
      id: "shortener",
      label: "URL shortener hides the destination",
      severity: "medium",
      weight: 26,
      category: "domain",
      detail: `${domain} is a link-shortening service.`,
      explanation:
        "Shortened links conceal their final destination. Expand a short link with a trusted expansion service before opening it, or navigate to the organization's site directly.",
    });
  } else {
    passed.push({
      label: "No link-shortener domain",
      detail: "The destination is not a well-known URL shortening service.",
    });
  }

  const hyphenCount = (hostNoDot.match(/-/g) ?? []).length;
  if (hyphenCount >= 2) {
    add({
      id: "hyphenated-host",
      label: "Hyphenated lookalike hostname",
      severity: "low",
      weight: 8,
      category: "domain",
      detail: `The hostname contains ${hyphenCount} hyphens.`,
      explanation:
        "Hyphenated names such as secure-bank-login.com are a classic way to squeeze trusted words into an unrelated domain. Focus on the registrable domain.",
    });
  }

  if (hostNoDot.length > 30 && !ipv4.test(hostNoDot)) {
    add({
      id: "long-host",
      label: "Long hostname",
      severity: "low",
      weight: 6,
      category: "domain",
      detail: `The hostname is ${hostNoDot.length} characters long.`,
      explanation:
        "Long hostnames can push the real domain out of sight on narrow phone screens. Read the address from right to left until the first single slash.",
    });
  }

  const digitCount = (hostNoDot.match(/\d/g) ?? []).length;
  if (digitCount >= 7 && !ipv4.test(hostNoDot)) {
    add({
      id: "numeric-host",
      label: "Digit-heavy hostname",
      severity: "low",
      weight: 8,
      category: "domain",
      detail: `The hostname contains ${digitCount} digits.`,
      explanation:
        "Many random-looking digits can indicate an automatically generated or disposable domain. Legitimate domains can contain digits too.",
    });
  }

  if (hostname.endsWith(".")) {
    add({
      id: "trailing-dot",
      label: "Trailing dot in hostname",
      severity: "low",
      weight: 6,
      category: "structure",
      detail: "The hostname ends with a dot.",
      explanation:
        "A trailing dot can make a hostname display differently in some tools. It is rarely needed in shared web links.",
    });
  }

  // Structure ---------------------------------------------------------------
  if (parsed.port) {
    add({
      id: "nonstandard-port",
      label: "Explicit port number",
      severity: "low",
      weight: 8,
      category: "structure",
      detail: `The URL specifies port ${parsed.port}.`,
      explanation:
        "Consumer websites normally use the default ports for HTTP(S). An explicit port can signal a temporary server or development environment.",
    });
  } else {
    passed.push({
      label: "Standard web port",
      detail: "The URL uses the default HTTP(S) port rather than an explicit unusual port.",
    });
  }

  if (parsed.href.length > 200) {
    add({
      id: "very-long-url",
      label: "Very long URL",
      severity: "medium",
      weight: 12,
      category: "structure",
      detail: `The address is ${parsed.href.length} characters long.`,
      explanation:
        "Extremely long URLs can hide their real destination and may carry encoded payload data. Long URLs are not automatically malicious, but they lower visibility.",
    });
  } else if (parsed.href.length > 120) {
    add({
      id: "long-url",
      label: "Long URL",
      severity: "low",
      weight: 6,
      category: "structure",
      detail: `The address is ${parsed.href.length} characters long.`,
      explanation:
        "Long links are harder to inspect, especially on mobile. Check the domain before the first single slash.",
    });
  } else {
    passed.push({
      label: "Readable URL length",
      detail: "The address is short enough to inspect without truncation.",
    });
  }

  const encodedCount = (input.match(/%[0-9a-f]{2}/gi) ?? []).length;
  if (encodedCount >= 3) {
    add({
      id: "encoded",
      label: "Heavy character encoding",
      severity: "low",
      weight: 8,
      category: "structure",
      detail: `The URL contains ${encodedCount} percent-encoded characters.`,
      explanation:
        "Encoding is normal in URLs, but heavy encoding can obscure path names and payloads. Look for unexpected encoded characters in the domain portion.",
    });
  }

  const pathDepth = parsed.pathname.split("/").filter(Boolean).length;
  if (pathDepth >= 5) {
    add({
      id: "deep-path",
      label: "Deep path structure",
      severity: "low",
      weight: 5,
      category: "structure",
      detail: `The path contains ${pathDepth} segments.`,
      explanation:
        "Deeply nested paths can mimic account pages or disguise the page's purpose. They are common on legitimate sites as well.",
    });
  }

  const queryKeys = [...parsed.searchParams.keys()].map((key) => key.toLowerCase());
  const redirectParam = queryKeys.find((key) => REDIRECT_PARAMS.includes(key));
  const queryLooksLikeUrl = redirectParam
    ? [...parsed.searchParams.values()].some((value) => /^https?:\/\//i.test(value))
    : false;
  if (redirectParam && queryLooksLikeUrl) {
    add({
      id: "redirect-param",
      label: "Redirect parameter points elsewhere",
      severity: "medium",
      weight: 10,
      category: "structure",
      detail: `The query string uses “${redirectParam}=” with another full URL as its value.`,
      explanation:
        "Open redirects are abused to make a trusted link bounce to an attacker-controlled page. Confirm the final destination before signing in.",
    });
  }

  if (queryKeys.length >= 6) {
    add({
      id: "many-params",
      label: "Large number of query parameters",
      severity: "low",
      weight: 4,
      category: "structure",
      detail: `The URL has ${queryKeys.length} query parameters.`,
      explanation:
        "Many parameters can indicate tracking or credential capture. This is a weak signal on its own.",
    });
  }

  const lowerPath = decodedPath.toLowerCase();
  const dangerousExtension = DANGEROUS_EXTENSIONS.find((extension) => lowerPath.includes(extension));
  if (dangerousExtension) {
    add({
      id: "dangerous-file",
      label: `Executable file reference (${dangerousExtension})`,
      severity: "high",
      weight: 26,
      category: "content",
      detail: `The path or query references a “${dangerousExtension}” file.`,
      explanation:
        "Never open unexpected executable or macro-enabled files from a link. CyberShield only inspects the URL text; it never downloads anything.",
    });
  } else {
    passed.push({
      label: "No executable file reference",
      detail: "The URL path does not end in a common executable or macro-enabled file type.",
    });
  }

  if (parsed.pathname.includes("//")) {
    add({
      id: "double-slash",
      label: "Duplicate slashes in path",
      severity: "low",
      weight: 4,
      category: "structure",
      detail: "The path contains // sequences.",
      explanation:
        "Some filters and servers interpret duplicate slashes differently, which can help hide a page's purpose. This is a weak structural signal.",
    });
  }

  if (labels.length === 1 && !ipv4.test(hostNoDot) && hostNoDot !== "localhost") {
    add({
      id: "single-label",
      label: "Single-label hostname",
      severity: "medium",
      weight: 8,
      category: "domain",
      detail: `“${hostNoDot}” is not a conventional public domain name.`,
      explanation:
        "Public websites normally use a domain with a top-level extension. A single-word host can be an internal machine name or a malformed public link.",
    });
  }

  const entropyHost = labels[0] ?? "";
  if (
    entropyHost.length >= 14 &&
    ENTROPY_CHARS.test(entropyHost) &&
    !entropyHost.includes("-") &&
    /[a-z]/.test(entropyHost) &&
    /\d/.test(entropyHost)
  ) {
    add({
      id: "random-host",
      label: "Random-looking first label",
      severity: "low",
      weight: 5,
      category: "domain",
      detail: `The leftmost label “${formatHost(entropyHost)}” mixes letters and numbers in an unusual pattern.`,
      explanation:
        "Random-looking labels can indicate disposable infrastructure. Automated subdomain generation is also used by legitimate services, so this is a weak signal.",
    });
  }

  const score = Math.min(
    100,
    indicators.reduce((total, indicator) => total + indicator.weight, 0),
  );
  const level = riskLevel(score);

  const result: ScanResult = {
    id: makeId(),
    input,
    normalized: parsed.href,
    hostname,
    path: parsed.pathname === "/" && !parsed.search ? "/" : `${parsed.pathname}${parsed.search}`,
    score,
    level,
    indicators: indicators.sort((a, b) => b.weight - a.weight),
    passed,
    analyzedAt: options?.analyzedAt ?? new Date().toISOString(),
    ...(options?.demo ? { demo: true } : {}),
  };

  return { ok: true, result };
}

export const ANALYZER_VERSION = "2026.11-local-heuristics";
