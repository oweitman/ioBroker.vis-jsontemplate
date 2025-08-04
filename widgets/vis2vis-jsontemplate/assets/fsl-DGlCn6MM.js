import{a}from"./_commonjsHelpers-DsqdWQfm.js";function f(s,r){for(var t=0;t<r.length;t++){const e=r[t];if(typeof e!="string"&&!Array.isArray(e)){for(const n in e)if(n!=="default"&&!(n in s)){const o=Object.getOwnPropertyDescriptor(e,n);o&&Object.defineProperty(s,n,o.get?o:{enumerable:!0,get:()=>e[n]})}}}return Object.freeze(Object.defineProperty(s,Symbol.toStringTag,{value:"Module"}))}var i={exports:{}};(function(s,r){ace.define("ace/snippets/fsl.snippets",["require","exports","module"],function(t,e,n){n.exports=`snippet header
	machine_name     : "";
	machine_author   : "";
	machine_license  : MIT;
	machine_comment  : "";
	machine_language : en;
	machine_version  : 1.0.0;
	fsl_version      : 1.0.0;
	start_states     : [];
`}),ace.define("ace/snippets/fsl",["require","exports","module","ace/snippets/fsl.snippets"],function(t,e,n){e.snippetText=t("./fsl.snippets"),e.scope="fsl"}),function(){ace.require(["ace/snippets/fsl"],function(t){s&&(s.exports=t)})}()})(i);var p=i.exports;const c=a(p),u=f({__proto__:null,default:c},[p]);export{u as f};
