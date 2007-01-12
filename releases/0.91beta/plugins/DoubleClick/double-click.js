DoubleClick._pluginInfo={name:"DoubleClick",version:"1.0",developer:"Marijn Kampf",developer_url:"http://www.marijn.org",c_owner:"Marijn Kampf",sponsor:"smiling-faces.com",sponsor_url:"http://www.smiling-faces.com",license:"htmlArea"};
function DoubleClick(_1){
this.editor=_1;
this.editor.dblClickList={a:[function(e){
e.config.btnList["createlink"][3](e);
}],img:[function(e){
e.execCommand("insertimage");
}],td:[function(e){
e.execCommand("inserttable");
}]};
}
DoubleClick.prototype.onGenerate=function(){
var _5=this;
var _6=this.editordoc=this.editor._iframe.contentWindow.document;
HTMLArea._addEvents(_6,["dblclick"],function(_7){
return _5.onDoubleClick(HTMLArea.is_ie?_5.editor._iframe.contentWindow.event:_7);
});
this.currentClick=null;
};
DoubleClick.prototype.onDoubleClick=function(ev){
var _9=HTMLArea.is_ie?ev.srcElement:ev.target;
var _a=_9.tagName.toLowerCase();
if(this.editor.dblClickList[_a]!=undefined){
this.editor.dblClickList[_a][0](this.editor,_9);
}
};

