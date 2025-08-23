(function (global) {
  const API_BASE = "http://3.39.89.75:8080"; // TODO: 운영은 https 권장

  const ACCESS_KEY = "accessToken";
  const REFRESH_KEY = "refreshToken";

  let refreshingPromise = null; // 동시 갱신 방지

  // ===== Storage =====
  const getAccess = () => localStorage.getItem(ACCESS_KEY);
  const getRefresh = () => localStorage.getItem(REFRESH_KEY);
  const setTokens = ({ access, refresh }) => {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  };
  const clearTokens = () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  };

  // ===== Auth API =====
  async function login(email, password) {
    const res = await fetch(API_BASE + "/api/v1/auths/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!json?.isSuccess) throw new Error(json?.message || "로그인 실패");
    setTokens({
      access: json.result?.jwtAccessToken,
      refresh: json.result?.jwtRefreshToken,
    });
    return json;
  }

  // ※ 실제 리프레시 경로는 백엔드에 맞게 바꿔주세요.
  const REFRESH_PATH = "/api/v1/auths/refresh"; // 예: /reissue, /token/refresh 등

  async function refresh() {
    if (refreshingPromise) return refreshingPromise; // 중복 호출 방지

    const refreshToken = getRefresh();
    if (!refreshToken) {
      clearTokens();
      throw new Error("리프레시 토큰 없음");
    }

    refreshingPromise = fetch(API_BASE + REFRESH_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then((r) => r.json())
      .then((j) => {
        if (!j?.isSuccess) throw new Error(j?.message || "토큰 갱신 실패");
        setTokens({
          access: j.result?.jwtAccessToken,
          refresh: j.result?.jwtRefreshToken,
        });
        return j.result?.jwtAccessToken;
      })
      .finally(() => {
        refreshingPromise = null;
      });

    return refreshingPromise;
  }

  // ===== Fetch 래퍼 (JSON) =====
  async function apiFetch(path, options = {}) {
    const token = getAccess();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let res = await fetch(API_BASE + path, { ...options, headers });

    // 만료/401 → 리프레시 후 1회 재시도
    if (res.status === 401) {
      try {
        await refresh();
        const token2 = getAccess();
        const headers2 = { ...headers, Authorization: `Bearer ${token2}` };
        res = await fetch(API_BASE + path, { ...options, headers: headers2 });
      } catch (e) {
        clearTokens();
        throw e;
      }
    }

    // JSON 응답만 처리
    return res.json();
  }

  // ===== Fetch 래퍼 (raw; blob 등) =====
  async function apiFetchRaw(path, options = {}) {
    const token = getAccess();
    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let res = await fetch(API_BASE + path, { ...options, headers });

    if (res.status === 401) {
      try {
        await refresh();
        const token2 = getAccess();
        const headers2 = { ...headers, Authorization: `Bearer ${token2}` };
        res = await fetch(API_BASE + path, { ...options, headers: headers2 });
      } catch (e) {
        clearTokens();
        throw e;
      }
    }
    return res; // 호출한 쪽에서 blob/text/json 선택
  }

  function requireAuth() {
    if (!getAccess()) location.href = "login.html";
  }

  // 전역 노출
  global.AccessAPI = {
    // storage
    getToken: getAccess,
    setToken: (t) => setTokens({ access: t }),
    clearToken: clearTokens,

    // auth
    login,
    refresh,
    requireAuth,

    // fetch
    apiFetch,
    apiFetchRaw,

    // 기타
    getRefresh,
    setTokens,
    API_BASE,
  };
})(window);
