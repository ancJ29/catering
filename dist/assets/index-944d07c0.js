import{C as n,r as o}from"./index-344213bf.js";import{u as h,A as g,D as f}from"./index-8981d1d4.js";import{u as x}from"./index-970177b3.js";import{u as y,F as A}from"./useTranslation-e97efc14.js";import{u as C}from"./material.store-4d353e04.js";import{S as M}from"./Stack-34296739.js";import"./createReactComponent-9318f0fb.js";import"./index-b822ee52.js";import"./Table-07bffc10.js";import"./Text-bc00d881.js";import"./Popover-378390b2.js";const j=e=>[{key:"name",sortable:!0,header:e("Material name"),width:"20%"},{key:"code",sortable:!0,header:e("Material code"),width:"5%"},{key:"type",header:e("Material type"),width:"15%",textAlign:"center",renderCell:(s,t)=>{if(!t.others.type)return"N/A";const r=t.others.type,a=e(`materials.type.${r}`);return n.jsx("span",{children:`${a} (${r})`})}},{key:"group",header:e("Material group"),width:"10%",textAlign:"center",renderCell:(s,t)=>{if(!t.others.group)return"N/A";const r=t.others.group,a=e(`materials.group.${r}`);return n.jsx("span",{children:`${a} (${r})`})}},{key:"unit",width:"10%",textAlign:"right",header:e("Unit"),renderCell:(s,t)=>{var r,a;return((a=(r=t.others)==null?void 0:r.unit)==null?void 0:a.name)||"N/A"}},{key:"suppliers",width:"10%",textAlign:"right",header:e("Suppliers"),renderCell:()=>"TODO"}],P=()=>{const e=y(),{materials:s,reload:t}=C(),[r,a]=o.useState(1),l=o.useMemo(()=>j(e),[e]);h(t);const{data:u,names:d,filter:i,change:p}=x({reload:()=>Array.from(s.values())}),m=o.useCallback(c=>{a(1),i(c)},[i]);return n.jsxs(M,{gap:10,children:[n.jsx(A,{justify:"end",align:"center",children:n.jsx(g,{w:"20vw",onEnter:m,data:d,onChange:p})}),n.jsx(f,{page:r,limit:10,isPaginated:!0,hasOrderColumn:!0,columns:l,data:u,onChangePage:a})]})};export{P as default};