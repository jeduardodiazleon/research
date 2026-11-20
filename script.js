const list=document.getElementById("publicationList");
const search=document.getElementById("searchInput");
const count=document.getElementById("resultCount");
const empty=document.getElementById("emptyState");
const filters=document.getElementById("filters");
let activeFilter="All";
function esc(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function card(pub,index){
 const article=document.createElement("article");article.className="publication";
 article.innerHTML=`
  <div class="pub-main">
   <div class="pub-meta"><span class="pub-number">${String(index+1).padStart(2,"0")}</span><span>${esc(pub.venue)}${pub.dateLabel?` · ${esc(pub.dateLabel)}`:""}</span></div>
   <h3>${esc(pub.title)}</h3>
   <p class="authors">${esc(pub.authors)}</p>
   <div class="tags">${pub.tags.map(t=>`<span>${esc(t)}</span>`).join("")}</div>
   <div class="pub-links"><a href="${esc(pub.url)}" target="_blank" rel="noreferrer">Read paper <span>↗</span></a></div>
  </div>
  <div class="abstract-block"><div class="abstract-label">ABSTRACT</div><p>${esc(pub.abstract)}</p></div>
  <a class="figure-link" href="${esc(pub.url)}" target="_blank" rel="noreferrer" aria-label="Open paper: ${esc(pub.title)}"><img src="${esc(pub.image)}" alt="Research figure related to ${esc(pub.title)}" loading="lazy"><span class="figure-caption">VIEW PAPER ↗</span></a>`;
 return article;
}
function render(){
 const q=search.value.trim().toLowerCase();
 const filtered=window.PUBLICATIONS.filter(pub=>{
  const text=[pub.title,pub.authors,pub.venue,pub.abstract,...pub.tags].join(" ").toLowerCase();
  const queryMatch=text.includes(q);
  const filterMatch=activeFilter==="All"||pub.tags.some(t=>t.toLowerCase().includes(activeFilter.toLowerCase()))||
   (activeFilter==="Banking"&&/bank|banca|financial system/i.test(text))||
   (activeFilter==="Financial Stability"&&/financial stability|solvency|bank failures/i.test(text))||
   (activeFilter==="Regulation"&&/regulation|basel|licensing/i.test(text))||
   (activeFilter==="Fintech"&&/fintech|open banking|digital innovation|digital currency/i.test(text));
  return queryMatch&&filterMatch;
 });
 list.replaceChildren(...filtered.map(pub=>card(pub,window.PUBLICATIONS.indexOf(pub))));
 count.textContent=`${filtered.length} ${filtered.length===1?"publication":"publications"}`;
 empty.hidden=filtered.length!==0;
}
search.addEventListener("input",render);
filters.addEventListener("click",event=>{const button=event.target.closest("button[data-filter]");if(!button)return;activeFilter=button.dataset.filter;filters.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b===button));render();});
document.getElementById("year").textContent=new Date().getFullYear();render();
