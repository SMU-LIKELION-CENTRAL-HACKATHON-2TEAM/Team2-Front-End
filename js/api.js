// api.js
const API_BASE_URL = "https://api-ieum.store/api/v1";

// 토큰 가져오기
function getAccessToken() {
  return localStorage.getItem("accessToken");
}

// 공통 fetch 함수
async function apiRequest(endpoint, options = {}) {
  const token = getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // 토큰이 있으면 헤더에 추가
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  return response.json();
}

// 예시: 사용자 정보 불러오기
export async function getUserProfile() {
  return apiRequest("/members/profile");
}

// 예시: 게시글 가져오기
export async function getPosts() {
  return apiRequest("/posts");
}
