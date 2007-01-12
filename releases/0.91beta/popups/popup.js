Xinha=window.opener.Xinha;
HTMLArea=window.opener.Xinha;
function getAbsolutePos(el){
var r={x:el.offsetLeft,y:el.offsetTop};
if(el.offsetParent){
var _3=getAbsolutePos(el.offsetParent);
r.x+=_3.x;
r.y+=_3.y;
}
return r;
}
function comboSelectValue(c,_5){
var _6=c.getElementsByTagName("option");
for(var i=_6.length;--i>=0;){
var op=_6[i];
op.selected=(op.value==_5);
}
c.value=_5;
}
function __dlg_onclose(){
opener.Dialog._return(null);
}
function __dlg_init(_9,_a){
if(window.__dlg_init_done){
return true;
}
if(window.opener._editor_skin!=""){
var _b=document.getElementsByTagName("head")[0];
var _c=document.createElement("link");
_c.type="text/css";
_c.href=window.opener._editor_url+"skins/"+window.opener._editor_skin+"/skin.css";
_c.rel="stylesheet";
_b.appendChild(_c);
}
window.dialogArguments=opener.Dialog._arguments;
var _d=document.body;
if(_a){
window.resizeTo(_a.width,_a.height);
if(_a.top&&_a.left){
window.moveTo(_a.left,_a.top);
}else{
if(!Xinha.is_ie){
var x=opener.screenX+(opener.outerWidth-_a.width)/2;
var y=opener.screenY+(opener.outerHeight-_a.height)/2;
}else{
var x=(self.screen.availWidth-_a.width)/2;
var y=(self.screen.availHeight-_a.height)/2;
}
window.moveTo(x,y);
}
}else{
if(window.sizeToContent){
window.sizeToContent();
window.sizeToContent();
window.addEventListener("unload",__dlg_onclose,true);
window.innerWidth=_d.offsetWidth+5;
window.innerHeight=_d.scrollHeight+2;
var x=opener.screenX+(opener.outerWidth-window.outerWidth)/2;
var y=opener.screenY+(opener.outerHeight-window.outerHeight)/2;
window.moveTo(x,y);
}else{
var _10=document.documentElement?document.documentElement:null;
var _11=_10&&_10.scrollTop?_10.scrollHeight:_d.scrollHeight;
window.resizeTo(_d.scrollWidth,_11);
var ch=_10&&_10.clientHeight?_10.clientHeight:_d.clientHeight;
var cw=_10&&_10.clientWidth?_10.clientWidth:_d.clientWidth;
window.resizeBy(_d.offsetWidth-cw,_11-ch);
var W=_d.offsetWidth;
var H=2*_11-ch;
var x=(screen.availWidth-W)/2;
var y=(screen.availHeight-H)/2;
window.moveTo(x,y);
}
}
Xinha.addDom0Event(document.body,"keypress",__dlg_close_on_esc);
window.__dlg_init_done=true;
}
function __dlg_translate(_16){
var _17=["input","select","legend","span","option","td","th","button","div","label","a","img"];
for(var _18=0;_18<_17.length;++_18){
var _19=document.getElementsByTagName(_17[_18]);
for(var i=_19.length;--i>=0;){
var _1b=_19[i];
if(_1b.firstChild&&_1b.firstChild.data){
var txt=Xinha._lc(_1b.firstChild.data,_16);
if(txt){
_1b.firstChild.data=txt;
}
}
if(_1b.title){
var txt=Xinha._lc(_1b.title,_16);
if(txt){
_1b.title=txt;
}
}
}
}
document.title=Xinha._lc(document.title,_16);
}
function __dlg_close(val){
opener.Dialog._return(val);
window.close();
}
function __dlg_close_on_esc(ev){
ev||(ev=window.event);
if(ev.keyCode==27){
__dlg_close(null);
return false;
}
return true;
}

