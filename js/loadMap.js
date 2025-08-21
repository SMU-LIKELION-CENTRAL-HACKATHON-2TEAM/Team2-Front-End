window.addEventListener("DOMContentLoaded", () => {
  // SDK가 로드된 뒤, maps 모듈을 초기화
  kakao.maps.load(() => {
    const appEl = document.getElementById("app");
    const resultsEl = document.getElementById("results");
    const resultMeta = document.getElementById("resultMeta");
    const queryEl = document.getElementById("query");
    const btnSearch = document.getElementById("btnSearch");
    const btnBookmark = document.getElementById("btnBookmark");
    const btnBack = document.getElementById("detailBack");
    const btnAdd = document.getElementById("detailAdd");
    const detailPanel = document.getElementById("detailPanel");
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");
    const map = new kakao.maps.Map(document.getElementById("map"), {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 7,
    });
    const places = new kakao.maps.services.Places();
    const markers = [];

    // [수정] RouteGraph 초기화: map 객체가 생성된 직후에 실행합니다.
    RouteGraph.init(map);

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
      detailBody.innerHTML = ""; // 필요 시 내용 채우기
      appEl.classList.add("details-open");
      if (pos) map.panTo(pos);
      detailPanel.dataset.lat = place.y;
      detailPanel.dataset.lng = place.x;
      setTimeout(() => btnBack.focus(), 0);
    }

    function closeDetail() {
      appEl.classList.remove("details-open");
      // [추가] 상세 패널을 닫을 때 지도에 그려진 모든 경로를 지웁니다.
      RouteGraph.clearAll();
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

    function doSearch(q) {
      if (!q || !q.trim()) return;
      clearResults();
      resultMeta.textContent = "검색 중…";

      const positions = [];
      let total = 0;
      const frag = document.createDocumentFragment();

      const handle = (data, status, pagination) => {
        if (status !== kakao.maps.services.Status.OK) {
          if (total === 0) resultMeta.textContent = "검색 결과가 없습니다.";
          return;
        }

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

        resultsEl.appendChild(frag);
        resultMeta.textContent = `${total}개 로딩 중…`;

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

        resultMeta.textContent = `${total}개의 검색 결과`;
        fitBounds(positions);
      };

      places.keywordSearch(q, handle, { location: map.getCenter(), page: 1 });
    }

    document.getElementById("searchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      doSearch(queryEl.value);
    });
    btnSearch.addEventListener("click", () => doSearch(queryEl.value));
    btnBookmark.addEventListener("click", () =>
      btnBookmark.classList.toggle("bookmark-on")
    );
    btnBack.addEventListener("click", closeDetail);

    // 초기 검색어
    doSearch("김치");

    window.map = map;
    window.dispatchEvent(new CustomEvent("map:ready", { detail: { map } }));
  });

  btnAdd.addEventListener("click", () => {
    const lat = parseFloat(detailPanel.dataset.lat);
    const lng = parseFloat(detailPanel.dataset.lng);
    if (isNaN(lat) || isNaN(lng)) return;

    const pos = new kakao.maps.LatLng(lat, lng);
    const marker = new kakao.maps.Marker({ position: pos, map, zIndex: 1 });
    // markers 배열은 kakao.maps.load 콜백 스코프 안에 있으므로 직접 접근이 어렵습니다.
    // 이 기능이 중요하다면 markers 배열을 전역으로 빼거나 다른 방식으로 관리해야 합니다.
    map.panTo(pos);
  });
});
