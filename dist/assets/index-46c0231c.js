import{Q as P,S as b,V as M,r as i,W as g,C as r,X as L,B as V,T as $,U as q,Y as z,D as C,Z as v}from"./index-344213bf.js";import{A,I as O,l as G,u as K,D as J}from"./index-8981d1d4.js";import{u as U,F as S}from"./useTranslation-e97efc14.js";import{c as D}from"./index-b822ee52.js";import{c as F,P as R,i as T}from"./index-2058cee8.js";import{u as _}from"./use-form-0557ef85.js";import{T as E}from"./Text-bc00d881.js";import{T as w}from"./TextInput-028a1133.js";import{i as N}from"./is-not-empty-01b37365.js";import{S as W}from"./Stack-34296739.js";import"./createReactComponent-9318f0fb.js";import"./Table-07bffc10.js";import"./Popover-378390b2.js";const{response:H}=P[b.GET_USERS].schema;H.shape.users.transform(a=>a[0]);const Q=a=>[{key:"userName",sortable:!0,header:a("Username"),width:"15%"},{key:"fullName",sortable:!0,header:a("Full name"),width:"15%"},{key:"email",sortable:!0,header:a("Email"),width:"25%"},{key:"roles",header:a("Role"),width:"10%",renderCell:e=>e.map(t=>a(t.name)).join(", ")},{key:"departments",header:a("Department"),width:"20%",renderCell:e=>e.map(t=>t.name).join(", ")||"-"},{key:"active",header:a("Status"),width:"20%",renderCell:e=>a(e?"Active":"Disabled")}];function X(){const e=["@","#","$","%","&"][Math.floor(Math.random()*5)],t=d=>Math.random().toString(36).slice(d);return`${t(8)}${e}${t(7)}`}P[b.ADD_USER].schema;const Y={department:"",role:"",userName:"",password:"",fullName:"",email:"",phone:""},h="100%",Z=({onSuccess:a})=>{const e=U(),t=M(),[d]=i.useState({departmentIdByName:t.departmentIdByName,departments:Array.from(t.departmentIdByName.keys()),roles:Array.from(t.roleIdByName.keys()).map(n=>e(n)),roleIdByName:new Map(Array.from(t.roleIdByName.entries()).map(([n,m])=>[e(n),m]))}),o=_({validate:ee(e),initialValues:{...Y,password:X()}}),c=i.useCallback(n=>{g.openConfirmModal({title:e("Add user"),children:r.jsx(E,{size:"sm",children:e("Are you sure you want to add new user?")}),labels:{confirm:"OK",cancel:e("Cancel")},onConfirm:async()=>{var y,l;const m=n.department?d.departmentIdByName.get(n.department):"",f=await D({action:b.ADD_USER,params:{password:Math.random().toString(36).slice(-8),userName:n.userName.trim(),fullName:n.fullName.trim(),roleId:d.roleIdByName.get(n.role)||"",departmentIds:[m||""].filter(Boolean),email:((y=n.email)==null?void 0:y.trim())||void 0,phone:F(((l=n.phone)==null?void 0:l.trim())||void 0)||void 0},options:{toastMessage:e("Add user successfully")}});f!=null&&f.id&&a()}})},[a,d,e]),p=i.useCallback(()=>{navigator.clipboard.writeText(o.values.password),L.show({message:e("Password copied to clipboard")})},[o.values.password,e]);return r.jsxs("form",{className:"c-catering-form-wrapper",onSubmit:o.onSubmit(c),children:[r.jsx(w,{w:h,withAsterisk:!0,label:e("Full name"),placeholder:e("John Doe"),...o.getInputProps("fullName")}),r.jsx(w,{w:h,withAsterisk:!0,label:e("Username"),placeholder:e("Username"),...o.getInputProps("userName")}),r.jsx(A,{w:h,withAsterisk:!0,data:d.roles,label:e("Role"),...o.getInputProps("role")}),r.jsx(A,{w:h,label:e("Department"),data:d.departments,...o.getInputProps("department")}),r.jsxs(V,{w:h,children:[r.jsxs(S,{w:h,align:"end",justify:"between",gap:2,children:[r.jsx($,{w:h,disabled:!0,visible:!0,label:e("Password"),placeholder:e("Password"),...o.getInputProps("password")}),r.jsx(q,{onClick:p,children:r.jsx(O,{strokeWidth:"1.5",color:"black"})})]}),r.jsx(S,{w:h,justify:"end",children:r.jsx(z,{c:"red.5",children:e("Please copy and keep password safe before create new user")})})]}),r.jsx(w,{w:h,label:e("Email"),placeholder:e("Email"),...o.getInputProps("email")}),r.jsx(R,{w:h,label:e("Phone"),placeholder:e("Phone"),onChangeValue:n=>o.setFieldValue("phone",n),...o.getInputProps("phone")}),r.jsx(C,{type:"submit",children:e("Add")})]})};function ee(a){return{userName:N(a("field is required")),fullName:N(a("field is required")),roleId:N(a("field is required")),phone:e=>{if(e&&(typeof e!="string"||e&&!T(e)))return a("Invalid phone number")},email:e=>{if(e)try{v.parse(e)}catch{return a("Invalid email")}}}}P[b.UPDATE_USER].schema;const I="100%",ae=({user:a,onSuccess:e})=>{var n,m,f,y;const t=U(),d=M(),[o]=i.useState({departmentIdByName:d.departmentIdByName,departments:Array.from(d.departmentIdByName.keys()),roles:Array.from(d.roleIdByName.keys()).map(l=>t(l)),roleIdByName:new Map(Array.from(d.roleIdByName.entries()).map(([l,j])=>[t(l),j]))}),c=_({validate:te(t),initialValues:{...a,email:a.email||"",phone:a.phone||"",role:t((m=(n=a.roles)==null?void 0:n[0])==null?void 0:m.name)||"",department:((y=(f=a.departments)==null?void 0:f[0])==null?void 0:y.name)||""}}),p=i.useCallback(l=>{g.openConfirmModal({title:t("Add user"),children:r.jsx(E,{size:"sm",children:t("Are you sure you want to update user?")}),labels:{confirm:"OK",cancel:t("Cancel")},onConfirm:async()=>{var k,s;await D({action:b.UPDATE_USER,params:{id:a.id,userName:l.userName.trim(),fullName:l.fullName.trim(),email:((k=l.email)==null?void 0:k.trim())||void 0,phone:F(((s=l.phone)==null?void 0:s.trim())||void 0)||void 0},options:{toastMessage:t("Update user successfully")}})&&e()}})},[t,a.id,e]);return r.jsxs("form",{className:"c-catering-form-wrapper",onSubmit:c.onSubmit(p),children:[r.jsx(w,{w:I,label:t("Full name"),placeholder:t("John Doe"),...c.getInputProps("fullName")}),r.jsx(w,{w:I,label:t("Username"),placeholder:t("Username"),...c.getInputProps("userName")}),r.jsx(A,{w:I,withAsterisk:!0,disabled:!0,data:o.roles,label:t("Role"),...c.getInputProps("role")}),r.jsx(A,{w:I,disabled:!0,withAsterisk:!0,data:o.departments,label:t("Department"),...c.getInputProps("department")}),r.jsx(w,{w:I,label:t("Email"),placeholder:t("Email"),...c.getInputProps("email")}),r.jsx(R,{w:I,label:t("Phone"),placeholder:t("Phone"),onChangeValue:l=>c.setFieldValue("phone",l),...c.getInputProps("phone")}),r.jsx(C,{type:"submit",children:t("Save")})]})};function te(a){return{userName:N(a("field is required")),fullName:N(a("field is required")),phone:e=>{if(e&&(typeof e!="string"||e&&!T(e)))return a("Invalid phone number")},email:e=>{if(e)try{v.parse(e)}catch{return a("Invalid email")}}}}const ye=()=>{const a=U(),[e,t]=i.useState([]),[d,o]=i.useState([]),c=i.useMemo(()=>Q(a),[a]),[p,n]=i.useState({keyword:""}),m=i.useCallback(async s=>{G({key:"users",noCache:s,action:b.GET_USERS}).then(u=>{t(u),o(u)}),g.closeAll()},[]),f=i.useCallback(s=>{if(s.preventDefault(),!p.keyword)return;const u=p.keyword.toLowerCase();o(e.filter(x=>{var B;return u?!!(x.fullName.toLocaleLowerCase().includes(u)||x.userName.toLocaleLowerCase().includes(u)||(B=x.email)!=null&&B.toLocaleLowerCase().includes(u)):!0}))},[p.keyword,e]);K(m);const y=i.useCallback(s=>{g.openConfirmModal({title:`${a("Deactivate user")}: ${(s==null?void 0:s.fullName)||""}`,children:r.jsx(E,{size:"sm",children:a("Are you sure you want to deactivate this user?")}),labels:{confirm:"OK",cancel:a("Cancel")},onConfirm:async()=>{await D({action:b.DISABLE_USERS,params:{ids:[s==null?void 0:s.id]}}).then(()=>m(!0))}})},[m,a]),l=i.useCallback(s=>{var x;const u=((x=s.target)==null?void 0:x.value.trim())||"";u!==p.keyword&&(n({keyword:u}),u||o(e))},[p.keyword,e]),j=i.useCallback(()=>{g.open({title:a("Add user"),classNames:{title:"c-catering-font-bold"},centered:!0,size:"lg",children:r.jsx(Z,{onSuccess:m.bind(null,!0)})})},[m,a]),k=i.useCallback(s=>{g.open({title:s.fullName,classNames:{title:"c-catering-font-bold"},centered:!0,size:"lg",children:r.jsx(ae,{onSuccess:m.bind(null,!0),user:s})})},[m]);return r.jsxs(W,{gap:10,children:[r.jsxs(S,{w:"100%",justify:"end",align:"center",gap:12,children:[r.jsxs("form",{onSubmit:f,style:{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8},children:[r.jsx(w,{value:p.keyword,onChange:l}),r.jsx(C,{ml:8,w:100,type:"submit",disabled:!p.keyword,children:a("Search")})]}),r.jsx(C,{w:100,onClick:j,children:a("Add")})]}),r.jsx(J,{onRowClick:k,hasOrderColumn:!0,columns:c,data:d,actionHandlers:{onDelete:y,deletable:s=>(s==null?void 0:s.active)===!0}})]})};export{ye as default};