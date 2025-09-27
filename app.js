const express = require('express');
const cors = require('cors');
const path = require('path');
const { pickPrize } = require('./prize');
const { genCode } = require('./coupons');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const DB = { coupons: new Map() };

app.post('/api/prize', (req,res)=>{
  const { loja, mesa, clientScore, game } = req.body || {};
  const pr = pickPrize({ game, clientScore });
  const code = genCode();
  const expiresAt = Date.now() + 7*24*3600*1000;
  DB.coupons.set(code, { code, prize:pr.id, label:pr.label, used:false, loja, mesa, expiresAt });
  return res.json({ coupon:code, label:pr.label, expiresAt, rules: 'Uso único. Válido por 7 dias. Apresente no caixa. Promo não cumulativa.' });
});

app.post('/api/redeem', (req,res)=>{
  const { code } = req.body || {};
  const row = DB.coupons.get(code);
  if(!row) return res.status(404).json({error:'Cupom inválido'});
  if(row.used) return res.status(409).json({error:'Cupom já utilizado'});
  if(Date.now()>row.expiresAt) return res.status(410).json({error:'Cupom vencido'});
  row.used = true; DB.coupons.set(code,row);
  return res.json({ ok:true, prize: row.label });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Doce Paladar games on :' + PORT));
