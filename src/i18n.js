const translations = {
  en: {
    accreditation: "Accreditation",
    annualTotalCost: "Annual total cost",
    any: "Any",
    chineseRouteSummary: "Chinese route summary",
    contact: "Contact",
    contactHelp: "For school data corrections, include the school name, field to correct, official source URL, and publication date.",
    contactIntro: "Send data corrections, source updates, and product feedback to our shared inbox.",
    contactTitle: "Contact AILATEST Path",
    costBreakdown: "Cost Breakdown",
    costNeedsReview: "Cost needs review",
    debtSignal: "Median debt",
    degreeLevel: "Degree level",
    earningsSignal: "Median earnings",
    estimatedAnnualTotal: "Estimated annual total",
    experienceCaveat: "These are live platform searches, not verified school facts. Results can change and some platforms may require sign-in.",
    experienceIntro: "Open a focused search for this school on public photo and video platforms.",
    emailUs: "Email us",
    eyebrow: "U.S. school database",
    footerGuide: "Informational education guide only. Always verify official school and government information before making decisions.",
    footerNoPromise: "No admission, visa, OPT, employment, or immigration outcome is promised. Verify official information before applying.",
    findExperiences: "Find experiences",
    graduation: "Graduation rate",
    homeIntro: "Compare cost and verify school legitimacy before you apply.",
    homeTitle: "Compare U.S. colleges.",
    higherCost: "Higher Cost",
    insurance: "Insurance",
    legitimacyEvidence: "Legitimacy Evidence",
    livingEstimate: "Living estimate",
    lowCost: "Low Cost",
    masters: "Master's",
    moderateCost: "Moderate Cost",
    needsCheck: "Needs check",
    needsManualCostCheck: "Cost needs review",
    needsReview: "Needs review",
    openLink: "Open",
    photoVideo: "Photos and video",
    outcomeSignals: "Outcomes",
    programs: "Programs",
    programsPending: "Program details are not added yet for this database record.",
    publicData: "Public Data",
    publicDiscussion: "Public Discussion Summary",
    publicDiscussionPending: "Public discussion summary is not added yet.",
    privacyHelp: "Do not email passwords, verification codes, passport details, or other sensitive personal information.",
    privacyNote: "Privacy note",
    resultsNote: "Complete records are marked verified. Screened records should be checked on official school pages before you apply.",
    retention: "First-year retention",
    retentionHelp: "Share of first-time students who return after their first year.",
    search: "Search",
    searchPlaceholder: "School, city, state, program",
    searchSchools: "Search schools",
    schoolDatabase: "School Database",
    state: "State",
    studentExperiences: "Student experiences",
    stemAvailable: "STEM available",
    stemOptEvidence: "STEM OPT CIP evidence",
    tuitionAndFees: "Tuition and fees",
    shortVideo: "Short video",
    undergraduate: "Undergraduate",
    verified: "Verified",
    verifiedLegit: "Verified Legit",
    verifiedOnly: "Verified Legit only",
    veryLowCost: "Very Low Cost",
    video: "Video"
  },
  zh: {
    accreditation: "认证",
    annualTotalCost: "年度总成本",
    any: "不限",
    chineseRouteSummary: "中文路线摘要",
    contact: "联系",
    contactHelp: "院校数据纠错请附学校名称、待纠正字段、官方来源链接和发布日期。",
    contactIntro: "通过统一邮箱提交数据纠错、来源更新与产品反馈。",
    contactTitle: "联系 AILATEST Path",
    costBreakdown: "成本拆分",
    costNeedsReview: "成本需核对",
    debtSignal: "中位数债务",
    degreeLevel: "学位层级",
    earningsSignal: "中位数收入",
    estimatedAnnualTotal: "预计年度总成本",
    experienceCaveat: "这些链接打开平台的实时搜索结果，不代表已核验的学校事实。结果会变化，部分平台需要登录。",
    experienceIntro: "快速查看这所学校在主流图文和视频平台上的公开体验内容。",
    emailUs: "发送邮件",
    eyebrow: "美国院校数据库",
    footerGuide: "本页仅作教育信息参考。做决定前请核对学校和政府官方信息。",
    footerNoPromise: "本页不承诺录取、签证、OPT、就业或移民结果。申请前请核对官方信息。",
    findExperiences: "查找体验",
    graduation: "毕业率",
    homeIntro: "比较费用，申请前核对学校资质。",
    homeTitle: "比较美国院校。",
    higherCost: "较高成本",
    insurance: "保险",
    legitimacyEvidence: "正规性证据",
    livingEstimate: "生活费估算",
    lowCost: "低成本",
    masters: "硕士",
    moderateCost: "中等成本",
    needsCheck: "需核查",
    needsManualCostCheck: "成本需核对",
    needsReview: "需核对",
    openLink: "打开",
    photoVideo: "图文 / 视频",
    outcomeSignals: "毕业结果",
    programs: "项目",
    programsPending: "这条数据库记录暂未补充专业详情。",
    publicData: "公开数据",
    publicDiscussion: "公开讨论摘要",
    publicDiscussionPending: "暂未补充公开讨论摘要。",
    privacyHelp: "请勿通过邮件发送密码、验证码、护照信息或其他敏感个人信息。",
    privacyNote: "隐私提示",
    resultsNote: "完整记录会标为已核验；初筛记录请在申请前到学校官网核对。",
    retention: "第一年保留率",
    retentionHelp: "第一年后继续在校就读的学生比例。",
    search: "搜索",
    searchPlaceholder: "学校、城市、州、项目",
    searchSchools: "搜索学校",
    schoolDatabase: "学校数据库",
    state: "州",
    studentExperiences: "学生真实体验",
    stemAvailable: "有 STEM",
    stemOptEvidence: "STEM OPT CIP 证据",
    tuitionAndFees: "学费和杂费",
    shortVideo: "短视频",
    undergraduate: "本科",
    verified: "已核验",
    verifiedLegit: "正规已核验",
    verifiedOnly: "只看正规已核验",
    veryLowCost: "很低成本",
    video: "视频"
  }
};

