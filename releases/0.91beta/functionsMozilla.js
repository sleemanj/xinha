Xinha.prototype.insertNodeAtSelection=function(_1){
var _2=this._getSelection();
var _3=this._createRange(_2);
_2.removeAllRanges();
_3.deleteContents();
var _4=_3.startContainer;
var _5=_3.startOffset;
var _6=_1;
switch(_4.nodeType){
case 3:
if(_1.nodeType==3){
_4.insertData(_5,_1.data);
_3=this._createRange();
_3.setEnd(_4,_5+_1.length);
_3.setStart(_4,_5+_1.length);
_2.addRange(_3);
}else{
_4=_4.splitText(_5);
if(_1.nodeType==11){
_6=_6.firstChild;
}
_4.parentNode.insertBefore(_1,_4);
this.selectNodeContents(_6);
this.updateToolbar();
}
break;
case 1:
if(_1.nodeType==11){
_6=_6.firstChild;
}
_4.insertBefore(_1,_4.childNodes[_5]);
this.selectNodeContents(_6);
this.updateToolbar();
break;
}
};
Xinha.prototype.getParentElement=function(_7){
if(typeof _7=="undefined"){
_7=this._getSelection();
}
var _8=this._createRange(_7);
try{
var p=_8.commonAncestorContainer;
if(!_8.collapsed&&_8.startContainer==_8.endContainer&&_8.startOffset-_8.endOffset<=1&&_8.startContainer.hasChildNodes()){
p=_8.startContainer.childNodes[_8.startOffset];
}
while(p.nodeType==3){
p=p.parentNode;
}
return p;
}
catch(ex){
return null;
}
};
Xinha.prototype._activeElement=function(_a){
if((_a===null)||this._selectionEmpty(_a)){
return null;
}
if(!_a.isCollapsed){
if(_a.anchorNode.childNodes.length>_a.anchorOffset&&_a.anchorNode.childNodes[_a.anchorOffset].nodeType==1){
return _a.anchorNode.childNodes[_a.anchorOffset];
}else{
if(_a.anchorNode.nodeType==1){
return _a.anchorNode;
}else{
return null;
}
}
}
return null;
};
Xinha.prototype._selectionEmpty=function(_b){
if(!_b){
return true;
}
if(typeof _b.isCollapsed!="undefined"){
return _b.isCollapsed;
}
return true;
};
Xinha.prototype.selectNodeContents=function(_c,_d){
this.focusEditor();
this.forceRedraw();
var _e;
var _f=typeof _d=="undefined"?true:false;
var sel=this._getSelection();
_e=this._doc.createRange();
if(_f&&_c.tagName&&_c.tagName.toLowerCase().match(/table|img|input|textarea|select/)){
_e.selectNode(_c);
}else{
_e.selectNodeContents(_c);
}
sel.removeAllRanges();
sel.addRange(_e);
};
Xinha.prototype.insertHTML=function(_11){
var sel=this._getSelection();
var _13=this._createRange(sel);
this.focusEditor();
var _14=this._doc.createDocumentFragment();
var div=this._doc.createElement("div");
div.innerHTML=_11;
while(div.firstChild){
_14.appendChild(div.firstChild);
}
var _16=this.insertNodeAtSelection(_14);
};
Xinha.prototype.getSelectedHTML=function(){
var sel=this._getSelection();
var _18=this._createRange(sel);
return Xinha.getHTML(_18.cloneContents(),false,this);
};
Xinha.prototype.checkBackspace=function(){
var _19=this;
setTimeout(function(){
var sel=_19._getSelection();
var _1b=_19._createRange(sel);
var SC=_1b.startContainer;
var SO=_1b.startOffset;
var EC=_1b.endContainer;
var EO=_1b.endOffset;
var _20=SC.nextSibling;
if(SC.nodeType==3){
SC=SC.parentNode;
}
if(!(/\S/.test(SC.tagName))){
var p=document.createElement("p");
while(SC.firstChild){
p.appendChild(SC.firstChild);
}
SC.parentNode.insertBefore(p,SC);
Xinha.removeFromParent(SC);
var r=_1b.cloneRange();
r.setStartBefore(_20);
r.setEndAfter(_20);
r.extractContents();
sel.removeAllRanges();
sel.addRange(r);
}
},10);
};
Xinha.prototype._getSelection=function(){
return this._iframe.contentWindow.getSelection();
};
Xinha.prototype._createRange=function(sel){
this.activateEditor();
if(typeof sel!="undefined"){
try{
return sel.getRangeAt(0);
}
catch(ex){
return this._doc.createRange();
}
}else{
return this._doc.createRange();
}
};
Xinha.getOuterHTML=function(_24){
return (new XMLSerializer()).serializeToString(_24);
};
Xinha.prototype._formatBlock=function(_25){
var _26=this.getAllAncestors();
var _27,x=null;
var _28=null;
var _29=[];
if(_25.indexOf(".")>=0){
_28=_25.substr(0,_25.indexOf(".")).toLowerCase();
_29=_25.substr(_25.indexOf("."),_25.length-_25.indexOf(".")).replace(/\./g,"").replace(/^\s*/,"").replace(/\s*$/,"").split(" ");
}else{
_28=_25.toLowerCase();
}
var sel=this._getSelection();
var rng=this._createRange(sel);
if(Xinha.is_gecko){
if(sel.isCollapsed){
_27=this._getAncestorBlock(sel);
if(_27===null){
_27=this._createImplicitBlock(sel,_28);
}
}else{
switch(_28){
case "h1":
case "h2":
case "h3":
case "h4":
case "h5":
case "h6":
case "h7":
_27=[];
var _2c=["h1","h2","h3","h4","h5","h6","h7"];
for(var y=0;y<_2c.length;y++){
var _2e=this._doc.getElementsByTagName(_2c[y]);
for(x=0;x<_2e.length;x++){
if(sel.containsNode(_2e[x])){
_27[_27.length]=_2e[x];
}
}
}
if(_27.length>0){
break;
}
case "div":
_27=this._doc.createElement(_28);
_27.appendChild(rng.extractContents());
rng.insertNode(_27);
break;
case "p":
case "center":
case "pre":
case "ins":
case "del":
case "blockquote":
case "address":
_27=[];
var _2f=this._doc.getElementsByTagName(_28);
for(x=0;x<_2f.length;x++){
if(sel.containsNode(_2f[x])){
_27[_27.length]=_2f[x];
}
}
if(_27.length===0){
sel.collapseToStart();
return this._formatBlock(_25);
}
break;
}
}
}
};
Xinha.prototype.mozKey=function(ev,_31){
var _32=this;
var s=_32._getSelection();
var _34=function(_35,tag){
var _37=_35.nextSibling;
if(typeof tag=="string"){
tag=_32._doc.createElement(tag);
}
var a=_35.parentNode.insertBefore(tag,_37);
Xinha.removeFromParent(_35);
a.appendChild(_35);
_37.data=" "+_37.data;
if(Xinha.is_ie){
var r=_32._createRange(s);
s.moveToElementText(_37);
s.move("character",1);
}else{
s.collapse(_37,1);
}
Xinha._stopEvent(ev);
_32._unLink=function(){
var t=a.firstChild;
a.removeChild(t);
a.parentNode.insertBefore(t,a);
Xinha.removeFromParent(a);
_32._unLink=null;
_32._unlinkOnUndo=false;
};
_32._unlinkOnUndo=true;
return a;
};
switch(ev.which){
case 32:
if(this.config.convertUrlsToLinks&&s&&s.isCollapsed&&s.anchorNode.nodeType==3&&s.anchorNode.data.length>3&&s.anchorNode.data.indexOf(".")>=0){
var _3b=s.anchorNode.data.substring(0,s.anchorOffset).search(/\S{4,}$/);
if(_3b==-1){
break;
}
if(this._getFirstAncestor(s,"a")){
break;
}
var _3c=s.anchorNode.data.substring(0,s.anchorOffset).replace(/^.*?(\S*)$/,"$1");
var _3d=_3c.match(Xinha.RE_email);
if(_3d){
var _3e=s.anchorNode;
var _3f=_3e.splitText(s.anchorOffset);
var _40=_3e.splitText(_3b);
_34(_40,"a").href="mailto:"+_3d[0];
break;
}
RE_date=/([0-9]+\.)+/;
RE_ip=/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;
var _41=_3c.match(Xinha.RE_url);
if(_41){
if(RE_date.test(_3c)){
if(!RE_ip.test(_3c)){
break;
}
}
var _42=s.anchorNode;
var _43=_42.splitText(s.anchorOffset);
var _44=_42.splitText(_3b);
_34(_44,"a").href=(_41[1]?_41[1]:"http://")+_41[2];
break;
}
}
break;
default:
if(ev.keyCode==27||(this._unlinkOnUndo&&ev.ctrlKey&&ev.which==122)){
if(this._unLink){
this._unLink();
Xinha._stopEvent(ev);
}
break;
}else{
if(ev.which||ev.keyCode==8||ev.keyCode==46){
this._unlinkOnUndo=false;
if(s.anchorNode&&s.anchorNode.nodeType==3){
var a=this._getFirstAncestor(s,"a");
if(!a){
break;
}
if(!a._updateAnchTimeout){
if(s.anchorNode.data.match(Xinha.RE_email)&&a.href.match("mailto:"+s.anchorNode.data.trim())){
var _46=s.anchorNode;
var _47=function(){
a.href="mailto:"+_46.data.trim();
a._updateAnchTimeout=setTimeout(_47,250);
};
a._updateAnchTimeout=setTimeout(_47,1000);
break;
}
var m=s.anchorNode.data.match(Xinha.RE_url);
if(m&&a.href.match(s.anchorNode.data.trim())){
var _49=s.anchorNode;
var _4a=function(){
m=_49.data.match(Xinha.RE_url);
a.href=(m[1]?m[1]:"http://")+m[2];
a._updateAnchTimeout=setTimeout(_4a,250);
};
a._updateAnchTimeout=setTimeout(_4a,1000);
}
}
}
}
}
break;
}
switch(ev.keyCode){
case 13:
if(Xinha.is_gecko&&!ev.shiftKey&&this.config.mozParaHandler=="dirty"){
this.dom_checkInsertP();
Xinha._stopEvent(ev);
}
break;
case 8:
case 46:
if((Xinha.is_gecko&&!ev.shiftKey)||Xinha.is_ie){
if(this.checkBackspace()){
Xinha._stopEvent(ev);
}
}
break;
}
};
Xinha._browserSpecificFunctionsLoaded=true;

