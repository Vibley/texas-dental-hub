const fs = require("fs");
const fetch = require("node-fetch");

const SITE_URL = "https://texasdentalhub.com";
const SUPABASE_URL = "https://wehhvavlbhdbcmgvdaxj.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

(async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/clinics?select=name,city`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  const clinics = await res.json();

  const cities = new Set();
  const clinicUrls = [];

  clinics.forEach(c => {
    if (c.city) {
      cities.add(slugify(c.city));
    }
    if (c.name) {
      clinicUrls.push(`${SITE_URL}/?clinic=${slugify(c.name)}`);
    }
  });

  const urls = [
    `${SITE_URL}/`,
    ...[...cities].map(c => `${SITE_URL}/?city=${c}`),
    ...clinicUrls
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `
  <url>
    <loc>${u}</loc>
  </url>`).join("")}
</urlset>`;

  fs.writeFileSync("sitemap.xml", xml.trim());
  console.log("✅ sitemap.xml generated");
})();
