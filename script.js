// script.js — robust mobile dropdown toggles (open & close reliably)
// - Delegated handlers
// - Prevents propagation issues
// - Keyboard support (Enter / Space / Escape)
// - Ensures aria-expanded and aria-hidden stay in sync

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // open / close mobile panel helpers
  function openMobile() {
    if (!mobileMenu) return;
    mobileMenu.hidden = false;
    hamburger?.setAttribute('aria-expanded', 'true');
    hamburger?.setAttribute('aria-label', 'Close menu');
    document.documentElement.style.overflow = 'hidden';
    const first = mobileMenu.querySelector('button, a');
    if (first) first.focus();
  }
  function closeMobile() {
    if (!mobileMenu) return;
    mobileMenu.hidden = true;
    hamburger?.setAttribute('aria-expanded', 'false');
    hamburger?.setAttribute('aria-label', 'Open menu');
    document.documentElement.style.overflow = '';
    hamburger?.focus();
  }

  hamburger?.addEventListener('click', () => {
    if (!mobileMenu) return;
    if (mobileMenu.hidden) openMobile();
    else closeMobile();
  });
  mobileClose?.addEventListener('click', closeMobile);

  // Ensure mobile dropdowns are closed helper
  function collapseMobilePanel(panel, toggle) {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', 'false');
    if (panel) {
      panel.classList.remove('show');
      panel.setAttribute('aria-hidden', 'true');
    }
  }
  function expandMobilePanel(panel, toggle) {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', 'true');
    if (panel) {
      panel.classList.add('show');
      panel.setAttribute('aria-hidden', 'false');
    }
  }

  // Delegated click handler for mobile menu (handles toggles + links)
  mobileMenu?.addEventListener('click', (e) => {
    const toggle = e.target.closest && e.target.closest('.mobile-drop-toggle');
    if (toggle) {
      // clicked a mobile toggle (or its inner span/arrow)
      e.preventDefault();
      e.stopPropagation();

      const panelId = toggle.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      // Toggle: close if open, open if closed
      if (isExpanded) collapseMobilePanel(panel, toggle);
      else expandMobilePanel(panel, toggle);

      return; // done
    }

    // if clicked a normal link inside mobile panel -> close the whole panel (after short delay)
    const clickedLink = e.target.closest && e.target.closest('a');
    if (clickedLink) {
      setTimeout(closeMobile, 120);
      return;
    }

    // if clicked the mobile login button
    if (e.target.id === 'mobileLogin' || e.target.closest && e.target.closest('#mobileLogin')) {
      setTimeout(closeMobile, 120);
      return;
    }
  });

  // Keyboard support on mobile panel: Enter/Space to toggle, Escape to collapse focused toggle
  mobileMenu?.addEventListener('keydown', (e) => {
    const toggle = e.target.closest && e.target.closest('.mobile-drop-toggle');
    if (!toggle) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle.click();
    } else if (e.key === 'Escape') {
      // collapse this toggle
      collapseMobilePanel(document.getElementById(toggle.getAttribute('aria-controls')), toggle);
      toggle.blur();
    }
  });

  // Extra: clicking outside any open mobile dropdowns should collapse them (but keep panel open)
  document.addEventListener('click', (e) => {
    if (!mobileMenu || mobileMenu.hidden) return;
    // if click is inside mobileMenu, ignore (handled above)
    if (e.target.closest && e.target.closest('#mobileMenu')) return;

    // clicked outside mobile menu: collapse any open mobile submenus
    mobileMenu.querySelectorAll('.mobile-drop-toggle[aria-expanded="true"]').forEach((openToggle) => {
      const panel = document.getElementById(openToggle.getAttribute('aria-controls'));
      collapseMobilePanel(panel, openToggle);
    });
  });

  // Desktop dropdown toggles: keep existing accessible behavior
  document.querySelectorAll('.drop-toggle').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.setAttribute('aria-hidden', String(expanded));
    });
    // hover open/close
    let hoverTimer;
    btn.parentElement?.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
      btn.setAttribute('aria-expanded', 'true');
      if (panel) panel.setAttribute('aria-hidden', 'false');
    });
    btn.parentElement?.addEventListener('mouseleave', () => {
      hoverTimer = setTimeout(() => {
        btn.setAttribute('aria-expanded', 'false');
        if (panel) panel.setAttribute('aria-hidden', 'true');
      }, 180);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        btn.setAttribute('aria-expanded', 'false');
        if (panel) panel.setAttribute('aria-hidden', 'true');
        btn.blur();
      }
    });
  });

  // Close mobile panel with Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.hidden) {
      closeMobile();
    }
  });
});




// ---------- Footer newsletter validation & redirect ----------
(function () {
  const form = document.getElementById('footerNewsletterForm');
  const email = document.getElementById('footerNewsletterEmail');
  const msg = document.getElementById('footerNewsletterMsg');
  const yearEl = document.getElementById('footerYear');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (!form || !email || !msg) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.textContent = '';

    const val = email.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!val) {
      msg.style.color = 'rgba(255,160,100,0.95)';
      msg.textContent = 'Please enter your email address.';
      email.focus();
      return;
    }

    if (!re.test(val)) {
      msg.style.color = 'rgba(255,160,100,0.95)';
      msg.textContent = 'Please enter a valid email address.';
      email.focus();
      return;
    }

    // success: show message briefly then redirect to 404 page
    msg.style.color = 'var(--accent)';
    msg.textContent = 'Thanks — redirecting…';

    // simulate brief delay to show message, then redirect (to your 404 page)
    setTimeout(() => {
      // change path if your 404 page is in a different location
      window.location.href = '404page.html';
    }, 700);
  });
})();






