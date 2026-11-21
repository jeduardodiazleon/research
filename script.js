(function () {
  "use strict";

  /* Theme names and colors. The keys match the "theme" field in publications.js */
  var THEMES = {
    stability:  { name: "Banking & stability",   color: "#0b2545" },
    regulation: { name: "Prudential regulation", color: "#1f6f78" },
    credit:     { name: "Credit & inclusion",    color: "#b07d12" },
    fintech:    { name: "Fintech & payments",    color: "#6e4c8e" }
  };
  var AUTHOR = /((José|Eduardo) )?Díaz/; // highlighted in author lists

  var pubs = (window.PUBLICATIONS || []).slice().sort(function (a, b) {
    return b.date.localeCompare(a.date);
  });
  pubs.forEach(function (p, i) { p._id = "pub-" + (pubs.length - i); });

  var state = { theme: "all", q: "" };

  var $ = function (id) { return document.getElementById(id); };
  var list = $("list"), count = $("count"), empty = $("empty"), search = $("search");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function matches(p) {
    if (state.theme !== "all" && p.theme !== state.theme) return false;
    if (!state.q) return true;
    var text = [p.title, p.authors, p.venue, p.abstract, p.dateLabel, (p.tags || []).join(" "),
      THEMES[p.theme] ? THEMES[p.theme].name : ""].join(" ").toLowerCase();
    return state.q.split(/\s+/).every(function (w) { return text.indexOf(w) !== -1; });
  }
  function citation(p) {
    return p.authors + " (" + p.year + "). " + p.title + ". " + p.venue + ". " + p.url;
  }

  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- Theme filter chips ---------- */
  function renderChips() {
    var box = $("themes");
    var html = '<button type="button" class="chip" data-theme="all" aria-pressed="true">All themes <span class="n">' + pubs.length + "</span></button>";
    Object.keys(THEMES).forEach(function (key) {
      var n = pubs.filter(function (p) { return p.theme === key; }).length;
      if (!n) return;
      html += '<button type="button" class="chip" data-theme="' + key + '" aria-pressed="false" style="--c:' + THEMES[key].color + '">' +
        '<span class="dot" aria-hidden="true"></span>' + esc(THEMES[key].name) + ' <span class="n">' + n + "</span></button>";
    });
    box.innerHTML = html;
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-theme]");
      if (!b) return;
      state.theme = b.dataset.theme;
      update();
    });
  }

  /* ---------- Publication list ---------- */
  function entry(p) {
    var th = THEMES[p.theme] || { name: "", color: "#66798f" };
    var authors = esc(p.authors).replace(AUTHOR, "<strong>$&</strong>");
    var art = document.createElement("article");
    art.className = "pub";
    art.id = p._id;
    art.innerHTML =
      '<div class="pub-meta">' +
        '<span class="date">' + esc(p.dateLabel) + "</span>" +
        '<span class="venue">' + esc(p.venue) + "</span>" +
        '<span class="theme" style="--c:' + th.color + '">' + esc(th.name) + "</span>" +
      "</div>" +
      "<div>" +
        '<h3><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + "</a></h3>" +
        '<p class="authors">' + authors + "</p>" +
        '<p class="abstract clamped" id="' + p._id + '-abs">' + esc(p.abstract) + "</p>" +
        '<button type="button" class="more" aria-expanded="false" aria-controls="' + p._id + '-abs">Show full abstract</button>' +
        ((p.tags || []).length ? '<p class="tags"><span>Keywords</span> ' + p.tags.map(esc).join(", ") + "</p>" : "") +
        '<div class="actions">' +
          '<a class="btn" href="' + esc(p.url) + '" target="_blank" rel="noopener">Read paper (PDF)</a>' +
          '<button type="button" class="btn ghost cite">Copy citation</button>' +
        "</div>" +
      "</div>" +
      '<figure class="pub-figure">' +
        '<a href="' + esc(p.url) + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">' +
          '<img src="' + esc(p.image) + '" alt="" loading="lazy"></a>' +
        "<figcaption>Figure from the paper</figcaption>" +
      "</figure>";

    art.querySelector(".more").addEventListener("click", function () {
      var abs = art.querySelector(".abstract");
      var open = abs.classList.toggle("clamped") === false;
      this.setAttribute("aria-expanded", String(open));
      this.textContent = open ? "Show less" : "Show full abstract";
    });
    art.querySelector(".cite").addEventListener("click", function () {
      var text = citation(p);
      var done = function () { toast("Citation copied"); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    });
    return art;
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  var entries = {};
  function renderList() {
    pubs.forEach(function (p) { entries[p._id] = entry(p); list.appendChild(entries[p._id]); });
  }

  /* ---------- Update on filter/search ---------- */
  function update() {
    var shown = 0;
    pubs.forEach(function (p) {
      var ok = matches(p);
      entries[p._id].hidden = !ok;
      if (ok) shown++;
    });
    document.querySelectorAll(".chip").forEach(function (c) {
      c.setAttribute("aria-pressed", String(c.dataset.theme === state.theme));
    });
    count.textContent = shown === pubs.length
      ? pubs.length + " publications"
      : shown + " of " + pubs.length + " publications";
    empty.hidden = shown !== 0;
    if (!shown) {
      $("empty-text").textContent = state.q
        ? "No publications match “" + search.value.trim() + "”" + (state.theme !== "all" ? " in " + THEMES[state.theme].name : "") + "."
        : "No publications in this theme yet.";
    }
  }

  search.addEventListener("input", function () { state.q = search.value.trim().toLowerCase(); update(); });
  $("clear").addEventListener("click", function () { state.q = ""; state.theme = "all"; search.value = ""; update(); search.focus(); });

  renderChips();
  renderList();
  update();
  $("year").textContent = new Date().getFullYear();
})();
