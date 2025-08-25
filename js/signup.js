const BASE_URL = "https://api-ieum.store"; // ← 스웨거 주소 기반 백엔드

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const nicknameInput = document.getElementById("name");
const nextBtn = document.getElementById("goVerify");
const backBtn = document.getElementById("backBtn");

let emailVerified = false;

// 📌 이메일 형식 유효성 검사
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// 📌 이메일 중복 확인 함수
async function checkEmailDuplicate(email) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/emails?email=${encodeURIComponent(email)}`
    );
    if (!res.ok) throw new Error("서버 응답 실패");
    const data = await res.json();

    // 중복이면 false 반환
    return !data.result.isDuplicate;
  } catch (err) {
    alert("이메일 중복 확인 중 오류가 발생했습니다.");
    console.error("이메일 중복 오류:", err);
    return false;
  }
}

// 📌 이메일 인증 요청 함수
async function sendVerificationEmail(email) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/members/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error("서버 응답 실패");
    const data = await res.json();

    if (data.isSuccess) {
      alert("인증번호가 전송되었습니다.");
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
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const nickname = nicknameInput.value.trim();

  // 유효성 검사
  if (!email || !password || !confirmPassword || !nickname) {
    alert("모든 항목을 입력해 주세요.");
    return;
  }

  if (!isValidEmail(email)) {
    alert("유효한 이메일 주소를 입력해 주세요.");
    return;
  }

  if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const isEmailAvailable = await checkEmailDuplicate(email);
  if (!isEmailAvailable) {
    alert("이미 사용 중인 이메일입니다.");
    return;
  }

  const isSent = await sendVerificationEmail(email);
  if (!isSent) return;

  // 인증 코드 입력 페이지로 이동 + 이메일 저장
  localStorage.setItem("signupEmail", email);
  localStorage.setItem("signupPassword", password);
  localStorage.setItem("signupNickname", nickname);

  window.location.href = "./verifyEmail.html";
});

// 📌 뒤로가기 버튼
backBtn.addEventListener("click", () => {
  history.back();
});
