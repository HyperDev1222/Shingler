/**
 * Desktop hover interaction for Shingler mega-menu panels.
 * Mobile drawer behaviour is unchanged.
 */
class ShinglerHeaderMenuHover {
  static DESKTOP_QUERY = '(min-width: 990px)';
  static OVERLAY_ID = 'shingler-mega-menu-overlay';

  static init() {
    const headerWrapper = document.querySelector('.header-wrapper');
    const menuItems = document.querySelectorAll('header-menu');

    if (!headerWrapper || !menuItems.length) return;

    const overlay = ShinglerHeaderMenuHover.ensureOverlay(headerWrapper);
    let closeTimer = null;

    const isDesktop = () => window.matchMedia(ShinglerHeaderMenuHover.DESKTOP_QUERY).matches;

    const getHeaderGroup = () =>
      document.querySelector('#shopify-section-group-header-group') ||
      document.querySelector('.shopify-section-group-header-group') ||
      headerWrapper.closest('.shopify-section-group-header-group') ||
      document.querySelector('.section-header') ||
      headerWrapper;

    const updateLayout = () => {
      document.documentElement.style.setProperty(
        '--shingler-header-bottom',
        `${Math.round(getHeaderGroup().getBoundingClientRect().bottom)}px`
      );
    };

    const closeAllMenus = () => {
      document.querySelectorAll('header-menu details.shingler-mega-menu[open]').forEach((details) => {
        details.removeAttribute('open');
        details.querySelector('summary')?.setAttribute('aria-expanded', 'false');
        details.dispatchEvent(new Event('toggle'));
      });

      headerWrapper.classList.remove('header-wrapper--mega-open');
      document.body.classList.remove('shingler-mega-menu-open');
      overlay.classList.remove('is-visible');
      overlay.setAttribute('aria-hidden', 'true');
    };

    const openMenu = (details) => {
      if (!isDesktop()) return;

      clearTimeout(closeTimer);
      updateLayout();

      document.querySelectorAll('header-menu details.shingler-mega-menu[open]').forEach((openDetails) => {
        if (openDetails === details) return;
        openDetails.removeAttribute('open');
        openDetails.querySelector('summary')?.setAttribute('aria-expanded', 'false');
        openDetails.dispatchEvent(new Event('toggle'));
      });

      if (!details.hasAttribute('open')) {
        details.setAttribute('open', '');
        details.querySelector('summary')?.setAttribute('aria-expanded', 'true');
        details.dispatchEvent(new Event('toggle'));
      }

      headerWrapper.classList.add('header-wrapper--mega-open');
      document.body.classList.add('shingler-mega-menu-open');
      overlay.classList.add('is-visible');
      overlay.setAttribute('aria-hidden', 'false');
    };

    const cancelClose = () => clearTimeout(closeTimer);

    const scheduleClose = () => {
      if (!isDesktop()) return;

      clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        if (headerWrapper.matches(':hover') || overlay.matches(':hover')) return;
        closeAllMenus();
      }, 200);
    };

    menuItems.forEach((menuEl) => {
      const details = menuEl.querySelector('details.shingler-mega-menu');
      if (!details) return;

      const summary = details.querySelector('summary');
      const panel = details.querySelector('.shingler-mega-menu__content');

      menuEl.addEventListener('mouseenter', () => openMenu(details));
      menuEl.addEventListener('focusin', () => openMenu(details));

      panel?.addEventListener('mouseenter', cancelClose);
      panel?.addEventListener('mouseleave', scheduleClose);

      summary?.addEventListener('click', (event) => {
        if (isDesktop()) event.preventDefault();
      });
    });

    headerWrapper.addEventListener('mouseenter', cancelClose);
    headerWrapper.addEventListener('mouseleave', scheduleClose);
    overlay.addEventListener('mouseenter', cancelClose);
    overlay.addEventListener('mouseleave', scheduleClose);
    overlay.addEventListener('click', closeAllMenus);

    headerWrapper.addEventListener('focusout', (event) => {
      if (headerWrapper.contains(event.relatedTarget)) return;
      scheduleClose();
    });

    window.addEventListener('resize', updateLayout);
    window.addEventListener(
      'scroll',
      () => {
        if (document.body.classList.contains('shingler-mega-menu-open')) updateLayout();
      },
      { passive: true }
    );

    window.matchMedia(ShinglerHeaderMenuHover.DESKTOP_QUERY).addEventListener('change', (event) => {
      if (event.matches) return;
      closeAllMenus();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeAllMenus();
    });

    updateLayout();
  }

  static ensureOverlay(headerWrapper) {
    let overlay = document.getElementById(ShinglerHeaderMenuHover.OVERLAY_ID);

    if (!overlay) {
      overlay = headerWrapper.querySelector('.shingler-mega-menu__overlay');
    }

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'shingler-mega-menu__overlay';
    }

    overlay.id = ShinglerHeaderMenuHover.OVERLAY_ID;
    overlay.setAttribute('aria-hidden', 'true');

    if (overlay.parentElement !== document.body) {
      document.body.appendChild(overlay);
    }

    return overlay;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ShinglerHeaderMenuHover.init();
});
