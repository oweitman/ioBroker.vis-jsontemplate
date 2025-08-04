import{a as l}from"./_commonjsHelpers-DsqdWQfm.js";function a(i,r){for(var t=0;t<r.length;t++){const e=r[t];if(typeof e!="string"&&!Array.isArray(e)){for(const n in e)if(n!=="default"&&!(n in i)){const o=Object.getOwnPropertyDescriptor(e,n);o&&Object.defineProperty(i,n,o.get?o:{enumerable:!0,get:()=>e[n]})}}}return Object.freeze(Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}))}var p={exports:{}};(function(i,r){ace.define("ace/snippets/textile.snippets",["require","exports","module"],function(t,e,n){n.exports=`# Jekyll post header
snippet header
	---
	title: \${1:title}
	layout: post
	date: \${2:date} \${3:hour:minute:second} -05:00
	---

# Image
snippet img
	!\${1:url}(\${2:title}):\${3:link}!

# Table
snippet |
	|\${1}|\${2}

# Link
snippet link
	"\${1:link text}":\${2:url}

# Acronym
snippet (
	(\${1:Expand acronym})\${2}

# Footnote
snippet fn
	[\${1:ref number}] \${3}

	fn$1. \${2:footnote}
	
`}),ace.define("ace/snippets/textile",["require","exports","module","ace/snippets/textile.snippets"],function(t,e,n){e.snippetText=t("./textile.snippets"),e.scope="textile"}),function(){ace.require(["ace/snippets/textile"],function(t){i&&(i.exports=t)})}()})(p);var s=p.exports;const c=l(s),f=a({__proto__:null,default:c},[s]);export{f as t};
