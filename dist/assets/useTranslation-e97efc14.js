import{p as D,c as G,t as h,d as C,ai as $,az as b,R as a,I as v,B as I,ah as T,r as l,L as j}from"./index-344213bf.js";const A={gap:{type:"spacing",property:"gap"},rowGap:{type:"spacing",property:"rowGap"},columnGap:{type:"spacing",property:"columnGap"},align:{type:"identity",property:"alignItems"},justify:{type:"identity",property:"justifyContent"},wrap:{type:"identity",property:"flexWrap"},direction:{type:"identity",property:"flexDirection"}};var p={root:"m-8bffd616"};const B={},i=D((e,n)=>{const t=G("Flex",B,e),{classNames:c,className:y,style:u,styles:g,unstyled:m,vars:d,gap:f,rowGap:S,columnGap:w,align:x,justify:F,wrap:R,direction:E,...L}=t,N=h({name:"Flex",classes:p,props:t,className:y,style:u,classNames:c,styles:g,unstyled:m,vars:d}),P=C(),o=$(),s=b({styleProps:{gap:f,rowGap:S,columnGap:w,align:x,justify:F,wrap:R,direction:E},theme:P,data:A});return a.createElement(a.Fragment,null,s.hasResponsiveStyles&&a.createElement(v,{selector:`.${o}`,styles:s.styles,media:s.media}),a.createElement(I,{ref:n,...N("root",{className:o,style:T(s.inlineStyles)}),...L}))});i.classes=p;i.displayName="@mantine/core/Flex";const r=console,O={error:(...e)=>{r.error(`[ERROR] [${new Date().toLocaleString()}]:`,...e)},warn:(...e)=>{r.warn(`[WARN] [${new Date().toLocaleString()}]:`,...e)},info:(...e)=>{r.info(`[INFO] [${new Date().toLocaleString()}]:`,...e)},debug:(...e)=>{r.debug(`[DEBUG] [${new Date().toLocaleString()}]:`,...e)},trace:(...e)=>{}};function M(){const{dictionary:e}=l.useContext(j);return l.useCallback(t=>t?e[t]?e[t]:(O.warn("Missing translation",t),t):"",[e])}export{i as F,O as l,M as u};