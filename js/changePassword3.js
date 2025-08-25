document.addEventListener("DOMContentLoaded", () => {
  console.log("🔐 비밀번호 변경 페이지 로드됨");

  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const submitBtn = document.getElementById("submitBtn");
  const backBtn = document.getElementById("backBtn");
  const passwordBanner = document.getElementById("passwordBanner");

  // 토큰 확인
  const token = localStorage.getItem("resetToken");
  if (!token) {
    alert("인증 정보가 없습니다. 처음부터 다시 시도해 주세요.");
    window.location.href = "changePassword1.html";
    return;
  }

  // 유효성 검사 함수
  function validatePasswords() {
    const pw = newPasswordInput.value.trim();
    const cpw = confirmPasswordInput.value.trim();
    if (pw === "" || cpw === "") {
      passwordBanner.textContent = "";
      submitBtn.disabled = true;
      return;
    }

    if (pw !== cpw) {
      passwordBanner.textContent = "❌ 비밀번호가 일치하지 않습니다.";
      passwordBanner.classList.add("show");
      submitBtn.disabled = true;
    } else {
      passwordBanner.textContent = "";
      passwordBanner.classList.remove("show");
      submitBtn.disabled = false;
    }
  }

  newPasswordInput.addEventListener("input", validatePasswords);
  confirmPasswordInput.addEventListener("input", validatePasswords);

  // 비밀번호 변경 요청
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value.trim();

    try {
      const res = await fetch(
        "https://api-ieum.store/api/v1/members/me/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newPassword: newPassword,
            confirmPassword: newPassword,
          }),
        }
      );

      const data = await res.json();
      console.log("🔁 비밀번호 변경 응답:", data);

      if (data.isSuccess) {
        alert("🎉 비밀번호가 성공적으로 변경되었습니다.");
        window.location.href = "changePassword4.html";
      } else {
        alert("❌ 비밀번호 변경 실패: " + data.message);
      }
    } catch (err) {
      console.error("🚨 네트워크 오류:", err);
      alert("⚠️ 비밀번호 변경 중 오류 발생");
    }
  });

  backBtn.addEventListener("click", () => {
    console.log("🔙 뒤로가기 클릭");
    window.location.href = "changePassword1.html";
  });
});
