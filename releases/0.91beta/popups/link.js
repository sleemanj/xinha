Xinha.prototype._createLink=function(_1){
var _2=this;
var _3=null;
if(typeof _1=="undefined"){
_1=this.getParentElement();
if(_1){
while(_1&&!/^a$/i.test(_1.tagName)){
_1=_1.parentNode;
}
}
}
if(!_1){
var _4=_2._getSelection();
var _5=_2._createRange(_4);
var _6=0;
if(Xinha.is_ie){
if(_4.type=="Control"){
_6=_5.length;
}else{
_6=_5.compareEndPoints("StartToEnd",_5);
}
}else{
_6=_5.compareBoundaryPoints(_5.START_TO_END,_5);
}
if(_6===0){
alert(Xinha._lc("You need to select some text before creating a link"));
return;
}
_3={f_href:"",f_title:"",f_target:"",f_usetarget:_2.config.makeLinkShowsTarget};
}else{
_3={f_href:Xinha.is_ie?_2.stripBaseURL(_1.href):_1.getAttribute("href"),f_title:_1.title,f_target:_1.target,f_usetarget:_2.config.makeLinkShowsTarget};
}
this._popupDialog(_2.config.URIs.link,function(_7){
if(!_7){
return false;
}
var a=_1;
if(!a){
try{
var _9=Xinha.uniq("http://www.example.com/Link");
_2._doc.execCommand("createlink",false,_9);
var _a=_2._doc.getElementsByTagName("a");
for(var i=0;i<_a.length;i++){
var _c=_a[i];
if(_c.href==_9){
if(!a){
a=_c;
}
_c.href=_7.f_href;
if(_7.f_target){
_c.target=_7.f_target;
}
if(_7.f_title){
_c.title=_7.f_title;
}
}
}
}
catch(ex){
}
}else{
var _d=_7.f_href.trim();
_2.selectNodeContents(a);
if(_d===""){
_2._doc.execCommand("unlink",false,null);
_2.updateToolbar();
return false;
}else{
a.href=_d;
}
}
if(!(a&&a.tagName.toLowerCase()=="a")){
return false;
}
a.target=_7.f_target.trim();
a.title=_7.f_title.trim();
_2.selectNodeContents(a);
_2.updateToolbar();
},_3);
};

