// api/og.js
// Node 18+ (Vercel 기본)에서 fetch 사용 가능
export default async function handler(req, res) {
  try {
    const pageUrl = (req.query.url || "").toString();

    // 1) 간단한 검증
    let target;
    try {
      target = new URL(pageUrl);
      if (!/^https?:$/.test(target.protocol))
        throw new Error("only http/https");
    } catch {
      res.status(400).json({ error: "Invalid url" });
      return;
    }

    // 2) HTML 가져오기 (봇 차단 줄이려고 UA만 살짝 바꿔줌)
    const resp = await fetch(target.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!resp.ok) {
      res.status(resp.status).json({ error: `fetch failed ${resp.status}` });
      return;
    }

    const html = await resp.text();

    // 3) 메타 태그 단순 파서 (정규식으로 content 뽑기)
    const pick = (re) => {
      const m = html.match(re);
      return m?.groups?.content?.trim();
    };

    // og:image / twitter:image / og:title 등 시도
    let ogImage =
      pick(
        /<meta[^>]+property=["']og:image["'][^>]+content=["'](?<content>[^"']+)["']/i
      ) ||
      pick(
        /<meta[^>]+name=["']og:image["'][^>]+content=["'](?<content>[^"']+)["']/i
      ) ||
      pick(
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["'](?<content>[^"']+)["']/i
      );

    const ogTitle =
      pick(
        /<meta[^>]+property=["']og:title["'][^>]+content=["'](?<content>[^"']+)["']/i
      ) ||
      pick(
        /<meta[^>]+name=["']og:title["'][^>]+content=["'](?<content>[^"']+)["']/i
      ) ||
      pick(/<title[^>]*>(?<content>[^<]+)<\/title>/i);

    // 상대경로면 절대경로로
    const toAbs = (u) => {
      try {
        return new URL(u, target).toString();
      } catch {
        return null;
      }
    };
    if (ogImage) ogImage = toAbs(ogImage);

    // 4) JSON 응답 + 캐시(에지 캐시)
    res.setHeader(
      "Cache-Control",
      "s-maxage=86400, stale-while-revalidate=604800"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      ok: true,
      page: target.toString(),
      title: ogTitle || null,
      image: ogImage || null,
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
