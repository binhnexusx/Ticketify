export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const setAccessToken = (token: string) => {
  const storage = localStorage.getItem('refreshToken') ? localStorage : sessionStorage;
  storage.setItem('token', token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
};

export const resetSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('refreshToken');
};

export const removeAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
};

export const logout = () => {
  resetSession();
  window.location.href = '/login';
};
