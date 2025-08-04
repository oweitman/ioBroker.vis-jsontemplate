import{a as s}from"./_commonjsHelpers-DsqdWQfm.js";function a(o,r){for(var t=0;t<r.length;t++){const e=r[t];if(typeof e!="string"&&!Array.isArray(e)){for(const n in e)if(n!=="default"&&!(n in o)){const i=Object.getOwnPropertyDescriptor(e,n);i&&Object.defineProperty(o,n,i.get?i:{enumerable:!0,get:()=>e[n]})}}}return Object.freeze(Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}))}var c={exports:{}};(function(o,r){ace.define("ace/snippets/velocity.snippets",["require","exports","module"],function(t,e,n){n.exports=`# macro
snippet #macro
	#macro ( \${1:macroName} \${2:\\$var1, [\\$var2, ...]} )
		\${3:## macro code}
	#end
# foreach
snippet #foreach
	#foreach ( \${1:\\$item} in \${2:\\$collection} )
		\${3:## foreach code}
	#end
# if
snippet #if
	#if ( \${1:true} )
		\${0}
	#end
# if ... else
snippet #ife
	#if ( \${1:true} )
		\${2}
	#else
		\${0}
	#end
#import
snippet #import
	#import ( "\${1:path/to/velocity/format}" )
# set
snippet #set
	#set ( $\${1:var} = \${0} )
`}),ace.define("ace/snippets/velocity",["require","exports","module","ace/snippets/velocity.snippets"],function(t,e,n){e.snippetText=t("./velocity.snippets"),e.scope="velocity",e.includeScopes=["html","javascript","css"]}),function(){ace.require(["ace/snippets/velocity"],function(t){o&&(o.exports=t)})}()})(c);var p=c.exports;const f=s(p),u=a({__proto__:null,default:f},[p]);export{u as v};
