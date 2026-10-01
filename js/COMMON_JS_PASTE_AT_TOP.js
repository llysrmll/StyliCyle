// ===== Paste this at the VERY TOP of your existing common.js =====
// ===== Then change the last line of common.js from  setupFloatingChat();  to:
// =====   if (!isAuthPage) setupFloatingChat();

const API = '../api/';
const isAuthPage = document.body.classList.contains('auth-login-page') ||
                   document.body.classList.contains('auth-page');

// One helper for every request to PHP. Pass an object as body for JSON, or FormData for uploads.
async function api(path, options = {}) {
  const opts = { credentials: 'same-origin', ...options };
  if (opts.body && !(opts.body instanceof FormData)) {
    opts.headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    opts.body = JSON.stringify(opts.body);
  }
  let res;
  try {
    res = await fetch(API + path, opts);
  } catch (err) {
    return { success: false, error: 'Cannot reach the server. Is Apache running, and are you using http://localhost?' };
  }
  let data;
  try {
    data = await res.json();
  } catch (err) {
    return { success: false, error: 'The server sent an unexpected response.' };
  }
  if (res.status === 401 && !isAuthPage) window.location.href = 'index.html';
  return data;
}

// Always escape database text before putting it into innerHTML
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

// Protect every page except login/signup, and add a Logout button to the navbar
if (!isAuthPage) {
  api('auth/me.php').then(res => {
    if (res.success) window.currentUser = res.user;
  });

  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    const logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.className = 'nav-button';
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', async () => {
      await api('auth/logout.php', { method: 'POST' });
      window.location.href = 'index.html';
    });
    navActions.appendChild(logoutBtn);
  }
}
// ===== end of paste =====
