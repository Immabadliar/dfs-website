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

const cards = [...document.querySelectorAll('.experience-card')];
const universeIds = cards.map((card) => card.dataset.universe);
const number = new Intl.NumberFormat('en-US');

async function refreshRobloxStats() {
  try {
    const response = await fetch(`/api/roblox?universeIds=${universeIds.join(',')}`);
    if (!response.ok) throw new Error('Roblox request failed');
    const payload = await response.json();
    let totalCCU = 0;
    let totalVisits = 0;
    cards.forEach((card) => {
      const game = payload.data.find((item) => String(item.id) === card.dataset.universe);
      const ccu = Number(game?.playing ?? 0);
      const visits = Number(game?.visits ?? card.dataset.visits ?? 0);
      card.querySelector('.ccu').textContent = number.format(ccu);
      card.querySelector('.visits').textContent = number.format(visits);
      totalCCU += ccu;
      totalVisits += visits;
    });
    document.getElementById('total-ccu').textContent = number.format(totalCCU);
    document.getElementById('total-visits').textContent = number.format(totalVisits);
  } catch {
    // Keep the server-fetched fallback numbers visible if Roblox blocks a client request.
  }
}

refreshRobloxStats();
window.setInterval(refreshRobloxStats, 60_000);
