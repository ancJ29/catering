import{b as t,e as u}from"./index-970177b3.js";import{a5 as i}from"./index-344213bf.js";const d=i((a,r)=>({loadedAll:!1,suppliers:new Map,set:s=>{a(({suppliers:p})=>{const e=new Map(p);return s.forEach(l=>e.set(l.id,l)),{suppliers:e}})},load:async s=>{if(!s||r().suppliers.has(s))return;const p=await t(s);p&&a(({suppliers:e})=>({suppliers:new Map(e).set(s,p)}))},reload:async(s=!1)=>{if(!s&&r().loadedAll)return;const p=await u(s);a(()=>({loadedAll:!0,suppliers:new Map(p.map(e=>[e.id,e]))}))}}));export{d as u};