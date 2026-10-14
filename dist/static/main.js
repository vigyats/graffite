(() => {
  'use strict';
  let toastTimer;window.showToast=message=>{const el=document.getElementById('notice');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),5500);};
  const media=matchMedia('(prefers-reduced-motion: reduce)');window.worldPaused=media.matches;
  const updateMotion=()=>{document.body.classList.toggle('motion-paused',window.worldPaused);window.dispatchEvent(new Event('world-motion'));};
  media.addEventListener('change',e=>{window.worldPaused=e.matches;updateMotion();});updateMotion();
  const dialog=document.getElementById('secret-dialog');document.querySelectorAll('[data-secret]').forEach(button=>button.addEventListener('click',()=>{const theme=button.dataset.secret==='theme';document.getElementById('secret-title').innerHTML=theme?'A new expression.<br>Still under wraps.':'New minds.<br>Same wild spirit.';document.getElementById('secret-copy').textContent=theme?'The Graffiti 2027 theme is still a secret. This sculpture is teaser art — the official theme reveal is coming soon.':'A new team is leaving its mark on Graffiti 2027. Names and faces will be revealed soon. Stay close — the next chapter is taking shape.';dialog.showModal();}));document.querySelectorAll('.dialog-close,.dialog-done').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
})();
