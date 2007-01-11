function LangMarks(_1,_2){
this.editor=_1;
var _3=_1.config;
var _4=this;
var _5={};
_5[this._lc("&mdash; language &mdash;")]="";
_5[this._lc("Greek")]="el";
_5[this._lc("English")]="en";
_5[this._lc("French")]="fr";
_5[this._lc("Latin")]="la";
_3.registerDropdown({id:"langmarks",tooltip:this._lc("language select"),options:_5,action:function(_6){
_4.onSelect(_6,this);
},refresh:function(_7){
_4.updateValue(_7,this);
}});
_3.addToolbarElement("langmarks","inserthorizontalrule",1);
}
LangMarks._pluginInfo={name:"LangMarks",version:"1.0",developer:"Udo Schmal",developer_url:"",sponsor:"L.N.Schaffrath NeueMedien",sponsor_url:"http://www.schaffrath-neuemedien.de/",c_owner:"Udo Schmal & Schaffrath NeueMedien",license:"htmlArea"};
LangMarks.prototype._lc=function(_8){
return HTMLArea._lc(_8,"LangMarks");
};
LangMarks.prototype.onGenerate=function(){
var _9="LM-style";
var _a=this.editor._doc.getElementById(_9);
if(_a==null){
_a=this.editor._doc.createElement("link");
_a.id=_9;
_a.rel="stylesheet";
_a.href=_editor_url+"plugins/LangMarks/lang-marks.css";
this.editor._doc.getElementsByTagName("HEAD")[0].appendChild(_a);
}
};
LangMarks.prototype.onSelect=function(_b,_c,_d,_e){
var _f=_b._toolbarObjects[_c.id];
var _10=_f.element.selectedIndex;
var _11=_f.element.value;
var _12=_b.getParentElement();
var _13=true;
var _14=(_12&&_12.tagName.toLowerCase()=="span");
var _15=(_d&&_e&&_12&&_12.tagName.toLowerCase()==_d);
if(_15){
_12.className=_11;
_12.lang=_11;
_b.updateToolbar();
return;
}
if(_14&&_10==0&&!/\S/.test(_12.style.cssText)){
while(_12.firstChild){
_12.parentNode.insertBefore(_12.firstChild,_12);
}
_12.parentNode.removeChild(_12);
_b.updateToolbar();
return;
}
if(_14){
if(_12.childNodes.length==1){
_12.className=_11;
_12.lang=_11;
_13=false;
_b.updateToolbar();
}
}
if(_13){
_b.surroundHTML("<span lang=\""+_11+"\" class=\""+_11+"\">","</span>");
}
};
LangMarks.prototype.updateValue=function(_16,obj){
var _18=_16._toolbarObjects[obj.id].element;
var _19=_16.getParentElement();
if(typeof _19.className!="undefined"&&/\S/.test(_19.className)){
var _1a=_18.options;
var _1b=_19.className;
for(var i=_1a.length;--i>=0;){
var _1d=_1a[i];
if(_1b==_1d.value){
_18.selectedIndex=i;
return;
}
}
}
_18.selectedIndex=0;
};

