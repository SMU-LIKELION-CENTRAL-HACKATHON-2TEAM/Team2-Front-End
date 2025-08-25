const API_BASE = ""; // 프록시 전제
const PATH_SEND_CODE = "/api/v1/emails"; // 인증코드 발송
const PATH_CHECK_EMAIL = "/api/v1/members/email"; // 이메일 중복검사

const $ = (sel, p = document) => p.querySelector(sel);
const isEmail = (s) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
const getCookie = (name) =>
  document.cookie
    .split("; ")
    .find((c) => c.startsWith(name + "="))
    ?.split("=")[1];

function getOrCreateErrorEl(inputEl) {
  if (inputEl.dataset.errId) {
    const ex = document.getElementById(inputEl.dataset.errId);
    if (ex) return ex;
  }
  const id = `err_${inputEl.id || Math.random().toString(36).slice(2)}`;
  const div = document.createElement("div");
  div.id = id;
  div.className = "field-error";
  inputEl.insertAdjacentElement("afterend", div);
  inputEl.dataset.errId = id;
  return div;
}
function showError(inputEl, msg) {
  const el = getOrCreateErrorEl(inputEl);
  el.textContent = msg || "";
  el.classList.add("show");
  inputEl.classList.add("input-error");
}
function hideError(inputEl) {
  const el = getOrCreateErrorEl(inputEl);
  el.textContent = "";
  el.classList.remove("show");
  inputEl.classList.remove("input-error");
}

let nextBtn;
let formEl;
function getOrCreateFormBanner() {
  let el = document.getElementById("formErrorBanner");
  if (!el) {
    el = document.createElement("div");
    el.id = "formErrorBanner";
    el.className = "form-error-banner";
    if (nextBtn) nextBtn.insertAdjacentElement("beforebegin", el);
    else if (formEl) formEl.appendChild(el);
    else document.body.appendChild(el);
  }
  return el;
}
function showFormBanner(msg) {
  const el = getOrCreateFormBanner();
  el.textContent = msg || "";
  el.classList.add("show");
}
function clearFormBanner() {
  const el = document.getElementById("formErrorBanner");
  if (el) {
    el.textContent = "";
    el.classList.remove("show");
  }
}

async function post(path, body) {
  const url = API_BASE + path;
  const xsrf = getCookie("XSRF-TOKEN") || getCookie("CSRF-TOKEN");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (xsrf) headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrf);

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const raw = await res.text();
  let data;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { message: raw };
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

document.addEventListener("DOMContentLoaded", () => {
  formEl = $(".submitForm");
  const emailEl = $("#email");
  const nickEl = $("#name");
  const pwEl = $("#password");
  const pwcEl = $("#confirm-password");
  nextBtn = $("#goVerify");
  const backBtn = $("#backBtn");

  backBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "../index.html";
  });

  let emailDup = "unknown";
  let emailCheckTimer = null;
  let lastChecked = "";

  const suppressMsg = (m) =>
    /인증\s*이\s*필요|unauthori[sz]ed|access\s*denied|forbidden|^401\b/i.test(
      String(m || "")
    );

  async function checkEmailDup(email) {
    if (!isEmail(email)) {
      emailDup = "unknown";
      return;
    }

    if (email === lastChecked && emailDup !== "unknown") return;
    lastChecked = email;

    try {
      const res = await post(PATH_CHECK_EMAIL, { email });

      if (res?.isSuccess === false && /(이미|중복)/i.test(res?.message || "")) {
        emailDup = "dup";
      } else {
        emailDup = "ok";
      }
    } catch (e) {
      if (e.status === 409) {
        emailDup = "dup";
      } else {
        emailDup = "unknown";
        if (!suppressMsg(e?.message)) {
        }
      }
    }
  }

  function validateAndRender() {
    const email = String(emailEl?.value || "").trim();
    const nick = String(nickEl?.value || "").trim();
    const pw = String(pwEl?.value || "");
    const pwc = String(pwcEl?.value || "");

    let ok = true;
    clearFormBanner();

    if (!email) {
      showError(emailEl, "이메일을 입력해주세요.");
      ok = false;
    } else if (!isEmail(email)) {
      showError(emailEl, "올바른 이메일 형식으로 입력해주세요.");
      ok = false;
    } else {
      hideError(emailEl);
    }

    if (!nick) {
      showError(nickEl, "닉네임을 입력해주세요.");
      ok = false;
    } else {
      hideError(nickEl);
    }

    if (!pw || !pwc) {
      hideError(pwcEl);
      ok = false;
    } else if (pw !== pwc) {
      showError(pwcEl, "비밀번호가 일치하지 않습니다.");
      ok = false;
    } else {
      hideError(pwcEl);
    }

    if (ok && emailDup === "dup") {
      showFormBanner("*이미 존재하는 이메일입니다.");
      ok = false;
    }

    if (nextBtn) nextBtn.disabled = !ok;
    return ok;
  }

  emailEl?.addEventListener("input", () => {
    emailDup = "unknown";
    clearFormBanner();
    validateAndRender();

    const email = String(emailEl.value || "").trim();
    if (!isEmail(email)) return;
    if (emailCheckTimer) clearTimeout(emailCheckTimer);
    emailCheckTimer = setTimeout(
      () => checkEmailDup(email).then(validateAndRender),
      400
    );
  });

  emailEl?.addEventListener("blur", () => {
    const email = String(emailEl.value || "").trim();
    if (isEmail(email)) checkEmailDup(email).then(validateAndRender);
  });

  [nickEl, pwEl, pwcEl].forEach((el) => {
    el?.addEventListener("input", () => {
      clearFormBanner();
      validateAndRender();
    });
    el?.addEventListener("change", () => {
      clearFormBanner();
      validateAndRender();
    });
    el?.addEventListener("blur", () => {
      validateAndRender();
    });
    el?.addEventListener("keyup", () => {
      validateAndRender();
    });
  });

  formEl?.addEventListener("submit", (e) => {
    e.preventDefault();
    nextBtn?.click();
  });

  nextBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const emailNow = String(emailEl.value || "").trim();
    if (isEmail(emailNow)) {
      try {
        await checkEmailDup(emailNow);
      } catch {}
    }
    if (!validateAndRender()) return;

    const email = emailEl.value.trim();
    const nickname = nickEl.value.trim();
    const password = pwEl.value;
    const confirmPassword = pwcEl.value;

    nextBtn.disabled = true;

    sessionStorage.setItem("signupEmail", email);
    sessionStorage.setItem("signupNickname", nickname);
    sessionStorage.setItem("signupPassword", password);
    sessionStorage.setItem("signupPasswordConfirm", confirmPassword);

    try {
      await post(PATH_SEND_CODE, { email });
    } catch (err) {
      sessionStorage.setItem(
        "verifySendError",
        err?.data?.message || err?.message || "인증 메일 전송에 실패했습니다."
      );
    } finally {
      location.assign(`./verifyEmail.html?email=${encodeURIComponent(email)}`);
    }
  });

  validateAndRender();
});
