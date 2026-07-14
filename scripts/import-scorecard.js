import fs from "node:fs";
import path from "node:path";

const institutions = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/institutions.json"), "utf8"));
const fields = [
  "id",
  "school.name",
  "school.city",
  "school.state",
  "latest.cost.attendance.academic_year",
  "latest.completion.rate_suppressed.overall",
  "latest.student.retention_rate.four_year.full_time",
  "latest.earnings.10_yrs_after_entry.median",
  "latest.aid.median_debt.completers.overall"
].join(",");

const apiKey = process.env.SCORECARD_API_KEY || "DEMO_KEY";
const results = [];

for (const institution of institutions) {
  const url = `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${apiKey}&id=${institution.unitid}&fields=${fields}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Scorecard API failed for ${institution.name}: ${response.status}`);
  const json = await response.json();
  results.push(json.results?.[0] || { id: institution.unitid, error: "No result" });
}

console.log(JSON.stringify(results, null, 2));
