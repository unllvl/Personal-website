// Theme toggle (persists in localStorage, defaults to system preference)
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Timeline filters (filtering happens per-card so a parallel group only
// hides once none of its cards match; the group itself hides too)
const filterButtons = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineCards = document.querySelectorAll('.timeline-card[data-type]');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    timelineCards.forEach(card => {
      const match = filter === 'all' || card.dataset.type === filter;
      card.classList.toggle('is-hidden', !match);
    });

    timelineItems.forEach(item => {
      const cards = item.querySelectorAll('.timeline-card[data-type]');
      const anyVisible = Array.from(cards).some(c => !c.classList.contains('is-hidden'));
      item.classList.toggle('is-hidden', !anyVisible);
    });
  });
});

// Degree span rail: a thin bar next to everything that happened during the
// Bachelor's degree, sized against the two [data-degree-bar] boundary items
// so it stays right even as content/images change the layout.
const degreeBar = document.querySelector('.degree-span-bar');
const degreeTop = document.querySelector('[data-degree-bar="top"]');
const degreeBottom = document.querySelector('[data-degree-bar="bottom"]');

function positionDegreeBar() {
  if (!degreeBar || !degreeTop || !degreeBottom) return;
  const containerRect = degreeBar.parentElement.getBoundingClientRect();
  const topRect = degreeTop.getBoundingClientRect();
  const bottomRect = degreeBottom.getBoundingClientRect();
  degreeBar.style.top = `${topRect.top - containerRect.top}px`;
  degreeBar.style.height = `${bottomRect.bottom - topRect.top}px`;
}

positionDegreeBar();
window.addEventListener('load', positionDegreeBar);
window.addEventListener('resize', positionDegreeBar);
window.addEventListener('scroll', () => requestAnimationFrame(positionDegreeBar), { passive: true });

// Scroll-reveal animation for timeline items
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

timelineItems.forEach(item => observer.observe(item));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
