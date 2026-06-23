/* ==========================================================================
   LogicLab - PWA Registration & Update Manager
   Registers the service worker, listens for updates, and prompts user
   Version: 1.0.1
   ========================================================================== */

(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) {
    console.info('[PWA] Service workers not supported in this browser.');
    return;
  }

  // Register on full page load to avoid blocking initial render
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        console.info('[PWA] Service worker registered, scope:', reg.scope);

        // ---- Listen for waiting worker (an update is available) ----
        if (reg.waiting) {
          showUpdateToast(reg);
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateToast(reg);
            }
          });
        });

        // ---- Check for updates every 60 minutes while page is open ----
        setInterval(() => {
          reg.update().catch(() => {});
        }, 60 * 60 * 1000);
      })
      .catch((err) => {
        console.warn('[PWA] Service worker registration failed:', err);
      });

    // ---- Reload when new SW takes control ----
    let isReloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (isReloading) return;
      isReloading = true;
      window.location.reload();
    });
  });

  /* --------------------- Update toast helper --------------------- */
  function showUpdateToast(reg) {
    if (document.getElementById('pwaUpdateToast')) return;

    const toast = document.createElement('div');
    toast.id = 'pwaUpdateToast';
    toast.style.cssText = `
      position: fixed; left: 50%; bottom: calc(var(--bottom-nav-height, 64px) + 1rem);
      transform: translateX(-50%);
      background: var(--secondary, #0F172A); color: #fff;
      padding: 0.75rem 1.25rem; border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      display: flex; align-items: center; gap: 0.75rem;
      z-index: 10000; font-size: 0.875rem;
      max-width: 90vw;
    `;
    toast.innerHTML = `
      <span>🔄 New version available</span>
      <button id="pwaReloadBtn" style="
        background: var(--primary, #2563EB); color: #fff;
        border: none; padding: 0.4rem 0.9rem; border-radius: 8px;
        font-weight: 600; cursor: pointer;
      ">Reload</button>
      <button id="pwaDismissBtn" style="
        background: transparent; color: #cbd5e1;
        border: none; cursor: pointer; font-size: 1rem;
      ">✕</button>
    `;
    document.body.appendChild(toast);

    document.getElementById('pwaReloadBtn')?.addEventListener('click', () => {
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else {
        window.location.reload();
      }
    });

    document.getElementById('pwaDismissBtn')?.addEventListener('click', () => {
      toast.remove();
    });
  }

  /* --------------------- Install prompt capture --------------------- */
  window.deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredInstallPrompt = e;
    document.dispatchEvent(new CustomEvent('pwa-installable'));
    console.info('[PWA] Install prompt available');
  });

  window.addEventListener('appinstalled', () => {
    console.info('[PWA] App installed');
    window.deferredInstallPrompt = null;
  });
})();