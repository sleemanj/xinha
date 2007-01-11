function SuperClean(_1,_2){
this.editor=_1;
var _3=this;
_1._superclean_on=false;
_1.config.registerButton("superclean",this._lc("Clean up HTML"),_1.imgURL("ed_superclean.gif","SuperClean"),true,function(e,_5,_6){
_3._superClean(null,_6);
});
_1.config.addToolbarElement("superclean","killword",0);
}
SuperClean._pluginInfo={name:"SuperClean",version:"1.0",developer:"James Sleeman, Niko Sams",developer_url:"http://www.gogo.co.nz/",c_owner:"Gogo Internet Services",license:"htmlArea",sponsor:"Gogo Internet Services",sponsor_url:"http://www.gogo.co.nz/"};
SuperClean.prototype._lc=function(_7){
return HTMLArea._lc(_7,"SuperClean");
};
SuperClean.prototype._superClean=function(_8,_9){
var _a=this;
var _b=function(){
var _c=_a._dialog.hide();
var _d=_a.editor;
if(_c.word_clean){
_d._wordClean();
}
var D=_d.getInnerHTML();
for(var _f in _d.config.SuperClean.filters){
if(_f=="tidy"||_f=="word_clean"){
continue;
}
if(_c[_f]){
D=SuperClean.filterFunctions[_f](D,_d);
}
}
D=D.replace(/(style|class)="\s*"/gi,"");
D=D.replace(/<(font|span)\s*>/gi,"");
_d.setHTML(D);
if(_c.tidy){
HTMLArea._postback(_d.config.SuperClean.tidy_handler,{"content":_d.getInnerHTML()},function(_10){
eval(_10);
});
}
return true;
};
if(this.editor.config.SuperClean.show_dialog){
var _11={};
this._dialog.show(_11,_b);
}else{
var _12=this.editor;
var _13=_12.getInnerHTML();
for(var _14 in _12.config.SuperClean.filters){
if(_14=="tidy"){
continue;
}
_13=SuperClean.filterFunctions[_14](_13,_12);
}
_13=_13.replace(/(style|class)="\s*"/gi,"");
_13=_13.replace(/<(font|span)\s*>/gi,"");
_12.setHTML(_13);
if(_12.config.SuperClean.filters.tidy){
SuperClean.filterFunctions.tidy(_13,_12);
}
}
};
HTMLArea.Config.prototype.SuperClean={"tidy_handler":_editor_url+"plugins/SuperClean/tidy.php","filters":{"tidy":HTMLArea._lc("General tidy up and correction of some problems.","SuperClean"),"word_clean":HTMLArea._lc("Clean bad HTML from Microsoft Word","SuperClean"),"remove_faces":HTMLArea._lc("Remove custom typefaces (font \"styles\").","SuperClean"),"remove_sizes":HTMLArea._lc("Remove custom font sizes.","SuperClean"),"remove_colors":HTMLArea._lc("Remove custom text colors.","SuperClean"),"remove_lang":HTMLArea._lc("Remove lang attributes.","SuperClean"),"remove_fancy_quotes":{label:HTMLArea._lc("Replace directional quote marks with non-directional quote marks.","SuperClean"),checked:false}},"show_dialog":true};
SuperClean.filterFunctions={};
SuperClean.filterFunctions.remove_colors=function(D){
D=D.replace(/color="?[^" >]*"?/gi,"");
D=D.replace(/([^-])color:[^;}"']+;?/gi,"$1");
return (D);
};
SuperClean.filterFunctions.remove_sizes=function(D){
D=D.replace(/size="?[^" >]*"?/gi,"");
D=D.replace(/font-size:[^;}"']+;?/gi,"");
return (D);
};
SuperClean.filterFunctions.remove_faces=function(D){
D=D.replace(/face="?[^" >]*"?/gi,"");
D=D.replace(/font-family:[^;}"']+;?/gi,"");
return (D);
};
SuperClean.filterFunctions.remove_lang=function(D){
D=D.replace(/lang="?[^" >]*"?/gi,"");
return (D);
};
SuperClean.filterFunctions.word_clean=function(_19,_1a){
_1a.setHTML(_19);
_1a._wordClean();
return _1a.getInnerHTML();
};
SuperClean.filterFunctions.remove_fancy_quotes=function(D){
D=D.replace(new RegExp(String.fromCharCode(8216),"g"),"'");
D=D.replace(new RegExp(String.fromCharCode(8217),"g"),"'");
D=D.replace(new RegExp(String.fromCharCode(8218),"g"),"'");
D=D.replace(new RegExp(String.fromCharCode(8219),"g"),"'");
D=D.replace(new RegExp(String.fromCharCode(8220),"g"),"\"");
D=D.replace(new RegExp(String.fromCharCode(8221),"g"),"\"");
D=D.replace(new RegExp(String.fromCharCode(8222),"g"),"\"");
D=D.replace(new RegExp(String.fromCharCode(8223),"g"),"\"");
return D;
};
SuperClean.filterFunctions.tidy=function(_1c,_1d){
HTMLArea._postback(_1d.config.SuperClean.tidy_handler,{"content":_1c},function(_1e){
eval(_1e);
});
};
SuperClean.prototype.onGenerate=function(){
if(this.editor.config.SuperClean.show_dialog&&!this._dialog){
this._dialog=new SuperClean.Dialog(this);
}
if(this.editor.config.tidy_handler){
this.editor.config.SuperClean.tidy_handler=this.editor.config.tidy_handler;
this.editor.config.tidy_handler=null;
}
if(!this.editor.config.SuperClean.tidy_handler&&this.editor.config.filters.tidy){
this.editor.config.filters.tidy=null;
}
var sc=this;
for(var _20 in this.editor.config.SuperClean.filters){
if(!SuperClean.filterFunctions[_20]){
var _21=this.editor.config.SuperClean.filters[_20];
if(typeof _21.filterFunction!="undefined"){
SuperClean.filterFunctions[_20]=filterFunction;
}else{
HTMLArea._getback(_editor_url+"plugins/SuperClean/filters/"+_20+".js",function(_22){
eval("SuperClean.filterFunctions."+_20+"="+_22+";");
sc.onGenerate();
});
}
return;
}
}
};
SuperClean.Dialog=function(_23){
var _24=this;
this.Dialog_nxtid=0;
this.SuperClean=_23;
this.id={};
this.ready=false;
this.files=false;
this.html=false;
this.dialog=false;
this._prepareDialog();
};
SuperClean.Dialog.prototype._prepareDialog=function(){
var _25=this;
var _26=this.SuperClean;
if(this.html==false){
HTMLArea._getback(_editor_url+"plugins/SuperClean/dialog.html",function(txt){
_25.html=txt;
_25._prepareDialog();
});
return;
}
var _28="";
for(var _29 in this.SuperClean.editor.config.SuperClean.filters){
_28+="    <div>\n";
var _2a=this.SuperClean.editor.config.SuperClean.filters[_29];
if(typeof _2a.label=="undefined"){
_28+="        <input type=\"checkbox\" name=\"["+_29+"]\" id=\"["+_29+"]\" checked />\n";
_28+="        <label for=\"["+_29+"]\">"+this.SuperClean.editor.config.SuperClean.filters[_29]+"</label>\n";
}else{
_28+="        <input type=\"checkbox\" name=\"["+_29+"]\" id=\"["+_29+"]\" "+(_2a.checked?"checked":"")+" />\n";
_28+="        <label for=\"["+_29+"]\">"+_2a.label+"</label>\n";
}
_28+="    </div>\n";
}
this.html=this.html.replace("<!--filters-->",_28);
var _2b=this.html;
var _2c=this.dialog=new HTMLArea.Dialog(_26.editor,this.html,"SuperClean");
this.ready=true;
};
SuperClean.Dialog.prototype._lc=SuperClean.prototype._lc;
SuperClean.Dialog.prototype.show=function(_2d,ok,_2f){
if(!this.ready){
var _30=this;
window.setTimeout(function(){
_30.show(_2d,ok,_2f);
},100);
return;
}
var _31=this.dialog;
var _30=this;
if(ok){
this.dialog.getElementById("ok").onclick=ok;
}else{
this.dialog.getElementById("ok").onclick=function(){
_30.hide();
};
}
if(_2f){
this.dialog.getElementById("cancel").onclick=_2f;
}else{
this.dialog.getElementById("cancel").onclick=function(){
_30.hide();
};
}
this.SuperClean.editor.disableToolbar(["fullscreen","SuperClean"]);
this.dialog.show(_2d);
this.dialog.onresize();
};
SuperClean.Dialog.prototype.hide=function(){
this.SuperClean.editor.enableToolbar();
return this.dialog.hide();
};

