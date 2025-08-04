import{a}from"./_commonjsHelpers-DsqdWQfm.js";function u(r,o){for(var t=0;t<o.length;t++){const e=o[t];if(typeof e!="string"&&!Array.isArray(e)){for(const n in e)if(n!=="default"&&!(n in r)){const s=Object.getOwnPropertyDescriptor(e,n);s&&Object.defineProperty(r,n,s.get?s:{enumerable:!0,get:()=>e[n]})}}}return Object.freeze(Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}))}var p={exports:{}};(function(r,o){ace.define("ace/snippets/drools.snippets",["require","exports","module"],function(t,e,n){n.exports=`
snippet rule
	rule "\${1?:rule_name}"
	when
		\${2:// when...} 
	then
		\${3:// then...}
	end

snippet query
	query \${1?:query_name}
		\${2:// find} 
	end
	
snippet declare
	declare \${1?:type_name}
		\${2:// attributes} 
	end

`}),ace.define("ace/snippets/drools",["require","exports","module","ace/snippets/drools.snippets"],function(t,e,n){e.snippetText=t("./drools.snippets"),e.scope="drools"}),function(){ace.require(["ace/snippets/drools"],function(t){r&&(r.exports=t)})}()})(p);var i=p.exports;const c=a(i),l=u({__proto__:null,default:c},[i]);export{l as d};
