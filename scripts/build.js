import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const institutions = read("data/institutions.json");
const costs = read("data/costs.json");
const programs = read("data/programs.json");
const outcomes = read("data/outcomes.json");
const reviews = read("data/review_summaries.json");
const experienceLinks = read("data/experience_links.json");
const siteUrl = "https://path.ailatest.org";
const experienceByInstitution = new Map(experienceLinks.map((item) => [item.institution_id, item.links]));

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatUsd(value) {
  if (typeof value !== "number") return "Needs check";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatPct(value) {
  if (typeof value !== "number") return "n/a";
  return `${Math.round(value * 100)}%`;
}

function pctWidth(value) {
  if (typeof value !== "number") return 0;
  return Math.max(0, Math.min(100, Math.round(value * 100)));
}

function costLabel(cost) {
  if (!cost || typeof cost.total_annual_cost_usd !== "number") return "Cost Needs Review";
  if (cost.total_annual_cost_usd <= 25000) return "Very Low Cost";
  if (cost.total_annual_cost_usd <= 35000) return "Low Cost";
  if (cost.total_annual_cost_usd <= 50000) return "Moderate Cost";
  return "Higher Cost";
}

function labelKey(label) {
  return {
    "Higher Cost": "higherCost",
    "Low Cost": "lowCost",
    "Moderate Cost": "moderateCost",
    "Cost Needs Review": "costNeedsReview",
    "Needs Review": "needsReview",
    "STEM Available": "stemAvailable",
    "STEM OPT CIP Evidence": "stemOptEvidence",
    "Very Low Cost": "veryLowCost",
    "Verified Legit": "verifiedLegit"
  }[label];
}

function badge(label) {
  const key = labelKey(label);
  return key ? `<span data-i18n="${key}">${escapeHtml(label)}</span>` : `<span>${escapeHtml(label)}</span>`;
}

function domainFromUrl(url) {
  if (!url) return null;
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function logoUrl(website) {
  const domain = domainFromUrl(website);
  return domain ? `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(domain)}&sz=96` : null;
}

function logoInitials(name) {
  return String(name || "")
    .split(/\s+/)
    .filter((word) => !/^(of|at|the|and|for)$/i.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "US";
}

const data = institutions.map((institution) => {
  const cost = costs.find((item) => item.institution_id === institution.id);
  const institutionPrograms = programs.filter((item) => item.institution_id === institution.id);
  const outcome = outcomes.find((item) => item.institution_id === institution.id);
  const institutionReviews = reviews.filter((item) => item.institution_id === institution.id);
  return {
    ...institution,
    cost,
    cost_label: costLabel(cost),
    programs: institutionPrograms,
    outcome,
    reviews: institutionReviews,
    logo_url: logoUrl(institution.website),
    logo_initials: logoInitials(institution.name),
    has_stem: institutionPrograms.some((program) => /computer|cyber|information|science|stem/i.test(program.program_name)),
    has_stem_opt_evidence: institutionPrograms.some((program) => program.stem_opt_eligible && program.cip_code)
  };
});

function layout({ title, description, body, script = "" }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    ${body}
    <script src="/analytics.js" defer></script>
    <script src="/i18n.js" type="module"></script>
    ${script}
  </body>
</html>`;
}

function sourceLinks(urls) {
  if (!urls) return "";
  const list = Array.isArray(urls) ? urls : Object.values(urls);
  return list.map((url) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer" data-i18n="openLink">Open</a>`).join(" ");
}

function rateBar(labelKeyName, fallbackLabel, value) {
  return `
    <div class="score-row score-row-large">
      <div class="score-label"><span data-i18n="${labelKeyName}">${escapeHtml(fallbackLabel)}</span><strong>${formatPct(value)}</strong></div>
      <div class="score-track" aria-label="${escapeHtml(fallbackLabel)} ${formatPct(value)}">
        <span class="score-fill" style="width: ${pctWidth(value)}%"></span>
      </div>
    </div>`;
}

function detailPage(school) {
  const programRows = school.programs.length ? school.programs.map((program) => `
    <article class="record">
      <div>
        <h3>${escapeHtml(program.program_name)}</h3>
        <p>${escapeHtml(program.degree_level)} · ${escapeHtml(program.delivery.join(", "))}</p>
      </div>
      <p><strong>STEM OPT evidence:</strong> ${escapeHtml(program.stem_opt_eligible ? program.stem_opt_basis : "No STEM OPT badge shown yet.")}</p>
      <p><strong>CIP:</strong> ${escapeHtml(program.cip_code || "Needs school-published CIP check")}</p>
      <p><a href="${escapeHtml(program.official_url)}" target="_blank" rel="noreferrer">Official program</a> · <a href="${escapeHtml(program.admission_url)}" target="_blank" rel="noreferrer">Admissions</a></p>
    </article>`).join("") : `<p class="muted" data-i18n="programsPending">Program details are not added yet for this database record.</p>`;

  const reviewRows = school.reviews.length ? school.reviews.map((review) => `
    <article class="record">
      <h3>${escapeHtml(review.topic)}</h3>
      <p>${escapeHtml(review.summary)}</p>
      <p class="muted">${escapeHtml(review.platform)} · ${escapeHtml(review.collected_at)}</p>
      ${review.short_excerpt ? `<p class="excerpt">Short excerpt: ${escapeHtml(review.short_excerpt)}</p>` : ""}
      <p><a href="${escapeHtml(review.source_url)}" target="_blank" rel="noreferrer" data-i18n="openLink">Open</a></p>
    </article>`).join("") : `<p class="muted" data-i18n="publicDiscussionPending">Public discussion summary is not added yet.</p>`;

  const experienceRows = school.experience_links.map((item) => {
    const platformClass = item.platform.toLowerCase();
    const mark = {
      Xiaohongshu: "RED",
      YouTube: "▶",
      Instagram: "◎",
      TikTok: "♪",
      Douyin: "抖"
    }[item.platform] || item.label.slice(0, 2);
    const typeKey = item.content_type === "video" ? "video" : item.content_type === "short_video" ? "shortVideo" : "photoVideo";
    const typeFallback = item.content_type === "video" ? "Video" : item.content_type === "short_video" ? "Short video" : "Photos and video";
    return `<a class="experience-link experience-${escapeHtml(platformClass)}" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener" title="${escapeHtml(item.access_note)}">
      <span class="experience-platform"><span class="experience-mark" aria-hidden="true">${escapeHtml(mark)}</span><span><strong>${escapeHtml(item.label)}</strong><small data-i18n="${typeKey}">${escapeHtml(typeFallback)}</small></span></span>
      <span class="experience-action" data-i18n="findExperiences">Find experiences</span>
    </a>`;
  }).join("");

  const body = `
<header class="topbar">
  <a class="brand" href="/">AILatest Path</a>
  <nav class="top-actions" aria-label="Primary">
    <a class="link-button" href="/" data-i18n="searchSchools">Search schools</a>
    <a class="link-button" href="/contact.html" data-i18n="contact">Contact</a>
    <button class="lang-toggle" type="button" data-lang-toggle>中文</button>
  </nav>
</header>
<main class="detail">
  <section class="detail-hero">
    <p class="eyebrow"><span data-i18n="verified">Verified</span> ${escapeHtml(school.verified_at)}</p>
    <h1>${escapeHtml(school.name)}</h1>
    <p>${escapeHtml(school.city)}, ${escapeHtml(school.state)} · ${escapeHtml(school.control)} · ${escapeHtml(school.level.join(" / "))}</p>
    <div class="badges">
      ${badge(school.legitimacy_label)}
      ${badge(school.cost_label)}
      ${school.has_stem ? badge("STEM Available") : ""}
      ${school.has_stem_opt_evidence ? badge("STEM OPT CIP Evidence") : ""}
    </div>
  </section>

  <section class="band">
    <h2 data-i18n="costBreakdown">Cost Breakdown</h2>
    <div class="metrics">
      <div><strong>${formatUsd(school.cost?.total_annual_cost_usd)}</strong><span data-i18n="estimatedAnnualTotal">Estimated annual total</span></div>
      <div><strong>${formatUsd(school.cost?.tuition_fees_usd)}</strong><span data-i18n="tuitionAndFees">Tuition and fees</span></div>
      <div><strong>${formatUsd(school.cost?.living_estimate_usd)}</strong><span data-i18n="livingEstimate">Living estimate</span></div>
      <div><strong>${school.cost?.insurance_usd ? formatUsd(school.cost.insurance_usd) : `<span data-i18n="needsCheck">Needs check</span>`}</strong><span data-i18n="insurance">Insurance</span></div>
    </div>
    <p>${escapeHtml(school.cost?.cost_basis)}</p>
    <p class="sources">${sourceLinks(school.cost?.source_urls)}</p>
  </section>

  <section class="band">
    <h2 data-i18n="legitimacyEvidence">Legitimacy Evidence</h2>
    <div class="evidence-grid">
      <article><h3 data-i18n="accreditation">Accreditation</h3><p>${escapeHtml(school.accreditation_status)}</p><p>${sourceLinks([school.source_urls.accreditation, school.source_urls.dapip])}</p></article>
      <article><h3>F-1 / SEVP</h3><p>${escapeHtml(school.sevp_status)}</p><p>${sourceLinks([school.source_urls.sevp])}</p></article>
      <article><h3 data-i18n="publicData">Public Data</h3><p>${escapeHtml(school.public_data_status)}</p><p>${sourceLinks([school.source_urls.scorecard])}</p></article>
    </div>
  </section>

  <section class="band">
    <h2 data-i18n="programs">Programs</h2>
    ${programRows}
  </section>

  <section class="band">
    <h2 data-i18n="outcomeSignals">Outcomes</h2>
    <div class="outcome-visuals">
      ${rateBar("graduation", "Graduation rate", school.outcome?.graduation_rate)}
      ${rateBar("retention", "First-year retention", school.outcome?.retention_rate)}
    </div>
    <p class="muted" data-i18n="retentionHelp">Share of first-time students who return after their first year.</p>
    <div class="metrics compact-metrics">
      <div><strong>${formatUsd(school.outcome?.earnings_signal)}</strong><span data-i18n="earningsSignal">Median earnings</span></div>
      <div><strong>${formatUsd(school.outcome?.debt_signal)}</strong><span data-i18n="debtSignal">Median debt</span></div>
    </div>
    <p class="muted">${escapeHtml(school.outcome?.limitations_note)}</p>
  </section>

  <section class="band" id="student-experiences">
    <h2 data-i18n="studentExperiences">Student experiences</h2>
    <p class="muted" data-i18n="experienceIntro">Open a focused search for this school on public photo and video platforms.</p>
    <div class="experience-grid">${experienceRows}</div>
    <p class="experience-note" data-i18n="experienceCaveat">These are live platform searches, not verified school facts. Results can change and some platforms may require sign-in.</p>
  </section>

  <section class="band">
    <h2 data-i18n="publicDiscussion">Public Discussion Summary</h2>
    ${reviewRows}
  </section>

  <section class="band zh">
    <h2 data-i18n="chineseRouteSummary">中文路线摘要</h2>
    <p>${escapeHtml(school.name)} 是一所美国公立院校。申请前建议重点核对三件事：认证情况、SEVP/F-1 学校资格、以及学校官网列出的最新费用。学费和生活费会变化，也要确认校区、专业 CIP 和英语要求。本页不承诺录取、签证、OPT、STEM OPT、就业或移民结果。</p>
  </section>
</main>
<footer class="footer">
  <p data-i18n="footerGuide">Informational education guide only. Always verify official school and government information before making decisions.</p>
  <p><a href="/contact.html" data-i18n="contact">Contact</a> · <a href="mailto:contact@ailatest.org">contact@ailatest.org</a></p>
</footer>`;

  return layout({
    title: `${school.name} | AILatest Path`,
    description: `Cost, legitimacy checks, programs, and outcomes for ${school.name}.`,
    body
  });
}

function indexPage() {
  const states = [...new Set(data.map((school) => school.state))].sort();
  const body = `
<header class="topbar">
  <a class="brand" href="/">AILatest Path</a>
  <nav class="top-actions" aria-label="Primary"><a class="link-button" href="/contact.html" data-i18n="contact">Contact</a><button class="lang-toggle" type="button" data-lang-toggle>中文</button></nav>
</header>
<main>
  <section class="search-shell">
    <div class="intro">
      <p class="eyebrow" data-i18n="eyebrow">U.S. school database</p>
      <h1 data-i18n="homeTitle">Compare U.S. colleges.</h1>
      <p class="intro-copy" data-i18n="homeIntro">Explore 200 public U.S. colleges by annual cost, accreditation and F-1 evidence, outcomes, and student experience links.</p>
      <ol class="intro-guide" aria-label="What you can compare">
        <li><span>01</span><div><strong data-i18n="introCostTitle">Cost</strong><p data-i18n="introCostText">Tuition, living estimate, and annual total</p></div></li>
        <li><span>02</span><div><strong data-i18n="introEvidenceTitle">Legitimacy</strong><p data-i18n="introEvidenceText">Accreditation, DAPIP, and SEVP/F-1 evidence</p></div></li>
        <li><span>03</span><div><strong data-i18n="introExperienceTitle">Student experience</strong><p data-i18n="introExperienceText">School-specific searches across five social platforms</p></div></li>
      </ol>
      <p class="intro-footnote" data-i18n="introFootnote">Filter first, then open a school page to check sources and student experiences.</p>
    </div>
    <form class="filters" id="filters">
      <label>
        <span data-i18n="search">Search</span>
        <input id="query" name="school_search" type="search" autocomplete="off" placeholder="School, city, state, program…" data-i18n-placeholder="searchPlaceholder">
      </label>
      <label>
        <span data-i18n="annualTotalCost">Annual total cost</span>
        <input id="maxCost" type="range" min="20000" max="55000" value="55000" step="1000">
        <span id="maxCostText">$55,000 or less</span>
      </label>
      <label>
        <span data-i18n="degreeLevel">Degree level</span>
        <select id="degree">
          <option value="" data-i18n="any">Any</option>
          <option value="undergraduate" data-i18n="undergraduate">Undergraduate</option>
          <option value="master's" data-i18n="masters">Master's</option>
        </select>
      </label>
      <label>
        <span data-i18n="state">State</span>
        <select id="state">
          <option value="" data-i18n="any">Any</option>
          ${states.map((state) => `<option value="${escapeHtml(state)}" data-state-code="${escapeHtml(state)}">${escapeHtml(state)}</option>`).join("")}
        </select>
      </label>
      <label>
        STEM
        <select id="stem">
          <option value="" data-i18n="any">Any</option>
          <option value="available" data-i18n="stemAvailable">STEM available</option>
          <option value="opt" data-i18n="stemOptEvidence">STEM OPT CIP evidence</option>
        </select>
      </label>
      <label class="check">
        <input id="verifiedOnly" type="checkbox">
        <span data-i18n="verifiedOnly">Verified Legit only</span>
      </label>
    </form>
  </section>
  <section class="results-head">
    <h2><span data-i18n="schoolDatabase">School Database</span> <span id="resultCount">Schools</span></h2>
    <p data-i18n="resultsNote">Complete records are marked verified. Screened records should be checked on official school pages before you apply.</p>
  </section>
  <section class="cards" id="cards"></section>
  <button class="load-more" id="loadMore" type="button" hidden>Show more</button>
</main>
<footer class="footer">
  <p data-i18n="footerNoPromise">No admission, visa, OPT, employment, or immigration outcome is promised. Verify official information before applying.</p>
  <p><a href="/contact.html" data-i18n="contact">Contact</a> · <a href="mailto:contact@ailatest.org">contact@ailatest.org</a></p>
</footer>
<script id="school-data" type="application/json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>
<script src="/app.js" type="module"></script>`;

  return layout({
    title: "AILatest Path | Affordable Legit U.S. Colleges",
    description: "Search U.S. colleges by annual cost, legitimacy checks, programs, and outcomes.",
    body
  });
}

cleanDir(dist);
fs.writeFileSync(path.join(dist, "index.html"), indexPage());
fs.copyFileSync(path.join(root, "src", "styles.css"), path.join(dist, "styles.css"));
fs.copyFileSync(path.join(root, "src", "i18n.js"), path.join(dist, "i18n.js"));
fs.copyFileSync(path.join(root, "src", "app.js"), path.join(dist, "app.js"));
fs.copyFileSync(path.join(root, "src", "analytics.js"), path.join(dist, "analytics.js"));
const contactMatrix = `<section class="band" aria-labelledby="contact-matrix-title"><h2 id="contact-matrix-title">Find AILATEST STUDIO</h2><p class="muted">Scan the same official contact codes used across all AILATEST products.</p><div class="contact-matrix"><article class="contact-channel"><h3>小红书</h3><p>产品方法与团队动态</p><a href="https://ailatest.org/assets/contact/xiaohongshu-qr.jpg" aria-label="View AILATEST STUDIO Xiaohongshu QR code"><img src="https://ailatest.org/assets/contact/xiaohongshu-qr.jpg" width="941" height="867" loading="lazy" alt="AILATEST STUDIO 小红书二维码"></a></article><article class="contact-channel"><h3>微信公众号</h3><p>产品更新与重要通知</p><a href="https://weixin.qq.com/r/mp/iS_4oBfEH0pgrVPD93qb" aria-label="Open AILATEST STUDIO WeChat official account"><img src="https://ailatest.org/assets/contact/wechat-official-qr.jpg" width="430" height="430" loading="lazy" alt="AILATEST STUDIO 微信公众号二维码"></a></article><article class="contact-channel"><h3>微信反馈群</h3><p>群二维码会过期，以联系矩阵页为准</p><a href="https://ailatest.org/connect.html#wechat-group" aria-label="Open the current AILATEST STUDIO WeChat group code"><img src="https://ailatest.org/assets/contact/wechat-group-current.jpg" width="1080" height="1080" loading="lazy" alt="AILATEST STUDIO 微信产品反馈群二维码"></a></article></div></section>`;
const contactBody = `<header class="topbar"><a class="brand" href="/">AILatest Path</a><nav class="top-actions" aria-label="Primary"><a class="link-button" href="/" data-i18n="searchSchools">Search schools</a><button class="lang-toggle" type="button" data-lang-toggle>中文</button></nav></header><main class="detail"><section class="detail-hero"><p class="eyebrow">Contact</p><h1 data-i18n="contactTitle">Contact AILATEST Path</h1><p data-i18n="contactIntro">Send data corrections, source updates, and product feedback to our shared inbox.</p></section>${contactMatrix}<section class="band contact-grid"><article class="record"><h2 data-i18n="emailUs">Email us</h2><p><a class="link-button" href="mailto:contact@ailatest.org">contact@ailatest.org</a></p><p data-i18n="contactHelp">For school data corrections, include the school name, field to correct, official source URL, and publication date.</p></article><article class="record"><h2 data-i18n="privacyNote">Privacy note</h2><p data-i18n="privacyHelp">Do not email passwords, verification codes, passport details, or other sensitive personal information.</p></article></section></main><footer class="footer"><p data-i18n="footerGuide">Informational education guide only. Always verify official school and government information before making decisions.</p></footer>`;
fs.writeFileSync(path.join(dist, "contact.html"), layout({ title: "Contact | AILatest Path", description: "Contact AILatest Path for data corrections and product feedback.", body: contactBody }));
fs.writeFileSync(path.join(dist, "schools.json"), JSON.stringify(data, null, 2));
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);

const sitemapUrls = [`${siteUrl}/`, `${siteUrl}/contact.html`, ...data.map((school) => `${siteUrl}/schools/${school.id}/`)];
fs.writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`);

for (const school of data) {
  const schoolDir = path.join(dist, "schools", school.id);
  ensureDir(schoolDir);
  fs.writeFileSync(path.join(schoolDir, "index.html"), detailPage({
    ...school,
    experience_links: experienceByInstitution.get(school.id) || []
  }));
}

console.log(`Built ${data.length} school pages into dist/.`);
