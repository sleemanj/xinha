function __dlg_onclose(){
if(opener.Dialog._return){
opener.Dialog._return(null);
}
}
function __dlg_translate(_1){
var _2=["span","option","td","th","button","div","label","a","img","legend"];
for(var _3=0;_3<_2.length;_3++){
var _4=document.getElementsByTagName(_2[_3]);
for(var i=_4.length;--i>=0;){
var _6=_4[i];
if(_6.firstChild&&_6.firstChild.data){
var _7=HTMLArea._lc(_6.firstChild.data,_1);
if(_7){
_6.firstChild.data=_7;
}
}
if(_6.title){
var _7=HTMLArea._lc(_6.title,_1);
if(_7){
_6.title=_7;
}
}
if(_6.alt){
var _7=HTMLArea._lc(_6.alt,_1);
if(_7){
_6.alt=_7;
}
}
}
}
document.title=HTMLArea._lc(document.title,_1);
}
function __dlg_close(_8){
opener.Dialog._return(_8);
window.close();
}

