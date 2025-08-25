document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const API_BASE = "https://api-ieum.store";
  const SEND_CODE_URL = `${API_BASE}/api/v1/emails`; // GET ?email=...
  const VERIFY_CODE_URL = `${API_BASE}/api/v1/emails/codes`; // POST { email, code }
  const SIGNUP_URL = `${API_BASE}/api/v1/members`; // POST { email, password, confirmPassword, nickname }
  const NEXT_URL = "./signupComplete.html";

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
  function showBanner(msg) {
    const t = String(msg || "").trim();
    if (!t) return;
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
  async function getJSON(urlWithQuery) {
    const res = await fetch(urlWithQuery, {
      method: "GET",
      headers: { Accept: "application/json" },
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
      const url = `${SEND_CODE_URL}?email=${encodeURIComponent(email.trim())}`;
      const res = await getJSON(url);
      if (res?.isSuccess === false) {
        showBanner(res?.message || "인증 메일 전송에 실패했습니다.");
        return false;
      }
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


  async function signupAfterVerify(email) {
    const nickname = (sessionStorage.getItem("signupNickname") || "").trim();
    const password = (sessionStorage.getItem("signupPassword") || "").trim();
    const confirmPassword = (
      sessionStorage.getItem("signupPasswordConfirm") || ""
    ).trim();

    if (!email || !nickname || !password || !confirmPassword) {
      showBanner("입력 정보가 없습니다. 처음부터 다시 진행해주세요.");
      return;
    }


    const nickRe = /^[a-zA-Z0-9_]{3,12}$/;
    const pwRe =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

    if (!isEmail(email)) {
      showBanner("올바른 이메일 형식이 아닙니다.");
      return;
    }
    if (!nickRe.test(nickname)) {
      showBanner("닉네임은 영문/숫자/밑줄 3~12자만 가능합니다.");
      return;
    }
    if (!pwRe.test(password)) {
      showBanner("비밀번호는 대/소문자, 숫자, 특수문자 포함 8~16자입니다.");
      return;
    }
    if (password !== confirmPassword) {
      showBanner("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const payload = {
      email: email.trim(),
      password,
      confirmPassword,
      passwordConfirm: confirmPassword, 
      nickname,
    };
    console.log("[signup payload]", payload);

    const keep = verifyNextBtn?.textContent;
    try {
      if (verifyNextBtn) {
        verifyNextBtn.textContent = "가입 중...";
        verifyNextBtn.disabled = true;
      }
      clearBanner();

      const res = await postJSON(SIGNUP_URL, payload);

      if (res?.isSuccess === false) {
   
        showBanner(res?.message || "회원가입에 실패했습니다.");
        if (verifyNextBtn && keep) {
          verifyNextBtn.textContent = keep;
          syncVerifyBtn();
        }
        return;
      }
      location.assign(NEXT_URL);
    } catch (e) {
      const d = e?.data || {};
      const detail =
        (Array.isArray(d?.errors) &&
          d.errors.length &&
          (d.errors[0].defaultMessage || d.errors[0].message)) ||
        d?.result?.message ||
        d?.message ||
        e?.message;
      console.warn("[signup failed]", e?.status, d);
      showBanner(detail || "회원가입에 실패했습니다.");
      if (verifyNextBtn && keep) {
        verifyNextBtn.textContent = keep;
        syncVerifyBtn();
      }
    }
  }


  async function verifyThenSignup(email, code) {
    const token = String(code || "").trim();
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

      const res = await postJSON(VERIFY_CODE_URL, {
        email: email.trim(),
        code: token,
      });
      if (res?.isSuccess === false) {
        showBanner(
          res?.message || "인증에 실패했습니다. 인증코드를 확인해주세요."
        );
        if (verifyNextBtn && keep) {
          verifyNextBtn.textContent = keep;
          syncVerifyBtn();
        }
        return;
      }

      await signupAfterVerify(email);
    } catch (e) {
      const d = e?.data || {};
      const detail = d?.message || e?.message;
      console.warn("[verify failed]", e?.status, d);
      showBanner(detail || "인증에 실패했습니다. 인증코드를 확인해주세요.");
      if (verifyNextBtn && keep) {
        verifyNextBtn.textContent = keep;
        syncVerifyBtn();
      }
    } finally {
      verifying = false;
    }
  }

  function syncVerifyBtn() {
    const token = String(codeInput?.value || "").trim();
    if (verifyNextBtn) verifyNextBtn.disabled = token.length < 6 || verifying;
  }


  const email = getEmailFromContext();
  if (!email) showBanner("이메일 정보가 없습니다. 다시 시도해주세요.");
  if (verifyEmailEl) verifyEmailEl.textContent = email || "";
  restoreCooldown();

  const until = Number(sessionStorage.getItem(COOLDOWN_KEY) || 0);
  if (email && until <= Date.now()) {
    sendCode(email);
  }

  backBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    location.assign("./signupPage.html");
  });
  codeInput?.addEventListener("input", syncVerifyBtn);
  codeInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !verifyNextBtn?.disabled) {
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

  syncVerifyBtn();
});
