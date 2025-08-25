document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 비밀번호 재설정 - 인증코드 페이지 로드됨");

  const codeInput = document.getElementById("code");
  const nextBtn = document.getElementById("verifyNext");
  const resendBtn = document.getElementById("resendCode");
  const backBtn = document.getElementById("backBtn");
  const verifyEmailSpan = document.getElementById("verifyEmail");
  const verifyBanner = document.getElementById("verifyBanner");

  const email = localStorage.getItem("resetEmail"); // 📌 비밀번호 재설정용 이메일 키

  if (!email) {
    alert("이메일 정보가 없습니다. 처음부터 다시 시도해 주세요.");
    window.location.href = "changePassword1.html";
    return;
  }

  // 이메일 화면에 표시
  if (verifyEmailSpan) verifyEmailSpan.textContent = email;

  // 입력 감지하여 다음 버튼 활성화
  codeInput.addEventListener("input", () => {
    nextBtn.disabled = codeInput.value.trim().length === 0;
    verifyBanner.classList.remove("show");
  });

  // 인증코드 확인 → 일치 시 다음 페이지로 이동
  nextBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const code = codeInput.value.trim();
    if (!code) return;

    try {
      console.log("📨 인증 코드 확인 요청:", email, code);

      const res = await fetch("https://api-ieum.store/api/v1/emails/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      console.log("✅ 인증 코드 응답:", data);

      if (!data.result) {
        codeInput.value = "";
        verifyBanner.textContent = "❌ 인증 코드가 일치하지 않습니다.";
        verifyBanner.classList.add("show");
        return;
      }

      // ✅ 인증 성공 → 비밀번호 변경 페이지로 이동
      window.location.href = "changePassword3.html";
    } catch (err) {
      console.error("🚨 인증 코드 확인 에러:", err);
      alert("⚠️ 서버 오류가 발생했습니다.");
    }
  });

  // 인증메일 재전송
  resendBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `https://api-ieum.store/api/v1/emails?email=${email}`,
        {
          method: "GET",
        }
      );

      if (res.ok) {
        alert("📨 인증 메일을 다시 전송했습니다.");
      } else {
        alert("❌ 인증 메일 재전송 실패");
      }
    } catch (err) {
      console.error("🚨 인증 메일 재전송 에러:", err);
      alert("⚠️ 인증 메일 재전송 오류");
    }
  });

  // 뒤로가기 버튼
  backBtn.addEventListener("click", () => {
    console.log("🔙 뒤로가기 클릭");
    window.location.href = "changePassword1.html";
  });
});
