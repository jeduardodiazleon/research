# Research · José Eduardo Díaz León

Academic research and publications portfolio, published with GitHub Pages.

Plain HTML, CSS and JavaScript. No build step.

## Files

```
index.html        Page structure
style.css         Design
script.js         Theme filters, search, abstracts, citations
publications.js   The list of publications. The file you edit to add papers
assets/images/    One figure per paper
assets/favicon.svg
.nojekyll
```

## Add a publication

1. Put the figure in `assets/images/` (PNG or JPG, about 600 px wide is enough).
2. Copy an entry in `publications.js` and fill in the fields:
   - `date` as `YYYY-MM-DD`: it sorts the list, newest first.
   - `dateLabel`: what the page shows, for example `June 2026`.
   - `year`: used in the copied citation (`n.d.` if there is no year).
   - `theme`: one of `stability`, `regulation`, `credit`, `fintech`.
3. Commit and push. The site updates in about a minute.

To rename a theme or change its color, edit `THEMES` at the top of `script.js`.

## Run locally

```
python3 -m http.server 8000
```
