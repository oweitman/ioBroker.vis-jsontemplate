import{a}from"./_commonjsHelpers-DsqdWQfm.js";function c(o,p){for(var e=0;e<p.length;e++){const t=p[e];if(typeof t!="string"&&!Array.isArray(t)){for(const n in t)if(n!=="default"&&!(n in o)){const s=Object.getOwnPropertyDescriptor(t,n);s&&Object.defineProperty(o,n,s.get?s:{enumerable:!0,get:()=>t[n]})}}}return Object.freeze(Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}))}var r={exports:{}};(function(o,p){ace.define("ace/snippets/abc.snippets",["require","exports","module"],function(e,t,n){n.exports=`
snippet zupfnoter.print
	%%%%hn.print {"startpos": \${1:pos_y}, "t":"\${2:title}", "v":[\${3:voices}], "s":[[\${4:syncvoices}1,2]], "f":[\${5:flowlines}],  "sf":[\${6:subflowlines}], "j":[\${7:jumplines}]}

snippet zupfnoter.note
	%%%%hn.note {"pos": [\${1:pos_x},\${2:pos_y}], "text": "\${3:text}", "style": "\${4:style}"}

snippet zupfnoter.annotation
	%%%%hn.annotation {"id": "\${1:id}", "pos": [\${2:pos}], "text": "\${3:text}"}

snippet zupfnoter.lyrics
	%%%%hn.lyrics {"pos": [\${1:x_pos},\${2:y_pos}]}

snippet zupfnoter.legend
	%%%%hn.legend {"pos": [\${1:x_pos},\${2:y_pos}]}



snippet zupfnoter.target
	"^:\${1:target}"

snippet zupfnoter.goto
	"^@\${1:target}@\${2:distance}"

snippet zupfnoter.annotationref
	"^#\${1:target}"

snippet zupfnoter.annotation
	"^!\${1:text}@\${2:x_offset},\${3:y_offset}"


`}),ace.define("ace/snippets/abc",["require","exports","module","ace/snippets/abc.snippets"],function(e,t,n){t.snippetText=e("./abc.snippets"),t.scope="abc"}),function(){ace.require(["ace/snippets/abc"],function(e){o&&(o.exports=e)})}()})(r);var i=r.exports;const f=a(i),$=c({__proto__:null,default:f},[i]);export{$ as a};
