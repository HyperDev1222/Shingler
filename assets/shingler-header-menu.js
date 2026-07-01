/**
 * Desktop hover interaction for Shingler mega-menu panels.
 * Mobile drawer behaviour is unchanged.
 */
class ShinglerHeaderMenuHover {
  static DESKTOP_QUERY = '(min-width: 990px)';

  static init() {
    const headerWrapper = document.querySelector('.header-wrapper');
    const overlay = headerWrapper?.querySelector('.shingler-mega-menu__overlay');
    const menuItems = document.querySelectorAll('header-menu');

    if (!headerWrapper || !menuItems.length) return;

    let closeTimer = null;

    const isDesktop = () => window.matchMedia(ShinglerHeaderMenuHover.DESKTOP_QUERY).matches;

    const updateLayout = () => {
      const headerGroup =
        document.querySelector('#shopify-section-group-header-group') ||
        document.querySelector('.shopify-section-group-header-group') ||
        headerWrapper.closest('.shopify-section-group-header-group') ||
        headerWrapper;

      document.documentElement.style.setProperty(
        '--shingler-header-bottom',
        `${Math.round(headerGroup.getBoundingClientRect().bottom)}px`
      );
    };

    const closeAllMenus = () => {
      document.querySelectorAll('header-menu details.shingler-mega-menu[open]').forEach((details) => {
        details.removeAttribute('open');
        details.querySelector('summary')?.setAttribute('aria-expanded', 'false');
        details.dispatchEvent(new Event('toggle'));
      });

      headerWrapper.classList.remove('header-wrapper--mega-open');
      overlay?.setAttribute('hidden', '');
      overlay?.setAttribute('aria-hidden', 'true');
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
      overlay?.removeAttribute('hidden');
      overlay?.setAttribute('aria-hidden', 'false');
    };

    const scheduleClose = () => {
      if (!isDesktop()) return;

      clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        if (headerWrapper.matches(':hover') || headerWrapper.contains(document.activeElement)) return;
        closeAllMenus();
      }, 180);
    };

    menuItems.forEach((menuEl) => {
      const details = menuEl.querySelector('details.shingler-mega-menu');
      if (!details) return;

      const summary = details.querySelector('summary');

      menuEl.addEventListener('mouseenter', () => openMenu(details));
      menuEl.addEventListener('focusin', () => openMenu(details));

      summary?.addEventListener('click', (event) => {
        if (isDesktop()) event.preventDefault();
      });
    });

    headerWrapper.addEventListener('mouseleave', scheduleClose);
    headerWrapper.addEventListener('mouseenter', () => clearTimeout(closeTimer));

    headerWrapper.addEventListener('focusout', (event) => {
      if (headerWrapper.contains(event.relatedTarget)) return;
      scheduleClose();
    });

    overlay?.addEventListener('click', closeAllMenus);

    window.addEventListener('resize', updateLayout);
    window.addEventListener('scroll', () => {
      if (headerWrapper.classList.contains('header-wrapper--mega-open')) updateLayout();
    }, { passive: true });

    window.matchMedia(ShinglerHeaderMenuHover.DESKTOP_QUERY).addEventListener('change', (event) => {
      if (event.matches) return;
      closeAllMenus();
    });

    updateLayout();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ShinglerHeaderMenuHover.init();
});
