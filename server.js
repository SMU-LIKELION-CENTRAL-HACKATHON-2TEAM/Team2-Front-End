// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

// 카카오 이미지 검색 프록시
app.get("/api/kakao/image", async (req, res) => {
  const q = req.query.q || "";
  const url = `https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(
    q
  )}&size=1&sort=accuracy`;

  try {
    const r = await fetch(url, {
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
    });

    const data = await r.json();
    const doc = data?.documents?.[0];

    // 브라우저에서 호출 가능하도록 CORS 허용
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      thumb: doc?.thumbnail_url || null,
      image: doc?.image_url || null,
      source: doc?.display_sitename || null,
      link: doc?.doc_url || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "이미지 검색 실패" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Proxy server on http://localhost:${PORT}`)
);
