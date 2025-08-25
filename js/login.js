// login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        "https://api-ieum.store/api/v1/members/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.isSuccess) {
        // JWT 토큰 저장 (예: localStorage)
        localStorage.setItem("accessToken", data.result.jwtAccessToken);
        localStorage.setItem("refreshToken", data.result.jwtRefreshToken);

        alert("로그인 성공!");
        // 예시: 로그인 후 메인 페이지로 이동
        window.location.href = "./pages/loadMapPage.html";
      } else {
        alert(`로그인 실패: ${data.message || "다시 시도해주세요."}`);
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  });
});
