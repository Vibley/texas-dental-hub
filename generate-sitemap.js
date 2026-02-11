const fs = require("fs");

const SITE_URL = "https://texasdentalhub.com";
const OUTPUT_PATH = "docs/sitemap-clinics.xml";

async function generate() {
  const res = await fetch(
    "https://wehhvavlbhdbcmgvdaxj.supabase.co/rest/v1/clinics?select=name,city",
    {
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
    }
  );

  const clinics = await res.json();

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const urls = clinics.map(c => {
    const citySlug = slugify(c.city) + "-tx";
    const clinicSlug = slugify(c.name);

    return `${SITE_URL}/dentists/${citySlug}/clinic/${clinicSlug}`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`).join("")}
</urlset>`;

  fs.writeFileSync(OUTPUT_PATH, sitemap.trim());
  console.log("✅ sitemap-clinics.xml generated");
}

generate();
