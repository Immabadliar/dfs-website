document.getElementById('year').textContent = new Date().getFullYear();

const revealItems = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0.04 });
  revealItems.forEach((item) => observer.observe(item));
  window.setTimeout(() => revealItems.forEach((item) => item.classList.add('visible')), 1200);
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

