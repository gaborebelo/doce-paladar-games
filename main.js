const qs = (s, el=document) => el.querySelector(s);
const toast = (msg, t=2200) => { const el=qs('#toast'); el.textContent=msg; el.style.display='block'; setTimeout(()=>el.style.display='none', t); };

// daily play guard (client)
const canPlay = () => {
  const k = 'dp-last-play';
  const last = localStorage.getItem(k);
  const today = new Date().toISOString().slice(0,10);
  if (last === today) return false;
  return true;
}
const markPlayed = () => localStorage.setItem('dp-last-play', new Date().toISOString().slice(0,10));

// router
window.addEventListener('hashchange', render);
window.addEventListener('load', render);

async function render(){
  const route = location.hash.replace('#/','');
  const host = qs('#game'); host.innerHTML = '';
  if(!route){ return; }
  if(!canPlay()){
    host.innerHTML = `<p class="card"><strong>Você já jogou hoje.</strong><br>Volte amanhã e garanta novos prêmios!</p>`;
    return;
  }
  if(route==='roleta'){ host.appendChild(rouletteView(onWin)); }
  if(route==='baus'){ host.appendChild(chestsView(onWin)); }
  if(route==='ninja'){ host.appendChild(catcherView(onWin)); }
}

async function onWin(payload){
  try{
    const url = new URL(location.href);
    const loja = url.searchParams.get('loja') || 'default';
    const mesa = url.searchParams.get('mesa') || '0';

    const r = await fetch('/api/prize', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ loja, mesa, clientScore: payload?.score, game: payload?.game })
    });
    const data = await r.json();
    if(!r.ok) throw new Error(data.error || 'Falha');
    markPlayed();
    showPrize(data);
  }catch(e){
    toast('Ops, tente novamente.');
    console.error(e);
  }
}

function showPrize({coupon, label, expiresAt, rules}){
  const host = qs('#game');
  host.innerHTML = `
    <div class="card">
      <h2>🎉 Parabéns!</h2>
      <p>Você ganhou: <strong>${label}</strong></p>
      <p>Cupom: <code style="font-size:1.4rem">${coupon}</code></p>
      <p>Validade: ${new Date(expiresAt).toLocaleDateString('pt-BR')}</p>
      <details><summary>Regras</summary><small>${rules}</small></details>
      <br><button class="primary" onclick="navigator.share ? navigator.share({title:'Cupom Doce Paladar',text:'Meu cupom: ${coupon}'}) : 0">Compartilhar</button>
    </div>
  `;
}
