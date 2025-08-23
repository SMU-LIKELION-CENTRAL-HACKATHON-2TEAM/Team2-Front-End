window.addEventListener("DOMContentLoaded", () => {
  // SDK가 로드된 뒤, maps 모듈을 초기화
  kakao.maps.load(() => {
    // [추가] 배포된 백엔드 서버의 주소를 입력하세요.
    const BACKEND_API_URL = "https://내-백엔드-주소.vercel.app";

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
      // openDetailWithDummy 함수가 있으므로, 이 함수는 검색 결과 클릭 시
      // 상세 패널을 여는 대신 getRoute.js의 함수를 호출하도록 변경할 수 있습니다.
      // 여기서는 getRoute.js의 openDetailWithDummy를 직접 호출하는 것을 권장합니다.
      openDetailWithDummy(place.place_name); // getRoute.js에 정의된 함수 호출

      // 아래는 기존 로직 백업
      // detailTitle.textContent = place.place_name || "Location Name";
      // appEl.classList.add("details-open");
      // if (pos) map.panTo(pos);
    }

    function closeDetail() {
      appEl.classList.remove("details-open");
      RouteGraph.clearAll();
    }

    // [수정] 백엔드에서 이미지 URL을 비동기로 가져오도록 함수 변경
    async function createCard(p, pos) {
      const cat =
        (p.category_name || "").split(">").pop()?.trim() || "Category";
      const addr = p.road_address_name || p.address_name || "";

      const card = document.createElement("div");
      card.className = "result-card";

      // 일단 UI 뼈대만 먼저 생성
      card.innerHTML = `
        <div class="thumb" style="background-color: #e5e7eb;"></div>
        <div class="title">${p.place_name}<span class="open-txt">Open</span></div>
        <div class="meta">
          <div class="sub">${cat} – ${addr}</div>
          <div class="chev" aria-hidden="true">
            <img src="/images/greyRightBtn.svg" alt="">
          </div>
        </div>
        <div class="aid-line">AI description</div>
      `;

      // 이미지를 가져오는 동안 다른 UI가 먼저 표시되도록 비동기 처리
      try {
        const response = await fetch(
          `${BACKEND_API_URL}/api/photo?placeName=${encodeURIComponent(
            p.place_name
          )}`
        );
        const data = await response.json();
        if (data.imageUrl) {
          const thumbDiv = card.querySelector(".thumb");
          thumbDiv.style.backgroundImage = `url('${data.imageUrl}')`;
        }
      } catch (error) {
        console.error("사진을 불러오지 못했습니다:", p.place_name, error);
      }

      card.addEventListener("click", () => openDetail(p, pos));
      return card;
    }

    function doSearch(q) {
      if (!q || !q.trim()) return;
      clearResults();
      resultMeta.textContent = "검색 중…";

      const positions = [];
      let total = 0;

      const handle = (data, status, pagination) => {
        if (status !== kakao.maps.services.Status.OK) {
          if (total === 0) resultMeta.textContent = "검색 결과가 없습니다.";
          return;
        }

        const frag = document.createDocumentFragment();
        // [수정] createCard가 비동기 함수가 되었으므로 Promise 배열로 처리
        const cardPromises = [];

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
          // kakao.maps.event.addListener(marker, "click", () => openDetail(p, pos));
          // getRoute.js의 openDetailWithDummy를 사용하므로 마커 클릭 이벤트도 통일
          kakao.maps.event.addListener(marker, "click", () =>
            openDetailWithDummy(p.place_name)
          );

          // Promise를 배열에 추가
          cardPromises.push(createCard(p, pos));
        });

        // 모든 카드가 생성될 때까지 기다렸다가 DOM에 추가
        Promise.all(cardPromises).then((cards) => {
          cards.forEach((card) => frag.appendChild(card));
          resultsEl.appendChild(frag);

          // DOM 업데이트 후 나머지 로직 처리
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
            if (typeof pagination.nextPage === "function")
              pagination.nextPage();
            else pagination.gotoPage(pagination.current + 1);
            return;
          }

          resultMeta.textContent = `${total}개의 검색 결과`;
          fitBounds(positions);
        });
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
    doSearch("보성 녹차밭");

    window.map = map;
    window.dispatchEvent(new CustomEvent("map:ready", { detail: { map } }));
  });

  // 이 부분은 kakao.maps.load 콜백 밖에서도 유효해야 합니다.
  const detailPanel = document.getElementById("detailPanel");
  const btnAdd = document.getElementById("detailAdd");
  btnAdd.addEventListener("click", () => {
    const lat = parseFloat(detailPanel.dataset.lat);
    const lng = parseFloat(detailPanel.dataset.lng);
    if (isNaN(lat) || isNaN(lng)) return;

    // map 객체는 window를 통해 접근 가능
    if (window.map) {
      const pos = new kakao.maps.LatLng(lat, lng);
      new kakao.maps.Marker({ position: pos, map: window.map, zIndex: 1 });
      window.map.panTo(pos);
    }
  });
});
