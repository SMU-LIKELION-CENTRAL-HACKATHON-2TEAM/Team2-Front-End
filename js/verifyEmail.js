document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DOM 완전히 로드됨");

  const codeInput = document.getElementById("code");
  const nextBtn = document.getElementById("verifyNext");
  const resendBtn = document.getElementById("resendCode");
  const backBtn = document.getElementById("backBtn");
  const verifyEmailSpan = document.getElementById("verifyEmail");
  const verifyBanner = document.getElementById("verifyBanner");

  const email = localStorage.getItem("signupEmail");
  const password = localStorage.getItem("signupPassword");
  const nickname = localStorage.getItem("signupNickname");

  if (!email || !password || !nickname) {
    alert("회원정보가 유실되었습니다. 다시 시작해주세요.");
    window.location.href = "signup.html";
    return;
  }

  verifyEmailSpan.textContent = email;

  codeInput.addEventListener("input", () => {
    nextBtn.disabled = codeInput.value.trim().length === 0;
    verifyBanner.classList.remove("show");
  });

  nextBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const code = codeInput.value.trim();
    if (!code) return;

    try {
      console.log("📨 인증 코드 확인 요청:", email, code);

      const verifyRes = await fetch(
        "https://api-ieum.store/api/v1/emails/codes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );

      const verifyData = await verifyRes.json();
      console.log("✅ 인증 코드 확인 응답:", verifyData);

      if (!verifyData.result) {
        codeInput.value = "";
        verifyBanner.textContent = "❌ 인증 코드가 일치하지 않습니다.";
        verifyBanner.classList.add("show");
        return;
      }

      // ✅ 회원가입 요청 시 confirmPassword 포함
      const signupRes = await fetch("https://api-ieum.store/api/v1/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          confirmPassword: password, // <-- 필수!
          nickname,
        }),
      });

      const signupData = await signupRes.json();
      console.log("📝 회원가입 응답:", signupData);

      if (signupData.isSuccess) {
        alert("🎉 회원가입이 완료되었습니다!");
        window.location.href = "signupComplete.html";
      } else {
        alert("❌ 회원가입 실패: " + signupData.message);
      }
    } catch (err) {
      console.error("🚨 네트워크 오류 또는 서버 오류 발생:", err);
      alert("⚠️ 서버 오류가 발생했습니다.");
    }
  });

  resendBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("📩 인증메일 재전송 요청");

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
      console.error("🚨 인증 메일 재전송 중 오류 발생:", err);
      alert("⚠️ 인증 메일 재전송 오류");
    }
  });

  backBtn.addEventListener("click", () => {
    console.log("🔙 뒤로가기 클릭");
    window.location.href = "signup.html";
  });
});
