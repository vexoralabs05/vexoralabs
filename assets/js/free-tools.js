(() => {
  const search = document.getElementById('toolSearch');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  if (!search) return;

  const cards = [...document.querySelectorAll('.tool-card, .ft-tool-card')];
  const empty = document.getElementById('emptyState');
  const status = document.getElementById('searchStatus');

  function filterTools() {
    const term = search.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const searchableText = ((card.dataset.search || '') + ' ' + card.innerText).toLowerCase();
      const match = searchableText.includes(term);
      card.hidden = !match;
      if (match) visible++;
    });

    if (empty) {
      empty.hidden = visible !== 0;
      empty.classList.toggle('show', visible === 0);
    }

    if (status) {
      status.textContent =
        term === ''
          ? `Showing all ${cards.length} tools`
          : `Showing ${visible} of ${cards.length} tools`;
    }
  }

  search.addEventListener('input', filterTools);

  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      search.focus();
    }
    if (event.key === 'Escape' && document.activeElement === search) {
      search.value = '';
      filterTools();
      search.blur();
    }
  });
})();
