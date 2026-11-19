const list = document.getElementById("publicationList");
const search = document.getElementById("searchInput");
const count = document.getElementById("resultCount");
const empty = document.getElementById("emptyState");
const filters = document.getElementById("filters");
let activeFilter = "All";

function card(pub, index) {
  const article = document.createElement("article");
  article.className = "publication";
  article.innerHTML = `
    <div class="pub-main">
      <div class="pub-meta"><span class="pub-number">${String(index + 1).padStart(2, "0")}</span><span>${pub.venue}</span></div>
      <h3>${pub.title}</h3>
      <p class="authors">${pub.authors}${pub.year !== "—" ? ` · ${pub.year}` : ""}</p>
      <div class="tags">${pub.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
      <div class="pub-links"><a href="${pub.url}" target="_blank" rel="noreferrer">Read paper <span>↗</span></a></div>
      ${pub.note ? `<p class="editor-note">${pub.note}: ${pub.abstract}</p>` : ""}
    </div>
    <div class="abstract-block">
      <div class="abstract-label">ABSTRACT <span></span></div>
      <p>${pub.note ? "El resumen de esta publicación está pendiente de confirmar para evitar asociar un contenido que podría pertenecer a otro artículo." : pub.abstract}</p>
    </div>
    <a class="figure-link" href="${pub.url}" target="_blank" rel="noreferrer" aria-label="Open paper: ${pub.title}">
      <img src="${pub.image}" alt="Figure related to ${pub.title}" loading="lazy">
      <span class="figure-caption">VIEW PAPER ↗</span>
    </a>`;
  return article;
}

function render() {
  const q = search.value.trim().toLowerCase();
  const filtered = window.PUBLICATIONS.filter(pub => {
    const text = [pub.title, pub.authors, pub.venue, pub.abstract, ...pub.tags].join(" ").toLowerCase();
    const matchesQuery = text.includes(q);
    const matchesFilter = activeFilter === "All" || pub.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase())) ||
      (activeFilter === "Banking" && /banc|bank|sistema financiero/i.test(text)) ||
      (activeFilter === "Financial Stability" && /estabilidad financiera|solvencia|quiebras/i.test(text)) ||
      (activeFilter === "Regulation" && /regul|basilea|licencia/i.test(text)) ||
      (activeFilter === "Fintech" && /fintech|open banking|innovaciones financieras|moneda digital/i.test(text));
    return matchesQuery && matchesFilter;
  });
  list.replaceChildren(...filtered.map(pub => card(pub, window.PUBLICATIONS.indexOf(pub))));
  count.textContent = `${filtered.length} ${filtered.length === 1 ? "publication" : "publications"}`;
  empty.hidden = filtered.length !== 0;
}
search.addEventListener("input", render);
filters.addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  filters.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === button));
  render();
});
document.getElementById("year").textContent = new Date().getFullYear();
render();
