import{f as S,c as C,t as N,R as T,B as k,v as A,x as P,C as e,G as m,Q as E,S as d,M as x,F as h,r as f,T as z,ag as I,at as F,D as R}from"./index-344213bf.js";import{T as _}from"./Text-bc00d881.js";import{u as g,F as L}from"./useTranslation-e97efc14.js";import{c as B}from"./index-b822ee52.js";import{u as G}from"./use-form-0557ef85.js";import{i as u}from"./is-not-empty-01b37365.js";import{C as O,A as U,T as V}from"./Title-26608369.js";import{S as D}from"./Stack-34296739.js";import{T as H}from"./TextInput-028a1133.js";var j={root:"m-7485cace"};const M={},Q=A((s,{size:r,fluid:t})=>({root:{"--container-size":t?void 0:P(r,"container-size")}})),p=S((s,r)=>{const t=C("Container",M,s),{classNames:a,className:n,style:i,styles:c,unstyled:l,vars:o,fluid:b,...y}=t,v=N({name:"Container",classes:j,props:t,className:n,style:i,classNames:a,styles:c,unstyled:l,vars:o,varsResolver:Q});return T.createElement(k,{ref:r,mod:{fluid:b},...v("root"),...y})});p.classes=j;p.displayName="@mantine/core/Container";const w=({children:s,...r})=>e.jsx(m,{children:e.jsx(_,{...r,children:s})});E[d.LOGIN].schema;const W={userName:"",password:"",remember:!1},q=()=>{const s=g(),r=x(),{setToken:t}=h(),a=G({initialValues:W,validate:{userName:u(s("Please enter email")),password:u(s("Please enter password"))}}),n=f.useCallback(async({password:i,userName:c,remember:l})=>{const o=await B({params:{password:i.trim(),userName:c.trim(),remember:l},action:d.LOGIN});o!=null&&o.token?(t(o.token,a.values.remember),r("/dashboard")):a.setErrors({password:s("Username or password is incorrect.")})},[a,r,t,s]);return e.jsx(O,{withBorder:!0,shadow:"md",radius:10,mt:"1rem",children:e.jsx(D,{gap:"xs",p:".5rem",pt:0,children:e.jsxs("form",{onSubmit:a.onSubmit(n),children:[e.jsx(H,{withAsterisk:!0,pb:".8rem",label:s("Username"),placeholder:s("Enter username"),...a.getInputProps("userName")}),e.jsx(z,{withAsterisk:!0,label:s("Password"),placeholder:s("Enter password"),...a.getInputProps("password")}),e.jsxs(I,{justify:"flex-start",mt:"xl",children:[e.jsxs(L,{w:"100%",fz:"0.8rem",justify:"space-between",children:[e.jsx(F,{...a.getInputProps("remember"),label:s("Remember me")}),e.jsx(U,{href:"/forgot-password",underline:"never",children:e.jsxs(w,{style:{fontSize:"1rem",fontWeight:"500",color:"var(--input-label-color)"},children:[s("Forgot your password"),"?"]})})]}),e.jsx(R,{type:"submit",w:"100%",children:s("Sign in")})]})]})})})},J=({children:s})=>e.jsx(m,{style:{minHeight:"100vh",background:"linear-gradient(to top, rgb(223, 233, 243) 0%, white 100%)"},children:e.jsx(p,{w:480,size:"xs",pb:16,children:s})}),as=()=>{const s=g(),r=x(),{user:t}=h();return f.useEffect(()=>{t&&r("/dashboard")},[r,t]),e.jsxs(J,{children:[e.jsx(m,{children:e.jsx(V,{fz:42,fw:900,children:s("__App_Title__")})}),e.jsxs(w,{children:[s("Sign in to continue"),"."]}),e.jsx(q,{})]})};export{as as default};