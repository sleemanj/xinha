Xinha.prototype.insertNodeAtSelection=function(_1){
return null;
};
Xinha.prototype.getParentElement=function(_2){
if(typeof _2=="undefined"){
_2=this._getSelection();
}
var _3=this._createRange(_2);
switch(_2.type){
case "Text":
var _4=_3.parentElement();
while(true){
var _5=_3.duplicate();
_5.moveToElementText(_4);
if(_5.inRange(_3)){
break;
}
if((_4.nodeType!=1)||(_4.tagName.toLowerCase()=="body")){
break;
}
_4=_4.parentElement;
}
return _4;
case "None":
return _3.parentElement();
case "Control":
return _3.item(0);
default:
return this._doc.body;
}
};
Xinha.prototype._activeElement=function(_6){
if((_6===null)||this._selectionEmpty(_6)){
return null;
}
if(_6.type.toLowerCase()=="control"){
return _6.createRange().item(0);
}else{
var _7=_6.createRange();
var _8=this.getParentElement(_6);
if(_8.innerHTML==_7.htmlText){
return _8;
}
return null;
}
};
Xinha.prototype._selectionEmpty=function(_9){
if(!_9){
return true;
}
return this._createRange(_9).htmlText==="";
};
Xinha.prototype.selectNodeContents=function(_a,_b){
this.focusEditor();
this.forceRedraw();
var _c;
var _d=typeof _b=="undefined"?true:false;
if(_d&&_a.tagName&&_a.tagName.toLowerCase().match(/table|img|input|select|textarea/)){
_c=this._doc.body.createControlRange();
_c.add(_a);
}else{
_c=this._doc.body.createTextRange();
_c.moveToElementText(_a);
}
_c.select();
};
Xinha.prototype.insertHTML=function(_e){
var _f=this._getSelection();
var _10=this._createRange(_f);
this.focusEditor();
_10.pasteHTML(_e);
};
Xinha.prototype.getSelectedHTML=function(){
var sel=this._getSelection();
var _12=this._createRange(sel);
if(_12.htmlText){
return _12.htmlText;
}else{
if(_12.length>=1){
return _12.item(0).outerHTML;
}
}
return "";
};
Xinha.prototype.checkBackspace=function(){
var sel=this._getSelection();
if(sel.type=="Control"){
var elm=this._activeElement(sel);
Xinha.removeFromParent(elm);
return true;
}
var _15=this._createRange(sel);
var r2=_15.duplicate();
r2.moveStart("character",-1);
var a=r2.parentElement();
if(a!=_15.parentElement()&&(/^a$/i.test(a.tagName))){
r2.collapse(true);
r2.moveEnd("character",1);
r2.pasteHTML("");
r2.select();
return true;
}
};
Xinha.prototype._getSelection=function(){
return this._doc.selection;
};
Xinha.prototype._createRange=function(sel){
return sel.createRange();
};
Xinha.getOuterHTML=function(_19){
return _19.outerHTML;
};
Xinha.prototype._formatBlock=function(_1a){
};
Xinha._browserSpecificFunctionsLoaded=true;

