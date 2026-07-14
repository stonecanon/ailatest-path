import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, "data", name), "utf8"));
const write = (name, value) => fs.writeFileSync(path.join(root, "data", name), `${JSON.stringify(value, null, 2)}\n`);
const TARGET_COUNT = Number(process.env.PATH_SCHOOL_TARGET || 200);
const PAGE_SIZE = 100;
const apiKey = process.env.SCORECARD_API_KEY || "DEMO_KEY";
const checkedAt = new Date().toISOString().slice(0, 10);

const institutions = read("institutions.json");
const costs = read("costs.json");
const outcomes = read("outcomes.json");
const existingUnitIds = new Set(institutions.map((item) => item.unitid));
const existingIds = new Set(institutions.map((item) => item.id));
const fields = [
  "id",
  "school.name",
  "school.city",
  "school.state",
  "school.school_url",
  "latest.student.size",
  "latest.cost.tuition.out_of_state",
  "latest.cost.roomboard.oncampus",
  "latest.completion.rate_suppressed.overall",
  "latest.student.retention_rate.four_year.full_time",
  "latest.earnings.10_yrs_after_entry.median",
  "latest.aid.median_debt.completers.overall"
].join(",");

function slug(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function schoolUrl(unitid, name) {
  return `https://collegescorecard.ed.gov/school/?${unitid}-${slug(name)}`;
}

async function fetchPage(page) {
  const params = new URLSearchParams({
    api_key: apiKey,
    "school.operating": "1",
    "school.ownership": "1",
    "school.degrees_awarded.predominant": "3",
    per_page: String(PAGE_SIZE),
    page: String(page),
    fields
  });
  const response = await fetch(`https://api.data.gov/ed/collegescorecard/v1/schools?${params}`);
  if (!response.ok) throw new Error(`College Scorecard page ${page} failed: ${response.status}`);
  return response.json();
}

const first = await fetchPage(0);
const pages = Math.ceil(first.metadata.total / PAGE_SIZE);
const records = [...first.results];
for (let page = 1; page < pages; page += 1) {
  const payload = await fetchPage(page);
  records.push(...payload.results);
}

const candidates = records
  .filter((item) => !existingUnitIds.has(item.id))
  .filter((item) => Number(item["latest.student.size"]) >= 1000)
  .filter((item) => Number.isFinite(item["latest.cost.tuition.out_of_state"]))
  .filter((item) => Number.isFinite(item["latest.cost.roomboard.oncampus"]))
  .filter((item) => Number.isFinite(item["latest.completion.rate_suppressed.overall"]))
  .filter((item) => Number.isFinite(item["latest.student.retention_rate.four_year.full_time"]))
  .map((item) => ({
    raw: item,
    estimatedTotal: Math.round(item["latest.cost.tuition.out_of_state"] + item["latest.cost.roomboard.oncampus"] + 4500)
  }))
  .filter((item) => item.estimatedTotal <= 55000)
  .sort((a, b) => a.estimatedTotal - b.estimatedTotal || a.raw["school.name"].localeCompare(b.raw["school.name"]));

const needed = Math.max(0, TARGET_COUNT - institutions.length);
for (const { raw, estimatedTotal } of candidates.slice(0, needed)) {
  const name = raw["school.name"];
  const baseId = slug(name);
  const id = existingIds.has(baseId) ? `${baseId}-${raw.id}` : baseId;
  existingIds.add(id);
  const websiteRaw = raw["school.school_url"] || "";
  const website = websiteRaw ? (websiteRaw.startsWith("http") ? websiteRaw : `https://${websiteRaw}`) : null;
  const scorecard = schoolUrl(raw.id, name);
  institutions.push({
    id,
    unitid: raw.id,
    opeid: null,
    name,
    country: "United States",
    state: raw["school.state"],
    city: raw["school.city"],
    control: "Public",
    level: ["undergraduate"],
    website,
    apply_url: website,
    accreditation_status: "Accreditation must be confirmed in DAPIP or on the institution website",
    sevp_status: "F-1 eligibility and the exact campus must be confirmed in DHS School Search",
    public_data_status: `College Scorecard UNITID ${raw.id}`,
    legitimacy_label: "Needs Review",
    source_urls: {
      accreditation: "https://ope.ed.gov/dapip/",
      dapip: "https://ope.ed.gov/dapip/",
      sevp: `https://studyinthestates.dhs.gov/school-search?field_school_name_value=${encodeURIComponent(name)}`,
      scorecard
    },
    verified_at: checkedAt
  });
  costs.push({
    institution_id: id,
    year: "latest Scorecard release",
    degree_level: "undergraduate",
    tuition_fees_usd: raw["latest.cost.tuition.out_of_state"],
    living_estimate_usd: raw["latest.cost.roomboard.oncampus"] + 4500,
    insurance_usd: null,
    total_annual_cost_usd: estimatedTotal,
    cost_basis: "Screening estimate: College Scorecard out-of-state tuition plus on-campus room and board, with a $4,500 allowance for books and other expenses. Confirm the international student budget on the school website.",
    source_urls: [scorecard],
    verification_status: "screened"
  });
  outcomes.push({
    institution_id: id,
    graduation_rate: raw["latest.completion.rate_suppressed.overall"],
    retention_rate: raw["latest.student.retention_rate.four_year.full_time"],
    earnings_signal: raw["latest.earnings.10_yrs_after_entry.median"],
    debt_signal: raw["latest.aid.median_debt.completers.overall"],
    scorecard_year: "latest",
    limitations_note: "College Scorecard outcomes are institution-level signals, not program-specific or international-student guarantees."
  });
}

write("institutions.json", institutions);
write("costs.json", costs);
write("outcomes.json", outcomes);
console.log(`Expanded Path from ${existingUnitIds.size} to ${institutions.length} institutions using College Scorecard public data.`);
