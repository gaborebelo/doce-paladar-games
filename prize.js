// Probabilidades controladas no servidor
const TABLE = [
  { id:'DOCINHO', label:'Docinho grátis', p:0.50 },
  { id:'COXINHA', label:'Coxinha grátis', p:0.30 },
  { id:'REFRI',   label:'Refrigerante 300ml', p:0.15 },
  { id:'OFF10',  label:'10% OFF em tortas', p:0.05 }
];
function pickPrize(ctx={}){
  let r = Math.random();
  let acc=0;
  for(const p of TABLE){ acc+=p.p; if(r<=acc) return p; }
  return TABLE[0];
}
module.exports = { pickPrize, TABLE };
