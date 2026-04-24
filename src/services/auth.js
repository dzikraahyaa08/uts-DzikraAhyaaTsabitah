const KC_URL = 'https://id.tif.uin-suska.ac.id';
const CLIENT_ID = 'setoran-mobile-dev';
const CLIENT_SECRET = 'aqJp3xnXKudgC7RMOshEQP7ZoVKWzoSl'; // Mengembalikan ke 'l' kecil karena menyebabkan invalid client credentials

export async function login(username, password) {
  const details = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'password',
    'username': username,
    'password': password,
    'scope': 'openid profile email'
  };

  const formBody = new URLSearchParams(details).toString();

  const res = await fetch(`${KC_URL}/realms/dev/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || 'Login Gagal');

  localStorage.setItem('token', data.access_token);
  if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
  if (data.id_token) localStorage.setItem('id_token', data.id_token);
  
  return data;
}

export async function logout() {
  const idToken = localStorage.getItem('id_token');
  if (!idToken) return;

  const details = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'id_token_hint': idToken
  };

  const formBody = new URLSearchParams(details).toString();

  try {
    await fetch(`${KC_URL}/realms/dev/protocol/openid-connect/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');
  }
}

export async function refreshToken() {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) throw new Error("No refresh token available");

  const details = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token
  };

  const formBody = new URLSearchParams(details).toString();

  const res = await fetch(`${KC_URL}/realms/dev/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || 'Refresh token failed');

  localStorage.setItem('token', data.access_token);
  if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
  if (data.id_token) localStorage.setItem('id_token', data.id_token);

  return data;
}

export async function getUserInfo() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No token available");

  const res = await fetch(`${KC_URL}/realms/dev/protocol/openid-connect/userinfo`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Optional: Handle token refresh logic here if unauthorized
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to fetch userinfo');
  }

  return await res.json();
}