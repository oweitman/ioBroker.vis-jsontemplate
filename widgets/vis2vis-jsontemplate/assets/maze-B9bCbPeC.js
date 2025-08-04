import{a}from"./_commonjsHelpers-DsqdWQfm.js";function c(r,s){for(var t=0;t<s.length;t++){const e=s[t];if(typeof e!="string"&&!Array.isArray(e)){for(const n in e)if(n!=="default"&&!(n in r)){const o=Object.getOwnPropertyDescriptor(e,n);o&&Object.defineProperty(r,n,o.get?o:{enumerable:!0,get:()=>e[n]})}}}return Object.freeze(Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}))}var p={exports:{}};(function(r,s){ace.define("ace/snippets/maze.snippets",["require","exports","module"],function(t,e,n){n.exports=`snippet >
description assignment
scope maze
	-> \${1}= \${2}

snippet >
description if
scope maze
	-> IF \${2:**} THEN %\${3:L} ELSE %\${4:R}
`}),ace.define("ace/snippets/maze",["require","exports","module","ace/snippets/maze.snippets"],function(t,e,n){e.snippetText=t("./maze.snippets"),e.scope="maze"}),function(){ace.require(["ace/snippets/maze"],function(t){r&&(r.exports=t)})}()})(p);var i=p.exports;const f=a(i),u=c({__proto__:null,default:f},[i]);export{u as m};
