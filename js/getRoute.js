const MOCK_DATA = {
  success: true,
  msg: "경복궁 주변 실제 루트",
  result: [
    // 1) 궁궐 안/주변 컬쳐 루트
    {
      startPlace: {
        placeId: 101,
        placeName: "경복궁",
        category: "궁궐",
        address: "서울 종로구 사직로 161",
        kakaoId: "",
        lat: 37.580467,
        lng: 126.976944,
        description: "조선의 정궁, 서울 대표 궁궐",
        saves: 2150,
        views: 12900,
        bookMarked: "true",
        isActivate: true,
      },
      nextPlaces: [
        {
          placeId: 201,
          placeName: "국립고궁박물관",
          category: "박물관",
          address: "서울 종로구 효자로 12",
          kakaoId: "",
          lat: 37.57635,
          lng: 126.9747,
          description: "조선 왕실 문화 전문 박물관",
          saves: 940,
          views: 5220,
          bookMarked: "true",
          isActivate: true,
        },
        {
          placeId: 202,
          placeName: "국립민속박물관",
          category: "박물관",
          address: "서울 종로구 삼청로 37",
          kakaoId: "",
          lat: 37.581977,
          lng: 126.978859,
          description: "한국 민속생활상 전시",
          saves: 780,
          views: 4180,
          bookMarked: "false",
          isActivate: true,
        },
      ],
      description: "경복궁 → 국립고궁박물관 → 국립민속박물관 컬쳐 루트",
    },

    // 2) 북촌 & 인사동 감성 산책
    {
      startPlace: {
        placeId: 102,
        placeName: "경복궁",
        category: "궁궐",
        address: "서울 종로구 사직로 161",
        kakaoId: "",
        lat: 37.580467,
        lng: 126.976944,
        description: "조선의 정궁, 서울 대표 궁궐",
        saves: 1980,
        views: 11020,
        bookMarked: "true",
        isActivate: true,
      },
      nextPlaces: [
        {
          placeId: 203,
          placeName: "북촌한옥마을",
          category: "관광지",
          address: "서울 종로구 계동길 37",
          kakaoId: "",
          lat: 37.58239,
          lng: 126.98587,
          description: "도심 속 전통 한옥 군락",
          saves: 1320,
          views: 8420,
          bookMarked: "true",
          isActivate: true,
        },
        {
          placeId: 204,
          placeName: "인사동길",
          category: "문화거리",
          address: "서울 종로구 인사동길 62",
          kakaoId: "",
          lat: 37.573537,
          lng: 126.98557,
          description: "갤러리·전통공예·티하우스 거리",
          saves: 990,
          views: 6030,
          bookMarked: "false",
          isActivate: true,
        },
      ],
      description: "경복궁 → 북촌한옥마을 → 인사동 감성 산책",
    },

    // 3) 서촌 먹거리 & 도심 광장
    {
      startPlace: {
        placeId: 103,
        placeName: "경복궁",
        category: "궁궐",
        address: "서울 종로구 사직로 161",
        kakaoId: "",
        lat: 37.580467,
        lng: 126.976944,
        description: "조선의 정궁, 서울 대표 궁궐",
        saves: 1720,
        views: 10150,
        bookMarked: "false",
        isActivate: true,
      },
      nextPlaces: [
        {
          placeId: 205,
          placeName: "통인시장",
          category: "시장",
          address: "서울 종로구 자하문로15길 18",
          kakaoId: "",
          lat: 37.579964,
          lng: 126.969078,
          description: "도시락카페로 유명한 서촌 전통시장",
          saves: 860,
          views: 4920,
          bookMarked: "true",
          isActivate: true,
        },
        {
          placeId: 206,
          placeName: "광화문광장",
          category: "광장",
          address: "서울 종로구 세종대로 172",
          kakaoId: "",
          lat: 37.572304,
          lng: 126.977148,
          description: "세종대왕·이순신 장군 동상이 있는 도심 광장",
          saves: 1440,
          views: 9100,
          bookMarked: "true",
          isActivate: true,
        },
      ],
      description: "경복궁 → 통인시장 → 광화문광장 도심 루트",
    },

    // 4) 사찰·전통거리 콤보
    {
      startPlace: {
        placeId: 104,
        placeName: "경복궁",
        category: "궁궐",
        address: "서울 종로구 사직로 161",
        kakaoId: "",
        lat: 37.580467,
        lng: 126.976944,
        description: "조선의 정궁, 서울 대표 궁궐",
        saves: 1600,
        views: 9500,
        bookMarked: "false",
        isActivate: true,
      },
      nextPlaces: [
        {
          placeId: 207,
          placeName: "조계사",
          category: "사찰",
          address: "서울 종로구 우정국로 55",
          kakaoId: "",
          lat: 37.57414,
          lng: 126.98202,
          description: "대한불교조계종 총본산 사찰",
          saves: 740,
          views: 3710,
          bookMarked: "false",
          isActivate: true,
        },
        {
          placeId: 208,
          placeName: "인사동길",
          category: "문화거리",
          address: "서울 종로구 인사동길 62",
          kakaoId: "",
          lat: 37.573537,
          lng: 126.98557,
          description: "전통과 현대 문화가 공존하는 거리",
          saves: 1050,
          views: 6400,
          bookMarked: "true",
          isActivate: true,
        },
      ],
      description: "경복궁 → 조계사 → 인사동 전통 컬처 루트",
    },

    // 5) 현대미술 & 청와대 산책
    {
      startPlace: {
        placeId: 105,
        placeName: "경복궁",
        category: "궁궐",
        address: "서울 종로구 사직로 161",
        kakaoId: "",
        lat: 37.580467,
        lng: 126.976944,
        description: "조선의 정궁, 서울 대표 궁궐",
        saves: 1830,
        views: 10830,
        bookMarked: "true",
        isActivate: true,
      },
      nextPlaces: [
        {
          placeId: 209,
          placeName: "국립현대미술관 서울",
          category: "미술관",
          address: "서울 종로구 삼청로 30",
          kakaoId: "",
          lat: 37.5792,
          lng: 126.9804,
          description: "MMCA 서울관",
          saves: 910,
          views: 5570,
          bookMarked: "true",
          isActivate: true,
        },
        {
          placeId: 210,
          placeName: "청와대",
          category: "공원",
          address: "서울 종로구 청와대로 1",
          kakaoId: "",
          lat: 37.586706,
          lng: 126.974608,
          description: "옛 대통령 관저, 현재는 개방 공간",
          saves: 1380,
          views: 8840,
          bookMarked: "false",
          isActivate: true,
        },
      ],
      description: "경복궁 → 국립현대미술관(서울) → 청와대 산책 루트",
    },
  ],
};

