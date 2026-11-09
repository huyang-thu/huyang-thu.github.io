/* The original animation files stay byte-identical; adapt only the embedded view. */
document.querySelectorAll('.animation-player').forEach(player=>{
  const zh=player.dataset.lang==='zh', viewport=player.querySelector('.player-viewport'), start=player.querySelector('.animation-start'), status=player.querySelector('.player-status'), zoom=player.querySelector('.animation-zoom'), fullscreen=player.querySelector('.animation-fullscreen');
  let frame, loading=false;
  function embeddedSizeBridge(){
    let previous=0;
    const send=()=>{const b=document.body,s=getComputedStyle(b),height=Math.ceil(b.getBoundingClientRect().height+parseFloat(s.marginTop)+parseFloat(s.marginBottom));if(height>0&&height!==previous){previous=height;parent.postMessage({type:'hy-animation-size',height},'*');}};
    new ResizeObserver(send).observe(document.body);document.fonts.ready.then(()=>{send();const play=document.getElementById('play')||document.getElementById('toggle');if(play&&/^(Play|播放)$/.test(play.textContent.trim()))play.click();});addEventListener('resize',send);requestAnimationFrame(send);
  }
  async function load(){
    if(frame)return true;if(loading)return false;loading=true;start.disabled=true;status.textContent=zh?'正在加载动画…':'Loading animation…';
    try{
      const response=await fetch(player.dataset.animation);if(!response.ok)throw new Error('Animation unavailable');let html=await response.text();
      const css='<style>html,body{margin:0!important;padding:0!important;background:white!important;overflow-x:hidden}main,.page{margin:0!important;padding:0!important;max-width:none!important;box-shadow:none!important}.controls,.toolbar{flex-wrap:wrap!important;gap:8px!important;padding:8px 12px!important;align-items:center!important;font-size:14px!important}.controls button,.toolbar button{min-height:40px!important;padding:6px 12px!important}.controls input,.toolbar input{flex:1 1 80px!important;min-width:0!important;max-width:100%!important}.controls span{min-width:48px!important}.hint{display:none!important}canvas{display:block!important;width:100%!important;height:auto!important}</style>';
      html=html.replace('</head>',css+'</head>').replace('</body>','<script>('+embeddedSizeBridge.toString()+')();</scr'+'ipt></body>');
      frame=document.createElement('iframe');frame.className='animation-frame';frame.title=start.getAttribute('aria-label');frame.setAttribute('sandbox','allow-scripts');frame.srcdoc=html;viewport.replaceChildren(frame);status.textContent='';return true;
    }catch(error){loading=false;start.disabled=false;status.textContent=zh?'加载失败，请点击重试':'Could not load. Click to retry.';return false;}
  }
  addEventListener('message',event=>{if(frame&&event.source===frame.contentWindow&&event.data?.type==='hy-animation-size'){const height=Number(event.data.height);if(Number.isFinite(height)&&height>0&&height<2000)frame.style.height=height+'px';}});
  start.addEventListener('click',load);
  load();
  zoom.addEventListener('click',async()=>{if(!await load())return;const on=player.classList.toggle('is-zoomed');zoom.setAttribute('aria-pressed',String(on));zoom.textContent=on?(zh?'适应宽度':'Fit width'):(zh?'放大':'Enlarge');status.textContent=on?(zh?'左右滑动查看放大的细节':'Scroll sideways to explore the enlarged diagram'):'';});
  fullscreen.addEventListener('click',async()=>{if(!await load())return;if(document.fullscreenElement){await document.exitFullscreen();return;}if(player.requestFullscreen){try{await player.requestFullscreen();return;}catch(error){/* Use the same player in an expanded view. */}}const on=player.classList.toggle('is-expanded');fullscreen.textContent=on?(zh?'退出全屏':'Exit full screen'):(zh?'全屏':'Full screen');});
  document.addEventListener('fullscreenchange',()=>{fullscreen.textContent=document.fullscreenElement===player?(zh?'退出全屏':'Exit full screen'):(zh?'全屏':'Full screen');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&player.classList.contains('is-expanded')){player.classList.remove('is-expanded');fullscreen.textContent=zh?'全屏':'Full screen';}});
});
