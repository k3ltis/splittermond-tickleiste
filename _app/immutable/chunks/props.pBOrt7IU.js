import{S as O,H as k,I as ee,J as y,K as re,L as w,M as S,U as v,j as p,C,N as ne,O as se,P as ie,v as te,y as q,F as ae,E as fe,Q as ue,R as le,G as ce,V as j,W as B,w as M,X as U,z as de,Y as oe,Z as _e,i as F,_ as ve,$ as be,a0 as Q,n as G,s as he,a1 as pe,a2 as we,a3 as W,a4 as Pe,a5 as ye,a6 as ge,a7 as H,a8 as Re,q as Ee,a9 as Ie,aa as Oe,ab as X,m as Z,ac as Se,ad as $,ae as N,af as xe}from"./utils.DQy3KIPA.js";function I(e,r=null,t){if(typeof e!="object"||e===null||O in e)return e;const s=se(e);if(s!==k&&s!==ee)return e;var i=new Map,l=ie(e),b=y(0);l&&i.set("length",y(e.length));var P;return new Proxy(e,{defineProperty(c,n,a){(!("value"in a)||a.configurable===!1||a.enumerable===!1||a.writable===!1)&&re();var u=i.get(n);return u===void 0?(u=y(a.value),i.set(n,u)):w(u,I(a.value,P)),!0},deleteProperty(c,n){var a=i.get(n);if(a===void 0)n in c&&i.set(n,y(v));else{if(l&&typeof n=="string"){var u=i.get("length"),f=Number(n);Number.isInteger(f)&&f<u.v&&w(u,f)}w(a,v),z(b)}return!0},get(c,n,a){var _;if(n===O)return e;var u=i.get(n),f=n in c;if(u===void 0&&(!f||(_=S(c,n))!=null&&_.writable)&&(u=y(I(f?c[n]:v,P)),i.set(n,u)),u!==void 0){var d=p(u);return d===v?void 0:d}return Reflect.get(c,n,a)},getOwnPropertyDescriptor(c,n){var a=Reflect.getOwnPropertyDescriptor(c,n);if(a&&"value"in a){var u=i.get(n);u&&(a.value=p(u))}else if(a===void 0){var f=i.get(n),d=f==null?void 0:f.v;if(f!==void 0&&d!==v)return{enumerable:!0,configurable:!0,value:d,writable:!0}}return a},has(c,n){var d;if(n===O)return!0;var a=i.get(n),u=a!==void 0&&a.v!==v||Reflect.has(c,n);if(a!==void 0||C!==null&&(!u||(d=S(c,n))!=null&&d.writable)){a===void 0&&(a=y(u?I(c[n],P):v),i.set(n,a));var f=p(a);if(f===v)return!1}return u},set(c,n,a,u){var R;var f=i.get(n),d=n in c;if(l&&n==="length")for(var _=a;_<f.v;_+=1){var g=i.get(_+"");g!==void 0?w(g,v):_ in c&&(g=y(v),i.set(_+"",g))}f===void 0?(!d||(R=S(c,n))!=null&&R.writable)&&(f=y(void 0),w(f,I(a,P)),i.set(n,f)):(d=f.v!==v,w(f,I(a,P)));var h=Reflect.getOwnPropertyDescriptor(c,n);if(h!=null&&h.set&&h.set.call(u,a),!d){if(l&&typeof n=="string"){var x=i.get("length"),T=Number(n);Number.isInteger(T)&&T>=x.v&&w(x,T+1)}z(b)}return!0},ownKeys(c){p(b);var n=Reflect.ownKeys(c).filter(f=>{var d=i.get(f);return d===void 0||d.v!==v});for(var[a,u]of i)u.v!==v&&!(a in c)&&n.push(a);return n},setPrototypeOf(){ne()}})}function z(e,r=1){w(e,e.v+r)}function me(e,r,t=!1){q&&ae();var s=e,i=null,l=null,b=v,P=t?fe:0,c=!1;const n=(u,f=!0)=>{c=!0,a(f,u)},a=(u,f)=>{if(b===(b=u))return;let d=!1;if(q){const _=s.data===ue;!!b===_&&(s=le(),ce(s),j(!1),d=!0)}b?(i?B(i):f&&(i=M(()=>f(s))),l&&U(l,()=>{l=null})):(l?B(l):f&&(l=M(()=>f(s))),i&&U(i,()=>{i=null})),d&&j(!0)};te(()=>{c=!1,r(n),c||a(null,null)},P),q&&(s=de)}function V(e,r){return e===r||(e==null?void 0:e[O])===r}function qe(e={},r,t,s){return oe(()=>{var i,l;return _e(()=>{i=l,l=[],F(()=>{e!==t(...l)&&(r(e,...l),i&&V(t(...i),e)&&r(null,...i))})}),()=>{ve(()=>{l&&V(t(...l),e)&&r(null,...l)})}}),e}let D=!1;function Ce(e,r,t){const s=t[r]??(t[r]={store:null,source:Q(void 0),unsubscribe:G});if(s.store!==e)if(s.unsubscribe(),s.store=e??null,e==null)s.source.v=void 0,s.unsubscribe=G;else{var i=!0;s.unsubscribe=he(e,l=>{i?s.source.v=l:w(s.source,l)}),i=!1}return p(s.source)}function Fe(e,r){return e.set(r),r}function Ke(){const e={};return be(()=>{for(var r in e)e[r].unsubscribe()}),e}function Te(e){var r=D;try{return D=!1,[e(),D]}finally{D=r}}const Ae={get(e,r){if(!e.exclude.includes(r))return p(e.version),r in e.special?e.special[r]():e.props[r]},set(e,r,t){return r in e.special||(e.special[r]=De({get[r](){return e.props[r]}},r,W)),e.special[r](t),$(e.version),!0},getOwnPropertyDescriptor(e,r){if(!e.exclude.includes(r)&&r in e.props)return{enumerable:!0,configurable:!0,value:e.props[r]}},deleteProperty(e,r){return e.exclude.includes(r)||(e.exclude.push(r),$(e.version)),!0},has(e,r){return e.exclude.includes(r)?!1:r in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(r=>!e.exclude.includes(r))}};function Ye(e,r){return new Proxy({props:e,exclude:r,special:{},version:y(0)},Ae)}const Ne={get(e,r){let t=e.props.length;for(;t--;){let s=e.props[t];if(N(s)&&(s=s()),typeof s=="object"&&s!==null&&r in s)return s[r]}},set(e,r,t){let s=e.props.length;for(;s--;){let i=e.props[s];N(i)&&(i=i());const l=S(i,r);if(l&&l.set)return l.set(t),!0}return!1},getOwnPropertyDescriptor(e,r){let t=e.props.length;for(;t--;){let s=e.props[t];if(N(s)&&(s=s()),typeof s=="object"&&s!==null&&r in s){const i=S(s,r);return i&&!i.configurable&&(i.configurable=!0),i}}},has(e,r){if(r===O||r===X)return!1;for(let t of e.props)if(N(t)&&(t=t()),t!=null&&r in t)return!0;return!1},ownKeys(e){const r=[];for(let t of e.props){N(t)&&(t=t());for(const s in t)r.includes(s)||r.push(s)}return r}};function je(...e){return new Proxy({props:e},Ne)}function J(e){for(var r=C,t=C;r!==null&&!(r.f&(ye|ge));)r=r.parent;try{return H(r),e()}finally{H(t)}}function De(e,r,t,s){var Y;var i=(t&Re)!==0,l=!Ee||(t&Ie)!==0,b=(t&Oe)!==0,P=(t&xe)!==0,c=!1,n;b?[n,c]=Te(()=>e[r]):n=e[r];var a=O in e||X in e,u=((Y=S(e,r))==null?void 0:Y.set)??(a&&b&&r in e?o=>e[r]=o:void 0),f=s,d=!0,_=!1,g=()=>(_=!0,d&&(d=!1,P?f=F(s):f=s),f);n===void 0&&s!==void 0&&(u&&l&&pe(),n=g(),u&&u(n));var h;if(l)h=()=>{var o=e[r];return o===void 0?g():(d=!0,_=!1,o)};else{var x=J(()=>(i?Z:Se)(()=>e[r]));x.f|=we,h=()=>{var o=p(x);return o!==void 0&&(f=void 0),o===void 0?f:o}}if(!(t&W))return h;if(u){var T=e.$$legacy;return function(o,E){return arguments.length>0?((!l||!E||T||c)&&u(E?h():o),o):h()}}var R=!1,K=!1,L=Q(n),A=J(()=>Z(()=>{var o=h(),E=p(L);return R?(R=!1,K=!0,E):(K=!1,L.v=o)}));return i||(A.equals=Pe),function(o,E){if(arguments.length>0){const m=E?p(A):l&&b?I(o):o;return A.equals(m)||(R=!0,w(L,m),_&&f!==void 0&&(f=m),F(()=>p(A))),o}return p(A)}}export{I as a,qe as b,Ke as c,Ce as d,Fe as e,me as i,Ye as l,De as p,je as s};
