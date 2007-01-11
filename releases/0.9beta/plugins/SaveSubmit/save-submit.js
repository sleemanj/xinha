function SaveSubmit(_1){
this.editor=_1;
this.initial_html=null;
this.changed=false;
var _2=this;
var _3=_1.config;
this.textarea=this.editor._textArea;
this.imgage_changed=_editor_url+"plugins/SaveSubmit/img/ed_save_red.gif";
this.imgage_unchanged=_editor_url+"plugins/SaveSubmit/img/ed_save_green.gif";
_3.registerButton({id:"savesubmit",tooltip:_2._lc("Save"),image:this.imgage_unchanged,textMode:false,action:function(_4){
_2.save(_4);
}});
_3.addToolbarElement("savesubmit","popupeditor",-1);
}
SaveSubmit.prototype._lc=function(_5){
return HTMLArea._lc(_5,"SaveSubmit");
};
SaveSubmit._pluginInfo={name:"SaveSubmit",version:"1.0",developer:"Raimund Meyer",developer_url:"http://rheinauf.de",c_owner:"Raimund Meyer",sponsor:"",sponsor_url:"",license:"htmlArea"};
SaveSubmit.prototype.onGenerate=function(){
var _6=this;
var _7=this.editordoc=this.editor._iframe.contentWindow.document;
HTMLArea._addEvents(_7,["mouseup","keyup","keypress","keydown"],function(_8){
return _6.onEvent(HTMLArea.is_ie?_6.editor._iframe.contentWindow.event:_8);
});
};
SaveSubmit.prototype.onEvent=function(ev){
var _a=(HTMLArea.is_ie&&ev.type=="keydown")||(!HTMLArea.is_ie&&ev.type=="keypress");
if(_a&&ev.ctrlKey&&String.fromCharCode(HTMLArea.is_ie?ev.keyCode:ev.charCode).toLowerCase()=="s"){
this.save(this.editor);
}else{
if(!this.changed){
if(this.getChanged()){
this.setChanged();
}
}
}
};
SaveSubmit.prototype.getChanged=function(){
if(this.initial_html==null){
this.initial_html=this.editor.getHTML();
}
if(this.initial_html!=this.editor.getHTML()&&this.changed==false){
this.changed=true;
return true;
}else{
return false;
}
};
SaveSubmit.prototype.setChanged=function(){
toolbar_objects=this.editor._toolbarObjects;
for(var i in toolbar_objects){
var _c=toolbar_objects[i];
if(_c.name=="savesubmit"){
_c.swapImage(this.imgage_changed);
}
}
this.editor.updateToolbar();
};
SaveSubmit.prototype.changedReset=function(){
this.changed=false;
this.initial_html=null;
toolbar_objects=this.editor._toolbarObjects;
for(var i in toolbar_objects){
var _e=toolbar_objects[i];
if(_e.name=="savesubmit"){
_e.swapImage(this.imgage_unchanged);
}
}
};
SaveSubmit.prototype.save=function(_f){
this.buildMessage();
var _10=this;
var _11=_f._textArea.form;
_11.onsubmit();
var _12="";
for(var i=0;i<_11.elements.length;i++){
_12+=((i>0)?"&":"")+_11.elements[i].name+"="+encodeURIComponent(_11.elements[i].value);
}
HTMLArea._postback(_f._textArea.form.action,_12,function(_14){
if(_14){
_10.setMessage(_14);
_10.changedReset();
}
removeMessage=function(){
_10.removeMessage();
};
window.setTimeout("removeMessage()",1000);
});
};
SaveSubmit.prototype.setMessage=function(_15){
var _16=this.textarea;
if(!document.getElementById("message_sub_"+_16.name)){
return;
}
var elt=document.getElementById("message_sub_"+_16.name);
elt.innerHTML=HTMLArea._lc(_15,"SaveSubmit");
};
SaveSubmit.prototype.removeMessage=function(){
var _18=this.textarea;
if(!document.getElementById("message_"+_18.name)){
return;
}
document.body.removeChild(document.getElementById("message_"+_18.name));
};
SaveSubmit.prototype.buildMessage=function(){
var _19=this.textarea;
var _1a=this.editor._htmlArea;
var _1b=document.createElement("div");
_1b.id="message_"+_19.name;
_1b.className="loading";
_1b.style.width=_1a.offsetWidth+"px";
_1b.style.left=HTMLArea.findPosX(_1a)+"px";
_1b.style.top=(HTMLArea.findPosY(_1a)+parseInt(_1a.offsetHeight)/2)-50+"px";
var _1c=document.createElement("div");
_1c.className="loading_main";
_1c.id="loading_main_"+_19.name;
_1c.appendChild(document.createTextNode(this._lc("Saving...")));
var _1d=document.createElement("div");
_1d.className="loading_sub";
_1d.id="message_sub_"+_19.name;
_1d.appendChild(document.createTextNode(this._lc("in progress")));
_1b.appendChild(_1c);
_1b.appendChild(_1d);
document.body.appendChild(_1b);
};

