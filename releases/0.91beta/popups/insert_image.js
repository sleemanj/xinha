Xinha.prototype._insertImage=function(_1){
var _2=this;
var _3=null;
if(typeof _1=="undefined"){
_1=this.getParentElement();
if(_1&&_1.tagName.toLowerCase()!="img"){
_1=null;
}
}
if(_1){
_3={f_base:_2.config.baseHref,f_url:Xinha.is_ie?_2.stripBaseURL(_1.src):_1.getAttribute("src"),f_alt:_1.alt,f_border:_1.border,f_align:_1.align,f_vert:_1.vspace,f_horiz:_1.hspace};
}
this._popupDialog(_2.config.URIs.insert_image,function(_4){
if(!_4){
return false;
}
var _5=_1;
if(!_5){
if(Xinha.is_ie){
var _6=_2._getSelection();
var _7=_2._createRange(_6);
_2._doc.execCommand("insertimage",false,_4.f_url);
_5=_7.parentElement();
if(_5.tagName.toLowerCase()!="img"){
_5=_5.previousSibling;
}
}else{
_5=document.createElement("img");
_5.src=_4.f_url;
_2.insertNodeAtSelection(_5);
if(!_5.tagName){
_5=_7.startContainer.firstChild;
}
}
}else{
_5.src=_4.f_url;
}
for(var _8 in _4){
var _9=_4[_8];
switch(_8){
case "f_alt":
_5.alt=_9;
break;
case "f_border":
_5.border=parseInt(_9||"0",10);
break;
case "f_align":
_5.align=_9;
break;
case "f_vert":
_5.vspace=parseInt(_9||"0",10);
break;
case "f_horiz":
_5.hspace=parseInt(_9||"0",10);
break;
}
}
},_3);
};

