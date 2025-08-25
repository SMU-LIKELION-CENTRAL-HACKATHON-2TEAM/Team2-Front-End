document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const API_BASE = "https://api-ieum.store";
  const SEND_CODE_URL = `${API_BASE}/api/v1/emails`; // POST { email }
  const VERIFY_CODE_URL = `${API_BASE}/api/v1/emails/codes`; // POST { email, code }
  const SIGNUP_URL = `${API_BASE}/api/v1/members`; // POST { email, password, confirmPassword, nickname }
  const NEXT_URL = "./signupComplete.html"; // 가입 완료 이동 페이지

  const RESEND_COOLDOWN_SEC = 60;
  const COOLDOWN_KEY = "emailVerifyCooldownUntil";

  const backBtn = document.getElementById("backBtn");
  const verifyEmailEl = document.getElementById("verifyEmail");
  const codeInput = document.getElementById("code");
  const verifyNextBtn = document.getElementById("verifyNext");
  const resendLink = document.getElementById("resendCode");

  function getOrCreateBanner() {
    let el = document.getElementById("verifyBanner");
    if (!el) {
      el = document.createElement("div");
      el.id = "verifyBanner";
      el.className = "form-error-banner";
      verifyNextBtn?.insertAdjacentElement("beforebegin", el);
    }
    return el;
  }

  const suppressMsg = (m) =>
    /인증\s*이\s*필요|unauthori[sz]ed|access\s*denied|forbidden|^401\b/i.test(
      String(m || "")
    );
  function showBanner(msg) {
    const t = String(msg || "").trim();
    if (!t || suppressMsg(t)) return;
    const el = getOrCreateBanner();
    el.textContent = t;
    el.classList.add("show");
  }
  function clearBanner() {
    const el = document.getElementById("verifyBanner");
    if (el) {
      el.textContent = "";
      el.classList.remove("show");
    }
  }

  let sending = false;
  let verifying = false;
  let cooldownTimer = null;
  let cooldownRemain = 0;

  const isEmail = (s) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
  const getEmailFromContext = () => {
    const u = new URL(location.href);
    const q = u.searchParams.get("email");
    return (
      q ||
      sessionStorage.getItem("signupEmail") ||
      localStorage.getItem("signupEmail") ||
      ""
    );
  };

  async function postJSON(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!res.ok) {
      const err = new Error(
        data?.message || res.statusText || `HTTP ${res.status}`
      );
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  function updateResendText() {
    if (!resendLink) return;
    resendLink.textContent = `인증 메일 다시 보내기${
      cooldownRemain > 0 ? ` (${cooldownRemain}s)` : ""
    }`;
  }
  function startCooldown(sec) {
    if (!resendLink) return;
    clearInterval(cooldownTimer);
    cooldownRemain = sec;
    updateResendText();
    resendLink.classList.add("disabled");
    resendLink.setAttribute("aria-disabled", "true");
    cooldownTimer = setInterval(() => {
      cooldownRemain--;
      updateResendText();
      if (cooldownRemain <= 0) {
        clearInterval(cooldownTimer);
        cooldownTimer = null;
        resendLink.classList.remove("disabled");
        resendLink.removeAttribute("aria-disabled");
        resendLink.textContent = "인증 메일 다시 보내기";
        sessionStorage.removeItem(COOLDOWN_KEY);
      }
    }, 1000);
  }
  function setCooldown(sec) {
    sessionStorage.setItem(COOLDOWN_KEY, String(Date.now() + sec * 1000));
    startCooldown(sec);
  }
  function restoreCooldown() {
    const until = Number(sessionStorage.getItem(COOLDOWN_KEY) || 0);
    const remain = Math.ceil((until - Date.now()) / 1000);
    if (remain > 0) startCooldown(remain);
  }

  async function sendCode(email) {
    if (!isEmail(email)) {
      showBanner("올바른 이메일이 아닙니다.");
      return false;
    }
    if (sending) return false;

    sending = true;
    const keep = resendLink?.textContent;
    try {
      if (resendLink) resendLink.textContent = "전송 중...";
      clearBanner();
      await postJSON(SEND_CODE_URL, { email });
      setCooldown(RESEND_COOLDOWN_SEC);
      return true;
    } catch (e) {
      console.warn("[sendCode failed]", e?.status, e?.data || e);
      showBanner(
        e?.data?.message || e.message || "인증 메일 전송에 실패했습니다."
      );
      return false;
    } finally {
      sending = false;
      if (resendLink && keep) resendLink.textContent = keep;
    }
  }

  // ===== 인증 성공 후 회원가입 =====
  async function signupAfterVerify(email) {
    const nickname = sessionStorage.getItem("signupNickname") || "";
    const password = sessionStorage.getItem("signupPassword") || "";
    const confirmPassword =
      sessionStorage.getItem("signupPasswordConfirm") || "";

    console.log("[signup payload]", {
      email,
      nickname,
      password: password ? `(len ${password.length})` : "(empty)",
      confirmPassword: confirmPassword
        ? `(len ${confirmPassword.length})`
        : "(empty)",
    });

    if (!email || !nickname || !password || !confirmPassword) {
      showBanner("입력 정보가 없습니다. 처음부터 다시 진행해주세요.");
      return;
    }

    const payload = { email, password, confirmPassword, nickname };
    const keep = verifyNextBtn?.textContent;

    try {
      if (verifyNextBtn) {
        verifyNextBtn.textContent = "가입 중...";
        verifyNextBtn.disabled = true;
      }
      clearBanner();

      const res = await postJSON(SIGNUP_URL, payload);

      if (res?.isSuccess === false) {
        console.warn("[signup server error]", res);
        showBanner(res?.message || "회원가입에 실패했습니다.");
        if (verifyNextBtn && keep) {
          verifyNextBtn.textContent = keep;
          syncVerifyBtn();
        }
        return;
      }

      // 성공 → 완료 페이지
      location.assign(NEXT_URL);
    } catch (e) {
      console.warn("[signup failed]", e?.status, e?.data || e);
      showBanner(e?.data?.message || e.message || "회원가입에 실패했습니다.");
      if (verifyNextBtn && keep) {
        verifyNextBtn.textContent = keep;
        syncVerifyBtn();
      }
    }
  }

  // ===== 인증 → 가입 =====
  async function verifyThenSignup(email, code) {
    const token = String(code || "").trim(); // 영문/숫자 허용
    if (!isEmail(email)) {
      showBanner("올바른 이메일이 아닙니다.");
      return;
    }
    if (token.length < 6) {
      showBanner("인증코드를 입력해주세요. (최소 6자)");
      return;
    }
    if (verifying) return;

    verifying = true;
    const keep = verifyNextBtn?.textContent;

    try {
      if (verifyNextBtn) {
        verifyNextBtn.textContent = "확인 중...";
        verifyNextBtn.disabled = true;
      }
      clearBanner();

      const res = await postJSON(VERIFY_CODE_URL, { email, code: token }); // 1) 코드 검증
      if (res?.isSuccess === false) {
        console.warn("[verify server error]", res);
        showBanner(
          res?.message || "인증에 실패했습니다. 인증코드를 확인해주세요."
        );
        if (verifyNextBtn && keep) {
          verifyNextBtn.textContent = keep;
          syncVerifyBtn();
        }
        return;
      }

      await signupAfterVerify(email); // 2) 가입
    } catch (e) {
      console.warn("[verify failed]", e?.status, e?.data || e);
      showBanner(
        e?.data?.message ||
          e.message ||
          "인증에 실패했습니다. 인증코드를 확인해주세요."
      );
      if (verifyNextBtn && keep) {
        verifyNextBtn.textContent = keep;
        syncVerifyBtn();
      }
    } finally {
      verifying = false;
    }
  }

  function syncVerifyBtn() {
    const token = String(codeInput.value || "").trim();
    verifyNextBtn.disabled = token.length < 6 || verifying;
  }

  const email = getEmailFromContext();
  if (!email) showBanner("이메일 정보가 없습니다. 다시 시도해주세요.");
  if (verifyEmailEl) verifyEmailEl.textContent = email || "";
  restoreCooldown();

  backBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    location.assign("./signupPage.html");
  });

  codeInput?.addEventListener("input", syncVerifyBtn);
  codeInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !verifyNextBtn.disabled) {
      e.preventDefault();
      verifyThenSignup(email, codeInput.value);
    }
  });

  verifyNextBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    verifyThenSignup(email, codeInput.value);
  });

  resendLink?.addEventListener("click", async (e) => {
    e.preventDefault();
    if (cooldownRemain > 0 || sending) return;
    await sendCode(email);
  });

  // 최초 버튼 상태 동기화
  syncVerifyBtn();
});
