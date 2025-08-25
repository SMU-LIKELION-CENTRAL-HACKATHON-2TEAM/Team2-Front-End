document.addEventListener("DOMContentLoaded", () => {
  const doneBtn = document.getElementById("doneBtn"); // 버튼 id 명확히

  doneBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    // 로그인 화면 또는 홈 화면으로 이동
    window.location.href = "./login.html";
  });
});
