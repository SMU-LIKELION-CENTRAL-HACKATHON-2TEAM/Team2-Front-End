// setting.js
(function () {
  const body = document.body;
  const btnOpen = document.getElementById("btnSettings");
  const modalRoot = document.getElementById("modalRoot");
  const fragmentPath = "./setting.html";

  const focusableSelector =
    'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

  let overlay, dialog, btnBack, avatarBtn, avatarInput, seg;
  let tabProfile,
    tabSaved,
    panelProfile,
    panelSaved,
    savedGrid,
    rowSaved,
    rowReviews;
  let form, inputs;
  let lastFocused = null;
  let isLoaded = false;

  // 보기/편집 전환
  const enterViewMode = (el) => {
    el.readOnly = true;
    el.classList.add("view-mode");
    el.classList.remove("editing");
  };
  const enterEditMode = (el) => {
    el.readOnly = false;
    el.classList.remove("view-mode");
    el.classList.add("editing");
    requestAnimationFrame(() => {
      el.focus();
      const len = el.value?.length ?? 0;
      if (el.setSelectionRange) el.setSelectionRange(len, len);
    });
  };

  // 저장/로드 (데모: localStorage)
  function loadProfile() {
    try {
      const saved = JSON.parse(localStorage.getItem("profile") || "{}");
      const nick = dialog.querySelector("#nickname");
      const email = dialog.querySelector("#email");
      if (saved.nickname != null) nick.value = saved.nickname;
      if (saved.email != null) email.value = saved.email;
    } catch (_) {}
  }
  function saveProfile() {
    const nick = dialog.querySelector("#nickname");
    const email = dialog.querySelector("#email");
    localStorage.setItem(
      "profile",
      JSON.stringify({ nickname: nick.value, email: email.value })
    );
    [nick, email].forEach(enterViewMode);
  }

  function createCard({
    name = "Route Name",
    sub = "Location 에서 출발",
  } = {}) {
    const a = document.createElement("a");
    a.className = "route-card";
    a.href = "#";
    a.innerHTML = `
    <div class="route-card__thumb" aria-hidden="true"></div>
    <div class="route-card__meta">
      <div class="route-card__title">${name}</div>
      <div class="route-card__sub">${sub}</div>
    </div>
    <img
      class="route-card__chev"
      src="/images/rightBtn.png"
      srcset="/images/rightBtn.png 1x, /images/rightBtn@2x.png 2x"
      width="14" height="14"
      alt="" aria-hidden="true" loading="lazy"
    />
  `;
    return a;
  }

  function renderRows() {
    // 예시 데이터 (없으면 플레이스홀더 5개씩)
    let saved = [];
    let reviews = [];
    try {
      saved = JSON.parse(localStorage.getItem("savedRoutes") || "[]");
    } catch (_) {}
    try {
      reviews = JSON.parse(localStorage.getItem("myReviews") || "[]");
    } catch (_) {}

    rowSaved.innerHTML = "";
    rowReviews.innerHTML = "";

    const fill = (row, list) => {
      if (!Array.isArray(list) || list.length === 0) {
        for (let i = 0; i < 5; i++) row.appendChild(createCard());
      } else {
        list.forEach((item) =>
          row.appendChild(
            createCard({
              name: item.name ?? "Route Name",
              sub: item.addr ?? item.sub ?? "Location 에서 출발",
            })
          )
        );
      }
    };

    fill(rowSaved, saved);
    fill(rowReviews, reviews);
  }

  // 탭 전환
  function showPanel(which) {
    const isProfile = which === "profile";
    tabProfile.classList.toggle("active", isProfile);
    tabSaved.classList.toggle("active", !isProfile);
    panelProfile.hidden = !isProfile;
    panelSaved.hidden = isProfile;
    if (!isProfile) renderRows();
  }

  // 모달 로드
  async function ensureModalLoaded() {
    if (isLoaded) return;

    const res = await fetch(fragmentPath, { cache: "no-store" });
    if (!res.ok)
      throw new Error("모달 파일을 불러오지 못했습니다: " + res.status);
    modalRoot.innerHTML = await res.text();

    // 요소 캐싱
    overlay = document.getElementById("settingsOverlay");
    dialog = document.getElementById("settingsDialog");
    btnBack = document.getElementById("backBtn");
    avatarBtn = document.getElementById("avatarBtn");
    avatarInput = document.getElementById("avatarInput");
    seg = dialog.querySelector(".seg");
    tabProfile = document.getElementById("tabProfile");
    tabSaved = document.getElementById("tabSaved");
    panelProfile = document.getElementById("panelProfile");
    panelSaved = document.getElementById("panelSaved");
    savedGrid = document.getElementById("savedGrid");
    rowSaved = document.getElementById("savedRoutesRow");
    rowReviews = document.getElementById("myReviewsRow");
    form = document.getElementById("settingsForm");
    inputs = Array.from(dialog.querySelectorAll(".input"));

    // 초기 값/상태
    loadProfile();
    inputs.forEach((el) => {
      enterViewMode(el);
      el.addEventListener("mousedown", (e) => {
        if (!el.classList.contains("view-mode")) return;
        e.preventDefault();
        enterEditMode(el);
      });
      el.addEventListener("focus", () => {
        if (el.classList.contains("view-mode")) enterEditMode(el);
      });
    });
    showPanel("profile");

    // 탭 클릭
    tabProfile.addEventListener("click", () => showPanel("profile"));
    tabSaved.addEventListener("click", () => showPanel("saved"));

    // 아바타 미리보기
    avatarBtn?.addEventListener("click", () => avatarInput.click());
    avatarInput?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        avatarBtn.style.backgroundImage = `url('${reader.result}')`;
        avatarBtn.style.backgroundSize = "cover";
        avatarBtn.style.backgroundPosition = "center";
        avatarBtn.style.border = "2px solid var(--primary)";
        avatarBtn.classList.add("has-image");
      };
      reader.readAsDataURL(file);
    });

    // 닫기/오버레이/ESC
    btnBack?.addEventListener("click", closeModal);
    overlay?.addEventListener("click", closeModal);
    document.addEventListener("keydown", onKeydown);

    // 저장
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      saveProfile();
    });

    isLoaded = true;
  }

  // 열기/닫기
  function openModal() {
    if (!overlay || !dialog) return;
    lastFocused = document.activeElement;
    overlay.hidden = false;
    dialog.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    (dialog.querySelector(focusableSelector) || dialog).focus();
  }
  function closeModal() {
    if (!overlay || !dialog) return;
    overlay.hidden = true;
    dialog.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    if (lastFocused?.focus) lastFocused.focus();
  }

  // ESC & 포커스 트랩
  function onKeydown(e) {
    if (!dialog || dialog.hidden) return;
    if (e.key === "Escape") return closeModal();

    if (e.key === "Tab") {
      const nodes = Array.from(
        dialog.querySelectorAll(focusableSelector)
      ).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  // 설정 버튼 → 로드 후 열기
  btnOpen?.addEventListener("click", async () => {
    try {
      await ensureModalLoaded();
      openModal();
    } catch (err) {
      console.error(err);
      alert("설정 화면을 불러오지 못했습니다.");
    }
  });
})();
