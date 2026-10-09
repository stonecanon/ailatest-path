# AILatest Path: Affordable Legit U.S. Colleges

## 1. Product Direction

AILatest Path is a route-planning and guide product for global international students who want to find affordable, legitimate, outcome-aware study options in the United States.

The first version should not be a generic study-abroad blog or a marketing landing page. It should start as a searchable school database with filters, evidence, and clear caveats.

Core positioning:

- Help students find U.S. colleges that are affordable and not diploma mills.
- Prioritize real annual cost, legitimacy, STEM availability, and outcome signals.
- Explain information gaps that many international students do not know how to verify.
- Provide English-first pages for global users, with Chinese summaries and route explanations for Chinese-speaking users.
- Avoid promising admission, visa approval, OPT approval, immigration outcomes, or employment results.

## 2. MVP Scope

The MVP focuses on U.S. schools only.

Included:

- U.S. undergraduate institutions with broad official-data coverage.
- A curated pilot set of STEM master's programs.
- School list, search, filters, and school detail pages.
- Basic application-route information from official school pages.
- Cost, legitimacy, STEM, and outcome indicators.
- Summarized public user feedback from platforms such as YouTube and Reddit, with source links.

Excluded for MVP:

- Australia and other countries.
- Personalized admissions prediction.
- Visa, immigration, or legal advice.
- Paid consulting workflows.
- User accounts, saved lists, or CRM features.
- Bulk republishing of raw third-party comments.

Australia can be added later with CRICOS and TEQSA-based verification.

## 3. Target Audience

Primary audience:

- Global international students looking for lower-cost U.S. study options.
- Students who care about STEM, OPT potential, employability, and total cost.
- Students who may not know how to distinguish legitimate but less famous schools from questionable institutions.

Secondary audience:

- Chinese-speaking students and families who need clear Chinese explanations of U.S. school legitimacy, costs, application paths, language requirements, and employment-related tradeoffs.

## 4. Legitimacy Gate

A school should only be shown as "verified" when it passes all three gates:

1. Accreditation gate
   - Institution appears in DAPIP or another official accreditation source.
   - Store accreditation agency, status, source URL, and verification date.

2. International student gate
   - Institution is SEVP-certified or otherwise officially eligible to enroll F-1 international students.
   - Store SEVP status, campus/location details if available, source URL, and verification date.

3. Public data gate
   - Institution appears in College Scorecard and/or IPEDS.
   - Store UNITID, OPEID when available, and source URL.

Public labels:

- `Verified Legit`: passes all three gates.
- `Needs Review`: missing one source or conflicting source data.
- `Do Not Recommend`: failed gate, inactive accreditation, missing international-student eligibility, or major warning.

The site should make the evidence visible instead of asking users to trust the label.

## 5. Affordability & Value Model

The primary affordability metric is estimated annual total cost.

Annual total cost should include:

- Tuition and required fees.
- Room and board or living-cost estimate.
- Required insurance when available.
- Other mandatory school-level fees when available.

Cost labels:

- `Very Low Cost`: verified annual total cost <= USD 25,000.
- `Low Cost`: verified annual total cost <= USD 35,000.
- `Moderate Cost`: verified annual total cost <= USD 50,000.
- `Needs Manual Cost Check`: official current-year cost is missing or incomplete.

Value should not be only "cheap." Secondary signals should include:

- STEM or STEM-adjacent program availability.
- STEM OPT eligibility when supported by CIP code evidence.
- Graduation and retention signals.
- College Scorecard earnings/debt signals.
- Location and nearby job-market context.
- Public official employment reports when available.

The value score should be explainable. It should not promise salary, job placement, visa success, or immigration outcomes.

## 6. Data Sources

Primary U.S. sources:

- College Scorecard: institution data, costs, student outcomes, field-of-study data.
- IPEDS / NCES: institutional metadata, tuition, enrollment, completion, finance, and other official education statistics.
- DAPIP: accreditation and institutional eligibility evidence.
- SEVP / Study in the States School Search: international-student school eligibility.
- DHS STEM OPT eligible CIP code list: STEM OPT-related program classification.
- Official school websites: application flow, tuition pages, program pages, admission requirements, English requirements, conditional admission or language pathway details.

Secondary sources:

- Official state or university employment reports.
- Public ranking signals, used only as context and not as the main recommendation basis.
- Public Reddit or YouTube discussion pages, summarized with source links and limited quotation.

Every source should be registered in `data/sources.json` with:

- source id
- publisher
- URL
- fields used
- update cadence
- ingestion policy
- allowed display behavior
- notes and limitations

## 7. Data Model

Recommended core files:

