const searchInput = document.getElementById('searchInput');
const filterButtons = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.publication')];
const emptyState = document.getElementById('emptyState');
let activeFilter = 'all';
function updateCards(){
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const tags = (card.dataset.tags || '').toLowerCase().split(/\s+/);
    const searchable = (card.dataset.search + ' ' + card.innerText).toLowerCase();
    const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
    const matchesSearch = !query || searchable.includes(query);
    card.hidden = !(matchesFilter && matchesSearch);
    if(!card.hidden) visible++;
  });
  emptyState.hidden = visible !== 0;
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(b => b.classList.toggle('active', b === button));
  updateCards();
}));
searchInput.addEventListener('input', updateCards);
document.getElementById('year').textContent = new Date().getFullYear();
updateCards();
