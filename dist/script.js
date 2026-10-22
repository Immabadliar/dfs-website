const root = document.documentElement;
const glow = document.querySelector('.cursor-glow');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

if (!reduced) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });

  document.querySelectorAll('.magnetic').forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * .14}px, ${y * .14}px)`;
    });
    item.addEventListener('pointerleave', () => item.style.transform = '');
  });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${y * -4}deg)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      root.style.setProperty('--scroll', window.scrollY);
      const mark = document.querySelector('.hero-mark');
      if (mark) mark.style.transform = `translateY(${window.scrollY * .18}px) rotate(${-8 + window.scrollY * .008}deg)`;
      ticking = false;
    });
  }, { passive: true });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .16 });

document.querySelectorAll('.reveal, .split-text').forEach((el) => observer.observe(el));
document.querySelectorAll('.game-card').forEach((card) => card.style.setProperty('--hover', card.dataset.color));
