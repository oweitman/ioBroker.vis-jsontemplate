import{a as P}from"./_commonjsHelpers-DsqdWQfm.js";function D(m,b){for(var a=0;a<b.length;a++){const u=b[a];if(typeof u!="string"&&!Array.isArray(u)){for(const l in u)if(l!=="default"&&!(l in m)){const v=Object.getOwnPropertyDescriptor(u,l);v&&Object.defineProperty(m,l,v.get?v:{enumerable:!0,get:()=>u[l]})}}}return Object.freeze(Object.defineProperty(m,Symbol.toStringTag,{value:"Module"}))}var T={exports:{}};(function(m,b){ace.define("ace/ext/static-css",["require","exports","module"],function(a,u,l){l.exports=`.ace_static_highlight {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Source Code Pro', 'source-code-pro', 'Droid Sans Mono', monospace;
    font-size: 12px;
    white-space: pre-wrap
}

.ace_static_highlight .ace_gutter {
    width: 2em;
    text-align: right;
    padding: 0 3px 0 0;
    margin-right: 3px;
    contain: none;
}

.ace_static_highlight.ace_show_gutter .ace_line {
    padding-left: 2.6em;
}

.ace_static_highlight .ace_line { position: relative; }

.ace_static_highlight .ace_gutter-cell {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    top: 0;
    bottom: 0;
    left: 0;
    position: absolute;
}


.ace_static_highlight .ace_gutter-cell:before {
    content: counter(ace_line, decimal);
    counter-increment: ace_line;
}
.ace_static_highlight {
    counter-reset: ace_line;
}
`}),ace.define("ace/ext/static_highlight",["require","exports","module","ace/edit_session","ace/layer/text","ace/ext/static-css","ace/config","ace/lib/dom","ace/lib/lang"],function(a,u,l){var v=a("../edit_session").EditSession,E=a("../layer/text").Text,L=a("./static-css"),S=a("../config"),$=a("../lib/dom"),O=a("../lib/lang").escapeHTML,w=function(){function t(e){this.className,this.type=e,this.style={},this.textContent=""}return t.prototype.cloneNode=function(){return this},t.prototype.appendChild=function(e){this.textContent+=e.toString()},t.prototype.toString=function(){var e=[];if(this.type!="fragment"){e.push("<",this.type),this.className&&e.push(" class='",this.className,"'");var r=[];for(var o in this.style)r.push(o,":",this.style[o]);r.length&&e.push(" style='",r.join(""),"'"),e.push(">")}return this.textContent&&e.push(this.textContent),this.type!="fragment"&&e.push("</",this.type,">"),e.join("")},t}(),_={createTextNode:function(t,e){return O(t)},createElement:function(t){return new w(t)},createFragment:function(){return new w("fragment")}},N=function(){this.config={},this.dom=_};N.prototype=E.prototype;var x=function(t,e,r){var o=t.className.match(/lang-(\w+)/),d=e.mode||o&&"ace/mode/"+o[1];if(!d)return!1;var c=e.theme||"ace/theme/textmate",n="",f=[];if(t.firstElementChild)for(var h=0,s=0;s<t.childNodes.length;s++){var i=t.childNodes[s];i.nodeType==3?(h+=i.data.length,n+=i.data):f.push(h,i)}else n=t.textContent,e.trim&&(n=n.trim());x.render(n,d,c,e.firstLineNumber,!e.showGutter,function(g){$.importCssString(g.css,"ace_highlight",!0),t.innerHTML=g.html;for(var y=t.firstChild.firstChild,p=0;p<f.length;p+=2){var C=g.session.doc.indexToPosition(f[p]),z=f[p+1],M=y.children[C.row];M&&M.appendChild(z)}r&&r()})};x.render=function(t,e,r,o,d,c){var n=1,f=v.prototype.$modes;typeof r=="string"&&(n++,S.loadModule(["theme",r],function(i){r=i,--n||s()}));var h;e&&typeof e=="object"&&!e.getTokenizer&&(h=e,e=h.path),typeof e=="string"&&(n++,S.loadModule(["mode",e],function(i){(!f[e]||h)&&(f[e]=new i.Mode(h)),e=f[e],--n||s()}));function s(){var i=x.renderSync(t,e,r,o,d);return c?c(i):i}return--n||s()},x.renderSync=function(t,e,r,o,d){o=parseInt(o||1,10);var c=new v("");c.setUseWorker(!1),c.setMode(e);var n=new N;n.setSession(c),Object.keys(n.$tabStrings).forEach(function(p){if(typeof n.$tabStrings[p]=="string"){var C=_.createFragment();C.textContent=n.$tabStrings[p],n.$tabStrings[p]=C}}),c.setValue(t);var f=c.getLength(),h=_.createElement("div");h.className=r.cssClass;var s=_.createElement("div");s.className="ace_static_highlight"+(d?"":" ace_show_gutter"),s.style["counter-reset"]="ace_line "+(o-1);for(var i=0;i<f;i++){var g=_.createElement("div");if(g.className="ace_line",!d){var y=_.createElement("span");y.className="ace_gutter ace_gutter-cell",y.textContent="",g.appendChild(y)}n.$renderLine(g,i,!1),g.textContent+=`
`,s.appendChild(g)}return h.appendChild(s),{css:L+r.cssText,html:h.toString(),session:c}},l.exports=x,l.exports.highlight=x}),function(){ace.require(["ace/ext/static_highlight"],function(a){m&&(m.exports=a)})}()})(T);var j=T.exports;const F=P(j),A=D({__proto__:null,default:F},[j]);export{A as e};
