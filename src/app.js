const schools = JSON.parse(document.getElementById("school-data").textContent);
const cards = document.getElementById("cards");
const resultCount = document.getElementById("resultCount");
const maxCost = document.getElementById("maxCost");
const maxCostText = document.getElementById("maxCostText");
const controls = ["query", "maxCost", "degree", "state", "stem", "verifiedOnly"].map((id) => document.getElementById(id));

const labelMaps = {
  zh: {
    "Higher Cost": "较高成本",
    "Low Cost": "低成本",
    "Moderate Cost": "中等成本",
    "Cost Needs Review": "成本需核对",
    "Needs Manual Cost Check": "成本需核对",
    "Needs Review": "需核对",
    "STEM Available": "有 STEM",
    "STEM OPT CIP Evidence": "STEM OPT CIP 证据",
    "Very Low Cost": "很低成本",
    "Verified Legit": "正规已核验"
  },
  en: {}
};

function language() {
  return window.pathI18n?.getLanguage?.() || "en";
}

function t(key) {
  return window.pathI18n?.t?.(key, language()) || key;
}

function localLabel(value) {
  return labelMaps[language()]?.[value] || value;
}

function logoMarkup(school) {
  const alt = `${school.name} logo`;
  return `
    <div class="school-logo" aria-hidden="${school.logo_url ? "false" : "true"}">
      ${school.logo_url ? `<img src="${school.logo_url}" alt="${alt}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false;">` : ""}
      <span ${school.logo_url ? "hidden" : ""}>${school.logo_initials || "US"}</span>
    </div>
  `;
}

function usd(value) {
  if (typeof value !== "number") return language() === "zh" ? "需核查" : "Needs check";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function pct(value) {
  if (typeof value !== "number") return "n/a";
  return `${Math.round(value * 100)}%`;
}

function pctWidth(value) {
  if (typeof value !== "number") return 0;
  return Math.max(0, Math.min(100, Math.round(value * 100)));
}

function rateBar(label, value) {
  const percent = pctWidth(value);
  return `
    <div class="score-row">
      <div class="score-label"><span>${label}</span><strong>${pct(value)}</strong></div>
      <div class="score-track" aria-label="${label} ${pct(value)}">
        <span class="score-fill" style="width: ${percent}%"></span>
      </div>
    </div>
  `;
}

function schoolText(school) {
  return [
    school.name,
    school.city,
    school.state,
    school.control,
    ...school.level,
    ...school.programs.map((program) => program.program_name)
  ].join(" ").toLowerCase();
}

function render() {
  const query = document.getElementById("query").value.trim().toLowerCase();
  const degree = document.getElementById("degree").value;
  const state = document.getElementById("state").value;
  const stem = document.getElementById("stem").value;
  const verifiedOnly = document.getElementById("verifiedOnly").checked;
  const max = Number(maxCost.value);
  maxCostText.textContent = language() === "zh" ? `${usd(max)} 以下` : `${usd(max)} or less`;

  const filtered = schools.filter((school) => {
    const total = school.cost?.total_annual_cost_usd ?? Infinity;
    if (query && !schoolText(school).includes(query)) return false;
    if (total > max) return false;
    if (degree && !school.level.includes(degree)) return false;
    if (state && school.state !== state) return false;
    if (verifiedOnly && school.legitimacy_label !== "Verified Legit") return false;
    if (stem === "available" && !school.has_stem) return false;
    if (stem === "opt" && !school.has_stem_opt_evidence) return false;
    return true;
  });

  resultCount.textContent = language() === "zh" ? `${filtered.length} 所学校` : `${filtered.length} school${filtered.length === 1 ? "" : "s"}`;
  cards.innerHTML = filtered.map((school) => `
    <article class="school-card">
      <div class="card-head">
        <div class="school-title">
          ${logoMarkup(school)}
          <div>
            <h2>${school.name}</h2>
            <p>${school.city}, ${school.state} · ${school.control}</p>
          </div>
        </div>
        <strong>${usd(school.cost?.total_annual_cost_usd)}</strong>
      </div>
      <div class="badges">
        <span>${localLabel(school.legitimacy_label)}</span>
        <span>${localLabel(school.cost_label)}</span>
        ${school.has_stem ? `<span>${localLabel("STEM Available")}</span>` : ""}
        ${school.has_stem_opt_evidence ? `<span>${localLabel("STEM OPT CIP Evidence")}</span>` : ""}
      </div>
      <div class="mini-metrics">
        ${rateBar(t("graduation"), school.outcome?.graduation_rate)}
        ${rateBar(t("retention"), school.outcome?.retention_rate)}
        <div class="score-value"><span>${t("earningsSignal")}</span><strong>${usd(school.outcome?.earnings_signal)}</strong></div>
      </div>
      <p>${school.programs.length ? school.programs.slice(0, 2).map((program) => program.program_name).join(" · ") : t("programsPending")}</p>
      <div class="card-actions">
        <a href="/schools/${school.id}/">${language() === "zh" ? "查看详情" : "View details"}</a>
        ${school.apply_url ? `<a href="${school.apply_url}" target="_blank" rel="noreferrer">${language() === "zh" ? "官方申请" : "Official apply"}</a>` : ""}
      </div>
    </article>
  `).join("") || `<p class="empty">${language() === "zh" ? "没有学校匹配当前筛选。" : "No schools match the current filters."}</p>`;
}

for (const control of controls) {
  control.addEventListener("input", render);
  control.addEventListener("change", render);
}

window.addEventListener("path-language-change", render);
render();
