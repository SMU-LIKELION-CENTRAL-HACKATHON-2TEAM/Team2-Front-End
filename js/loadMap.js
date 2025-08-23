//loadMap.js

window.addEventListener("DOMContentLoaded", () => {
  kakao.maps.load(() => {
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
      // getRoute.js 의 openDetailWithDummy 호출
      openDetailWithDummy(place.place_name);
      if (pos) map.panTo(pos);
    }

    function closeDetail() {
      appEl.classList.remove("details-open");
      RouteGraph.clearAll();
    }

    async function createCard(p, pos) {
      const cat =
        (p.category_name || "").split(">").pop()?.trim() || "Category";
      const addr = p.road_address_name || p.address_name || "";

      const card = document.createElement("div");
      card.className = "result-card";

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

          kakao.maps.event.addListener(marker, "click", () =>
            openDetailWithDummy(p.place_name)
          );

          cardPromises.push(createCard(p, pos));
        });

        Promise.all(cardPromises).then((cards) => {
          cards.forEach((card) => frag.appendChild(card));
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
    doSearch("경복궁");

    window.map = map;
    window.dispatchEvent(new CustomEvent("map:ready", { detail: { map } }));
  });

  const detailPanel = document.getElementById("detailPanel");
  const btnAdd = document.getElementById("detailAdd");

  btnAdd.addEventListener("click", () => {
    const lat = parseFloat(detailPanel.dataset.lat);
    const lng = parseFloat(detailPanel.dataset.lng);
    if (isNaN(lat) || isNaN(lng)) return;

    if (window.map) {
      const pos = new kakao.maps.LatLng(lat, lng);
      new kakao.maps.Marker({ position: pos, map: window.map, zIndex: 1 });
      window.map.panTo(pos);
    }
  });
});

// DOM 요소 참조
const toggleInput = document.getElementById("toggleSwitch");
const panelSearch = document.getElementById("panel-search");
const panelBookmark = document.getElementById("panel-bookmark");

function updatePanelUI(isBookmark) {
  if (isBookmark) {
    panelSearch.classList.remove("is-active");
    panelBookmark.classList.add("is-active");
  } else {
    panelBookmark.classList.remove("is-active");
    panelSearch.classList.add("is-active");
  }
}

toggleInput.addEventListener("change", function () {
  updatePanelUI(toggleInput.checked);
});

updatePanelUI(toggleInput.checked);
