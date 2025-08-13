document.addEventListener("DOMContentLoaded", () => {
  console.log("signup.js loaded"); // 로딩 확인용

  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("goVerify");
  const verifyNextBtn = document.getElementById("verifyNext");
  const codeInput = document.getElementById("code");

  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "./signupPage.html";
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("next clicked");
      window.location.href = "./home.html";
    });
  }

  if (codeInput && verifyNextBtn) {
    codeInput.addEventListener("input", () => {
      verifyNextBtn.disabled = codeInput.value.trim().length !== 6;
    });
  }
});
