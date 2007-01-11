HTMLArea.PanelDialog=function(_1,_2,_3,_4){
this.id={};
this.r_id={};
this.editor=_1;
this.document=document;
this.rootElem=_1.addPanel(_2);
var _5=this;
if(typeof _4=="function"){
this._lc=_4;
}else{
if(_4){
this._lc=function(_6){
return HTMLArea._lc(_6,_4);
};
}else{
this._lc=function(_7){
return _7;
};
}
}
_3=_3.replace(/\[([a-z0-9_]+)\]/ig,function(_8,id){
if(typeof _5.id[id]=="undefined"){
_5.id[id]=HTMLArea.uniq("Dialog");
_5.r_id[_5.id[id]]=id;
}
return _5.id[id];
}).replace(/<l10n>(.*?)<\/l10n>/ig,function(_a,_b){
return _5._lc(_b);
}).replace(/="_\((.*?)\)"/g,function(_c,_d){
return "=\""+_5._lc(_d)+"\"";
});
this.rootElem.innerHTML=_3;
};
HTMLArea.PanelDialog.prototype.show=function(_e){
this.editor.showPanel(this.rootElem);
};
HTMLArea.PanelDialog.prototype.hide=function(){
this.editor.hidePanel(this.rootElem);
return this.getValues();
};
HTMLArea.PanelDialog.prototype.onresize=HTMLArea.Dialog.prototype.onresize;
HTMLArea.PanelDialog.prototype.toggle=HTMLArea.Dialog.prototype.toggle;
HTMLArea.PanelDialog.prototype.setValues=HTMLArea.Dialog.prototype.setValues;
HTMLArea.PanelDialog.prototype.getValues=HTMLArea.Dialog.prototype.getValues;
HTMLArea.PanelDialog.prototype.getElementById=HTMLArea.Dialog.prototype.getElementById;
HTMLArea.PanelDialog.prototype.getElementsByName=HTMLArea.Dialog.prototype.getElementsByName;

