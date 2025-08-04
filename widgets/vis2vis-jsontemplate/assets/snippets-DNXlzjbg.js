import{a as c}from"./_commonjsHelpers-DsqdWQfm.js";function a(s,n){for(var t=0;t<n.length;t++){const e=n[t];if(typeof e!="string"&&!Array.isArray(e)){for(const p in e)if(p!=="default"&&!(p in s)){const i=Object.getOwnPropertyDescriptor(e,p);i&&Object.defineProperty(s,p,i.get?i:{enumerable:!0,get:()=>e[p]})}}}return Object.freeze(Object.defineProperty(s,Symbol.toStringTag,{value:"Module"}))}var r={exports:{}};(function(s,n){ace.define("ace/snippets/snippets.snippets",["require","exports","module"],function(t,e,p){p.exports=`# snippets for making snippets :)
snippet snip
	snippet \${1:trigger}
		\${2}
snippet msnip
	snippet \${1:trigger} \${2:description}
		\${3}
snippet v
	{VISUAL}
`}),ace.define("ace/snippets/snippets",["require","exports","module","ace/snippets/snippets.snippets"],function(t,e,p){e.snippetText=t("./snippets.snippets"),e.scope="snippets"}),function(){ace.require(["ace/snippets/snippets"],function(t){s&&(s.exports=t)})}()})(r);var o=r.exports;const f=c(o),g=a({__proto__:null,default:f},[o]);export{g as s};
