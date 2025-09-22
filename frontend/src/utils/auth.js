// small auth helpers
export function saveAuth(token, user) {
localStorage.setItem('cc_token', token);
localStorage.setItem('cc_user', JSON.stringify(user));
}

export function clearAuth() {
localStorage.removeItem('cc_token');
localStorage.removeItem('cc_user');
}

export function getUser() {
try { return JSON.parse(localStorage.getItem('cc_user')); } catch { return null; }
}