// proxy.js  (CommonJS 버전)
const path = require("path");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 5501;

// 정적 파일 서비스 (현재 프로젝트 폴더 전체)
app.use(express.static(path.resolve(__dirname, ".")));

// /api 로 시작하는 요청은 백엔드로 프록시
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://api-ieum.store",
    changeOrigin: true,
    secure: false, // 사설 인증서면 false, 정상 인증서면 true여도 OK
  })
);

app.listen(PORT, () => {
  console.log(`프록시 기동: http://127.0.0.1:${PORT}/pages/signupPage.html`);
});
