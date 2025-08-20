window.addEventListener("DOMContentLoaded", () => {
  // SDK가 로드된 뒤, maps 모듈을 초기화
  kakao.maps.load(() => {
    // ===== DOM refs =====
    const appEl = document.getElementById("app");
    const resultsEl = document.getElementById("results");
    const resultMeta = document.getElementById("resultMeta");
    const queryEl = document.getElementById("query");
    const btnSearch = document.getElementById("btnSearch");
    const btnBookmark = document.getElementById("btnBookmark");
    const btnBack = document.getElementById("detailBack");
    const detailTitle = document.getElementById("detailTitle");
    const detailAddr = document.getElementById("detailAddr");
    const detailBody = document.getElementById("detailBody");

    // 빈 상태 템플릿 (side-body 안에 있어야 함)
    const emptyNoInput = document.getElementById("empty-no-input");
    const emptyNoResult = document.getElementById("empty-no-result");

    // ===== Kakao Map / Places =====
    const map = new kakao.maps.Map(document.getElementById("map"), {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 7,
    });
    const places = new kakao.maps.services.Places();
    const markers = [];

    // ===== Empty state helpers =====
    function hideEmpty() {
      if (emptyNoInput) emptyNoInput.classList.add("hidden");
      if (emptyNoResult) emptyNoResult.classList.add("hidden");
    }
    function showEmpty(kind) {
      // 결과 영역 숨기고 초기화
      resultsEl.style.display = "none";
      resultsEl.innerHTML = "";
      markers.forEach((m) => m.setMap(null));
      markers.length = 0;

      hideEmpty();
      if (kind === "no-input" && emptyNoInput)
        emptyNoInput.classList.remove("hidden");
      if (kind === "no-result" && emptyNoResult)
        emptyNoResult.classList.remove("hidden");
    }
    function showResults() {
      hideEmpty();
      resultsEl.style.display = "";
    }

    // ===== Utils =====
    function clearResults() {
      markers.forEach((m) => m.setMap(null));
      markers.length = 0;
      resultsEl.innerHTML = "";
    }

    function fitBounds(positions) {
      if (!positions.length) return;
      const b = new kakao.maps.LatLngBounds();
      positions.forEach((p) => b.extend(p));
      map.setBounds(b);
    }

    function openDetail(place, pos) {
      detailTitle.textContent = place.place_name || "Location Name";
      detailAddr.textContent =
        place.road_address_name || place.address_name || "";
      detailBody.innerHTML = ""; // 필요 시 내용 채우기
      appEl.classList.add("details-open");
      if (pos) map.panTo(pos);
      setTimeout(() => btnBack && btnBack.focus(), 0);
    }

    function closeDetail() {
      appEl.classList.remove("details-open");
    }

    function createCard(p, pos) {
      const cat =
        (p.category_name || "").split(">").pop()?.trim() || "Category";
      const addr = p.road_address_name || p.address_name || "";

      const card = document.createElement("div");
      card.className = "result-card";
      card.innerHTML = `
        <div class="thumb"></div>
        <div class="title">${p.place_name}<span class="open-txt">Open</span></div>
        <div class="meta">
          <div class="sub">${cat} – ${addr}</div>
          <div class="chev" aria-hidden="true">
            <img src="/images/greyRightBtn.svg" alt="">
          </div>
        </div>
        <div class="aid-line">AI description</div>
      `;
      card.addEventListener("click", () => openDetail(p, pos));
      return card;
    }

    // ===== Search =====
    function doSearch(q) {
      // 1) 입력 없음 → 미입력 빈상태
      if (!q || !q.trim()) {
        showEmpty("no-input");
        if (resultMeta) resultMeta.textContent = "검색어를 입력하세요.";
        return;
      }

      // 2) 정상 검색
      clearResults();
      showResults(); // 결과 영역을 기본으로 열어둠(로딩 중 표시)
      if (resultMeta) resultMeta.textContent = "검색 중…";

      const positions = [];
      let total = 0;
      const frag = document.createDocumentFragment();

      const handle = (data, status, pagination) => {
        // 3) 에러/결과 없음 페이지 단위 처리
        if (status !== kakao.maps.services.Status.OK) {
          if (total === 0) {
            showEmpty("no-result");
            if (resultMeta) resultMeta.textContent = "검색 결과가 없습니다.";
          }
          return;
        }

        // 4) 결과 누적
        data.forEach((p) => {
          total += 1;
          const pos = new kakao.maps.LatLng(p.y, p.x);
          positions.push(pos);

          const marker = new kakao.maps.Marker({
            position: pos,
            map,
            zIndex: 1,
          });
          markers.push(marker);
          kakao.maps.event.addListener(marker, "click", () =>
            openDetail(p, pos)
          );

          frag.appendChild(createCard(p, pos));
        });

        // 5) 리스트 반영 & 로딩 메타
        resultsEl.appendChild(frag);
        if (resultMeta) resultMeta.textContent = `${total}개 로딩 중…`;

        // 6) 페이지네이션 계속?
        const hasNext =
          pagination &&
          ((pagination.hasNextPage &&
            typeof pagination.nextPage === "function") ||
            (pagination.current &&
              pagination.last &&
              pagination.current < pagination.last &&
              typeof pagination.gotoPage === "function"));

        if (hasNext) {
          if (typeof pagination.nextPage === "function") pagination.nextPage();
          else pagination.gotoPage(pagination.current + 1);
          return;
        }

        // 7) 모든 페이지 끝
        if (total === 0) {
          showEmpty("no-result");
          if (resultMeta) resultMeta.textContent = "검색 결과가 없습니다.";
          return;
        }

        // 결과 있음
        showResults();
        if (resultMeta) resultMeta.textContent = `${total}개의 검색 결과`;
        fitBounds(positions);
      };

      places.keywordSearch(q, handle, { location: map.getCenter(), page: 1 });
    }

    // ===== Events =====
    document.getElementById("searchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      doSearch(queryEl.value);
    });
    btnSearch.addEventListener("click", () => doSearch(queryEl.value));
    btnBookmark.addEventListener("click", () =>
      btnBookmark.classList.toggle("bookmark-on")
    );
    btnBack && btnBack.addEventListener("click", closeDetail);

    // ===== 초기 상태: 미입력 빈화면 노출 (원하면 기본 검색어 호출로 교체) =====
    showEmpty("no-input");
    if (resultMeta)
      resultMeta.textContent = "검색어를 입력하면 결과가 표시됩니다.";

    // 기존처럼 초기 검색어를 바로 수행하고 싶다면 아래 주석 해제
    // doSearch("김치");
  });
});

// DOM 요소 참조
const toggleInput = document.getElementById("toggleSwitch");
const panelSearch = document.getElementById("panel-search");
const panelBookmark = document.getElementById("panel-bookmark");

// 초기 상태 설정
function updatePanelUI(isBookmark) {
  if (isBookmark) {
    panelSearch.classList.remove("is-active");
    panelBookmark.classList.add("is-active");
  } else {
    panelBookmark.classList.remove("is-active");
    panelSearch.classList.add("is-active");
  }
}

// 이벤트 연결
toggleInput.addEventListener("change", function () {
  updatePanelUI(toggleInput.checked);
});

// 페이지 로드시 초기 상태 반영
updatePanelUI(toggleInput.checked);
