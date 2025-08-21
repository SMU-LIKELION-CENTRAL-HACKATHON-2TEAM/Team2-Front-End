// /api/img.js  — Vercel (Node 18)
export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send("url required");

  try {
    // 원본 요청
    const r = await fetch(url, { redirect: "follow" });

    // 1) 원본이 곧 이미지면 그대로 스트리밍
    const ct = r.headers.get("content-type") || "";
    if (ct.startsWith("image/")) {
      res.setHeader("Content-Type", ct);
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
      const buf = Buffer.from(await r.arrayBuffer());
      return res.status(200).send(buf);
    }

    // 2) HTML이면 og:image / twitter:image 추출해서 302로 리다이렉트
    const html = await r.text();
    const m1 = html.match(
      /<meta[^>]+property=['"]og:image['"][^>]+content=['"]([^'"]+)['"]/i
    );
    const m2 = html.match(
      /<meta[^>]+name=['"]twitter:image(?::src)?['"][^>]+content=['"]([^'"]+)['"]/i
    );

    const imgUrl = (m1 && m1[1]) || (m2 && m2[1]);
    if (imgUrl) {
      // 절대 URL 보정
      const absolute = new URL(imgUrl, url).toString();
      return res.redirect(302, absolute);
    }

    return res.status(404).send("no image");
  } catch (e) {
    return res.status(500).send("proxy error");
  }
}