//getRoute.js

/* =========================================
 2) 우측 디테일 사이드바 렌더링 유틸
 ========================================= */

const appEl = document.getElementById("app");
const detailPanel = document.getElementById("detailPanel");
const detailTitle = document.getElementById("detailTitle");
const detailBody = document.getElementById("detailBody");
const btnBack = document.getElementById("detailBack");
const btnAdd = document.getElementById("detailAdd");
const resultsEl = document.getElementById("results");

let currentView = "list";
let currentPlaceName = "";

const nfmt = (n) => (n ?? 0).toLocaleString("en-US");
const isMarked = (v) => String(v).toLowerCase() === "true" || v === true;
const bmSvg = (on) =>
  `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" style="display:block; fill:${
    on ? "#1e88f7" : "#6b7280"
  };"><path d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z"/></svg>`;

function buildRouteName(route) {
  return route?.startPlace?.placeName || "Route";
}
function placeLine(p) {
  return `${p.placeName} - ${p.category}`;
}

function createRouteCard(route) {
  const sp = route.startPlace;
  const places = [sp, ...route.nextPlaces];
  const saves = nfmt(sp.saves);
  const views = nfmt(sp.views);
  const marked = isMarked(sp.bookMarked);
  const title = buildRouteName(route);
  return `
    <article class="route-card" data-route-id="${
      sp.placeId
    }" style="background:#fff; padding:16px; margin:0 12px 12px; cursor:pointer; border:1px solid #e5e7eb; border-radius:12px;">
      <div style="display:flex; gap:12px; margin-bottom:12px;">
        <div style="flex:1; height:88px; border-radius:14px; background:#e5e7eb;"></div>
        <div style="flex:1; height:88px; border-radius:14px; background:#e5e7eb;"></div>
        <div style="flex:1; height:88px; border-radius:14px; background:#e5e7eb;"></div>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div style="font-size:20px; font-weight:bold;">${title}<span style="margin-left:8px; color:#9aa3af; font-weight:600; font-size:14px;">${saves} saves - ${views} views</span></div>
        <button class="bm ${marked ? "on" : ""}" data-place-id="${
    sp.placeId
  }" style="background:none; border:none; padding:0; cursor:pointer;">${bmSvg(
    marked
  )}</button>
      </div>
      <div style="color:#374151; font-size:15px; line-height:1.6; margin-top:10px;">${places
        .map((p) => `<div>${placeLine(p)}</div>`)
        .join("")}</div>
      <div style="margin-top:12px; color:#1e88f7; font-weight:700; font-size:16px; display:flex; align-items:center; gap:6px;"><span style="color:#60a5fa; font-size:18px;">ⓘ</span> AI description</div>
    </article>`;
}

