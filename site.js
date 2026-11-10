const menu=document.getElementById('menu-button'),nav=document.getElementById('mobile-nav');menu?.addEventListener('click',()=>{nav.hidden=!nav.hidden;menu.setAttribute('aria-expanded',String(!nav.hidden))});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav){nav.hidden=true;menu.setAttribute('aria-expanded','false')}});
const search=document.getElementById('paper-search'),year=document.getElementById('paper-year'),venue=document.getElementById('paper-venue');if(search){const rows=[...document.querySelectorAll('.pub-entry')],zh=document.documentElement.lang==='zh-CN';function filter(){let count=0;const q=search.value.trim().toLowerCase();rows.forEach(row=>{const show=row.textContent.toLowerCase().includes(q)&&(year.value==='all'||row.dataset.year===year.value)&&(venue.value==='all'||row.dataset.venue===venue.value);row.hidden=!show;if(show)count++});document.getElementById('filter-count').textContent=zh?count+' 篇论文':count+' '+(count===1?'paper':'papers');document.getElementById('no-results').hidden=count!==0}for(const el of [search,year,venue])el.addEventListener('input',filter);document.getElementById('publication-filter').addEventListener('submit',e=>e.preventDefault());document.getElementById('reset-filters').addEventListener('click',()=>{search.value='';year.value=venue.value='all';filter();search.focus()})}

/* First-party visit log: no UI, cookies or public log data. */
(()=>{
  if(location.protocol!=='https:'||location.hostname!=='huyang-thu.github.io'||window.self!==window.top)return;
  if(window.__hyVisitorLoggerInstalled)return;
  const endpoint="https://hy-homepage-visitors.hy6356.workers.dev/collect";
  if(!endpoint)return;
  try{const u=new URL(endpoint);if(u.protocol!=='https:'||!u.hostname.endsWith('.workers.dev')||u.pathname!=='/collect'||u.search||u.hash)return;}catch{return;}
  window.__hyVisitorLoggerInstalled=true;
  function record(){
    try{
      const id=crypto.randomUUID();
      fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({id,path:location.pathname}),credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store',keepalive:true}).catch(()=>{});
    }catch{/* A blocked or unavailable collector must not affect the page. */}
  }
  record();
  addEventListener('pageshow',event=>{if(event.persisted)record();});
})();
