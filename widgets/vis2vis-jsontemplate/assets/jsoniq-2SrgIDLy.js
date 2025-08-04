import{a as o}from"./_commonjsHelpers-DsqdWQfm.js";function $(r,p){for(var n=0;n<p.length;n++){const e=p[n];if(typeof e!="string"&&!Array.isArray(e)){for(const t in e)if(t!=="default"&&!(t in r)){const s=Object.getOwnPropertyDescriptor(e,t);s&&Object.defineProperty(r,t,s.get?s:{enumerable:!0,get:()=>e[t]})}}}return Object.freeze(Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}))}var i={exports:{}};(function(r,p){ace.define("ace/snippets/jsoniq.snippets",["require","exports","module"],function(n,e,t){t.exports=`snippet for
		for $\${1:item} in \${2:expr}
	snippet return
		return \${1:expr}
	snippet import
		import module namespace \${1:ns} = "\${2:http://www.example.com/}";
	snippet some
		some $\${1:varname} in \${2:expr} satisfies \${3:expr}
	snippet every
		every $\${1:varname} in \${2:expr} satisfies \${3:expr}
	snippet if
		if(\${1:true}) then \${2:expr} else \${3:true}
	snippet switch
		switch(\${1:"foo"})
		case \${2:"foo"}
		return \${3:true}
		default return \${4:false}
	snippet try
		try { \${1:expr} } catch \${2:*} { \${3:expr} }
	snippet tumbling
		for tumbling window $\${1:varname} in \${2:expr}
		start at $\${3:start} when \${4:expr}
		end at $\${5:end} when \${6:expr}
		return \${7:expr}
	snippet sliding
		for sliding window $\${1:varname} in \${2:expr}
		start at $\${3:start} when \${4:expr}
		end at $\${5:end} when \${6:expr}
		return \${7:expr}
	snippet let
		let $\${1:varname} := \${2:expr}
	snippet group
		group by $\${1:varname} := \${2:expr}
	snippet order
		order by \${1:expr} \${2:descending}
	snippet stable
		stable order by \${1:expr}
	snippet count
		count $\${1:varname}
	snippet ordered
		ordered { \${1:expr} }
	snippet unordered
		unordered { \${1:expr} }
	snippet treat 
		treat as \${1:expr}
	snippet castable
		castable as \${1:atomicType}
	snippet cast
		cast as \${1:atomicType}
	snippet typeswitch
		typeswitch(\${1:expr})
		case \${2:type}  return \${3:expr}
		default return \${4:expr}
	snippet var
		declare variable $\${1:varname} := \${2:expr};
	snippet fn
		declare function \${1:ns}:\${2:name}(){
		\${3:expr}
		};
	snippet module
		module namespace \${1:ns} = "\${2:http://www.example.com}";
	`}),ace.define("ace/snippets/jsoniq",["require","exports","module","ace/snippets/jsoniq.snippets"],function(n,e,t){e.snippetText=n("./jsoniq.snippets"),e.scope="jsoniq"}),function(){ace.require(["ace/snippets/jsoniq"],function(n){r&&(r.exports=n)})}()})(i);var a=i.exports;const c=o(a),x=$({__proto__:null,default:c},[a]);export{x as j};
