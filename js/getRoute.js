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

/* =========================================
    2) 우측 디테일 사이드바 렌더링 유틸
    ========================================= */
const appEl = document.getElementById("app");
const detailTitle = document.getElementById("detailTitle");
const detailBody = document.getElementById("detailBody");
const btnBack = document.getElementById("detailBack");
const btnAdd = document.getElementById("detailAdd");

// 숫자 포맷 & 북마크 처리
const nfmt = (n) => (n ?? 0).toLocaleString("en-US");
const isMarked = (v) => String(v).toLowerCase() === "true" || v === true;
const bmSvg = (on) => `
<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
     style="display:block; fill:${on ? "#1e88f7" : "#1f2937"}">
  <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z"/>
</svg>`;

// 라우트 네임 만들기: startPlace 이름을 그대로 사용
function buildRouteName(route) {
  const spName = route?.startPlace?.placeName || "Route";
  return spName;
}

function placeLine(p) {
  return `${p.placeName} - ${p.category}`;
}

function routeCard(route) {
  const sp = route.startPlace;
  const places = [route.startPlace, ...route.nextPlaces];

  const saves = nfmt(sp?.saves);
  const views = nfmt(sp?.views);
  const marked = isMarked(sp?.bookMarked);
  const title = buildRouteName(route);

  return `
    <article class="route-card"
             data-is-route-card="true"
             data-route-id="${sp.placeId}"
             style="border:1px solid #e5e7eb;border-radius:12px;background:#fff;padding:14px 12px;margin:8px 4px; cursor:pointer;">
      <div style="display:flex;gap:12px;margin:4px 0 12px;">
        <div style="flex:1;height:88px;border-radius:14px;background:#e5e7eb;"></div>
        <div style="flex:1;height:88px;border-radius:14px;background:#e5e7eb;"></div>
        <div style="flex:1;height:88px;border-radius:14px;background:#e5e7eb;"></div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div style="font-size:23px;font-weight:800;letter-spacing:-.2px;">
          ${title}
          <span style="margin-left:10px;color:#9aa3af;font-weight:600;font-size:14px;">
            ${saves} saves - ${views} views
          </span>
        </div>
        <button class="bm ${marked ? "on" : ""}"
                title="북마크" aria-label="북마크"
                data-place-id="${sp.placeId}"
                style="background:#fff;border:0;padding:6px;cursor:pointer;">
          ${bmSvg(marked)}
        </button>
      </div>

      <div style="color:#6b7280;font-size:18px;line-height:1.35;margin-top:10px;">
        <div>${placeLine(places[0])}</div>
        <div>${placeLine(places[1])}</div>
        <div>${placeLine(places[2])}</div>
      </div>

      <div style="margin-top:10px;color:#1e88f7;font-weight:700;font-size:22px;display:flex;align-items:center;gap:8px;">
        <span style="color:#60a5fa;font-size:22px;">ⓘ</span> AI description
      </div>
    </article>`;
}

// 장소명으로 해당 루트를 찾고 패널 오픈
function openDetailWithDummy(placeName) {
  const all = MOCK_DATA.result || [];
  const matched = all.filter(
    (r) =>
      r.startPlace.placeName === placeName ||
      r.nextPlaces.some((np) => np.placeName === placeName)
  );

  const list = matched.length ? matched : all;
  detailTitle.textContent = placeName || "Location Name";

  // 카드 렌더
  detailBody.innerHTML = list.map(routeCard).join("");

  // [추가] 지도에 상위 5개 경로를 회색 라인으로 그립니다.
  RouteGraph.drawRoutes(list, { limit: 5 });

  // 사이드바 열기
  appEl.classList.add("details-open");

  // + 버튼 예시 동작
  btnAdd.onclick = () => {
    console.log("담기:", placeName);
  };
}

btnBack?.addEventListener("click", () =>
  appEl.classList.remove("details-open")
);

/* ==========================================================
    3) 좌측 결과 리스트( .result-card ) 클릭 시 사이드바 열기
    ========================================================== */
const resultsEl = document.getElementById("results");
if (resultsEl) {
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
    if (!name) return;
    openDetailWithDummy(name);
  });
}

/* ==========================================================
    4) 북마크 토글 및 경로 카드 클릭 이벤트 처리
    ========================================================== */
detailBody.addEventListener("click", (e) => {
  const btn = e.target.closest(".bm");
  if (btn) {
    const on = !btn.classList.contains("on");
    btn.classList.toggle("on", on);
    btn.innerHTML = bmSvg(on);
    return;
  }

  // 루트 카드 클릭 시 동작
  const card = e.target.closest(".route-card");
  if (!card) return;

  // 모든 카드의 선택 상태를 초기화하고 클릭된 카드에만 선택 상태를 적용
  document
    .querySelectorAll(".route-card")
    .forEach((c) => (c.style.borderColor = "#e5e7eb"));
  card.style.borderColor = "#1e88f7"; // 선택된 카드는 파란색 테두리로 변경

  // 선택된 루트 정보 추출
  const routeId = card.dataset.routeId;
  const route = MOCK_DATA.result.find(
    (r) => String(r.startPlace.placeId) === routeId
  );

  if (route) {
    // 지도에 강조 표시를 요청하는 사용자 정의 이벤트 발생
    window.dispatchEvent(
      new CustomEvent("route:highlight", {
        detail: {
          route: route,
        },
      })
    );
  }
});