function createPlaceDetailCard(place) {
  return `
    <div style="padding: 0 12px 24px;">
        <div style="width:100%; height:180px; border-radius:14px; background:#e5e7eb; margin-bottom: 12px;"></div>
        <div style="font-weight: bold; font-size: 18px;">${place.placeName} <span style="font-weight: normal; font-size: 16px; color: #4ade80;">Open</span></div>
        <div style="color: #6b7280; font-size:15px; margin-top:4px;">${place.category} - ${place.address}</div>
        <div style="margin-top:8px; color:#1e88f7; font-weight:700; font-size:16px; display:flex; align-items:center; gap:6px; cursor:pointer;"><span style="color:#60a5fa; font-size:18px;">ⓘ</span> AI description</div>
        <div style="text-align: center; margin-top: 8px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10L12 15L17 10" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    </div>`;
}

function createReviewCard() {
  const settingsIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
  return `
    <div style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 32px; height: 32px; border-radius: 50%; background-color: #e5e7eb;"></div><div style="font-weight: bold; font-size: 16px;">Nickname</div></div>
            <div style="display: flex; align-items: center; gap: 8px;"><div style="color: #9aa3af; font-size: 14px;">♥ Num</div><div style="cursor: pointer;">${settingsIcon}</div></div>
        </div>
        <div style="display:flex; gap:12px; margin:12px 0;">
            <div style="flex:1; height:88px; border-radius:14px; background:#e5e7eb;"></div><div style="flex:1; height:88px; border-radius:14px; background:#e5e7eb;"></div><div style="flex:1; height:88px; border-radius:14px; background:#e5e7eb;"></div>
        </div>
        <p style="color: #374151; line-height: 1.5; margin: 0; font-size: 15px;">조용하고 분위기 좋아서 혼자 책 읽기 딱 좋아요. 디저트도 맛있고 직원분들이 친절했어요.</p>
    </div>`;
}

function showRouteList(placeName) {
  currentPlaceName = placeName;
  currentView = "list";
  const all = MOCK_DATA.result || [];
  const matched = all.filter(
    (r) =>
      r.startPlace.placeName === placeName ||
      r.nextPlaces.some((np) => np.placeName === placeName)
  );
  const list = matched.length ? matched : all;
  detailTitle.textContent = placeName;
  detailBody.innerHTML = list.map(createRouteCard).join("");
  appEl.classList.add("details-open");
  if (typeof RouteGraph !== "undefined" && RouteGraph.drawRoutes) {
    RouteGraph.drawRoutes(list, { limit: 5 });
  }
}

