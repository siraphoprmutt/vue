import{r as h,b as g,d as c,w as e,u as x,o as n,e as t,f as o,c as V,g as k,t as d,F as C}from"./index--9lmIkWP.js";import{_ as w}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{V as v,a as i,b as y,c as b,d as u,e as B,f as R,g as S,h as T}from"./VRow-saKd6Qg9.js";const $={__name:"index",setup(A){const f=x(),l=h([]),p="http://localhost:3002",_=a=>f.push(`/workshops/${a.id}/register`),m=async()=>{try{const s=await(await fetch(`${p}/api/workshops`,{headers:{Authorization:"oledev"}})).json();l.value=s.workshops}catch(a){console.error("Error fetching workshops:",a)}};return g(()=>{m()}),(a,s)=>(n(),c(v,null,{default:e(()=>[t(u,{class:"pa-5"},{default:e(()=>[t(i,{class:"text-center text-h4 font-weight-bold"},{default:e(()=>s[0]||(s[0]=[o(" หน้าหลัก ")])),_:1}),t(y,null,{default:e(()=>[(n(!0),V(C,null,k(l.value,r=>(n(),c(b,{key:r.id,cols:"12",sm:"6",md:"4"},{default:e(()=>[t(u,{class:"workshop-card"},{default:e(()=>[t(B,{src:r.image,height:"200px",class:"rounded",cover:""},null,8,["src"]),t(i,{class:"text-center"},{default:e(()=>[o(d(r.name),1)]),_:2},1024),t(R,{class:"text-center"},{default:e(()=>[o(" ฿"+d(r.price.toLocaleString()),1)]),_:2},1024),t(S,{class:"text-center"},{default:e(()=>[t(T,{onClick:E=>_(r),color:"primary"},{default:e(()=>s[1]||(s[1]=[o("ลงทะเบียน")])),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1}))}},N=w($,[["__scopeId","data-v-fd580a33"]]);export{N as default};
