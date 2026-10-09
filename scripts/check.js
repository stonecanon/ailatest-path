import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const institutions = read("data/institutions.json");
const costs = read("data/costs.json");
const programs = read("data/programs.json");
const outcomes = read("data/outcomes.json");
const reviews = read("data/review_summaries.json");
const experienceLinks = read("data/experience_links.json");
const sources = read("data/sources.json");

const errors = [];
const warnings = [];
const byId = new Map(institutions.map((item) => [item.id, item]));
const urlPattern = /^https?:\/\//;
const requiredExperiencePlatforms = ["Xiaohongshu", "YouTube", "Instagram", "TikTok", "Douyin"];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

for (const source of sources) {
  for (const key of ["id", "publisher", "url", "fields_used", "update_cadence", "ingestion_policy", "allowed_display_behavior", "notes_and_limitations"]) {
    assert(source[key] !== undefined && source[key] !== "", `Source ${source.id || "(missing id)"} is missing ${key}.`);
  }
  assert(urlPattern.test(source.url), `Source ${source.id} has an invalid URL.`);
}

for (const institution of institutions) {
  assert(institution.id && institution.name, "Institution is missing id or name.");
  assert(Number.isInteger(institution.unitid), `${institution.name} is missing numeric UNITID.`);
  assert(institution.verified_at, `${institution.name} is missing verified_at.`);

  const urls = institution.source_urls || {};
  for (const key of ["accreditation", "dapip", "sevp", "scorecard"]) {
    assert(urlPattern.test(urls[key] || ""), `${institution.name} is missing ${key} evidence URL.`);
  }

  if (institution.legitimacy_label === "Verified Legit") {
    assert(institution.opeid, `${institution.name} is missing OPEID.`);
    assert(/Accredited/i.test(institution.accreditation_status), `${institution.name} cannot be Verified Legit without accreditation evidence.`);
    assert(/SEVP/i.test(institution.sevp_status), `${institution.name} cannot be Verified Legit without SEVP evidence.`);
    assert(/Scorecard/i.test(institution.public_data_status), `${institution.name} cannot be Verified Legit without public data evidence.`);
  } else {
    assert(/Review|Do Not Recommend/i.test(institution.legitimacy_label), `${institution.name} needs a public review label.`);
  }
}

for (const cost of costs) {
  const institution = byId.get(cost.institution_id);
  assert(institution, `Cost record references unknown institution ${cost.institution_id}.`);
  assert(cost.year && cost.degree_level, `Cost record for ${cost.institution_id} needs year and degree level.`);
  assert(typeof cost.total_annual_cost_usd === "number", `Cost record for ${cost.institution_id} needs numeric total annual cost.`);
  assert(Array.isArray(cost.source_urls) && cost.source_urls.every((url) => urlPattern.test(url)), `Cost record for ${cost.institution_id} needs valid source URLs.`);
  warn(cost.verification_status === "verified" || cost.insurance_usd === null, `Cost record for ${cost.institution_id} should mark incomplete insurance checks.`);
}

for (const program of programs) {
  assert(byId.has(program.institution_id), `Program ${program.program_name} references unknown institution ${program.institution_id}.`);
  assert(program.official_url && urlPattern.test(program.official_url), `Program ${program.program_name} needs official_url.`);
  assert(Array.isArray(program.source_urls) && program.source_urls.every((url) => urlPattern.test(url)), `Program ${program.program_name} needs valid source URLs.`);
  if (program.stem_opt_eligible) {
    assert(program.stem_opt_basis, `Program ${program.program_name} needs STEM OPT basis.`);
    warn(Boolean(program.cip_code), `Program ${program.program_name} is STEM-tagged without a confirmed CIP code; page will show a note.`);
  }
}

for (const outcome of outcomes) {
  assert(byId.has(outcome.institution_id), `Outcome references unknown institution ${outcome.institution_id}.`);
  for (const key of ["graduation_rate", "retention_rate"]) {
    assert(typeof outcome[key] === "number" && outcome[key] >= 0 && outcome[key] <= 1, `Outcome ${outcome.institution_id} has invalid ${key}.`);
  }
}

for (const review of reviews) {
  assert(byId.has(review.institution_id), `Review references unknown institution ${review.institution_id}.`);
  assert(review.source_url && urlPattern.test(review.source_url), `Review for ${review.institution_id} needs source_url.`);
  assert(review.collected_at, `Review for ${review.institution_id} needs collected_at.`);
  assert(review.moderation_status, `Review for ${review.institution_id} needs moderation_status.`);
  assert((review.short_excerpt || "").split(/\s+/).filter(Boolean).length <= 12, `Review excerpt for ${review.institution_id} is too long.`);
}

const experienceIds = new Set();
for (const record of experienceLinks) {
  assert(byId.has(record.institution_id), `Experience links reference unknown institution ${record.institution_id}.`);
  assert(!experienceIds.has(record.institution_id), `Duplicate experience-link record for ${record.institution_id}.`);
  experienceIds.add(record.institution_id);
  assert(record.generated_at, `Experience links for ${record.institution_id} need generated_at.`);
  assert(Array.isArray(record.links) && record.links.length === requiredExperiencePlatforms.length, `Experience links for ${record.institution_id} need five platforms.`);
  const platforms = new Set((record.links || []).map((item) => item.platform));
  for (const platform of requiredExperiencePlatforms) {
    assert(platforms.has(platform), `Experience links for ${record.institution_id} are missing ${platform}.`);
  }
  for (const item of record.links || []) {
    assert(urlPattern.test(item.url || ""), `${item.platform} experience link for ${record.institution_id} is invalid.`);
    assert(item.search_query && item.content_type && item.access_note, `${item.platform} experience link for ${record.institution_id} is incomplete.`);
  }
}
assert(experienceIds.size === institutions.length, `Experience-link coverage is ${experienceIds.size}/${institutions.length} schools.`);

if (errors.length) {
  console.error("Validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

if (warnings.length) {
  console.warn("Validation warnings:");
  for (const item of warnings) console.warn(`- ${item}`);
}

console.log(`Validation passed: ${institutions.length} institutions, ${costs.length} costs, ${programs.length} programs, ${reviews.length} review summaries, ${experienceIds.size * requiredExperiencePlatforms.length} experience links.`);
