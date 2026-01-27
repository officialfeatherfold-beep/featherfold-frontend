export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");

  const base = "https://featherfold.in";

  const urls = ["/", "/bedsheets", "/collections", "/about", "/contact"];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url>
  <loc>${base}${u}</loc>
  <changefreq>weekly</changefreq>
  <priority>${u === "/" ? "1.0" : "0.8"}</priority>
</url>`
  )
  .join("")}
</urlset>`;

  res.status(200).send(xml);
}
