import{a as x}from"./_commonjsHelpers-DsqdWQfm.js";function v(g,f){for(var t=0;t<f.length;t++){const a=f[t];if(typeof a!="string"&&!Array.isArray(a)){for(const r in a)if(r!=="default"&&!(r in g)){const s=Object.getOwnPropertyDescriptor(a,r);s&&Object.defineProperty(g,r,s.get?s:{enumerable:!0,get:()=>a[r]})}}}return Object.freeze(Object.defineProperty(g,Symbol.toStringTag,{value:"Module"}))}var y={exports:{}};(function(g,f){ace.define("ace/ext/menu_tools/settings_menu.css",["require","exports","module"],function(t,a,r){r.exports=`#ace_settingsmenu, #kbshortcutmenu {
    background-color: #F7F7F7;
    color: black;
    box-shadow: -5px 4px 5px rgba(126, 126, 126, 0.55);
    padding: 1em 0.5em 2em 1em;
    overflow: auto;
    position: absolute;
    margin: 0;
    bottom: 0;
    right: 0;
    top: 0;
    z-index: 9991;
    cursor: default;
}

.ace_dark #ace_settingsmenu, .ace_dark #kbshortcutmenu {
    box-shadow: -20px 10px 25px rgba(126, 126, 126, 0.25);
    background-color: rgba(255, 255, 255, 0.6);
    color: black;
}

.ace_optionsMenuEntry:hover {
    background-color: rgba(100, 100, 100, 0.1);
    transition: all 0.3s
}

.ace_closeButton {
    background: rgba(245, 146, 146, 0.5);
    border: 1px solid #F48A8A;
    border-radius: 50%;
    padding: 7px;
    position: absolute;
    right: -8px;
    top: -8px;
    z-index: 100000;
}
.ace_closeButton{
    background: rgba(245, 146, 146, 0.9);
}
.ace_optionsMenuKey {
    color: darkslateblue;
    font-weight: bold;
}
.ace_optionsMenuCommand {
    color: darkcyan;
    font-weight: normal;
}
.ace_optionsMenuEntry input, .ace_optionsMenuEntry button {
    vertical-align: middle;
}

.ace_optionsMenuEntry button[ace_selected_button=true] {
    background: #e7e7e7;
    box-shadow: 1px 0px 2px 0px #adadad inset;
    border-color: #adadad;
}
.ace_optionsMenuEntry button {
    background: white;
    border: 1px solid lightgray;
    margin: 0px;
}
.ace_optionsMenuEntry button:hover{
    background: #f0f0f0;
}`}),ace.define("ace/ext/menu_tools/overlay_page",["require","exports","module","ace/ext/menu_tools/overlay_page","ace/lib/dom","ace/ext/menu_tools/settings_menu.css"],function(t,a,r){var s=t("../../lib/dom"),b=t("./settings_menu.css");s.importCssString(b,"settings_menu.css",!1),r.exports.overlayPage=function(o,u,d){var n=document.createElement("div"),p=!1;function i(l){l.keyCode===27&&e()}function e(){n&&(document.removeEventListener("keydown",i),n.parentNode.removeChild(n),o&&o.focus(),n=null,d&&d())}function _(l){p=l,l&&(n.style.pointerEvents="none",u.style.pointerEvents="auto")}return n.style.cssText="margin: 0; padding: 0; position: fixed; top:0; bottom:0; left:0; right:0;z-index: 9990; "+(o?"background-color: rgba(0, 0, 0, 0.3);":""),n.addEventListener("click",function(l){p||e()}),document.addEventListener("keydown",i),u.addEventListener("click",function(l){l.stopPropagation()}),n.appendChild(u),document.body.appendChild(n),o&&o.blur(),{close:e,setIgnoreFocusOut:_}}}),ace.define("ace/ext/menu_tools/get_editor_keyboard_shortcuts",["require","exports","module","ace/ext/menu_tools/get_editor_keyboard_shortcuts","ace/lib/keys"],function(t,a,r){var s=t("../../lib/keys");r.exports.getEditorKeybordShortcuts=function(b){s.KEY_MODS;var c=[],o={};return b.keyBinding.$handlers.forEach(function(u){var d=u.commandKeyBinding;for(var n in d){var p=n.replace(/(^|-)\w/g,function(e){return e.toUpperCase()}),i=d[n];Array.isArray(i)||(i=[i]),i.forEach(function(e){typeof e!="string"&&(e=e.name),o[e]?o[e].key+="|"+p:(o[e]={key:p,command:e},c.push(o[e]))})}}),c}}),ace.define("ace/ext/keybinding_menu",["require","exports","module","ace/editor","ace/ext/menu_tools/overlay_page","ace/ext/menu_tools/get_editor_keyboard_shortcuts"],function(t,a,r){var s=t("../editor").Editor;function b(c){if(!document.getElementById("kbshortcutmenu")){var o=t("./menu_tools/overlay_page").overlayPage,u=t("./menu_tools/get_editor_keyboard_shortcuts").getEditorKeybordShortcuts,d=u(c),n=document.createElement("div"),p=d.reduce(function(i,e){return i+'<div class="ace_optionsMenuEntry"><span class="ace_optionsMenuCommand">'+e.command+'</span> : <span class="ace_optionsMenuKey">'+e.key+"</span></div>"},"");n.id="kbshortcutmenu",n.innerHTML="<h1>Keyboard Shortcuts</h1>"+p+"</div>",o(c,n)}}r.exports.init=function(c){s.prototype.showKeyboardShortcuts=function(){b(this)},c.commands.addCommands([{name:"showKeyboardShortcuts",bindKey:{win:"Ctrl-Alt-h",mac:"Command-Alt-h"},exec:function(o,u){o.showKeyboardShortcuts()}}])}}),function(){ace.require(["ace/ext/keybinding_menu"],function(t){g&&(g.exports=t)})}()})(y);var m=y.exports;const h=x(m),E=v({__proto__:null,default:h},[m]);export{E as e};
