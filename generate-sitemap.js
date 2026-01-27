const fs = require("fs");
import fetch from "node-fetch";

const SUPABASE_URL = "https://wehhvavlbhdbcmgvdaxj.supabase.co";
const SUPABASE_KEY = "sb_publishable_HI7wHyO6rFnczXvvEGoldg_GF-Hd2DV";

const SITE_URL = "https://texasdentalhub.com";

async function generateSitemap() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/clinics?select=city&active=eq.true`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const rows = await res.json();

  // Unique cities → slug
  const cities = [
    ...new Set(
      rows
        .map(r => (r.city || "").trim().toLowerCase())
        .filter(Boolean)
    )
  ];

  const urls = [];

  // Homepage
  urls.push(`${SITE_URL}/`);

  // City pages
  cities.forEach(city => {
    const slug = city.replace(/[^a-z0-9]+/g, "-");
    urls.push(`${SITE_URL}/?city=${slug}`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `
  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join("")}
</urlset>
`;

  fs.writeFileSync("sitemap.xml", xml.trim());
  console.log(`✅ Sitemap generated with ${urls.length} URLs`);
}

generateSitemap();
