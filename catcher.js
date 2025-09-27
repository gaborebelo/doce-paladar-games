function catcherView(onFinish){
  const wrap=document.createElement('div'); wrap.className='card';
  wrap.innerHTML=`<h2>🥟 Coxinha Ninja</h2><canvas id="c" width="420" height="520"></canvas>`;
  const c=wrap.querySelector('#c'), g=c.getContext('2d');
  let basketX=210, score=0, t0=Date.now(), duration=10000;
  const items = [];
  function spawn(){ items.push({x:Math.random()*380+20, y:-20, vy:2+Math.random()*2}); }
  function draw(){
    g.clearRect(0,0,c.width,c.height);
    g.fillStyle='#ff7a00'; g.fillRect(basketX-40,480,80,12);
    if(Math.random()<0.05) spawn();
    items.forEach(it=>{ it.y+=it.vy; g.fillStyle='#8b5e34'; g.beginPath(); g.arc(it.x,it.y,14,0,Math.PI*2); g.fill(); });
    items.forEach((it,i)=>{ if(it.y>470 && Math.abs(it.x-basketX)<50){ score++; items.splice(i,1); } });
    g.fillStyle='#3b2d1f'; g.font='16px system-ui';
    g.fillText(`Coxinhas: ${score}/5`, 12, 24);
    const left = Math.max(0, 10000 - (Date.now()-t0));
    g.fillText(`Tempo: ${(left/1000).toFixed(1)}s`, 320, 24);
    if(left<=0){ onFinish({game:'catcher', prize: score>=5 ? 'Coxinha grátis' : 'Tente outra vez', score}); return; }
    requestAnimationFrame(draw);
  }
  c.addEventListener('mousemove', e=>{ const r=c.getBoundingClientRect(); basketX = e.clientX - r.left; });
  c.addEventListener('touchmove', e=>{ const r=c.getBoundingClientRect(); basketX = e.touches[0].clientX - r.left; }, {passive:true});
  draw();
  return wrap;
}