function showRouteDetails(route) {
  currentView = "details";
  const tabs = `
    <div class="tabs-container">
        <button class="tab-btn active" data-tab="info"><span>정보</span></button>
        <button class="tab-btn" data-tab="review"><span>후기</span></button>
    </div>`;

  const topImages = `<div style="display:flex; gap:8px; padding: 0 12px 12px;"><div style="flex:1; height:110px; border-radius:14px; background:#e5e7eb;"></div><div style="flex:1; height:110px; border-radius:14px; background:#e5e7eb;"></div><div style="flex:1; height:110px; border-radius:14px; background:#e5e7eb;"></div></div>`;
  const savesAndViews = `<div style="padding: 0 16px 16px; display:flex; gap:16px; color:#6b7280; border-bottom: 8px solid #f3f4f6;"><span style="font-weight:bold;">🏴 ${nfmt(
    route.startPlace.saves
  )}</span> <span>ⓘ ${nfmt(route.startPlace.views)}</span></div>`;
  const places = [route.startPlace, ...route.nextPlaces];
  const infoContent = `<div class="tab-content" data-content="info">${topImages}${savesAndViews}${places
    .map(createPlaceDetailCard)
    .join("")}</div>`;

  // ▼▼▼▼ [수정] "리뷰 작성" 버튼에 식별용 클래스(write-review-btn)를 추가합니다. ▼▼▼▼
  const writeReviewButton = `
    <div style="padding: 16px 12px;">
        <button class="write-review-btn" style="width: 100%; background-color: #3b82f6; color: white; border: none; border-radius: 8px; padding: 12px; font-size: 16px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>
            리뷰 작성
        </button>
    </div>`;
  const reviewContent = `<div class="tab-content" data-content="review" style="display:none;">${writeReviewButton}${createReviewCard()}${createReviewCard()}</div>`;

  detailTitle.textContent = "Route Name";
  detailBody.innerHTML = tabs + infoContent + reviewContent;
}

btnBack.addEventListener("click", () => {
  if (currentView === "details") {
    showRouteList(currentPlaceName);
  } else {
    appEl.classList.remove("details-open");
  }
});

resultsEl.addEventListener("click", (e) => {
  const card = e.target.closest(".result-card");
  if (!card) return;
  const titleEl = card.querySelector(".title");
  if (!titleEl) return;
  const name = (
    titleEl.childNodes[0]?.nodeValue ||
    titleEl.textContent ||
    ""
  ).trim();
  if (name) showRouteList(name);
});

detailBody.addEventListener("click", (e) => {
  const bmBtn = e.target.closest(".bm");
  if (bmBtn) {
    e.stopPropagation();
    const isOn = !bmBtn.classList.contains("on");
    bmBtn.classList.toggle("on", isOn);
    bmBtn.innerHTML = bmSvg(isOn);
    return;
  }

  const routeCard = e.target.closest(".route-card");
  if (routeCard) {
    detailBody
      .querySelectorAll(".route-card")
      .forEach((c) => (c.style.borderColor = "#e5e7eb"));
    routeCard.style.borderColor = "#1e88f7";
    const routeId = routeCard.dataset.routeId;
    const route = MOCK_DATA.result.find(
      (r) => String(r.startPlace.placeId) === routeId
    );

    if (route) {
      window.dispatchEvent(
        new CustomEvent("route:highlight", { detail: { route: route } })
      );
      setTimeout(() => showRouteDetails(route), 100);
    }
    return;
  }

  const tabBtn = e.target.closest(".tab-btn");
  if (tabBtn) {
    detailBody
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    tabBtn.classList.add("active");
    detailBody
      .querySelectorAll(".tab-content")
      .forEach((content) => (content.style.display = "none"));
    const tabToShow = tabBtn.dataset.tab;
    detailBody.querySelector(
      `.tab-content[data-content="${tabToShow}"]`
    ).style.display = "block";
    return;
  }

  // ▼▼▼▼ [추가] "리뷰 작성" 버튼 클릭을 감지하여 팝업을 띄웁니다. ▼▼▼▼
  const writeReviewBtn = e.target.closest(".write-review-btn");
  if (writeReviewBtn) {
    showReviewPopup();
  }
});

