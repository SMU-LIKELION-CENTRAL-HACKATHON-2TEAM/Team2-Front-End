const BASE_URL = "https://api-ieum.store"; // ← 백엔드 주소

const emailInput = document.getElementById("email");
const nextBtn = document.getElementById("goVerify");
const backBtn = document.getElementById("backBtn");

// 📌 이메일 형식 유효성 검사
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// 📌 이메일 인증 요청 함수
async function sendVerificationEmail(email) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/emails?email=${email}`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("서버 응답 실패");
    const data = await res.json();

    if (data.isSuccess) {
      alert("📨 인증번호가 전송되었습니다.");
      return true;
    } else {
      alert("이메일 인증 요청 실패: " + data.message);
      return false;
    }
  } catch (err) {
    alert("이메일 인증 요청에 실패했습니다.");
    console.error("이메일 인증 오류:", err);
    return false;
  }
}

// 📌 다음 버튼 클릭 이벤트
nextBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();

  // 유효성 검사
  if (!email) {
    alert("이메일을 입력해 주세요.");
    return;
  }

  if (!isValidEmail(email)) {
    alert("유효한 이메일 주소를 입력해 주세요.");
    return;
  }

  // 인증 메일 보내기
  const isSent = await sendVerificationEmail(email);
  if (!isSent) return;

  // 인증 코드 입력 페이지로 이동 + 이메일 저장
  localStorage.setItem("resetEmail", email);
  window.location.href = "./changePassword2.html";
});

// 📌 뒤로가기 버튼
backBtn.addEventListener("click", () => {
  history.back();
});
