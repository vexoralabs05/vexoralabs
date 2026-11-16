(() => {
  const search = document.getElementById('toolSearch');
  if (!search) return;
  const cards = [...document.querySelectorAll('.tool-card')];
  const empty = document.getElementById('emptyState');
  const status = document.getElementById('searchStatus');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  function filterTools() {
    const term = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const match = (card.dataset.search + ' ' + card.innerText).toLowerCase().includes(term);
      card.hidden = !match;
      if (match) visible++;
    });
    empty.hidden = visible !== 0;
    status.textContent = `Showing ${visible} of ${cards.length} tools`;
  }
  search.addEventListener('input', filterTools);
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); search.focus();
    }
    if (event.key === 'Escape' && document.activeElement === search) {
      search.value = ''; filterTools(); search.blur();
    }
  });
})();