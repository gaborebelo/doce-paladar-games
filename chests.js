function chestsView(onFinish){
  const wrap=document.createElement('div'); wrap.className='card';
  wrap.innerHTML=`<h2>🧰 Escolha um baú</h2>
  <div style="display:flex;gap:12px;justify-content:center">
    ${[0,1,2].map(i=>`<button class="card" data-i="${i}" style="width:120px;height:120px;font-size:2rem">🧰</button>`).join('')}
  </div>`;
  const secret = Math.floor(Math.random()*3);
  wrap.querySelectorAll('button').forEach(btn=>{
    btn.onclick=()=>{
      const pick = +btn.dataset.i;
      btn.textContent = pick===secret ? '🎁' : '❌';
      onFinish({game:'chests', prize: pick===secret ? 'Brinde surpresa' : 'Tente outra vez', score: pick===secret?1:0});
    };
  });
  return wrap;
}