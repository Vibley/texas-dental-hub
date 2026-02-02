const fs = require("fs");

const SITE_URL = "https://texasdentalhub.com";

const urls = [
  `${SITE_URL}/`
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `
  <url>
    <loc>${u}</loc>
  </url>`).join("")}
</urlset>`;

fs.writeFileSync("sitemap.xml", xml.trim());
console.log("✅ Clean sitemap.xml generated");
