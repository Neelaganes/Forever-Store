// Keep the local default aligned with backend/server.js. Deployments can
// override this with VITE_BACKEND_URL at build time.
const LOCAL_BACKEND = 'http://localhost:8001';

const trimSlash = (url = '') => String(url).replace(/\/+$/, '');

export const getBackendUrl = () => {
  const envUrl = trimSlash(import.meta.env.VITE_BACKEND_URL || '');
  const localUrl = trimSlash(import.meta.env.VITE_LOCAL_BACKEND_URL || LOCAL_BACKEND);

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return localUrl;
    }
  }

  return envUrl || localUrl;
};
