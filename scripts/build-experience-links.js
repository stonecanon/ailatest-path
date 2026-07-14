import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const institutions = JSON.parse(fs.readFileSync(path.join(root, "data", "institutions.json"), "utf8"));
const generatedAt = new Date().toISOString().slice(0, 10);

function encoded(value) {
  return encodeURIComponent(value).replaceAll("%20", "+");
}

function encodedPath(value) {
  return encodeURIComponent(value);
}

const records = institutions.map((school) => {
  const location = [school.city, school.state].filter(Boolean).join(" ");
  const englishQuery = `${school.name} ${location} student experience campus life`.replace(/\s+/g, " ").trim();
  const chineseQuery = `${school.name} ${location} 留学 体验`.replace(/\s+/g, " ").trim();

  return {
    institution_id: school.id,
    generated_at: generatedAt,
    links: [
      {
        platform: "Xiaohongshu",
        label: "小红书",
        content_type: "photo_video",
        search_query: chineseQuery,
        url: `https://www.xiaohongshu.com/search_result/?keyword=${encoded(chineseQuery)}`,
        access_note: "Search results vary by account, region, and time."
      },
      {
        platform: "YouTube",
        label: "YouTube",
        content_type: "video",
        search_query: englishQuery,
        url: `https://www.youtube.com/results?search_query=${encoded(englishQuery)}`,
        access_note: "Public video search; availability varies by region."
      },
      {
        platform: "Instagram",
        label: "Instagram",
        content_type: "photo_video",
        search_query: `${school.name} ${location}`.trim(),
        url: `https://www.instagram.com/explore/search/keyword/?q=${encoded(`${school.name} ${location}`.trim())}`,
        access_note: "Instagram may require sign-in before showing results."
      },
      {
        platform: "TikTok",
        label: "TikTok",
        content_type: "short_video",
        search_query: englishQuery,
        url: `https://www.tiktok.com/search?q=${encoded(englishQuery)}`,
        access_note: "Search results vary by account, region, and time."
      },
      {
        platform: "Douyin",
        label: "抖音",
        content_type: "short_video",
        search_query: chineseQuery,
        url: `https://www.douyin.com/search/${encodedPath(chineseQuery)}?type=general`,
        access_note: "Douyin may require sign-in or the mobile app."
      }
    ]
  };
});

fs.writeFileSync(
  path.join(root, "data", "experience_links.json"),
  `${JSON.stringify(records, null, 2)}\n`
);

console.log(`Built ${records.length} school experience-link records (${records.length * 5} platform links).`);