const stateNames = {
  AL: { en: "Alabama", zh: "阿拉巴马州" },
  AK: { en: "Alaska", zh: "阿拉斯加州" },
  AZ: { en: "Arizona", zh: "亚利桑那州" },
  AR: { en: "Arkansas", zh: "阿肯色州" },
  CA: { en: "California", zh: "加利福尼亚州" },
  CO: { en: "Colorado", zh: "科罗拉多州" },
  CT: { en: "Connecticut", zh: "康涅狄格州" },
  DE: { en: "Delaware", zh: "特拉华州" },
  DC: { en: "District of Columbia", zh: "哥伦比亚特区" },
  FL: { en: "Florida", zh: "佛罗里达州" },
  GA: { en: "Georgia", zh: "佐治亚州" },
  HI: { en: "Hawaii", zh: "夏威夷州" },
  ID: { en: "Idaho", zh: "爱达荷州" },
  IL: { en: "Illinois", zh: "伊利诺伊州" },
  IN: { en: "Indiana", zh: "印第安纳州" },
  IA: { en: "Iowa", zh: "爱荷华州" },
  KS: { en: "Kansas", zh: "堪萨斯州" },
  KY: { en: "Kentucky", zh: "肯塔基州" },
  LA: { en: "Louisiana", zh: "路易斯安那州" },
  ME: { en: "Maine", zh: "缅因州" },
  MD: { en: "Maryland", zh: "马里兰州" },
  MA: { en: "Massachusetts", zh: "马萨诸塞州" },
  MI: { en: "Michigan", zh: "密歇根州" },
  MN: { en: "Minnesota", zh: "明尼苏达州" },
  MS: { en: "Mississippi", zh: "密西西比州" },
  MO: { en: "Missouri", zh: "密苏里州" },
  MT: { en: "Montana", zh: "蒙大拿州" },
  NE: { en: "Nebraska", zh: "内布拉斯加州" },
  NV: { en: "Nevada", zh: "内华达州" },
  NH: { en: "New Hampshire", zh: "新罕布什尔州" },
  NJ: { en: "New Jersey", zh: "新泽西州" },
  NM: { en: "New Mexico", zh: "新墨西哥州" },
  NY: { en: "New York", zh: "纽约州" },
  NC: { en: "North Carolina", zh: "北卡罗来纳州" },
  ND: { en: "North Dakota", zh: "北达科他州" },
  OH: { en: "Ohio", zh: "俄亥俄州" },
  OK: { en: "Oklahoma", zh: "俄克拉荷马州" },
  OR: { en: "Oregon", zh: "俄勒冈州" },
  PA: { en: "Pennsylvania", zh: "宾夕法尼亚州" },
  RI: { en: "Rhode Island", zh: "罗得岛州" },
  SC: { en: "South Carolina", zh: "南卡罗来纳州" },
  SD: { en: "South Dakota", zh: "南达科他州" },
  TN: { en: "Tennessee", zh: "田纳西州" },
  TX: { en: "Texas", zh: "得克萨斯州" },
  UT: { en: "Utah", zh: "犹他州" },
  VT: { en: "Vermont", zh: "佛蒙特州" },
  VA: { en: "Virginia", zh: "弗吉尼亚州" },
  WA: { en: "Washington", zh: "华盛顿州" },
  WV: { en: "West Virginia", zh: "西弗吉尼亚州" },
  WI: { en: "Wisconsin", zh: "威斯康星州" },
  WY: { en: "Wyoming", zh: "怀俄明州" }
};

const storageKey = "ailatest-path-language";

function getLanguage() {
  return localStorage.getItem(storageKey) === "zh" ? "zh" : "en";
}

function translate(key, language = getLanguage()) {
  return translations[language]?.[key] || translations.en[key] || key;
}

function applyLanguage(language) {
  const normalized = language === "zh" ? "zh" : "en";
  localStorage.setItem(storageKey, normalized);
  document.documentElement.lang = normalized === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n, normalized);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", translate(element.dataset.i18nPlaceholder, normalized));
  });

  document.querySelectorAll("[data-state-code]").forEach((option) => {
    const code = option.dataset.stateCode;
    const name = stateNames[code]?.[normalized] || code;
    option.textContent = `${name} (${code})`;
  });

  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    button.textContent = normalized === "zh" ? "English" : "中文";
    button.setAttribute("aria-label", normalized === "zh" ? "Switch to English" : "切换到中文");
  });

  window.dispatchEvent(new CustomEvent("path-language-change", { detail: { language: normalized } }));
}

window.pathI18n = {
  applyLanguage,
  getLanguage,
  t: translate
};

document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(getLanguage() === "zh" ? "en" : "zh");
  });
});

applyLanguage(getLanguage());
