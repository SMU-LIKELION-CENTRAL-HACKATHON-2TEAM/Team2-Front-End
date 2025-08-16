document.addEventListener("DOMContentLoaded", () => {
  console.log("changePassword3.js loaded"); // 로딩 확인용

  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("goVerify"); // ID로 정확히 지정
  const verifyNextBtn = document.getElementById("verifyNext");
  const codeInput = document.getElementById("code");

  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "./changePassword2.html";
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("next clicked");
      window.location.href = "./changePassword4.html";
    });
  }

  if (codeInput && verifyNextBtn) {
    codeInput.addEventListener("input", () => {
      verifyNextBtn.disabled = codeInput.value.trim().length !== 6;
    });
  }
});