### `data/institutions.json`

Fields:

- `id`
- `unitid`
- `opeid`
- `name`
- `country`
- `state`
- `city`
- `control`
- `level`
- `website`
- `apply_url`
- `accreditation_status`
- `sevp_status`
- `source_urls`
- `verified_at`

### `data/costs.json`

Fields:

- `institution_id`
- `year`
- `degree_level`
- `tuition_fees_usd`
- `living_estimate_usd`
- `insurance_usd`
- `total_annual_cost_usd`
- `cost_basis`
- `source_urls`
- `verification_status`

### `data/programs.json`

Fields:

- `institution_id`
- `degree_level`
- `program_name`
- `cip_code`
- `stem_opt_eligible`
- `delivery`
- `official_url`
- `admission_url`
- `english_requirement_summary`
- `conditional_admission_available`
- `source_urls`

### `data/outcomes.json`

Fields:

- `institution_id`
- `graduation_rate`
- `retention_rate`
- `earnings_signal`
- `debt_signal`
- `scorecard_year`
- `limitations_note`

### `data/review_summaries.json`

Fields:

- `institution_id`
- `platform`
- `topic`
- `sentiment`
- `summary`
- `short_excerpt`
- `source_url`
- `collected_at`
- `moderation_status`

## 8. User Experience

The homepage should immediately show the usable school search interface.

Primary filters:

- Annual total cost.
- Tuition range.
- Degree level: undergraduate, master's.
- STEM availability.
- STEM OPT eligible program evidence.
- State or region.
- Public/private.
- Accreditation status.
- SEVP/F-1 eligibility.
- Graduation rate.
- Earnings/debt signal.
- Conditional admission or English pathway.
- Online/on-campus availability if relevant.

School card should show:

- School name and location.
- Estimated annual total cost.
- Legitimacy badges.
- STEM/program badges.
- Main value signals.
- Data freshness.
- "View evidence" link.

School detail page should show:

- Cost breakdown.
- Accreditation evidence.
- SEVP/F-1 eligibility evidence.
- Application and admission links.
- English requirement or conditional admission notes.
- STEM/program information.
- Outcome signals and caveats.
- Public review summary with source links.
- Chinese route summary block.

## 9. Review Summary Policy

The site should not republish large volumes of raw YouTube, Reddit, or forum comments.

Allowed first-version behavior:

- Summarize themes from public discussion.
- Link back to original sources.
- Use only short excerpts when necessary.
- Store collection date and platform.
- Clearly mark summaries as public discussion, not verified facts.
- Avoid private, deleted, login-only, or restricted content.

Recommended public categories:

- Cost complaints or praise.
- Campus safety and city life.
- International student support.
- Career services and internships.
- Faculty/program quality.
- Housing and transportation.
- Red flags or recurring concerns.

## 10. Build & Validation Plan

Recommended project pattern:

- Static generated site similar to AILatest Major.
- Plain data files under `data/`.
- Node scripts for data import, validation, and static build.
- Cloudflare Pages deployment.

Suggested scripts:

- `npm run import:scorecard`
- `npm run import:ipeds`
- `npm run import:dapip`
- `npm run import:sevp`
- `npm run import:manual-programs`
- `npm run summarize:reviews`
- `npm run check`
- `npm run build`
- `npm run dev`

Validation rules:

- No institution can receive `Verified Legit` without passing all three legitimacy gates.
- No cost badge can appear without source-backed cost fields.
- No STEM OPT badge can appear without CIP/source evidence.
- No review summary can appear without source URL and collection date.
- No page should imply guaranteed admission, visa approval, OPT approval, employment, or immigration outcome.
- Every public school detail page must include source links and data freshness.

## 11. Acceptance Criteria

MVP is acceptable when:

- Users can search and filter affordable legitimate U.S. schools.
- Each verified school shows evidence for accreditation, SEVP eligibility, and official data presence.
- Cost ranking uses annual total cost, not just tuition.
- STEM and outcome signals are visible but carefully caveated.
- At least a pilot set of STEM master's programs is manually verified from official program pages.
- Review summaries are source-linked and do not bulk reproduce raw comments.
- English-first pages include concise Chinese route summaries.
- Static build produces list pages, detail pages, sitemap, robots file, and deployable assets.

## 12. Assumptions

- Target domain: `path.ailatest.org`.
- MVP country: United States.
- Future expansion: Australia.
- UI language: English first, Chinese support for explanation blocks.
- Product shape: school database and filters first, guide articles later.
- Recommendation principle: affordable + legitimate + outcome-aware, not cheap-only.
- Legal posture: informational education guide, not legal, immigration, admissions, or career advice.