// ▼▼▼▼ [추가] 팝업 관련 함수 및 스타일 ▼▼▼▼
function createReviewPopupHTML() {
  const backIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>`;
  const photoIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;

  return `
    <div id="review-popup-overlay" class="review-popup-overlay">
      <div class="review-popup-content">
        <header class="review-popup-header">
          <button id="popup-close-btn" class="popup-icon-btn">${backIcon}</button>
          <h2>리뷰 작성</h2>
        </header>
        <div class="review-popup-body">
          <div class="photo-uploader">
            <div class="photo-box add-photo">
              ${photoIcon}
              <span>사진 추가</span>
            </div>
            <div class="photo-box"></div>
            <div class="photo-box"></div>
          </div>
          <div class="text-input-group">
            <label for="review-text">텍스트</label>
            <textarea id="review-text" placeholder="내용을 입력해주세요"></textarea>
          </div>
          <button class="upload-btn">업로드</button>
        </div>
      </div>
    </div>
    `;
}

function showReviewPopup() {
  if (document.getElementById("review-popup-overlay")) return;

  const popupContainer = document.createElement("div");
  popupContainer.innerHTML = createReviewPopupHTML();
  document.body.appendChild(popupContainer);

  const overlay = document.getElementById("review-popup-overlay");
  const closeBtn = document.getElementById("popup-close-btn");

  const closePopup = () => {
    popupContainer.remove();
  };

  closeBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closePopup();
    }
  });
}

const style = document.createElement("style");
style.textContent = `
    .tabs-container { display: flex; padding: 0 16px; justify-content: space-around; }
    .tab-btn { padding: 0; border: none; background: none; cursor: pointer; color: #6b7280; }
    .tab-btn span { display: inline-block; padding: 14px 4px; font-size: 16px; border-bottom: 3px solid transparent; }
    .tab-btn.active { color: #1e88f7; }
    .tab-btn.active span { font-weight: bold; border-bottom-color: #1e88f7; }
    .tab-content { padding-top: 16px; }

    /* 팝업 스타일 */
    .review-popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }
    .review-popup-content {
        background-color: white;
        border-radius: 16px;
        width: 90%;
        max-width: 480px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .review-popup-header {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border-bottom: 1px solid #e5e7eb;
    }
    .review-popup-header h2 {
        flex-grow: 1;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin: 0;
        transform: translateX(-12px); /* 뒤로가기 버튼 만큼 중앙 이동 */
    }
    .popup-icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
    }
    .review-popup-body {
        padding: 24px;
    }
    .photo-uploader {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
    }
    .photo-box {
        flex: 1;
        aspect-ratio: 1 / 1;
        background-color: #f3f4f6;
        border-radius: 8px;
        border: 1px dashed #d1d5db;
    }
    .add-photo {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        background-color: #eef2ff;
        border-color: #a5b4fc;
        cursor: pointer;
    }
    .add-photo span {
        font-size: 14px;
        margin-top: 4px;
    }
    .text-input-group label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
        color: #374151;
    }
    .text-input-group textarea {
        width: 100%;
        height: 100px;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        resize: vertical;
        font-size: 16px;
        box-sizing: border-box;
    }
    .upload-btn {
        width: 100%;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 14px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        margin-top: 24px;
    }
`;
document.head.appendChild(style);