// ---------- Hero search form validation & submit ----------
(function () {
  const form = document.getElementById('searchForm');
  const locationInput = document.getElementById('location');
  const msg = document.getElementById('searchMsg');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.textContent = '';
    const locationVal = locationInput.value.trim();

    if (!locationVal) {
      msg.style.color = 'rgba(255,160,100,0.98)';
      msg.textContent = 'Please enter a location (city, neighbourhood or project).';
      locationInput.focus();
      return;
    }

    // all good → build query and redirect (simulate)
    const tx = document.getElementById('txType').value;
    const prop = document.getElementById('propType').value;
    const budget = document.getElementById('budget').value;

    // create a simple query string (for real app you'd call API or go to results page)
    const q = new URLSearchParams({ q: locationVal, tx, prop, budget }).toString();

    msg.style.color = 'var(--accent)';
    msg.textContent = 'Searching…';

    // simulate a short delay then redirect to results page (replace URL as needed)
    setTimeout(() => {
      // change this to your real results page
      window.location.href = `404page.html`;
    }, 600);
  });
})();



// Scroll animation
window.addEventListener("scroll", () => {
  const elements = document.querySelectorAll(".fade-up, .fade-right");

  elements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (position < screenHeight - 100) {
      el.classList.add("show");
    }
  });
});



// FAQ Accordion Logic
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".faq-item");
  const search = document.getElementById("faq-search");
  const openAll = document.getElementById("open-all");
  const closeAll = document.getElementById("close-all");

  // Initialize all closed
  items.forEach(item => {
    const btn = item.querySelector(".faq-q");
    const panel = item.querySelector(".faq-a");
    btn.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  });

  // Toggle
  items.forEach(item => {
    const btn = item.querySelector(".faq-q");
    const panel = item.querySelector(".faq-a");

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !open);
      panel.hidden = open;
    });
  });

  // Open All
  openAll.addEventListener("click", () => {
    items.forEach(item => {
      const btn = item.querySelector(".faq-q");
      const panel = item.querySelector(".faq-a");
      btn.setAttribute("aria-expanded", "true");
      panel.hidden = false;
    });
  });

  // Close All
  closeAll.addEventListener("click", () => {
    items.forEach(item => {
      const btn = item.querySelector(".faq-q");
      const panel = item.querySelector(".faq-a");
      btn.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    });
  });

  // Search filter
  search.addEventListener("input", e => {
    const q = e.target.value.toLowerCase();

    items.forEach(item => {
      const question = item.querySelector(".faq-q").innerText.toLowerCase();
      const answer = item.querySelector(".faq-a").innerText.toLowerCase();
      item.style.display = (question.includes(q) || answer.includes(q))
        ? "block"
        : "none";
    });
  });
});




// ============================================
// STACKLY TESTIMONIALS AUTO-SLIDER FUNCTION
// ============================================

const testiTrack = document.querySelector(".stackly-testi-track");
let testiSlides = Array.from(testiTrack.children);

let slideIndex = 0;
let slideGap = 20; // same gap as CSS
let slideWidth = testiSlides[0].getBoundingClientRect().width + slideGap;

// Duplicate slides to allow infinite scrolling
testiSlides.forEach(slide => {
  const clone = slide.cloneNode(true);
  testiTrack.appendChild(clone);
});

// Auto slide function
function moveTestimonialSlider() {
  slideIndex++;
  testiTrack.style.transform = `translateX(-${slideIndex * slideWidth}px)`;

  // Reset position when half slides passed (because we duplicated them)
  if (slideIndex >= testiSlides.length) {
    slideIndex = 0;

    setTimeout(() => {
      testiTrack.style.transition = "none";           // turn off transition
      testiTrack.style.transform = "translateX(0px)"; // instant reset
      setTimeout(() => {
        testiTrack.style.transition = "transform 0.6s ease";
      }, 30);
    }, 600); // wait for current animation to finish
  }
}

// Auto move every 3 seconds
setInterval(moveTestimonialSlider, 3000);



// STACKLY pricing toggle & reveal

// Billing toggle: switches between monthly and yearly
(function () {
  const toggle = document.getElementById('stackly-billing-toggle');
  const priceElements = document.querySelectorAll('.stackly-price-amount');

  function setBilling(isYearly) {
    // update aria
    toggle.setAttribute('aria-checked', String(isYearly));
    // update each price element
    priceElements.forEach(el => {
      const monthly = el.getAttribute('data-monthly');
      const yearly = el.getAttribute('data-yearly');
      if (!monthly || !yearly) return;
      if (isYearly) {
        // show yearly price (divide by 12 as an example discount display)
        if (yearly === 'custom') {
          el.textContent = 'Contact';
        } else {
          el.textContent = yearly;
        }
        // update period
        el.nextElementSibling && (el.nextElementSibling.textContent = '/yr');
      } else {
        if (monthly === 'custom') {
          el.textContent = 'Contact';
          el.nextElementSibling && (el.nextElementSibling.textContent = '');
        } else {
          el.textContent = monthly;
          el.nextElementSibling && (el.nextElementSibling.textContent = '/mo');
        }
      }
    });
  }

  // initial state: monthly
  let yearly = false;
  setBilling(yearly);

  // click / keyboard toggle
  toggle.addEventListener('click', () => {
    yearly = !yearly;
    setBilling(yearly);
  });
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      yearly = !yearly;
      setBilling(yearly);
    }
  });
})();

// Reveal cards on scroll with stagger
(function () {
  const cards = Array.from(document.querySelectorAll('.stackly-plan-card'));
  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = cards.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('is-visible'), idx * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  cards.forEach(c => obs.observe(c));
})();

