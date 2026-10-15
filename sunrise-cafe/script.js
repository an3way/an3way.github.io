const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-category]').forEach(drink => {
    drink.hidden = button.dataset.filter !== 'all' && button.dataset.filter !== drink.dataset.category;
  });
}));
document.getElementById('year').textContent = new Date().getFullYear();
