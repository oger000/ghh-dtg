(()=>{"use strict";var e={9942:(e,t,o)=>{o(7280),o(5363),o(71);var r=o(8880),n=o(9592),a=o(3673);function i(e,t,o,r,n,i){const s=(0,a.up)("router-view");return(0,a.wg)(),(0,a.j4)(s)}const s=(0,a.aZ)({name:"App"});s.render=i;const l=s;var c=o(4584),u=o(7083),p=o(9582);const d=[{path:"/",component:()=>Promise.all([o.e(736),o.e(502)]).then(o.bind(o,5502)),children:[{path:"",component:()=>Promise.all([o.e(736),o.e(26)]).then(o.bind(o,7026))},{path:"navi",component:()=>Promise.all([o.e(736),o.e(39)]).then(o.bind(o,9039))}]},{path:"/",component:()=>Promise.all([o.e(736),o.e(903)]).then(o.bind(o,5903)),children:[{path:"ghhDetails",name:"ghhDetails",props:!0,component:()=>Promise.all([o.e(736),o.e(207)]).then(o.bind(o,7207))}]},{path:"/:catchAll(.*)*",component:()=>Promise.all([o.e(736),o.e(193)]).then(o.bind(o,2193))}],h=d,f=(0,u.BC)((function(){const e=p.r5,t=(0,p.p7)({scrollBehavior:()=>({left:0,top:0}),routes:h,history:e("/gemeindehaushalt/")});return t}));async function g(e,t){const r="function"===typeof c.default?await(0,c.default)({}):c.default,{storeKey:a}=await Promise.resolve().then(o.bind(o,4584)),i="function"===typeof f?await f({store:r}):f;r.$router=i;const s=e(l);return s.use(n.Z,t),{app:s,store:r,storeKey:a,router:i}}var m=o(1525);const v={config:{},plugins:{Dialog:m.Z}},b="/gemeindehaushalt/",w=/\/\//,y=e=>(b+e).replace(w,"/");async function P({app:e,router:t,store:o,storeKey:r},n){let a=!1;const i=e=>{a=!0;const o=Object(e)===e?y(t.resolve(e).fullPath):e;window.location.href=o},s=window.location.href.replace(window.location.origin,"");for(let c=0;!1===a&&c<n.length;c++)try{await n[c]({app:e,router:t,store:o,ssrContext:null,redirect:i,urlPath:s,publicPath:b})}catch(l){return l&&l.url?void(window.location.href=l.url):void console.error("[Quasar] boot error:",l)}!0!==a&&(e.use(t),e.use(o,r),e.mount("#q-app"))}g(r.ri,v).then((e=>Promise.all([Promise.resolve().then(o.bind(o,5474))]).then((t=>{const o=t.map((e=>e.default)).filter((e=>"function"===typeof e));P(e,o)}))))},5474:(e,t,o)=>{o.r(t),o.d(t,{default:()=>l,api:()=>s});var r=o(7083),n=o(52),a=o.n(n),i=o(6584);const s=a().create({baseURL:(0,i.MT)(),timeout:2500}),l=(0,r.xr)((({app:e})=>{e.config.globalProperties.$axios=a(),e.config.globalProperties.$api=s}))},6584:(e,t,o)=>{o.d(t,{MT:()=>a,s3:()=>i,Rw:()=>s});o(7280);var r=o(1082),n=o(1525);r.ZP.formatDate;const a=()=>{const e=window.location.pathname.split("/");"index.html"===e[e.length-1]&&e.pop();let t=e.join("/");return"/"!==t.substr(-1)&&(t+="/"),[window.location.protocol,"//",window.location.host,t].join("")},i=e=>{const t=o(3626);if(e.response){const o=`${e.response.status}: ${e.response.statusText}\n${e.response.data}`;let r,a;console.log(o),e.response.status===t.UNPROCESSABLE_ENTITY?(r=e.response.data,a="Serverantwort"):(r=`${e.response.status} ${e.response.statusText}`,a="Serverfehler"),n.Z.create({title:a,message:r,ok:!0})}else e.request?(n.Z.create({title:"Sendefehler",message:e.message,ok:!0}),console.log(e.request)):(n.Z.create({title:"Allgemeiner Fehler",message:e.message,ok:!0}),console.log("Error",e.message))},s=e=>{const t={};e.pagination.sortBy&&(t.sort=[[e.pagination.sortBy,e.pagination.descending?"DESC":"ASC"]]);const o=(e.pagination.page-1)*e.pagination.rowsPerPage;return Object.assign(t,e.filter?{filter:e.filter}:void 0,e.pagination.rowsPerPage?{limit:e.pagination.rowsPerPage}:void 0,o?{offset:o}:void 0,{_dc:Date.now()}),t}},4584:(e,t,o)=>{o.r(t),o.d(t,{default:()=>a});var r=o(7083),n=o(7874);const a=(0,r.h)((function(){const e=(0,n.MT)({modules:{},strict:!1});return e}))}},t={};function o(r){var n=t[r];if(void 0!==n)return n.exports;var a=t[r]={exports:{}};return e[r](a,a.exports,o),a.exports}o.m=e,(()=>{var e=[];o.O=(t,r,n,a)=>{if(!r){var i=1/0;for(c=0;c<e.length;c++){for(var[r,n,a]=e[c],s=!0,l=0;l<r.length;l++)(!1&a||i>=a)&&Object.keys(o.O).every((e=>o.O[e](r[l])))?r.splice(l--,1):(s=!1,a<i&&(i=a));s&&(e.splice(c--,1),t=n())}return t}a=a||0;for(var c=e.length;c>0&&e[c-1][2]>a;c--)e[c]=e[c-1];e[c]=[r,n,a]}})(),(()=>{o.n=e=>{var t=e&&e.__esModule?()=>e["default"]:()=>e;return o.d(t,{a:t}),t}})(),(()=>{o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}})(),(()=>{o.f={},o.e=e=>Promise.all(Object.keys(o.f).reduce(((t,r)=>(o.f[r](e,t),t)),[]))})(),(()=>{o.u=e=>"js/"+e+"."+{26:"f6246f7e",39:"a5247323",193:"a246cb39",207:"2a51d776",502:"5744b24a",903:"99991501"}[e]+".js"})(),(()=>{o.miniCssF=e=>"css/vendor.cc62b1eb.css"})(),(()=>{o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()})(),(()=>{o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)})(),(()=>{var e={},t="ghh-navi:";o.l=(r,n,a,i)=>{if(e[r])e[r].push(n);else{var s,l;if(void 0!==a)for(var c=document.getElementsByTagName("script"),u=0;u<c.length;u++){var p=c[u];if(p.getAttribute("src")==r||p.getAttribute("data-webpack")==t+a){s=p;break}}s||(l=!0,s=document.createElement("script"),s.charset="utf-8",s.timeout=120,o.nc&&s.setAttribute("nonce",o.nc),s.setAttribute("data-webpack",t+a),s.src=r),e[r]=[n];var d=(t,o)=>{s.onerror=s.onload=null,clearTimeout(h);var n=e[r];if(delete e[r],s.parentNode&&s.parentNode.removeChild(s),n&&n.forEach((e=>e(o))),t)return t(o)},h=setTimeout(d.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=d.bind(null,s.onerror),s.onload=d.bind(null,s.onload),l&&document.head.appendChild(s)}}})(),(()=>{o.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}})(),(()=>{o.p="/gemeindehaushalt/"})(),(()=>{var e={143:0};o.f.j=(t,r)=>{var n=o.o(e,t)?e[t]:void 0;if(0!==n)if(n)r.push(n[2]);else{var a=new Promise(((o,r)=>n=e[t]=[o,r]));r.push(n[2]=a);var i=o.p+o.u(t),s=new Error,l=r=>{if(o.o(e,t)&&(n=e[t],0!==n&&(e[t]=void 0),n)){var a=r&&("load"===r.type?"missing":r.type),i=r&&r.target&&r.target.src;s.message="Loading chunk "+t+" failed.\n("+a+": "+i+")",s.name="ChunkLoadError",s.type=a,s.request=i,n[1](s)}};o.l(i,l,"chunk-"+t,t)}},o.O.j=t=>0===e[t];var t=(t,r)=>{var n,a,[i,s,l]=r,c=0;for(n in s)o.o(s,n)&&(o.m[n]=s[n]);if(l)var u=l(o);for(t&&t(r);c<i.length;c++)a=i[c],o.o(e,a)&&e[a]&&e[a][0](),e[i[c]]=0;return o.O(u)},r=self["webpackChunkghh_navi"]=self["webpackChunkghh_navi"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var r=o.O(void 0,[736],(()=>o(9942)));r=o.O(r)})();