function rouletteView(onFinish){
  const wrap = document.createElement('div'); wrap.className='card';
  wrap.innerHTML = `<h2>🎡 Roleta do Sabor</h2><canvas id="wheel" width="420" height="420"></canvas><button class="primary" id="spin">Girar</button>`;
  const canvas = wrap.querySelector('#wheel'); const ctx = canvas.getContext('2d');
  const sectors = [
    {label:'Docinho grátis'}, {label:'Coxinha grátis'},
    {label:'Refri 300ml'}, {label:'10% OFF tortas'},
    {label:'Tente outra vez'}, {label:'Docinho grátis'}
  ];
  const R = canvas.width/2; const cx=R, cy=R;
  function draw(angle=0){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    sectors.forEach((s,i)=>{
      const a0 = (i*2*Math.PI/sectors.length)+angle;
      const a1 = ((i+1)*2*Math.PI/sectors.length)+angle;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R-10,a0,a1); ctx.closePath();
      ctx.fillStyle = i%2? '#ffd27a' : '#ffb469'; ctx.fill();
      ctx.save(); ctx.translate(cx,cy); ctx.rotate((a0+a1)/2 - Math.PI/2);
      ctx.fillStyle='#3b2d1f'; ctx.font='16px system-ui'; ctx.textAlign='center';
      ctx.fillText(s.label,0, -R*0.65, R*0.9); ctx.restore();
    });
    ctx.fillStyle='#3b2d1f'; ctx.beginPath(); ctx.moveTo(cx,5); ctx.lineTo(cx-12,30); ctx.lineTo(cx+12,30); ctx.closePath(); ctx.fill();
  }
  draw();

  wrap.querySelector('#spin').onclick = async ()=>{
    if(wrap._spinning) return; wrap._spinning=true;
    let a=0, v=0.45+Math.random()*0.3;
    const friction=0.985;
    const tick=()=>{ a+=v; v*=friction; draw(a); if(v>0.002){ requestAnimationFrame(tick); }else{
      const idx = (sectors.length - Math.floor(((a%(2*Math.PI))/(2*Math.PI))*sectors.length) - 1) % sectors.length;
      const prize = sectors[idx].label;
      onFinish({ game:'roulette', prize, score:idx });
    }};
    tick();
  };
  return wrap;
}