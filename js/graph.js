/**
 * 지도에 경로(라인, 마커)를 그리고 관리하는 모듈
 */
const RouteGraph = (() => {
  let _map = null; // 카카오 맵 인스턴스
  const _polylines = []; // 그려진 모든 회색 경로 라인들을 저장하는 배열
  const _grayMarkers = []; // 그려진 모든 회색 경로의 마커들
  let _highlightedPolyline = null; // 강조 표시된 파란색 라인
  const _highlightedMarkers = []; // 강조 표시된 경로의 마커들

  // [추가] SVG를 이용해 원형 마커 이미지를 생성하는 헬퍼 함수
  /**
   * 지정된 색상의 원형 마커 이미지를 생성합니다.
   * @param {string} color - 원의 채우기 색상 (예: '#1e88f7')
   * @returns {kakao.maps.MarkerImage}
   */
  const createCircleMarkerImage = (color) => {
    const size = new kakao.maps.Size(12, 12); // 마커 이미지의 크기
    const options = {
      offset: new kakao.maps.Point(6, 6), // 마커 이미지의 좌표 중심점
    };
    // SVG 문자열을 생성. data URI 스킴을 사용하여 이미지 소스로 직접 사용
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">' +
      `<circle cx="6" cy="6" r="6" fill="${color}" />` +
      "</svg>";
    const imageUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svg
    )}`;

    return new kakao.maps.MarkerImage(imageUrl, size, options);
  };

  /**
   * 지도에 그려진 모든 경로 관련 오버레이(라인, 마커)를 지웁니다.
   */
  function clearAll() {
    _polylines.forEach((line) => line.setMap(null));
    _polylines.length = 0;
    _grayMarkers.forEach((marker) => marker.setMap(null));
    _grayMarkers.length = 0;
    clearHighlight();
  }

  /**
   * 강조 표시(파란 라인, 마커)를 지도에서 지웁니다.
   */
  function clearHighlight() {
    if (_highlightedPolyline) {
      _highlightedPolyline.setMap(null);
      _highlightedPolyline = null;
    }
    _highlightedMarkers.forEach((marker) => marker.setMap(null));
    _highlightedMarkers.length = 0;
  }

  /**
   * 주어진 경로 데이터로부터 좌표 배열을 생성합니다.
   */
  function getPathFromRoute(route) {
    const places = [route.startPlace, ...route.nextPlaces];
    return places.map((p) => new kakao.maps.LatLng(p.lat, p.lng));
  }

  /**
   * 모듈을 초기화합니다.
   */
  function init(mapInstance) {
    _map = mapInstance;
    window.addEventListener("route:highlight", (e) => {
      if (e.detail && e.detail.route) {
        highlightRoute(e.detail.route);
      }
    });
  }

  /**
   * 여러 개의 경로를 지도에 회색 라인과 마커로 그립니다.
   */
  function drawRoutes(routesToDraw, options = {}) {
    clearAll();

    const limit = options.limit || routesToDraw.length;
    const limitedRoutes = routesToDraw.slice(0, limit);
    const grayDotImage = createCircleMarkerImage("#888888"); // 회색 점 이미지 생성

    limitedRoutes.forEach((route) => {
      const linePath = getPathFromRoute(route);

      // 회색 라인 그리기
      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 4,
        strokeColor: "#888888",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      });
      polyline.setMap(_map);
      _polylines.push(polyline);

      // [추가] 각 좌표에 회색 점 마커 찍기
      linePath.forEach((pos) => {
        const marker = new kakao.maps.Marker({
          position: pos,
          image: grayDotImage,
        });
        marker.setMap(_map);
        _grayMarkers.push(marker);
      });
    });
  }

  /**
   * 특정 경로 하나를 지도에 파란색 라인과 마커로 강조 표시합니다.
   */
  function highlightRoute(route) {
    clearHighlight();

    const path = getPathFromRoute(route);
    const bounds = new kakao.maps.LatLngBounds();
    const blueDotImage = createCircleMarkerImage("#1e88f7"); // 파란색 점 이미지 생성

    // [수정] 기본 마커 대신 파란색 점 마커 생성
    path.forEach((pos) => {
      const marker = new kakao.maps.Marker({
        position: pos,
        image: blueDotImage, // 생성한 원형 이미지로 설정
        zIndex: 3, // 강조 마커가 위로 오도록 z-index 설정
      });
      _highlightedMarkers.push(marker);
      marker.setMap(_map);
      bounds.extend(pos);
    });

    // 파란색 라인 생성
    _highlightedPolyline = new kakao.maps.Polyline({
      path: path,
      strokeWeight: 6,
      strokeColor: "#1e88f7",
      strokeOpacity: 1,
      strokeStyle: "solid",
      zIndex: 2, // 강조 라인이 일반 라인보다 위로 오도록 설정
    });

    _highlightedPolyline.setMap(_map);
    _map.setBounds(bounds);
  }

  return {
    init,
    drawRoutes,
    clearAll,
  };
})();
