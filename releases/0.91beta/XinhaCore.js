Xinha.version={"Release":"Trunk","Head":"$HeadURL: http://svn.xinha.python-hosting.com/trunk/htmlarea.js $".replace(/^[^:]*: (.*) \$$/,"$1"),"Date":"$LastChangedDate: 2007-01-11 23:39:40 +0100 (Do, 11 Jan 2007) $".replace(/^[^:]*: ([0-9-]*) ([0-9:]*) ([+0-9]*) \((.*)\) \$/,"$4 $2 $3"),"Revision":"$LastChangedRevision: 647 $".replace(/^[^:]*: (.*) \$$/,"$1"),"RevisionBy":"$LastChangedBy: ray $".replace(/^[^:]*: (.*) \$$/,"$1")};
if(typeof _editor_url=="string"){
_editor_url=_editor_url.replace(/\x2f*$/,"/");
}else{
alert("WARNING: _editor_url is not set!  You should set this variable to the editor files path; it should preferably be an absolute path, like in '/htmlarea/', but it can be relative if you prefer.  Further we will try to load the editor files correctly but we'll probably fail.");
_editor_url="";
}
if(typeof _editor_lang=="string"){
_editor_lang=_editor_lang.toLowerCase();
}else{
_editor_lang="en";
}
if(typeof _editor_skin!=="string"){
_editor_skin="";
}
var __xinhas=[];
Xinha.agt=navigator.userAgent.toLowerCase();
Xinha.is_ie=((Xinha.agt.indexOf("msie")!=-1)&&(Xinha.agt.indexOf("opera")==-1));
Xinha.is_opera=(Xinha.agt.indexOf("opera")!=-1);
Xinha.is_mac=(Xinha.agt.indexOf("mac")!=-1);
Xinha.is_mac_ie=(Xinha.is_ie&&Xinha.is_mac);
Xinha.is_win_ie=(Xinha.is_ie&&!Xinha.is_mac);
Xinha.is_gecko=(navigator.product=="Gecko");
Xinha.isRunLocally=document.URL.toLowerCase().search(/^file:/)!=-1;
if(Xinha.isRunLocally){
alert("Xinha *must* be installed on a web server. Locally opened files (those that use the \"file://\" protocol) cannot properly function. Xinha will try to initialize but may not be correctly loaded.");
}
function Xinha(_1,_2){
if(!_1){
throw ("Tried to create Xinha without textarea specified.");
}
if(Xinha.checkSupportedBrowser()){
if(typeof _2=="undefined"){
this.config=new Xinha.Config();
}else{
this.config=_2;
}
this._htmlArea=null;
if(typeof _1!="object"){
_1=Xinha.getElementById("textarea",_1);
}
this._textArea=_1;
this._textArea.spellcheck=false;
this._initial_ta_size={w:_1.style.width?_1.style.width:(_1.offsetWidth?(_1.offsetWidth+"px"):(_1.cols+"em")),h:_1.style.height?_1.style.height:(_1.offsetHeight?(_1.offsetHeight+"px"):(_1.rows+"em"))};
if(this.config.showLoading){
var _3=document.createElement("div");
_3.id="loading_"+_1.name;
_3.className="loading";
try{
_3.style.width=_1.offsetWidth+"px";
}
catch(ex){
_3.style.width=this._initial_ta_size.w;
}
_3.style.left=Xinha.findPosX(_1)+"px";
_3.style.top=(Xinha.findPosY(_1)+parseInt(this._initial_ta_size.h,10)/2)+"px";
var _4=document.createElement("div");
_4.className="loading_main";
_4.id="loading_main_"+_1.name;
_4.appendChild(document.createTextNode(Xinha._lc("Loading in progress. Please wait !")));
var _5=document.createElement("div");
_5.className="loading_sub";
_5.id="loading_sub_"+_1.name;
_5.appendChild(document.createTextNode(Xinha._lc("Constructing main object")));
_3.appendChild(_4);
_3.appendChild(_5);
document.body.appendChild(_3);
this.setLoadingMessage("Constructing object");
}
this._editMode="wysiwyg";
this.plugins={};
this._timerToolbar=null;
this._timerUndo=null;
this._undoQueue=[this.config.undoSteps];
this._undoPos=-1;
this._customUndo=true;
this._mdoc=document;
this.doctype="";
this.__htmlarea_id_num=__xinhas.length;
__xinhas[this.__htmlarea_id_num]=this;
this._notifyListeners={};
var _6={right:{on:true,container:document.createElement("td"),panels:[]},left:{on:true,container:document.createElement("td"),panels:[]},top:{on:true,container:document.createElement("td"),panels:[]},bottom:{on:true,container:document.createElement("td"),panels:[]}};
for(var i in _6){
if(!_6[i].container){
continue;
}
_6[i].div=_6[i].container;
_6[i].container.className="panels "+i;
Xinha.freeLater(_6[i],"container");
Xinha.freeLater(_6[i],"div");
}
this._panels=_6;
Xinha.freeLater(this,"_textArea");
}
}
Xinha.onload=function(){
};
Xinha.init=function(){
Xinha.onload();
};
Xinha.RE_tagName=/(<\/|<)\s*([^ \t\n>]+)/ig;
Xinha.RE_doctype=/(<!doctype((.|\n)*?)>)\n?/i;
Xinha.RE_head=/<head>((.|\n)*?)<\/head>/i;
Xinha.RE_body=/<body[^>]*>((.|\n|\r|\t)*?)<\/body>/i;
Xinha.RE_Specials=/([\/\^$*+?.()|{}[\]])/g;
Xinha.RE_email=/[_a-zA-Z\d\-\.]{3,}@[_a-zA-Z\d\-]{2,}(\.[_a-zA-Z\d\-]{2,})+/i;
Xinha.RE_url=/(https?:\/\/)?(([a-z0-9_]+:[a-z0-9_]+@)?[a-z0-9_-]{2,}(\.[a-z0-9_-]{2,}){2,}(:[0-9]+)?(\/\S+)*)/i;
Xinha.Config=function(){
var _8=this;
this.version=Xinha.version.Revision;
this.width="auto";
this.height="auto";
this.sizeIncludesBars=true;
this.sizeIncludesPanels=true;
this.panel_dimensions={left:"200px",right:"200px",top:"100px",bottom:"100px"};
this.statusBar=true;
this.htmlareaPaste=false;
this.mozParaHandler="best";
this.undoSteps=20;
this.undoTimeout=500;
this.changeJustifyWithDirection=false;
this.fullPage=false;
this.pageStyle="";
this.pageStyleSheets=[];
this.baseHref=null;
this.expandRelativeUrl=true;
this.stripBaseHref=true;
this.stripSelfNamedAnchors=true;
this.only7BitPrintablesInURLs=true;
this.sevenBitClean=false;
this.specialReplacements={};
this.killWordOnPaste=true;
this.makeLinkShowsTarget=true;
this.charSet=Xinha.is_gecko?document.characterSet:document.charset;
this.imgURL="images/";
this.popupURL="popups/";
this.htmlRemoveTags=null;
this.flowToolbars=true;
this.showLoading=false;
this.stripScripts=true;
this.convertUrlsToLinks=false;
this.colorPickerCellSize="6px";
this.colorPickerGranularity=18;
this.colorPickerPosition="bottom,right";
this.colorPickerWebSafe=false;
this.colorPickerSaveColors=20;
this.toolbar=[["popupeditor"],["separator","formatblock","fontname","fontsize","bold","italic","underline","strikethrough"],["separator","forecolor","hilitecolor","textindicator"],["separator","subscript","superscript"],["linebreak","separator","justifyleft","justifycenter","justifyright","justifyfull"],["separator","insertorderedlist","insertunorderedlist","outdent","indent"],["separator","inserthorizontalrule","createlink","insertimage","inserttable"],["linebreak","separator","undo","redo","selectall","print"],(Xinha.is_gecko?[]:["cut","copy","paste","overwrite","saveas"]),["separator","killword","clearfonts","removeformat","toggleborders","splitblock","lefttoright","righttoleft"],["separator","htmlmode","showhelp","about"]];
this.fontname={"&mdash; font &mdash;":"","Arial":"arial,helvetica,sans-serif","Courier New":"courier new,courier,monospace","Georgia":"georgia,times new roman,times,serif","Tahoma":"tahoma,arial,helvetica,sans-serif","Times New Roman":"times new roman,times,serif","Verdana":"verdana,arial,helvetica,sans-serif","impact":"impact","WingDings":"wingdings"};
this.fontsize={"&mdash; size &mdash;":"","1 (8 pt)":"1","2 (10 pt)":"2","3 (12 pt)":"3","4 (14 pt)":"4","5 (18 pt)":"5","6 (24 pt)":"6","7 (36 pt)":"7"};
this.formatblock={"&mdash; format &mdash;":"","Heading 1":"h1","Heading 2":"h2","Heading 3":"h3","Heading 4":"h4","Heading 5":"h5","Heading 6":"h6","Normal":"p","Address":"address","Formatted":"pre"};
this.customSelects={};
function cut_copy_paste(e,_a,_b){
e.execCommand(_a);
}
this.debug=true;
this.URIs={"blank":"popups/blank.html","link":"link.html","insert_image":"insert_image.html","insert_table":"insert_table.html","select_color":"select_color.html","about":"about.html","help":"editor_help.html"};
this.btnList={bold:["Bold",Xinha._lc({key:"button_bold",string:["ed_buttons_main.gif",3,2]},"Xinha"),false,function(e){
e.execCommand("bold");
}],italic:["Italic",Xinha._lc({key:"button_italic",string:["ed_buttons_main.gif",2,2]},"Xinha"),false,function(e){
e.execCommand("italic");
}],underline:["Underline",Xinha._lc({key:"button_underline",string:["ed_buttons_main.gif",2,0]},"Xinha"),false,function(e){
e.execCommand("underline");
}],strikethrough:["Strikethrough",Xinha._lc({key:"button_strikethrough",string:["ed_buttons_main.gif",3,0]},"Xinha"),false,function(e){
e.execCommand("strikethrough");
}],subscript:["Subscript",Xinha._lc({key:"button_subscript",string:["ed_buttons_main.gif",3,1]},"Xinha"),false,function(e){
e.execCommand("subscript");
}],superscript:["Superscript",Xinha._lc({key:"button_superscript",string:["ed_buttons_main.gif",2,1]},"Xinha"),false,function(e){
e.execCommand("superscript");
}],justifyleft:["Justify Left",["ed_buttons_main.gif",0,0],false,function(e){
e.execCommand("justifyleft");
}],justifycenter:["Justify Center",["ed_buttons_main.gif",1,1],false,function(e){
e.execCommand("justifycenter");
}],justifyright:["Justify Right",["ed_buttons_main.gif",1,0],false,function(e){
e.execCommand("justifyright");
}],justifyfull:["Justify Full",["ed_buttons_main.gif",0,1],false,function(e){
e.execCommand("justifyfull");
}],orderedlist:["Ordered List",["ed_buttons_main.gif",0,3],false,function(e){
e.execCommand("insertorderedlist");
}],unorderedlist:["Bulleted List",["ed_buttons_main.gif",1,3],false,function(e){
e.execCommand("insertunorderedlist");
}],insertorderedlist:["Ordered List",["ed_buttons_main.gif",0,3],false,function(e){
e.execCommand("insertorderedlist");
}],insertunorderedlist:["Bulleted List",["ed_buttons_main.gif",1,3],false,function(e){
e.execCommand("insertunorderedlist");
}],outdent:["Decrease Indent",["ed_buttons_main.gif",1,2],false,function(e){
e.execCommand("outdent");
}],indent:["Increase Indent",["ed_buttons_main.gif",0,2],false,function(e){
e.execCommand("indent");
}],forecolor:["Font Color",["ed_buttons_main.gif",3,3],false,function(e){
e.execCommand("forecolor");
}],hilitecolor:["Background Color",["ed_buttons_main.gif",2,3],false,function(e){
e.execCommand("hilitecolor");
}],undo:["Undoes your last action",["ed_buttons_main.gif",4,2],false,function(e){
e.execCommand("undo");
}],redo:["Redoes your last action",["ed_buttons_main.gif",5,2],false,function(e){
e.execCommand("redo");
}],cut:["Cut selection",["ed_buttons_main.gif",5,0],false,cut_copy_paste],copy:["Copy selection",["ed_buttons_main.gif",4,0],false,cut_copy_paste],paste:["Paste from clipboard",["ed_buttons_main.gif",4,1],false,cut_copy_paste],selectall:["Select all","ed_selectall.gif",false,function(e){
e.execCommand("selectall");
}],inserthorizontalrule:["Horizontal Rule",["ed_buttons_main.gif",6,0],false,function(e){
e.execCommand("inserthorizontalrule");
}],createlink:["Insert Web Link",["ed_buttons_main.gif",6,1],false,function(e){
e._createLink();
}],insertimage:["Insert/Modify Image",["ed_buttons_main.gif",6,3],false,function(e){
e.execCommand("insertimage");
}],inserttable:["Insert Table",["ed_buttons_main.gif",6,2],false,function(e){
e.execCommand("inserttable");
}],htmlmode:["Toggle HTML Source",["ed_buttons_main.gif",7,0],true,function(e){
e.execCommand("htmlmode");
}],toggleborders:["Toggle Borders",["ed_buttons_main.gif",7,2],false,function(e){
e._toggleBorders();
}],print:["Print document",["ed_buttons_main.gif",8,1],false,function(e){
if(Xinha.is_gecko){
e._iframe.contentWindow.print();
}else{
e.focusEditor();
print();
}
}],saveas:["Save as","ed_saveas.gif",false,function(e){
e.execCommand("saveas",false,"noname.htm");
}],about:["About this editor",["ed_buttons_main.gif",8,2],true,function(e){
e.execCommand("about");
}],showhelp:["Help using editor",["ed_buttons_main.gif",9,2],true,function(e){
e.execCommand("showhelp");
}],splitblock:["Split Block","ed_splitblock.gif",false,function(e){
e._splitBlock();
}],lefttoright:["Direction left to right",["ed_buttons_main.gif",0,4],false,function(e){
e.execCommand("lefttoright");
}],righttoleft:["Direction right to left",["ed_buttons_main.gif",1,4],false,function(e){
e.execCommand("righttoleft");
}],overwrite:["Insert/Overwrite","ed_overwrite.gif",false,function(e){
e.execCommand("overwrite");
}],wordclean:["MS Word Cleaner",["ed_buttons_main.gif",5,3],false,function(e){
e._wordClean();
}],clearfonts:["Clear Inline Font Specifications",["ed_buttons_main.gif",5,4],true,function(e){
e._clearFonts();
}],removeformat:["Remove formatting",["ed_buttons_main.gif",4,4],false,function(e){
e.execCommand("removeformat");
}],killword:["Clear MSOffice tags",["ed_buttons_main.gif",4,3],false,function(e){
e.execCommand("killword");
}]};
for(var i in this.btnList){
var btn=this.btnList[i];
if(typeof btn!="object"){
continue;
}
if(typeof btn[1]!="string"){
btn[1][0]=_editor_url+this.imgURL+btn[1][0];
}else{
btn[1]=_editor_url+this.imgURL+btn[1];
}
btn[0]=Xinha._lc(btn[0]);
}
};
Xinha.Config.prototype.registerButton=function(id,_36,_37,_38,_39,_3a){
var _3b;
if(typeof id=="string"){
_3b=id;
}else{
if(typeof id=="object"){
_3b=id.id;
}else{
alert("ERROR [Xinha.Config::registerButton]:\ninvalid arguments");
return false;
}
}
switch(typeof id){
case "string":
this.btnList[id]=[_36,_37,_38,_39,_3a];
break;
case "object":
this.btnList[id.id]=[id.tooltip,id.image,id.textMode,id.action,id.context];
break;
}
};
Xinha.prototype.registerPanel=function(_3c,_3d){
if(!_3c){
_3c="right";
}
this.setLoadingMessage("Register panel "+_3c);
var _3e=this.addPanel(_3c);
if(_3d){
_3d.drawPanelIn(_3e);
}
};
Xinha.Config.prototype.registerDropdown=function(_3f){
this.customSelects[_3f.id]=_3f;
};
Xinha.Config.prototype.hideSomeButtons=function(_40){
var _41=this.toolbar;
for(var i=_41.length;--i>=0;){
var _43=_41[i];
for(var j=_43.length;--j>=0;){
if(_40.indexOf(" "+_43[j]+" ")>=0){
var len=1;
if(/separator|space/.test(_43[j+1])){
len=2;
}
_43.splice(j,len);
}
}
}
};
Xinha.Config.prototype.addToolbarElement=function(id,_47,_48){
var _49=this.toolbar;
var a,i,j,o,sid;
var _4b=false;
var _4c=false;
var _4d=0;
var _4e=0;
var _4f=0;
var _50=false;
var _51=false;
if((id&&typeof id=="object")&&(id.constructor==Array)){
_4b=true;
}
if((_47&&typeof _47=="object")&&(_47.constructor==Array)){
_4c=true;
_4d=_47.length;
}
if(_4b){
for(i=0;i<id.length;++i){
if((id[i]!="separator")&&(id[i].indexOf("T[")!==0)){
sid=id[i];
}
}
}else{
sid=id;
}
for(i=0;!_50&&!_51&&i<_49.length;++i){
a=_49[i];
for(j=0;!_51&&j<a.length;++j){
if(a[i]==sid){
_50=true;
break;
}
if(_4c){
for(o=0;o<_4d;++o){
if(a[j]==_47[o]){
if(o===0){
_51=true;
j--;
break;
}else{
_4f=i;
_4e=j;
_4d=o;
}
}
}
}else{
if(a[j]==_47){
_51=true;
break;
}
}
}
}
if(!_50){
if(!_51&&_4c){
if(_47.length!=_4d){
j=_4e;
a=_49[_4f];
_51=true;
}
}
if(_51){
if(_48===0){
if(_4b){
a[j]=id[id.length-1];
for(i=id.length-1;--i>=0;){
a.splice(j,0,id[i]);
}
}else{
a[j]=id;
}
}else{
if(_48<0){
j=j+_48+1;
}else{
if(_48>0){
j=j+_48;
}
}
if(_4b){
for(i=id.length;--i>=0;){
a.splice(j,0,id[i]);
}
}else{
a.splice(j,0,id);
}
}
}else{
_49[0].splice(0,0,"separator");
if(_4b){
for(i=id.length;--i>=0;){
_49[0].splice(0,0,id[i]);
}
}else{
_49[0].splice(0,0,id);
}
}
}
};
Xinha.Config.prototype.removeToolbarElement=Xinha.Config.prototype.hideSomeButtons;
Xinha.replaceAll=function(_52){
var tas=document.getElementsByTagName("textarea");
for(var i=tas.length;i>0;(new Xinha(tas[--i],_52)).generate()){
}
};
Xinha.replace=function(id,_56){
var ta=Xinha.getElementById("textarea",id);
return ta?(new Xinha(ta,_56)).generate():null;
};
Xinha.prototype._createToolbar=function(){
this.setLoadingMessage("Create Toolbar");
var _58=this;
var _59=document.createElement("div");
this._toolBar=this._toolbar=_59;
_59.className="toolbar";
_59.unselectable="1";
Xinha.freeLater(this,"_toolBar");
Xinha.freeLater(this,"_toolbar");
var _5a=null;
var _5b={};
this._toolbarObjects=_5b;
this._createToolbar1(_58,_59,_5b);
this._htmlArea.appendChild(_59);
return _59;
};
Xinha.prototype._setConfig=function(_5c){
this.config=_5c;
};
Xinha.prototype._addToolbar=function(){
this._createToolbar1(this,this._toolbar,this._toolbarObjects);
};
Xinha._createToolbarBreakingElement=function(){
var brk=document.createElement("div");
brk.style.height="1px";
brk.style.width="1px";
brk.style.lineHeight="1px";
brk.style.fontSize="1px";
brk.style.clear="both";
return brk;
};
Xinha.prototype._createToolbar1=function(_5e,_5f,_60){
var _61;
if(_5e.config.flowToolbars){
_5f.appendChild(Xinha._createToolbarBreakingElement());
}
function newLine(){
if(typeof _61!="undefined"&&_61.childNodes.length===0){
return;
}
var _62=document.createElement("table");
_62.border="0px";
_62.cellSpacing="0px";
_62.cellPadding="0px";
if(_5e.config.flowToolbars){
if(Xinha.is_ie){
_62.style.styleFloat="left";
}else{
_62.style.cssFloat="left";
}
}
_5f.appendChild(_62);
var _63=document.createElement("tbody");
_62.appendChild(_63);
_61=document.createElement("tr");
_63.appendChild(_61);
_62.className="toolbarRow";
}
newLine();
function setButtonStatus(id,_65){
var _66=this[id];
var el=this.element;
if(_66!=_65){
switch(id){
case "enabled":
if(_65){
Xinha._removeClass(el,"buttonDisabled");
el.disabled=false;
}else{
Xinha._addClass(el,"buttonDisabled");
el.disabled=true;
}
break;
case "active":
if(_65){
Xinha._addClass(el,"buttonPressed");
}else{
Xinha._removeClass(el,"buttonPressed");
}
break;
}
this[id]=_65;
}
}
function createSelect(txt){
var _69=null;
var el=null;
var cmd=null;
var _6c=_5e.config.customSelects;
var _6d=null;
var _6e="";
switch(txt){
case "fontsize":
case "fontname":
case "formatblock":
_69=_5e.config[txt];
cmd=txt;
break;
default:
cmd=txt;
var _6f=_6c[cmd];
if(typeof _6f!="undefined"){
_69=_6f.options;
_6d=_6f.context;
if(typeof _6f.tooltip!="undefined"){
_6e=_6f.tooltip;
}
}else{
alert("ERROR [createSelect]:\nCan't find the requested dropdown definition");
}
break;
}
if(_69){
el=document.createElement("select");
el.title=_6e;
var obj={name:txt,element:el,enabled:true,text:false,cmd:cmd,state:setButtonStatus,context:_6d};
Xinha.freeLater(obj);
_60[txt]=obj;
for(var i in _69){
if(typeof (_69[i])!="string"){
continue;
}
var op=document.createElement("option");
op.innerHTML=Xinha._lc(i);
op.value=_69[i];
el.appendChild(op);
}
Xinha._addEvent(el,"change",function(){
_5e._comboSelected(el,txt);
});
}
return el;
}
function createButton(txt){
var el,btn,obj=null;
switch(txt){
case "separator":
if(_5e.config.flowToolbars){
newLine();
}
el=document.createElement("div");
el.className="separator";
break;
case "space":
el=document.createElement("div");
el.className="space";
break;
case "linebreak":
newLine();
return false;
case "textindicator":
el=document.createElement("div");
el.appendChild(document.createTextNode("A"));
el.className="indicator";
el.title=Xinha._lc("Current style");
obj={name:txt,element:el,enabled:true,active:false,text:false,cmd:"textindicator",state:setButtonStatus};
Xinha.freeLater(obj);
_60[txt]=obj;
break;
default:
btn=_5e.config.btnList[txt];
}
if(!el&&btn){
el=document.createElement("a");
el.style.display="block";
el.href="javascript:void(0)";
el.style.textDecoration="none";
el.title=btn[0];
el.className="button";
el.style.direction="ltr";
obj={name:txt,element:el,enabled:true,active:false,text:btn[2],cmd:btn[3],state:setButtonStatus,context:btn[4]||null};
Xinha.freeLater(el);
Xinha.freeLater(obj);
_60[txt]=obj;
el.ondrag=function(){
return false;
};
Xinha._addEvent(el,"mouseout",function(ev){
if(obj.enabled){
Xinha._removeClass(el,"buttonActive");
if(obj.active){
Xinha._addClass(el,"buttonPressed");
}
}
});
Xinha._addEvent(el,"mousedown",function(ev){
if(obj.enabled){
Xinha._addClass(el,"buttonActive");
Xinha._removeClass(el,"buttonPressed");
Xinha._stopEvent(Xinha.is_ie?window.event:ev);
}
});
Xinha._addEvent(el,"click",function(ev){
if(obj.enabled){
Xinha._removeClass(el,"buttonActive");
if(Xinha.is_gecko){
_5e.activateEditor();
}
obj.cmd(_5e,obj.name,obj);
Xinha._stopEvent(Xinha.is_ie?window.event:ev);
}
});
var _78=Xinha.makeBtnImg(btn[1]);
var img=_78.firstChild;
el.appendChild(_78);
obj.imgel=img;
obj.swapImage=function(_7a){
if(typeof _7a!="string"){
img.src=_7a[0];
img.style.position="relative";
img.style.top=_7a[2]?("-"+(18*(_7a[2]+1))+"px"):"-18px";
img.style.left=_7a[1]?("-"+(18*(_7a[1]+1))+"px"):"-18px";
}else{
obj.imgel.src=_7a;
img.style.top="0px";
img.style.left="0px";
}
};
}else{
if(!el){
el=createSelect(txt);
}
}
return el;
}
var _7b=true;
for(var i=0;i<this.config.toolbar.length;++i){
if(!_7b){
}else{
_7b=false;
}
if(this.config.toolbar[i]===null){
this.config.toolbar[i]=["separator"];
}
var _7d=this.config.toolbar[i];
for(var j=0;j<_7d.length;++j){
var _7f=_7d[j];
var _80;
if(/^([IT])\[(.*?)\]/.test(_7f)){
var _81=RegExp.$1=="I";
var _82=RegExp.$2;
if(_81){
_82=Xinha._lc(_82);
}
_80=document.createElement("td");
_61.appendChild(_80);
_80.className="label";
_80.innerHTML=_82;
}else{
if(typeof _7f!="function"){
var _83=createButton(_7f);
if(_83){
_80=document.createElement("td");
_80.className="toolbarElement";
_61.appendChild(_80);
_80.appendChild(_83);
}else{
if(_83===null){
alert("FIXME: Unknown toolbar item: "+_7f);
}
}
}
}
}
}
if(_5e.config.flowToolbars){
_5f.appendChild(Xinha._createToolbarBreakingElement());
}
return _5f;
};
var use_clone_img=false;
Xinha.makeBtnImg=function(_84,doc){
if(!doc){
doc=document;
}
if(!doc._xinhaImgCache){
doc._xinhaImgCache={};
Xinha.freeLater(doc._xinhaImgCache);
}
var _86=null;
if(Xinha.is_ie&&((!doc.compatMode)||(doc.compatMode&&doc.compatMode=="BackCompat"))){
_86=doc.createElement("span");
}else{
_86=doc.createElement("div");
_86.style.position="relative";
}
_86.style.overflow="hidden";
_86.style.width="18px";
_86.style.height="18px";
_86.className="buttonImageContainer";
var img=null;
if(typeof _84=="string"){
if(doc._xinhaImgCache[_84]){
img=doc._xinhaImgCache[_84].cloneNode();
}else{
img=doc.createElement("img");
img.src=_84;
img.style.width="18px";
img.style.height="18px";
if(use_clone_img){
doc._xinhaImgCache[_84]=img.cloneNode();
}
}
}else{
if(doc._xinhaImgCache[_84[0]]){
img=doc._xinhaImgCache[_84[0]].cloneNode();
}else{
img=doc.createElement("img");
img.src=_84[0];
img.style.position="relative";
if(use_clone_img){
doc._xinhaImgCache[_84[0]]=img.cloneNode();
}
}
img.style.top=_84[2]?("-"+(18*(_84[2]+1))+"px"):"-18px";
img.style.left=_84[1]?("-"+(18*(_84[1]+1))+"px"):"-18px";
}
_86.appendChild(img);
return _86;
};
Xinha.prototype._createStatusBar=function(){
this.setLoadingMessage("Create StatusBar");
var _88=document.createElement("div");
_88.className="statusBar";
this._statusBar=_88;
Xinha.freeLater(this,"_statusBar");
var div=document.createElement("span");
div.className="statusBarTree";
div.innerHTML=Xinha._lc("Path")+": ";
this._statusBarTree=div;
Xinha.freeLater(this,"_statusBarTree");
this._statusBar.appendChild(div);
div=document.createElement("span");
div.innerHTML=Xinha._lc("You are in TEXT MODE.  Use the [<>] button to switch back to WYSIWYG.");
div.style.display="none";
this._statusBarTextMode=div;
Xinha.freeLater(this,"_statusBarTextMode");
this._statusBar.appendChild(div);
if(!this.config.statusBar){
_88.style.display="none";
}
return _88;
};
Xinha.prototype.generate=function(){
var i;
var _8b=this;
this.setLoadingMessage("Generate Xinha object");
if(typeof Dialog=="undefined"){
Xinha._loadback(_editor_url+"dialog.js",this.generate,this);
return false;
}
if(typeof Xinha.Dialog=="undefined"){
Xinha._loadback(_editor_url+"inline-dialog.js",this.generate,this);
return false;
}
if(typeof PopupWin=="undefined"){
Xinha._loadback(_editor_url+"popupwin.js",this.generate,this);
return false;
}
if(_editor_skin!==""){
var _8c=false;
var _8d=document.getElementsByTagName("head")[0];
var _8e=document.getElementsByTagName("link");
for(i=0;i<_8e.length;i++){
if((_8e[i].rel=="stylesheet")&&(_8e[i].href==_editor_url+"skins/"+_editor_skin+"/skin.css")){
_8c=true;
}
}
if(!_8c){
var _8f=document.createElement("link");
_8f.type="text/css";
_8f.href=_editor_url+"skins/"+_editor_skin+"/skin.css";
_8f.rel="stylesheet";
_8d.appendChild(_8f);
}
}
var _90=_8b.config.toolbar;
for(i=_90.length;--i>=0;){
for(var j=_90[i].length;--j>=0;){
if(_90[i][j]=="popupeditor"){
if(typeof FullScreen=="undefined"){
Xinha.loadPlugin("FullScreen",function(){
_8b.generate();
});
return false;
}
_8b.registerPlugin("FullScreen");
}
}
}
if(Xinha.is_gecko&&_8b.config.mozParaHandler=="best"){
if(typeof EnterParagraphs=="undefined"){
Xinha.loadPlugin("EnterParagraphs",function(){
_8b.generate();
});
return false;
}
_8b.registerPlugin("EnterParagraphs");
}
if(typeof Xinha.getHTML=="undefined"){
Xinha._loadback(_editor_url+"getHTML.js",function(){
_8b.generate();
});
return false;
}
if(typeof Xinha.prototype._insertImage=="undefined"){
Xinha._loadback(_editor_url+"popups/insert_image.js",function(){
_8b.generate();
});
return false;
}
if(typeof Xinha.prototype._createLink=="undefined"&&typeof Linker=="undefined"){
Xinha._loadback(_editor_url+"popups/link.js",function(){
_8b.generate();
});
return false;
}
this._framework={"table":document.createElement("table"),"tbody":document.createElement("tbody"),"tb_row":document.createElement("tr"),"tb_cell":document.createElement("td"),"tp_row":document.createElement("tr"),"tp_cell":this._panels.top.container,"ler_row":document.createElement("tr"),"lp_cell":this._panels.left.container,"ed_cell":document.createElement("td"),"rp_cell":this._panels.right.container,"bp_row":document.createElement("tr"),"bp_cell":this._panels.bottom.container,"sb_row":document.createElement("tr"),"sb_cell":document.createElement("td")};
Xinha.freeLater(this._framework);
var fw=this._framework;
fw.table.border="0";
fw.table.cellPadding="0";
fw.table.cellSpacing="0";
fw.tb_row.style.verticalAlign="top";
fw.tp_row.style.verticalAlign="top";
fw.ler_row.style.verticalAlign="top";
fw.bp_row.style.verticalAlign="top";
fw.sb_row.style.verticalAlign="top";
fw.ed_cell.style.position="relative";
fw.tb_row.appendChild(fw.tb_cell);
fw.tb_cell.colSpan=3;
fw.tp_row.appendChild(fw.tp_cell);
fw.tp_cell.colSpan=3;
fw.ler_row.appendChild(fw.lp_cell);
fw.ler_row.appendChild(fw.ed_cell);
fw.ler_row.appendChild(fw.rp_cell);
fw.bp_row.appendChild(fw.bp_cell);
fw.bp_cell.colSpan=3;
fw.sb_row.appendChild(fw.sb_cell);
fw.sb_cell.colSpan=3;
fw.tbody.appendChild(fw.tb_row);
fw.tbody.appendChild(fw.tp_row);
fw.tbody.appendChild(fw.ler_row);
fw.tbody.appendChild(fw.bp_row);
fw.tbody.appendChild(fw.sb_row);
fw.table.appendChild(fw.tbody);
var _93=this._framework.table;
this._htmlArea=_93;
Xinha.freeLater(this,"_htmlArea");
_93.className="htmlarea";
this._framework.tb_cell.appendChild(this._createToolbar());
var _94=document.createElement("iframe");
_94.src=_editor_url+_8b.config.URIs.blank;
this._framework.ed_cell.appendChild(_94);
this._iframe=_94;
this._iframe.className="xinha_iframe";
Xinha.freeLater(this,"_iframe");
var _95=this._createStatusBar();
this._framework.sb_cell.appendChild(_95);
var _96=this._textArea;
_96.parentNode.insertBefore(_93,_96);
_96.className="xinha_textarea";
Xinha.removeFromParent(_96);
this._framework.ed_cell.appendChild(_96);
if(_96.form){
Xinha.prependDom0Event(this._textArea.form,"submit",function(){
_8b._textArea.value=_8b.outwardHtml(_8b.getHTML());
return true;
});
var _97=_96.value;
Xinha.prependDom0Event(this._textArea.form,"reset",function(){
_8b.setHTML(_8b.inwardHtml(_97));
_8b.updateToolbar();
return true;
});
}
Xinha.prependDom0Event(window,"unload",function(){
_96.value=_8b.outwardHtml(_8b.getHTML());
return true;
});
_96.style.display="none";
_8b.initSize();
_8b._iframeLoadDone=false;
Xinha._addEvent(this._iframe,"load",function(e){
if(!_8b._iframeLoadDone){
_8b._iframeLoadDone=true;
_8b.initIframe();
}
return true;
});
};
Xinha.prototype.initSize=function(){
this.setLoadingMessage("Init editor size");
var _99=this;
var _9a=null;
var _9b=null;
switch(this.config.width){
case "auto":
_9a=this._initial_ta_size.w;
break;
case "toolbar":
_9a=this._toolBar.offsetWidth+"px";
break;
default:
_9a=/[^0-9]/.test(this.config.width)?this.config.width:this.config.width+"px";
break;
}
switch(this.config.height){
case "auto":
_9b=this._initial_ta_size.h;
break;
default:
_9b=/[^0-9]/.test(this.config.height)?this.config.height:this.config.height+"px";
break;
}
this.sizeEditor(_9a,_9b,this.config.sizeIncludesBars,this.config.sizeIncludesPanels);
this.notifyOn("panel_change",function(){
_99.sizeEditor();
});
};
Xinha.prototype.sizeEditor=function(_9c,_9d,_9e,_9f){
this._iframe.style.height="100%";
this._textArea.style.height="100%";
this._iframe.style.width="";
this._textArea.style.width="";
if(_9e!==null){
this._htmlArea.sizeIncludesToolbars=_9e;
}
if(_9f!==null){
this._htmlArea.sizeIncludesPanels=_9f;
}
if(_9c){
this._htmlArea.style.width=_9c;
if(!this._htmlArea.sizeIncludesPanels){
var _a0=this._panels.right;
if(_a0.on&&_a0.panels.length&&Xinha.hasDisplayedChildren(_a0.div)){
this._htmlArea.style.width=(this._htmlArea.offsetWidth+parseInt(this.config.panel_dimensions.right,10))+"px";
}
var _a1=this._panels.left;
if(_a1.on&&_a1.panels.length&&Xinha.hasDisplayedChildren(_a1.div)){
this._htmlArea.style.width=(this._htmlArea.offsetWidth+parseInt(this.config.panel_dimensions.left,10))+"px";
}
}
}
if(_9d){
this._htmlArea.style.height=_9d;
if(!this._htmlArea.sizeIncludesToolbars){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+this._toolbar.offsetHeight+this._statusBar.offsetHeight)+"px";
}
if(!this._htmlArea.sizeIncludesPanels){
var _a2=this._panels.top;
if(_a2.on&&_a2.panels.length&&Xinha.hasDisplayedChildren(_a2.div)){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+parseInt(this.config.panel_dimensions.top,10))+"px";
}
var _a3=this._panels.bottom;
if(_a3.on&&_a3.panels.length&&Xinha.hasDisplayedChildren(_a3.div)){
this._htmlArea.style.height=(this._htmlArea.offsetHeight+parseInt(this.config.panel_dimensions.bottom,10))+"px";
}
}
}
_9c=this._htmlArea.offsetWidth;
_9d=this._htmlArea.offsetHeight;
var _a4=this._panels;
var _a5=this;
var _a6=1;
function panel_is_alive(pan){
if(_a4[pan].on&&_a4[pan].panels.length&&Xinha.hasDisplayedChildren(_a4[pan].container)){
_a4[pan].container.style.display="";
return true;
}else{
_a4[pan].container.style.display="none";
return false;
}
}
if(panel_is_alive("left")){
_a6+=1;
}
if(panel_is_alive("right")){
_a6+=1;
}
this._framework.tb_cell.colSpan=_a6;
this._framework.tp_cell.colSpan=_a6;
this._framework.bp_cell.colSpan=_a6;
this._framework.sb_cell.colSpan=_a6;
if(!this._framework.tp_row.childNodes.length){
Xinha.removeFromParent(this._framework.tp_row);
}else{
if(!Xinha.hasParentNode(this._framework.tp_row)){
this._framework.tbody.insertBefore(this._framework.tp_row,this._framework.ler_row);
}
}
if(!this._framework.bp_row.childNodes.length){
Xinha.removeFromParent(this._framework.bp_row);
}else{
if(!Xinha.hasParentNode(this._framework.bp_row)){
this._framework.tbody.insertBefore(this._framework.bp_row,this._framework.ler_row.nextSibling);
}
}
if(!this.config.statusBar){
Xinha.removeFromParent(this._framework.sb_row);
}else{
if(!Xinha.hasParentNode(this._framework.sb_row)){
this._framework.table.appendChild(this._framework.sb_row);
}
}
this._framework.lp_cell.style.width=this.config.panel_dimensions.left;
this._framework.rp_cell.style.width=this.config.panel_dimensions.right;
this._framework.tp_cell.style.height=this.config.panel_dimensions.top;
this._framework.bp_cell.style.height=this.config.panel_dimensions.bottom;
this._framework.tb_cell.style.height=this._toolBar.offsetHeight+"px";
this._framework.sb_cell.style.height=this._statusBar.offsetHeight+"px";
var _a8=_9d-this._toolBar.offsetHeight-this._statusBar.offsetHeight;
if(panel_is_alive("top")){
_a8-=parseInt(this.config.panel_dimensions.top,10);
}
if(panel_is_alive("bottom")){
_a8-=parseInt(this.config.panel_dimensions.bottom,10);
}
this._iframe.style.height=_a8+"px";
var _a9=_9c;
if(panel_is_alive("left")){
_a9-=parseInt(this.config.panel_dimensions.left,10);
}
if(panel_is_alive("right")){
_a9-=parseInt(this.config.panel_dimensions.right,10);
}
this._iframe.style.width=_a9+"px";
this._textArea.style.height=this._iframe.style.height;
this._textArea.style.width=this._iframe.style.width;
this.notifyOf("resize",{width:this._htmlArea.offsetWidth,height:this._htmlArea.offsetHeight});
};
Xinha.prototype.addPanel=function(_aa){
var div=document.createElement("div");
div.side=_aa;
if(_aa=="left"||_aa=="right"){
div.style.width=this.config.panel_dimensions[_aa];
if(this._iframe){
div.style.height=this._iframe.style.height;
}
}
Xinha.addClasses(div,"panel");
this._panels[_aa].panels.push(div);
this._panels[_aa].div.appendChild(div);
this.notifyOf("panel_change",{"action":"add","panel":div});
return div;
};
Xinha.prototype.removePanel=function(_ac){
this._panels[_ac.side].div.removeChild(_ac);
var _ad=[];
for(var i=0;i<this._panels[_ac.side].panels.length;i++){
if(this._panels[_ac.side].panels[i]!=_ac){
_ad.push(this._panels[_ac.side].panels[i]);
}
}
this._panels[_ac.side].panels=_ad;
this.notifyOf("panel_change",{"action":"remove","panel":_ac});
};
Xinha.prototype.hidePanel=function(_af){
if(_af&&_af.style.display!="none"){
_af.style.display="none";
this.notifyOf("panel_change",{"action":"hide","panel":_af});
}
};
Xinha.prototype.showPanel=function(_b0){
if(_b0&&_b0.style.display=="none"){
_b0.style.display="";
this.notifyOf("panel_change",{"action":"show","panel":_b0});
}
};
Xinha.prototype.hidePanels=function(_b1){
if(typeof _b1=="undefined"){
_b1=["left","right","top","bottom"];
}
var _b2=[];
for(var i=0;i<_b1.length;i++){
if(this._panels[_b1[i]].on){
_b2.push(_b1[i]);
this._panels[_b1[i]].on=false;
}
}
this.notifyOf("panel_change",{"action":"multi_hide","sides":_b1});
};
Xinha.prototype.showPanels=function(_b4){
if(typeof _b4=="undefined"){
_b4=["left","right","top","bottom"];
}
var _b5=[];
for(var i=0;i<_b4.length;i++){
if(!this._panels[_b4[i]].on){
_b5.push(_b4[i]);
this._panels[_b4[i]].on=true;
}
}
this.notifyOf("panel_change",{"action":"multi_show","sides":_b4});
};
Xinha.objectProperties=function(obj){
var _b8=[];
for(var x in obj){
_b8[_b8.length]=x;
}
return _b8;
};
Xinha.prototype.editorIsActivated=function(){
try{
return Xinha.is_gecko?this._doc.designMode=="on":this._doc.body.contentEditable;
}
catch(ex){
return false;
}
};
Xinha._someEditorHasBeenActivated=false;
Xinha._currentlyActiveEditor=false;
Xinha.prototype.activateEditor=function(){
if(Xinha._currentlyActiveEditor){
if(Xinha._currentlyActiveEditor==this){
return true;
}
Xinha._currentlyActiveEditor.deactivateEditor();
}
if(Xinha.is_gecko&&this._doc.designMode!="on"){
try{
if(this._iframe.style.display=="none"){
this._iframe.style.display="";
this._doc.designMode="on";
this._iframe.style.display="none";
}else{
this._doc.designMode="on";
}
}
catch(ex){
}
}else{
if(!Xinha.is_gecko&&this._doc.body.contentEditable!==true){
this._doc.body.contentEditable=true;
}
}
Xinha._someEditorHasBeenActivated=true;
Xinha._currentlyActiveEditor=this;
var _ba=this;
this.enableToolbar();
};
Xinha.prototype.deactivateEditor=function(){
this.disableToolbar();
if(Xinha.is_gecko&&this._doc.designMode!="off"){
try{
this._doc.designMode="off";
}
catch(ex){
}
}else{
if(!Xinha.is_gecko&&this._doc.body.contentEditable!==false){
this._doc.body.contentEditable=false;
}
}
if(Xinha._currentlyActiveEditor!=this){
return;
}
Xinha._currentlyActiveEditor=false;
};
Xinha.prototype.initIframe=function(){
this.setLoadingMessage("Init IFrame");
this.disableToolbar();
var doc=null;
var _bc=this;
try{
if(_bc._iframe.contentDocument){
this._doc=_bc._iframe.contentDocument;
}else{
this._doc=_bc._iframe.contentWindow.document;
}
doc=this._doc;
if(!doc){
if(Xinha.is_gecko){
setTimeout(function(){
_bc.initIframe();
},50);
return false;
}else{
alert("ERROR: IFRAME can't be initialized.");
}
}
}
catch(ex){
setTimeout(function(){
_bc.initIframe();
},50);
}
Xinha.freeLater(this,"_doc");
doc.open("text/html","replace");
var _bd="";
if(!_bc.config.fullPage){
_bd="<html>\n";
_bd+="<head>\n";
_bd+="<meta http-equiv=\"Content-Type\" content=\"text/html; charset="+_bc.config.charSet+"\">\n";
if(typeof _bc.config.baseHref!="undefined"&&_bc.config.baseHref!==null){
_bd+="<base href=\""+_bc.config.baseHref+"\"/>\n";
}
_bd+="<style title=\"table borders\">";
_bd+=".htmtableborders, .htmtableborders td, .htmtableborders th {border : 1px dashed lightgrey ! important;} \n";
_bd+="</style>\n";
_bd+="<style type=\"text/css\">";
_bd+="html, body { border: 0px; } \n";
_bd+="body { background-color: #ffffff; } \n";
_bd+="span.macro, span.macro ul, span.macro div, span.macro p {background : #CCCCCC;}\n";
_bd+="</style>\n";
if(_bc.config.pageStyle){
_bd+="<style type=\"text/css\">\n"+_bc.config.pageStyle+"\n</style>";
}
if(typeof _bc.config.pageStyleSheets!=="undefined"){
for(var i=0;i<_bc.config.pageStyleSheets.length;i++){
if(_bc.config.pageStyleSheets[i].length>0){
_bd+="<link rel=\"stylesheet\" type=\"text/css\" href=\""+_bc.config.pageStyleSheets[i]+"\">";
}
}
}
_bd+="</head>\n";
_bd+="<body>\n";
_bd+=_bc.inwardHtml(_bc._textArea.value);
_bd+="</body>\n";
_bd+="</html>";
}else{
_bd=_bc.inwardHtml(_bc._textArea.value);
if(_bd.match(Xinha.RE_doctype)){
_bc.setDoctype(RegExp.$1);
_bd=_bd.replace(Xinha.RE_doctype,"");
}
}
doc.write(_bd);
doc.close();
this.setEditorEvents();
};
Xinha.prototype.whenDocReady=function(F){
var E=this;
if(this._doc&&this._doc.body){
F();
}else{
setTimeout(function(){
E.whenDocReady(F);
},50);
}
};
Xinha.prototype.setMode=function(_c1){
var _c2;
if(typeof _c1=="undefined"){
_c1=this._editMode=="textmode"?"wysiwyg":"textmode";
}
switch(_c1){
case "textmode":
_c2=this.outwardHtml(this.getHTML());
this.setHTML(_c2);
this.deactivateEditor();
this._iframe.style.display="none";
this._textArea.style.display="";
if(this.config.statusBar){
this._statusBarTree.style.display="none";
this._statusBarTextMode.style.display="";
}
this.notifyOf("modechange",{"mode":"text"});
break;
case "wysiwyg":
_c2=this.inwardHtml(this.getHTML());
this.deactivateEditor();
this.setHTML(_c2);
this._iframe.style.display="";
this._textArea.style.display="none";
this.activateEditor();
if(this.config.statusBar){
this._statusBarTree.style.display="";
this._statusBarTextMode.style.display="none";
}
this.notifyOf("modechange",{"mode":"wysiwyg"});
break;
default:
alert("Mode <"+_c1+"> not defined!");
return false;
}
this._editMode=_c1;
for(var i in this.plugins){
var _c4=this.plugins[i].instance;
if(_c4&&typeof _c4.onMode=="function"){
_c4.onMode(_c1);
}
}
};
Xinha.prototype.setFullHTML=function(_c5){
var _c6=RegExp.multiline;
RegExp.multiline=true;
if(_c5.match(Xinha.RE_doctype)){
this.setDoctype(RegExp.$1);
_c5=_c5.replace(Xinha.RE_doctype,"");
}
RegExp.multiline=_c6;
if(!Xinha.is_ie){
if(_c5.match(Xinha.RE_head)){
this._doc.getElementsByTagName("head")[0].innerHTML=RegExp.$1;
}
if(_c5.match(Xinha.RE_body)){
this._doc.getElementsByTagName("body")[0].innerHTML=RegExp.$1;
}
}else{
var _c7=this.editorIsActivated();
if(_c7){
this.deactivateEditor();
}
var _c8=/<html>((.|\n)*?)<\/html>/i;
_c5=_c5.replace(_c8,"$1");
this._doc.open("text/html","replace");
this._doc.write(_c5);
this._doc.close();
if(_c7){
this.activateEditor();
}
this.setEditorEvents();
return true;
}
};
Xinha.prototype.setEditorEvents=function(){
var _c9=this;
var doc=this._doc;
_c9.whenDocReady(function(){
Xinha._addEvents(doc,["mousedown"],function(){
_c9.activateEditor();
return true;
});
Xinha._addEvents(doc,["keydown","keypress","mousedown","mouseup","drag"],function(_cb){
return _c9._editorEvent(Xinha.is_ie?_c9._iframe.contentWindow.event:_cb);
});
for(var i in _c9.plugins){
var _cd=_c9.plugins[i].instance;
Xinha.refreshPlugin(_cd);
}
if(typeof _c9._onGenerate=="function"){
_c9._onGenerate();
}
Xinha.addDom0Event(window,"resize",function(e){
_c9.sizeEditor();
});
_c9.removeLoadingMessage();
});
};
Xinha.prototype.registerPlugin=function(){
var _cf=arguments[0];
if(_cf===null||typeof _cf=="undefined"||(typeof _cf=="string"&&eval("typeof "+_cf)=="undefined")){
return false;
}
var _d0=[];
for(var i=1;i<arguments.length;++i){
_d0.push(arguments[i]);
}
return this.registerPlugin2(_cf,_d0);
};
Xinha.prototype.registerPlugin2=function(_d2,_d3){
if(typeof _d2=="string"){
_d2=eval(_d2);
}
if(typeof _d2=="undefined"){
return false;
}
var obj=new _d2(this,_d3);
if(obj){
var _d5={};
var _d6=_d2._pluginInfo;
for(var i in _d6){
_d5[i]=_d6[i];
}
_d5.instance=obj;
_d5.args=_d3;
this.plugins[_d2._pluginInfo.name]=_d5;
return obj;
}else{
alert("Can't register plugin "+_d2.toString()+".");
}
};
Xinha.getPluginDir=function(_d8){
return _editor_url+"plugins/"+_d8;
};
Xinha.loadPlugin=function(_d9,_da){
if(eval("typeof "+_d9)!="undefined"){
if(_da){
_da(_d9);
}
return true;
}
var dir=this.getPluginDir(_d9);
var _dc=_d9.replace(/([a-z])([A-Z])([a-z])/g,function(str,l1,l2,l3){
return l1+"-"+l2.toLowerCase()+l3;
}).toLowerCase()+".js";
var _e1=dir+"/"+_dc;
Xinha._loadback(_e1,_da?function(){
_da(_d9);
}:null);
return false;
};
Xinha._pluginLoadStatus={};
Xinha._browserSpecificFunctionsLoaded=false;
Xinha.loadPlugins=function(_e2,_e3){
var _e4=true;
var _e5=Xinha.cloneObject(_e2);
if(!Xinha._browserSpecificFunctionsLoaded){
if(Xinha.is_ie){
Xinha._loadback(_editor_url+"functionsIE.js",_e3);
}else{
Xinha._loadback(_editor_url+"functionsMozilla.js",_e3);
}
return false;
}
while(_e5.length){
var p=_e5.pop();
if(typeof Xinha._pluginLoadStatus[p]=="undefined"){
Xinha._pluginLoadStatus[p]="loading";
Xinha.loadPlugin(p,function(_e7){
if(eval("typeof "+_e7)!="undefined"){
Xinha._pluginLoadStatus[_e7]="ready";
}else{
Xinha._pluginLoadStatus[_e7]="failed";
}
});
_e4=false;
}else{
switch(Xinha._pluginLoadStatus[p]){
case "failed":
case "ready":
break;
default:
_e4=false;
break;
}
}
}
if(_e4){
return true;
}
if(_e3){
setTimeout(function(){
if(Xinha.loadPlugins(_e2,_e3)){
_e3();
}
},150);
}
return _e4;
};
Xinha.refreshPlugin=function(_e8){
if(_e8&&typeof _e8.onGenerate=="function"){
_e8.onGenerate();
}
if(_e8&&typeof _e8.onGenerateOnce=="function"){
_e8.onGenerateOnce();
_e8.onGenerateOnce=null;
}
};
Xinha.loadStyle=function(_e9,_ea){
var url=_editor_url||"";
if(typeof _ea!="undefined"){
url+="plugins/"+_ea+"/";
}
url+=_e9;
if(/^\//.test(_e9)){
url=_e9;
}
var _ec=document.getElementsByTagName("head")[0];
var _ed=document.createElement("link");
_ed.rel="stylesheet";
_ed.href=url;
_ec.appendChild(_ed);
};
Xinha.loadStyle(typeof _editor_css=="string"?_editor_css:"Xinha.css");
Xinha.prototype.debugTree=function(){
var ta=document.createElement("textarea");
ta.style.width="100%";
ta.style.height="20em";
ta.value="";
function debug(_ef,str){
for(;--_ef>=0;){
ta.value+=" ";
}
ta.value+=str+"\n";
}
function _dt(_f1,_f2){
var tag=_f1.tagName.toLowerCase(),i;
var ns=Xinha.is_ie?_f1.scopeName:_f1.prefix;
debug(_f2,"- "+tag+" ["+ns+"]");
for(i=_f1.firstChild;i;i=i.nextSibling){
if(i.nodeType==1){
_dt(i,_f2+2);
}
}
}
_dt(this._doc.body,0);
document.body.appendChild(ta);
};
Xinha.getInnerText=function(el){
var txt="",i;
for(i=el.firstChild;i;i=i.nextSibling){
if(i.nodeType==3){
txt+=i.data;
}else{
if(i.nodeType==1){
txt+=Xinha.getInnerText(i);
}
}
}
return txt;
};
Xinha.prototype._wordClean=function(){
var _f7=this;
var _f8={empty_tags:0,mso_class:0,mso_style:0,mso_xmlel:0,orig_len:this._doc.body.innerHTML.length,T:(new Date()).getTime()};
var _f9={empty_tags:"Empty tags removed: ",mso_class:"MSO class names removed: ",mso_style:"MSO inline style removed: ",mso_xmlel:"MSO XML elements stripped: "};
function showStats(){
var txt="Xinha word cleaner stats: \n\n";
for(var i in _f8){
if(_f9[i]){
txt+=_f9[i]+_f8[i]+"\n";
}
}
txt+="\nInitial document length: "+_f8.orig_len+"\n";
txt+="Final document length: "+_f7._doc.body.innerHTML.length+"\n";
txt+="Clean-up took "+(((new Date()).getTime()-_f8.T)/1000)+" seconds";
alert(txt);
}
function clearClass(_fc){
var _fd=_fc.className.replace(/(^|\s)mso.*?(\s|$)/ig," ");
if(_fd!=_fc.className){
_fc.className=_fd;
if(!(/\S/.test(_fc.className))){
_fc.removeAttribute("className");
++_f8.mso_class;
}
}
}
function clearStyle(_fe){
var _ff=_fe.style.cssText.split(/\s*;\s*/);
for(var i=_ff.length;--i>=0;){
if((/^mso|^tab-stops/i.test(_ff[i]))||(/^margin\s*:\s*0..\s+0..\s+0../i.test(_ff[i]))){
++_f8.mso_style;
_ff.splice(i,1);
}
}
_fe.style.cssText=_ff.join("; ");
}
var _101=null;
if(Xinha.is_ie){
_101=function(el){
el.outerHTML=Xinha.htmlEncode(el.innerText);
++_f8.mso_xmlel;
};
}else{
_101=function(el){
var txt=document.createTextNode(Xinha.getInnerText(el));
el.parentNode.insertBefore(txt,el);
Xinha.removeFromParent(el);
++_f8.mso_xmlel;
};
}
function checkEmpty(el){
if(/^(a|span|b|strong|i|em|font)$/i.test(el.tagName)&&!el.firstChild){
Xinha.removeFromParent(el);
++_f8.empty_tags;
}
}
function parseTree(root){
var tag=root.tagName.toLowerCase(),i,next;
if((Xinha.is_ie&&root.scopeName!="HTML")||(!Xinha.is_ie&&(/:/.test(tag)))){
_101(root);
return false;
}else{
clearClass(root);
clearStyle(root);
for(i=root.firstChild;i;i=next){
next=i.nextSibling;
if(i.nodeType==1&&parseTree(i)){
checkEmpty(i);
}
}
}
return true;
}
parseTree(this._doc.body);
this.updateToolbar();
};
Xinha.prototype._clearFonts=function(){
var D=this.getInnerHTML();
if(confirm(Xinha._lc("Would you like to clear font typefaces?"))){
D=D.replace(/face="[^"]*"/gi,"");
D=D.replace(/font-family:[^;}"']+;?/gi,"");
}
if(confirm(Xinha._lc("Would you like to clear font sizes?"))){
D=D.replace(/size="[^"]*"/gi,"");
D=D.replace(/font-size:[^;}"']+;?/gi,"");
}
if(confirm(Xinha._lc("Would you like to clear font colours?"))){
D=D.replace(/color="[^"]*"/gi,"");
D=D.replace(/([^-])color:[^;}"']+;?/gi,"$1");
}
D=D.replace(/(style|class)="\s*"/gi,"");
D=D.replace(/<(font|span)\s*>/gi,"");
this.setHTML(D);
this.updateToolbar();
};
Xinha.prototype._splitBlock=function(){
this._doc.execCommand("formatblock",false,"div");
};
Xinha.prototype.forceRedraw=function(){
this._doc.body.style.visibility="hidden";
this._doc.body.style.visibility="visible";
};
Xinha.prototype.focusEditor=function(){
switch(this._editMode){
case "wysiwyg":
try{
if(Xinha._someEditorHasBeenActivated){
this.activateEditor();
this._iframe.contentWindow.focus();
}
}
catch(ex){
}
break;
case "textmode":
try{
this._textArea.focus();
}
catch(e){
}
break;
default:
alert("ERROR: mode "+this._editMode+" is not defined");
}
return this._doc;
};
Xinha.prototype._undoTakeSnapshot=function(){
++this._undoPos;
if(this._undoPos>=this.config.undoSteps){
this._undoQueue.shift();
--this._undoPos;
}
var take=true;
var txt=this.getInnerHTML();
if(this._undoPos>0){
take=(this._undoQueue[this._undoPos-1]!=txt);
}
if(take){
this._undoQueue[this._undoPos]=txt;
}else{
this._undoPos--;
}
};
Xinha.prototype.undo=function(){
if(this._undoPos>0){
var txt=this._undoQueue[--this._undoPos];
if(txt){
this.setHTML(txt);
}else{
++this._undoPos;
}
}
};
Xinha.prototype.redo=function(){
if(this._undoPos<this._undoQueue.length-1){
var txt=this._undoQueue[++this._undoPos];
if(txt){
this.setHTML(txt);
}else{
--this._undoPos;
}
}
};
Xinha.prototype.disableToolbar=function(_10d){
if(this._timerToolbar){
clearTimeout(this._timerToolbar);
}
if(typeof _10d=="undefined"){
_10d=[];
}else{
if(typeof _10d!="object"){
_10d=[_10d];
}
}
for(var i in this._toolbarObjects){
var btn=this._toolbarObjects[i];
if(_10d.contains(i)){
continue;
}
if(typeof (btn.state)!="function"){
continue;
}
btn.state("enabled",false);
}
};
Xinha.prototype.enableToolbar=function(){
this.updateToolbar();
};
if(!Array.prototype.contains){
Array.prototype.contains=function(_110){
var _111=this;
for(var i=0;i<_111.length;i++){
if(_110==_111[i]){
return true;
}
}
return false;
};
}
if(!Array.prototype.indexOf){
Array.prototype.indexOf=function(_113){
var _114=this;
for(var i=0;i<_114.length;i++){
if(_113==_114[i]){
return i;
}
}
return null;
};
}
Xinha.prototype.updateToolbar=function(_116){
var doc=this._doc;
var text=(this._editMode=="textmode");
var _119=null;
if(!text){
_119=this.getAllAncestors();
if(this.config.statusBar&&!_116){
this._statusBarTree.innerHTML=Xinha._lc("Path")+": ";
for(var i=_119.length;--i>=0;){
var el=_119[i];
if(!el){
continue;
}
var a=document.createElement("a");
a.href="javascript:void(0)";
a.el=el;
a.editor=this;
Xinha.addDom0Event(a,"click",function(){
this.blur();
this.editor.selectNodeContents(this.el);
this.editor.updateToolbar(true);
return false;
});
Xinha.addDom0Event(a,"contextmenu",function(){
this.blur();
var info="Inline style:\n\n";
info+=this.el.style.cssText.split(/;\s*/).join(";\n");
alert(info);
return false;
});
var txt=el.tagName.toLowerCase();
if(typeof el.style!="undefined"){
a.title=el.style.cssText;
}
if(el.id){
txt+="#"+el.id;
}
if(el.className){
txt+="."+el.className;
}
a.appendChild(document.createTextNode(txt));
this._statusBarTree.appendChild(a);
if(i!==0){
this._statusBarTree.appendChild(document.createTextNode(String.fromCharCode(187)));
}
}
}
}
for(var cmd in this._toolbarObjects){
var btn=this._toolbarObjects[cmd];
var _121=true;
if(typeof (btn.state)!="function"){
continue;
}
if(btn.context&&!text){
_121=false;
var _122=btn.context;
var _123=[];
if(/(.*)\[(.*?)\]/.test(_122)){
_122=RegExp.$1;
_123=RegExp.$2.split(",");
}
_122=_122.toLowerCase();
var _124=(_122=="*");
for(var k=0;k<_119.length;++k){
if(!_119[k]){
continue;
}
if(_124||(_119[k].tagName.toLowerCase()==_122)){
_121=true;
for(var ka=0;ka<_123.length;++ka){
if(!_119[k].getAttribute(_123[ka])){
_121=false;
break;
}
}
if(_121){
break;
}
}
}
}
btn.state("enabled",(!text||btn.text)&&_121);
if(typeof cmd=="function"){
continue;
}
var _127=this.config.customSelects[cmd];
if((!text||btn.text)&&(typeof _127!="undefined")){
_127.refresh(this);
continue;
}
switch(cmd){
case "fontname":
case "fontsize":
if(!text){
try{
var _128=(""+doc.queryCommandValue(cmd)).toLowerCase();
if(!_128){
btn.element.selectedIndex=0;
break;
}
var _129=this.config[cmd];
var _12a=0;
for(var j in _129){
if((j.toLowerCase()==_128)||(_129[j].substr(0,_128.length).toLowerCase()==_128)){
btn.element.selectedIndex=_12a;
throw "ok";
}
++_12a;
}
btn.element.selectedIndex=0;
}
catch(ex){
}
}
break;
case "formatblock":
var _12c=[];
for(var _12d in this.config.formatblock){
if(typeof this.config.formatblock[_12d]=="string"){
_12c[_12c.length]=this.config.formatblock[_12d];
}
}
var _12e=this._getFirstAncestor(this._getSelection(),_12c);
if(_12e){
for(var x=0;x<_12c.length;x++){
if(_12c[x].toLowerCase()==_12e.tagName.toLowerCase()){
btn.element.selectedIndex=x;
}
}
}else{
btn.element.selectedIndex=0;
}
break;
case "textindicator":
if(!text){
try{
var _130=btn.element.style;
_130.backgroundColor=Xinha._makeColor(doc.queryCommandValue(Xinha.is_ie?"backcolor":"hilitecolor"));
if(/transparent/i.test(_130.backgroundColor)){
_130.backgroundColor=Xinha._makeColor(doc.queryCommandValue("backcolor"));
}
_130.color=Xinha._makeColor(doc.queryCommandValue("forecolor"));
_130.fontFamily=doc.queryCommandValue("fontname");
_130.fontWeight=doc.queryCommandState("bold")?"bold":"normal";
_130.fontStyle=doc.queryCommandState("italic")?"italic":"normal";
}
catch(ex){
}
}
break;
case "htmlmode":
btn.state("active",text);
break;
case "lefttoright":
case "righttoleft":
var _131=this.getParentElement();
while(_131&&!Xinha.isBlockElement(_131)){
_131=_131.parentNode;
}
if(_131){
btn.state("active",(_131.style.direction==((cmd=="righttoleft")?"rtl":"ltr")));
}
break;
default:
cmd=cmd.replace(/(un)?orderedlist/i,"insert$1orderedlist");
try{
btn.state("active",(!text&&doc.queryCommandState(cmd)));
}
catch(ex){
}
break;
}
}
if(this._customUndo&&!this._timerUndo){
this._undoTakeSnapshot();
var _132=this;
this._timerUndo=setTimeout(function(){
_132._timerUndo=null;
},this.config.undoTimeout);
}
if(0&&Xinha.is_gecko){
var s=this._getSelection();
if(s&&s.isCollapsed&&s.anchorNode&&s.anchorNode.parentNode.tagName.toLowerCase()!="body"&&s.anchorNode.nodeType==3&&s.anchorOffset==s.anchorNode.length&&!(s.anchorNode.parentNode.nextSibling&&s.anchorNode.parentNode.nextSibling.nodeType==3)&&!Xinha.isBlockElement(s.anchorNode.parentNode)){
try{
s.anchorNode.parentNode.parentNode.insertBefore(this._doc.createTextNode("\t"),s.anchorNode.parentNode.nextSibling);
}
catch(ex){
}
}
}
for(var _134 in this.plugins){
var _135=this.plugins[_134].instance;
if(_135&&typeof _135.onUpdateToolbar=="function"){
_135.onUpdateToolbar();
}
}
};
Xinha.prototype.getAllAncestors=function(){
var p=this.getParentElement();
var a=[];
while(p&&(p.nodeType==1)&&(p.tagName.toLowerCase()!="body")){
a.push(p);
p=p.parentNode;
}
a.push(this._doc.body);
return a;
};
Xinha.prototype._getFirstAncestor=function(sel,_139){
var prnt=this._activeElement(sel);
if(prnt===null){
try{
prnt=(Xinha.is_ie?this._createRange(sel).parentElement():this._createRange(sel).commonAncestorContainer);
}
catch(ex){
return null;
}
}
if(typeof _139=="string"){
_139=[_139];
}
while(prnt){
if(prnt.nodeType==1){
if(_139===null){
return prnt;
}
if(_139.contains(prnt.tagName.toLowerCase())){
return prnt;
}
if(prnt.tagName.toLowerCase()=="body"){
break;
}
if(prnt.tagName.toLowerCase()=="table"){
break;
}
}
prnt=prnt.parentNode;
}
return null;
};
Xinha.prototype._getAncestorBlock=function(sel){
var prnt=(Xinha.is_ie?this._createRange(sel).parentElement:this._createRange(sel).commonAncestorContainer);
while(prnt&&(prnt.nodeType==1)){
switch(prnt.tagName.toLowerCase()){
case "div":
case "p":
case "address":
case "blockquote":
case "center":
case "del":
case "ins":
case "pre":
case "h1":
case "h2":
case "h3":
case "h4":
case "h5":
case "h6":
case "h7":
return prnt;
case "body":
case "noframes":
case "dd":
case "li":
case "th":
case "td":
case "noscript":
return null;
default:
break;
}
}
return null;
};
Xinha.prototype._createImplicitBlock=function(type){
var sel=this._getSelection();
if(Xinha.is_ie){
sel.empty();
}else{
sel.collapseToStart();
}
var rng=this._createRange(sel);
};
Xinha.prototype.surroundHTML=function(_140,_141){
var html=this.getSelectedHTML();
this.insertHTML(_140+html+_141);
};
Xinha.prototype.hasSelectedText=function(){
return this.getSelectedHTML()!=="";
};
Xinha.prototype._insertTable=function(){
var sel=this._getSelection();
var _144=this._createRange(sel);
var _145=this;
this._popupDialog(_145.config.URIs.insert_table,function(_146){
if(!_146){
return false;
}
var doc=_145._doc;
var _148=doc.createElement("table");
for(var _149 in _146){
var _14a=_146[_149];
if(!_14a){
continue;
}
switch(_149){
case "f_width":
_148.style.width=_14a+_146.f_unit;
break;
case "f_align":
_148.align=_14a;
break;
case "f_border":
_148.border=parseInt(_14a,10);
break;
case "f_spacing":
_148.cellSpacing=parseInt(_14a,10);
break;
case "f_padding":
_148.cellPadding=parseInt(_14a,10);
break;
}
}
var _14b=0;
if(_146.f_fixed){
_14b=Math.floor(100/parseInt(_146.f_cols,10));
}
var _14c=doc.createElement("tbody");
_148.appendChild(_14c);
for(var i=0;i<_146.f_rows;++i){
var tr=doc.createElement("tr");
_14c.appendChild(tr);
for(var j=0;j<_146.f_cols;++j){
var td=doc.createElement("td");
if(_14b){
td.style.width=_14b+"%";
}
tr.appendChild(td);
td.appendChild(doc.createTextNode("\xa0"));
}
}
if(Xinha.is_ie){
_144.pasteHTML(_148.outerHTML);
}else{
_145.insertNodeAtSelection(_148);
}
return true;
},null);
};
Xinha.prototype._comboSelected=function(el,txt){
this.focusEditor();
var _153=el.options[el.selectedIndex].value;
switch(txt){
case "fontname":
case "fontsize":
this.execCommand(txt,false,_153);
break;
case "formatblock":
if(!_153){
this.updateToolbar();
break;
}
if(!Xinha.is_gecko||_153!=="blockquote"){
_153="<"+_153+">";
}
this.execCommand(txt,false,_153);
break;
default:
var _154=this.config.customSelects[txt];
if(typeof _154!="undefined"){
_154.action(this);
}else{
alert("FIXME: combo box "+txt+" not implemented");
}
break;
}
};
Xinha.prototype._colorSelector=function(_155){
var _156=this;
if(typeof colorPicker=="undefined"){
Xinha._loadback(_editor_url+"popups/color_picker.js",function(){
_156._colorSelector(_155);
});
return false;
}
var btn=_156._toolbarObjects[_155].element;
var _158;
if(_155=="hilitecolor"){
if(Xinha.is_ie){
_155="backcolor";
_158=Xinha._colorToRgb(_156._doc.queryCommandValue("backcolor"));
}else{
_158=Xinha._colorToRgb(_156._doc.queryCommandValue("hilitecolor"));
}
}else{
_158=Xinha._colorToRgb(_156._doc.queryCommandValue("forecolor"));
}
var _159=function(_15a){
_156._doc.execCommand(_155,false,_15a);
};
if(Xinha.is_ie){
var _15b=_156._createRange(_156._getSelection());
_159=function(_15c){
_15b.select();
_156._doc.execCommand(_155,false,_15c);
};
}
var _15d=new colorPicker({cellsize:_156.config.colorPickerCellSize,callback:_159,granularity:_156.config.colorPickerGranularity,websafe:_156.config.colorPickerWebSafe,savecolors:_156.config.colorPickerSaveColors});
_15d.open(_156.config.colorPickerPosition,btn,_158);
};
Xinha.prototype.execCommand=function(_15e,UI,_160){
var _161=this;
this.focusEditor();
_15e=_15e.toLowerCase();
if(Xinha.is_gecko){
try{
this._doc.execCommand("useCSS",false,true);
}
catch(ex){
}
}
switch(_15e){
case "htmlmode":
this.setMode();
break;
case "hilitecolor":
case "forecolor":
this._colorSelector(_15e);
break;
case "createlink":
this._createLink();
break;
case "undo":
case "redo":
if(this._customUndo){
this[_15e]();
}else{
this._doc.execCommand(_15e,UI,_160);
}
break;
case "inserttable":
this._insertTable();
break;
case "insertimage":
this._insertImage();
break;
case "about":
this._popupDialog(_161.config.URIs.about,null,this);
break;
case "showhelp":
this._popupDialog(_161.config.URIs.help,null,this);
break;
case "killword":
this._wordClean();
break;
case "cut":
case "copy":
case "paste":
try{
this._doc.execCommand(_15e,UI,_160);
if(this.config.killWordOnPaste){
this._wordClean();
}
}
catch(ex){
if(Xinha.is_gecko){
alert(Xinha._lc("The Paste button does not work in Mozilla based web browsers (technical security reasons). Press CTRL-V on your keyboard to paste directly."));
}
}
break;
case "lefttoright":
case "righttoleft":
if(this.config.changeJustifyWithDirection){
this._doc.execCommand((_15e=="righttoleft")?"justifyright":"justifyleft",UI,_160);
}
var dir=(_15e=="righttoleft")?"rtl":"ltr";
var el=this.getParentElement();
while(el&&!Xinha.isBlockElement(el)){
el=el.parentNode;
}
if(el){
if(el.style.direction==dir){
el.style.direction="";
}else{
el.style.direction=dir;
}
}
break;
default:
try{
this._doc.execCommand(_15e,UI,_160);
}
catch(ex){
if(this.config.debug){
alert(e+"\n\nby execCommand("+_15e+");");
}
}
break;
}
this.updateToolbar();
return false;
};
Xinha.prototype._editorEvent=function(ev){
var _165=this;
var _166=(Xinha.is_ie&&ev.type=="keydown")||(!Xinha.is_ie&&ev.type=="keypress");
if(typeof _165._textArea["on"+ev.type]=="function"){
_165._textArea["on"+ev.type]();
}
if(Xinha.is_gecko&&_166&&ev.ctrlKey&&this._unLink&&this._unlinkOnUndo){
if(String.fromCharCode(ev.charCode).toLowerCase()=="z"){
Xinha._stopEvent(ev);
this._unLink();
_165.updateToolbar();
return;
}
}
if(_166){
for(var i in _165.plugins){
var _168=_165.plugins[i].instance;
if(_168&&typeof _168.onKeyPress=="function"){
if(_168.onKeyPress(ev)){
return false;
}
}
}
}
if(_166&&ev.ctrlKey&&!ev.altKey){
this._shortCuts(ev);
}else{
if(_166&&Xinha.is_gecko){
this.mozKey(ev,_166);
}
}
if(_165._timerToolbar){
clearTimeout(_165._timerToolbar);
}
_165._timerToolbar=setTimeout(function(){
_165.updateToolbar();
_165._timerToolbar=null;
},250);
};
Xinha.prototype._shortCuts=function(ev){
var _16a=this;
var sel=null;
var _16c=null;
var key=String.fromCharCode(Xinha.is_ie?ev.keyCode:ev.charCode).toLowerCase();
var cmd=null;
var _16f=null;
switch(key){
case "a":
if(!Xinha.is_ie){
sel=this._getSelection();
sel.removeAllRanges();
_16c=this._createRange();
_16c.selectNodeContents(this._doc.body);
sel.addRange(_16c);
Xinha._stopEvent(ev);
}
break;
case "b":
cmd="bold";
break;
case "i":
cmd="italic";
break;
case "u":
cmd="underline";
break;
case "s":
cmd="strikethrough";
break;
case "l":
cmd="justifyleft";
break;
case "e":
cmd="justifycenter";
break;
case "r":
cmd="justifyright";
break;
case "j":
cmd="justifyfull";
break;
case "z":
cmd="undo";
break;
case "y":
cmd="redo";
break;
case "v":
if(Xinha.is_ie||_16a.config.htmlareaPaste){
cmd="paste";
}
break;
case "n":
cmd="formatblock";
_16f=Xinha.is_ie?"<p>":"p";
break;
case "0":
cmd="killword";
break;
case "1":
case "2":
case "3":
case "4":
case "5":
case "6":
cmd="formatblock";
_16f="h"+key;
if(Xinha.is_ie){
_16f="<"+_16f+">";
}
break;
}
if(cmd){
this.execCommand(cmd,false,_16f);
Xinha._stopEvent(ev);
}
};
Xinha.prototype.convertNode=function(el,_171){
var _172=this._doc.createElement(_171);
while(el.firstChild){
_172.appendChild(el.firstChild);
}
return _172;
};
Xinha.prototype.dom_checkInsertP=function(){
var p,body;
var sel=this._getSelection();
var _175=this._createRange(sel);
if(!_175.collapsed){
_175.deleteContents();
}
this.deactivateEditor();
var SC=_175.startContainer;
var SO=_175.startOffset;
var EC=_175.endContainer;
var EO=_175.endOffset;
if(SC==EC&&SC==body&&!SO&&!EO){
p=this._doc.createTextNode(" ");
body.insertBefore(p,body.firstChild);
_175.selectNodeContents(p);
SC=_175.startContainer;
SO=_175.startOffset;
EC=_175.endContainer;
EO=_175.endOffset;
}
p=this.getAllAncestors();
var _17a=null;
body=this._doc.body;
for(var i=0;i<p.length;++i){
if(Xinha.isParaContainer(p[i])){
break;
}else{
if(Xinha.isBlockElement(p[i])&&!(/body|html/i.test(p[i].tagName))){
_17a=p[i];
break;
}
}
}
if(!_17a){
var wrap=_175.startContainer;
while(wrap.parentNode&&!Xinha.isParaContainer(wrap.parentNode)){
wrap=wrap.parentNode;
}
var _17d=wrap;
var end=wrap;
while(_17d.previousSibling){
if(_17d.previousSibling.tagName){
if(!Xinha.isBlockElement(_17d.previousSibling)){
_17d=_17d.previousSibling;
}else{
break;
}
}else{
_17d=_17d.previousSibling;
}
}
while(end.nextSibling){
if(end.nextSibling.tagName){
if(!Xinha.isBlockElement(end.nextSibling)){
end=end.nextSibling;
}else{
break;
}
}else{
end=end.nextSibling;
}
}
_175.setStartBefore(_17d);
_175.setEndAfter(end);
_175.surroundContents(this._doc.createElement("p"));
_17a=_175.startContainer.firstChild;
_175.setStart(SC,SO);
}
_175.setEndAfter(_17a);
var r2=_175.cloneRange();
sel.removeRange(_175);
var df=r2.extractContents();
if(df.childNodes.length===0){
df.appendChild(this._doc.createElement("p"));
df.firstChild.appendChild(this._doc.createElement("br"));
}
if(df.childNodes.length>1){
var nb=this._doc.createElement("p");
while(df.firstChild){
var s=df.firstChild;
df.removeChild(s);
nb.appendChild(s);
}
df.appendChild(nb);
}
if(!(/\S/.test(_17a.innerHTML))){
_17a.innerHTML="&nbsp;";
}
p=df.firstChild;
if(!(/\S/.test(p.innerHTML))){
p.innerHTML="<br />";
}
if((/^\s*<br\s*\/?>\s*$/.test(p.innerHTML))&&(/^h[1-6]$/i.test(p.tagName))){
df.appendChild(this.convertNode(p,"p"));
df.removeChild(p);
}
var _183=_17a.parentNode.insertBefore(df.firstChild,_17a.nextSibling);
this.activateEditor();
sel=this._getSelection();
sel.removeAllRanges();
sel.collapse(_183,0);
this.scrollToElement(_183);
};
Xinha.prototype.scrollToElement=function(e){
if(Xinha.is_gecko){
var top=0;
var left=0;
while(e){
top+=e.offsetTop;
left+=e.offsetLeft;
if(e.offsetParent&&e.offsetParent.tagName.toLowerCase()!="body"){
e=e.offsetParent;
}else{
e=null;
}
}
this._iframe.contentWindow.scrollTo(left,top);
}
};
Xinha.prototype.getHTML=function(){
var html="";
switch(this._editMode){
case "wysiwyg":
if(!this.config.fullPage){
html=Xinha.getHTML(this._doc.body,false,this);
}else{
html=this.doctype+"\n"+Xinha.getHTML(this._doc.documentElement,true,this);
}
break;
case "textmode":
html=this._textArea.value;
break;
default:
alert("Mode <"+this._editMode+"> not defined!");
return false;
}
return html;
};
Xinha.prototype.outwardHtml=function(html){
html=html.replace(/<(\/?)b(\s|>|\/)/ig,"<$1strong$2");
html=html.replace(/<(\/?)i(\s|>|\/)/ig,"<$1em$2");
html=html.replace(/<(\/?)strike(\s|>|\/)/ig,"<$1del$2");
html=html.replace("onclick=\"try{if(document.designMode &amp;&amp; document.designMode == 'on') return false;}catch(e){} window.open(","onclick=\"window.open(");
var _189=location.href.replace(/(https?:\/\/[^\/]*)\/.*/,"$1")+"/";
html=html.replace(/https?:\/\/null\//g,_189);
html=html.replace(/((href|src|background)=[\'\"])\/+/ig,"$1"+_189);
html=this.outwardSpecialReplacements(html);
html=this.fixRelativeLinks(html);
if(this.config.sevenBitClean){
html=html.replace(/[^ -~\r\n\t]/g,function(c){
return "&#"+c.charCodeAt(0)+";";
});
}
if(Xinha.is_gecko){
html=html.replace(/<script[\s]*src[\s]*=[\s]*['"]chrome:\/\/.*?["']>[\s]*<\/script>/ig,"");
}
html=html.replace(/(<script[^>]*)(freezescript)/gi,"$1javascript");
return html;
};
Xinha.prototype.inwardHtml=function(html){
if(Xinha.is_gecko){
html=html.replace(/<(\/?)strong(\s|>|\/)/ig,"<$1b$2");
html=html.replace(/<(\/?)em(\s|>|\/)/ig,"<$1i$2");
}
html=html.replace(/<(\/?)del(\s|>|\/)/ig,"<$1strike$2");
html=html.replace("onclick=\"window.open(","onclick=\"try{if(document.designMode &amp;&amp; document.designMode == 'on') return false;}catch(e){} window.open(");
html=this.inwardSpecialReplacements(html);
html=html.replace(/(<script[^>]*)(javascript)/gi,"$1freezescript");
var _18c=new RegExp("((href|src|background)=['\"])/+","gi");
html=html.replace(_18c,"$1"+location.href.replace(/(https?:\/\/[^\/]*)\/.*/,"$1")+"/");
html=this.fixRelativeLinks(html);
return html;
};
Xinha.prototype.outwardSpecialReplacements=function(html){
for(var i in this.config.specialReplacements){
var from=this.config.specialReplacements[i];
var to=i;
if(typeof from.replace!="function"||typeof to.replace!="function"){
continue;
}
var reg=new RegExp(from.replace(Xinha.RE_Specials,"\\$1"),"g");
html=html.replace(reg,to.replace(/\$/g,"$$$$"));
}
return html;
};
Xinha.prototype.inwardSpecialReplacements=function(html){
for(var i in this.config.specialReplacements){
var from=i;
var to=this.config.specialReplacements[i];
if(typeof from.replace!="function"||typeof to.replace!="function"){
continue;
}
var reg=new RegExp(from.replace(Xinha.RE_Specials,"\\$1"),"g");
html=html.replace(reg,to.replace(/\$/g,"$$$$"));
}
return html;
};
Xinha.prototype.fixRelativeLinks=function(html){
if(typeof this.config.expandRelativeUrl!="undefined"&&this.config.expandRelativeUrl){
var src=html.match(/(src|href)="([^"]*)"/gi);
}
var b=document.location.href;
if(src){
var url,url_m,relPath,base_m,absPath;
for(var i=0;i<src.length;++i){
url=src[i].match(/(src|href)="([^"]*)"/i);
url_m=url[2].match(/\.\.\//g);
if(url_m){
relPath=new RegExp("(.*?)(([^/]*/){"+url_m.length+"})[^/]*$");
base_m=b.match(relPath);
absPath=url[2].replace(/(\.\.\/)*/,base_m[1]);
html=html.replace(new RegExp(url[2].replace(Xinha.RE_Specials,"\\$1")),absPath);
}
}
}
if(typeof this.config.stripSelfNamedAnchors!="undefined"&&this.config.stripSelfNamedAnchors){
var _19c=new RegExp(document.location.href.replace(/&/g,"&amp;").replace(Xinha.RE_Specials,"\\$1")+"(#[^'\" ]*)","g");
html=html.replace(_19c,"$1");
}
if(typeof this.config.stripBaseHref!="undefined"&&this.config.stripBaseHref){
var _19d=null;
if(typeof this.config.baseHref!="undefined"&&this.config.baseHref!==null){
_19d=new RegExp("((href|src|background)=\")("+this.config.baseHref.replace(Xinha.RE_Specials,"\\$1")+")","g");
}else{
_19d=new RegExp("((href|src|background)=\")("+document.location.href.replace(/([^\/]*\/?)$/,"").replace(Xinha.RE_Specials,"\\$1")+")","g");
}
html=html.replace(_19d,"$1");
}
return html;
};
Xinha.prototype.getInnerHTML=function(){
if(!this._doc.body){
return "";
}
var html="";
switch(this._editMode){
case "wysiwyg":
if(!this.config.fullPage){
html=this._doc.body.innerHTML;
}else{
html=this.doctype+"\n"+this._doc.documentElement.innerHTML;
}
break;
case "textmode":
html=this._textArea.value;
break;
default:
alert("Mode <"+this._editMode+"> not defined!");
return false;
}
return html;
};
Xinha.prototype.setHTML=function(html){
if(!this.config.fullPage){
this._doc.body.innerHTML=html;
}else{
this.setFullHTML(html);
}
this._textArea.value=html;
};
Xinha.prototype.setDoctype=function(_1a0){
this.doctype=_1a0;
};
Xinha._object=null;
Xinha.cloneObject=function(obj){
if(!obj){
return null;
}
var _1a2={};
if(obj.constructor.toString().match(/\s*function Array\(/)){
_1a2=obj.constructor();
}
if(obj.constructor.toString().match(/\s*function Function\(/)){
_1a2=obj;
}else{
for(var n in obj){
var node=obj[n];
if(typeof node=="object"){
_1a2[n]=Xinha.cloneObject(node);
}else{
_1a2[n]=node;
}
}
}
return _1a2;
};
Xinha.checkSupportedBrowser=function(){
if(Xinha.is_gecko){
if(navigator.productSub<20021201){
alert("You need at least Mozilla-1.3 Alpha.\nSorry, your Gecko is not supported.");
return false;
}
if(navigator.productSub<20030210){
alert("Mozilla < 1.3 Beta is not supported!\nI'll try, though, but it might not work.");
}
}
return Xinha.is_gecko||Xinha.is_ie;
};
Xinha._eventFlushers=[];
Xinha.flushEvents=function(){
var x=0;
var e=Xinha._eventFlushers.pop();
while(e){
try{
if(e.length==3){
Xinha._removeEvent(e[0],e[1],e[2]);
x++;
}else{
if(e.length==2){
e[0]["on"+e[1]]=null;
e[0]._xinha_dom0Events[e[1]]=null;
x++;
}
}
}
catch(ex){
}
e=Xinha._eventFlushers.pop();
}
};
if(document.addEventListener){
Xinha._addEvent=function(el,_1a8,func){
el.addEventListener(_1a8,func,true);
Xinha._eventFlushers.push([el,_1a8,func]);
};
Xinha._removeEvent=function(el,_1ab,func){
el.removeEventListener(_1ab,func,true);
};
Xinha._stopEvent=function(ev){
ev.preventDefault();
ev.stopPropagation();
};
}else{
if(document.attachEvent){
Xinha._addEvent=function(el,_1af,func){
el.attachEvent("on"+_1af,func);
Xinha._eventFlushers.push([el,_1af,func]);
};
Xinha._removeEvent=function(el,_1b2,func){
el.detachEvent("on"+_1b2,func);
};
Xinha._stopEvent=function(ev){
try{
ev.cancelBubble=true;
ev.returnValue=false;
}
catch(ex){
}
};
}else{
Xinha._addEvent=function(el,_1b6,func){
alert("_addEvent is not supported");
};
Xinha._removeEvent=function(el,_1b9,func){
alert("_removeEvent is not supported");
};
Xinha._stopEvent=function(ev){
alert("_stopEvent is not supported");
};
}
}
Xinha._addEvents=function(el,evs,func){
for(var i=evs.length;--i>=0;){
Xinha._addEvent(el,evs[i],func);
}
};
Xinha._removeEvents=function(el,evs,func){
for(var i=evs.length;--i>=0;){
Xinha._removeEvent(el,evs[i],func);
}
};
Xinha.addDom0Event=function(el,ev,fn){
Xinha._prepareForDom0Events(el,ev);
el._xinha_dom0Events[ev].unshift(fn);
};
Xinha.prependDom0Event=function(el,ev,fn){
Xinha._prepareForDom0Events(el,ev);
el._xinha_dom0Events[ev].push(fn);
};
Xinha._prepareForDom0Events=function(el,ev){
if(typeof el._xinha_dom0Events=="undefined"){
el._xinha_dom0Events={};
Xinha.freeLater(el,"_xinha_dom0Events");
}
if(typeof el._xinha_dom0Events[ev]=="undefined"){
el._xinha_dom0Events[ev]=[];
if(typeof el["on"+ev]=="function"){
el._xinha_dom0Events[ev].push(el["on"+ev]);
}
el["on"+ev]=function(_1cc){
var a=el._xinha_dom0Events[ev];
var _1ce=true;
for(var i=a.length;--i>=0;){
el._xinha_tempEventHandler=a[i];
if(el._xinha_tempEventHandler(_1cc)===false){
el._xinha_tempEventHandler=null;
_1ce=false;
break;
}
el._xinha_tempEventHandler=null;
}
return _1ce;
};
Xinha._eventFlushers.push([el,ev]);
}
};
Xinha.prototype.notifyOn=function(ev,fn){
if(typeof this._notifyListeners[ev]=="undefined"){
this._notifyListeners[ev]=[];
Xinha.freeLater(this,"_notifyListeners");
}
this._notifyListeners[ev].push(fn);
};
Xinha.prototype.notifyOf=function(ev,args){
if(this._notifyListeners[ev]){
for(var i=0;i<this._notifyListeners[ev].length;i++){
this._notifyListeners[ev][i](ev,args);
}
}
};
Xinha._removeClass=function(el,_1d6){
if(!(el&&el.className)){
return;
}
var cls=el.className.split(" ");
var ar=[];
for(var i=cls.length;i>0;){
if(cls[--i]!=_1d6){
ar[ar.length]=cls[i];
}
}
el.className=ar.join(" ");
};
Xinha._addClass=function(el,_1db){
Xinha._removeClass(el,_1db);
el.className+=" "+_1db;
};
Xinha._hasClass=function(el,_1dd){
if(!(el&&el.className)){
return false;
}
var cls=el.className.split(" ");
for(var i=cls.length;i>0;){
if(cls[--i]==_1dd){
return true;
}
}
return false;
};
Xinha._blockTags=" body form textarea fieldset ul ol dl li div "+"p h1 h2 h3 h4 h5 h6 quote pre table thead "+"tbody tfoot tr td th iframe address blockquote ";
Xinha.isBlockElement=function(el){
return el&&el.nodeType==1&&(Xinha._blockTags.indexOf(" "+el.tagName.toLowerCase()+" ")!=-1);
};
Xinha._paraContainerTags=" body td th caption fieldset div";
Xinha.isParaContainer=function(el){
return el&&el.nodeType==1&&(Xinha._paraContainerTags.indexOf(" "+el.tagName.toLowerCase()+" ")!=-1);
};
Xinha._closingTags=" a abbr acronym address applet b bdo big blockquote button caption center cite code del dfn dir div dl em fieldset font form frameset h1 h2 h3 h4 h5 h6 i iframe ins kbd label legend map menu noframes noscript object ol optgroup pre q s samp script select small span strike strong style sub sup table textarea title tt u ul var ";
Xinha.needsClosingTag=function(el){
return el&&el.nodeType==1&&(Xinha._closingTags.indexOf(" "+el.tagName.toLowerCase()+" ")!=-1);
};
Xinha.htmlEncode=function(str){
if(typeof str.replace=="undefined"){
str=str.toString();
}
str=str.replace(/&/ig,"&amp;");
str=str.replace(/</ig,"&lt;");
str=str.replace(/>/ig,"&gt;");
str=str.replace(/\xA0/g,"&nbsp;");
str=str.replace(/\x22/g,"&quot;");
return str;
};
Xinha.prototype.stripBaseURL=function(_1e4){
if(this.config.baseHref===null||!this.config.stripBaseHref){
return _1e4;
}
var _1e5=this.config.baseHref.replace(/^(https?:\/\/[^\/]+)(.*)$/,"$1");
var _1e6=new RegExp(_1e5);
return _1e4.replace(_1e6,"");
};
String.prototype.trim=function(){
return this.replace(/^\s+/,"").replace(/\s+$/,"");
};
Xinha._makeColor=function(v){
if(typeof v!="number"){
return v;
}
var r=v&255;
var g=(v>>8)&255;
var b=(v>>16)&255;
return "rgb("+r+","+g+","+b+")";
};
Xinha._colorToRgb=function(v){
if(!v){
return "";
}
var r,g,b;
function hex(d){
return (d<16)?("0"+d.toString(16)):d.toString(16);
}
if(typeof v=="number"){
r=v&255;
g=(v>>8)&255;
b=(v>>16)&255;
return "#"+hex(r)+hex(g)+hex(b);
}
if(v.substr(0,3)=="rgb"){
var re=/rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/;
if(v.match(re)){
r=parseInt(RegExp.$1,10);
g=parseInt(RegExp.$2,10);
b=parseInt(RegExp.$3,10);
return "#"+hex(r)+hex(g)+hex(b);
}
return null;
}
if(v.substr(0,1)=="#"){
return v;
}
return null;
};
Xinha.prototype._popupDialog=function(url,_1f0,init){
Dialog(this.popupURL(url),_1f0,init);
};
Xinha.prototype.imgURL=function(file,_1f3){
if(typeof _1f3=="undefined"){
return _editor_url+file;
}else{
return _editor_url+"plugins/"+_1f3+"/img/"+file;
}
};
Xinha.prototype.popupURL=function(file){
var url="";
if(file.match(/^plugin:\/\/(.*?)\/(.*)/)){
var _1f6=RegExp.$1;
var _1f7=RegExp.$2;
if(!(/\.html$/.test(_1f7))){
_1f7+=".html";
}
url=_editor_url+"plugins/"+_1f6+"/popups/"+_1f7;
}else{
if(file.match(/^\/.*?/)){
url=file;
}else{
url=_editor_url+this.config.popupURL+file;
}
}
return url;
};
Xinha.getElementById=function(tag,id){
var el,i,objs=document.getElementsByTagName(tag);
for(i=objs.length;--i>=0&&(el=objs[i]);){
if(el.id==id){
return el;
}
}
return null;
};
Xinha.prototype._toggleBorders=function(){
var _1fb=this._doc.getElementsByTagName("TABLE");
if(_1fb.length!==0){
if(!this.borders){
name="bordered";
this.borders=true;
}else{
name="";
this.borders=false;
}
for(var i=0;i<_1fb.length;i++){
if(this.borders){
if(Xinha.is_gecko){
_1fb[i].style.display="none";
_1fb[i].style.display="table";
}
Xinha._addClass(_1fb[i],"htmtableborders");
}else{
Xinha._removeClass(_1fb[i],"htmtableborders");
}
}
}
return true;
};
Xinha.addClasses=function(el,_1fe){
if(el!==null){
var _1ff=el.className.trim().split(" ");
var ours=_1fe.split(" ");
for(var x=0;x<ours.length;x++){
var _202=false;
for(var i=0;_202===false&&i<_1ff.length;i++){
if(_1ff[i]==ours[x]){
_202=true;
}
}
if(_202===false){
_1ff[_1ff.length]=ours[x];
}
}
el.className=_1ff.join(" ").trim();
}
};
Xinha.removeClasses=function(el,_205){
var _206=el.className.trim().split();
var _207=[];
var _208=_205.trim().split();
for(var i=0;i<_206.length;i++){
var _20a=false;
for(var x=0;x<_208.length&&!_20a;x++){
if(_206[i]==_208[x]){
_20a=true;
}
}
if(!_20a){
_207[_207.length]=_206[i];
}
}
return _207.join(" ");
};
Xinha.addClass=Xinha._addClass;
Xinha.removeClass=Xinha._removeClass;
Xinha._addClasses=Xinha.addClasses;
Xinha._removeClasses=Xinha.removeClasses;
Xinha._postback=function(url,data,_20e){
var req=null;
if(Xinha.is_ie){
req=new ActiveXObject("Microsoft.XMLHTTP");
}else{
req=new XMLHttpRequest();
}
var _210="";
if(typeof data=="string"){
_210=data;
}else{
if(typeof data=="object"){
for(var i in data){
_210+=(_210.length?"&":"")+i+"="+encodeURIComponent(data[i]);
}
}
}
function callBack(){
if(req.readyState==4){
if(req.status==200||Xinha.isRunLocally&&req.status==0){
if(typeof _20e=="function"){
_20e(req.responseText,req);
}
}else{
alert("An error has occurred: "+req.statusText);
}
}
}
req.onreadystatechange=callBack;
req.open("POST",url,true);
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
req.send(_210);
};
Xinha._getback=function(url,_213){
var req=null;
if(Xinha.is_ie){
req=new ActiveXObject("Microsoft.XMLHTTP");
}else{
req=new XMLHttpRequest();
}
function callBack(){
if(req.readyState==4){
if(req.status==200||Xinha.isRunLocally&&req.status==0){
_213(req.responseText,req);
}else{
alert("An error has occurred: "+req.statusText);
}
}
}
req.onreadystatechange=callBack;
req.open("GET",url,true);
req.send(null);
};
Xinha._geturlcontent=function(url){
var req=null;
if(Xinha.is_ie){
req=new ActiveXObject("Microsoft.XMLHTTP");
}else{
req=new XMLHttpRequest();
}
req.open("GET",url,false);
req.send(null);
if(req.status==200||Xinha.isRunLocally&&req.status==0){
return req.responseText;
}else{
return "";
}
};
if(typeof dump=="undefined"){
function dump(o){
var s="";
for(var prop in o){
s+=prop+" = "+o[prop]+"\n";
}
var x=window.open("","debugger");
x.document.write("<pre>"+s+"</pre>");
}
}
Xinha.arrayContainsArray=function(a1,a2){
var _21d=true;
for(var x=0;x<a2.length;x++){
var _21f=false;
for(var i=0;i<a1.length;i++){
if(a1[i]==a2[x]){
_21f=true;
break;
}
}
if(!_21f){
_21d=false;
break;
}
}
return _21d;
};
Xinha.arrayFilter=function(a1,_222){
var _223=[];
for(var x=0;x<a1.length;x++){
if(_222(a1[x])){
_223[_223.length]=a1[x];
}
}
return _223;
};
Xinha.uniq_count=0;
Xinha.uniq=function(_225){
return _225+Xinha.uniq_count++;
};
Xinha._loadlang=function(_226){
var url,lang;
if(typeof _editor_lcbackend=="string"){
url=_editor_lcbackend;
url=url.replace(/%lang%/,_editor_lang);
url=url.replace(/%context%/,_226);
}else{
if(_226!="Xinha"){
url=_editor_url+"plugins/"+_226+"/lang/"+_editor_lang+".js";
}else{
url=_editor_url+"lang/"+_editor_lang+".js";
}
}
var _228=Xinha._geturlcontent(url);
if(_228!==""){
try{
eval("lang = "+_228);
}
catch(ex){
alert("Error reading Language-File ("+url+"):\n"+Error.toString());
lang={};
}
}else{
lang={};
}
return lang;
};
Xinha._lc=function(_229,_22a,_22b){
var ret;
var m=null;
if(typeof _229=="string"){
m=_229.match(/\$(.*?)=(.*?)\$/g);
}
if(m){
if(!_22b){
_22b={};
}
for(var i=0;i<m.length;i++){
var n=m[i].match(/\$(.*?)=(.*?)\$/);
_22b[n[1]]=n[2];
_229=_229.replace(n[0],"$"+n[1]);
}
}
if(_editor_lang=="en"){
if(typeof _229=="object"&&_229.string){
ret=_229.string;
}else{
ret=_229;
}
}else{
if(typeof Xinha._lc_catalog=="undefined"){
Xinha._lc_catalog=[];
}
if(typeof _22a=="undefined"){
_22a="Xinha";
}
if(typeof Xinha._lc_catalog[_22a]=="undefined"){
Xinha._lc_catalog[_22a]=Xinha._loadlang(_22a);
}
var key;
if(typeof _229=="object"&&_229.key){
key=_229.key;
}else{
if(typeof _229=="object"&&_229.string){
key=_229.string;
}else{
key=_229;
}
}
if(typeof Xinha._lc_catalog[_22a][key]=="undefined"){
if(_22a=="Xinha"){
if(typeof _229=="object"&&_229.string){
ret=_229.string;
}else{
ret=_229;
}
}else{
return Xinha._lc(_229,"Xinha",_22b);
}
}else{
ret=Xinha._lc_catalog[_22a][key];
}
}
if(typeof _229=="object"&&_229.replace){
_22b=_229.replace;
}
if(typeof _22b!="undefined"){
for(var i in _22b){
ret=ret.replace("$"+i,_22b[i]);
}
}
return ret;
};
Xinha.hasDisplayedChildren=function(el){
var _232=el.childNodes;
for(var i=0;i<_232.length;i++){
if(_232[i].tagName){
if(_232[i].style.display!="none"){
return true;
}
}
}
return false;
};
Xinha._loadback=function(U,C,O,B){
var T=Xinha.is_ie?"onreadystatechange":"onload";
var S=document.createElement("script");
S.type="text/javascript";
S.src=U;
if(C){
S[T]=function(){
if(Xinha.is_ie&&!(/loaded|complete/.test(window.event.srcElement.readyState))){
return;
}
C.call(O?O:this,B);
S[T]=null;
};
}
document.getElementsByTagName("head")[0].appendChild(S);
};
Xinha.collectionToArray=function(_23a){
var _23b=[];
for(var i=0;i<_23a.length;i++){
_23b.push(_23a.item(i));
}
return _23b;
};
if(!Array.prototype.append){
Array.prototype.append=function(a){
for(var i=0;i<a.length;i++){
this.push(a[i]);
}
return this;
};
}
Xinha.makeEditors=function(_23f,_240,_241){
if(typeof _240=="function"){
_240=_240();
}
var _242={};
for(var x=0;x<_23f.length;x++){
var _244=new Xinha(_23f[x],Xinha.cloneObject(_240));
_244.registerPlugins(_241);
_242[_23f[x]]=_244;
}
return _242;
};
Xinha.startEditors=function(_245){
for(var i in _245){
if(_245[i].generate){
_245[i].generate();
}
}
};
Xinha.prototype.registerPlugins=function(_247){
if(_247){
for(var i=0;i<_247.length;i++){
this.setLoadingMessage("Register plugin $plugin","Xinha",{"plugin":_247[i]});
this.registerPlugin(eval(_247[i]));
}
}
};
Xinha.base64_encode=function(_249){
var _24a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var _24b="";
var chr1,chr2,chr3;
var enc1,enc2,enc3,enc4;
var i=0;
do{
chr1=_249.charCodeAt(i++);
chr2=_249.charCodeAt(i++);
chr3=_249.charCodeAt(i++);
enc1=chr1>>2;
enc2=((chr1&3)<<4)|(chr2>>4);
enc3=((chr2&15)<<2)|(chr3>>6);
enc4=chr3&63;
if(isNaN(chr2)){
enc3=enc4=64;
}else{
if(isNaN(chr3)){
enc4=64;
}
}
_24b=_24b+_24a.charAt(enc1)+_24a.charAt(enc2)+_24a.charAt(enc3)+_24a.charAt(enc4);
}while(i<_249.length);
return _24b;
};
Xinha.base64_decode=function(_24f){
var _250="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var _251="";
var chr1,chr2,chr3;
var enc1,enc2,enc3,enc4;
var i=0;
_24f=_24f.replace(/[^A-Za-z0-9\+\/\=]/g,"");
do{
enc1=_250.indexOf(_24f.charAt(i++));
enc2=_250.indexOf(_24f.charAt(i++));
enc3=_250.indexOf(_24f.charAt(i++));
enc4=_250.indexOf(_24f.charAt(i++));
chr1=(enc1<<2)|(enc2>>4);
chr2=((enc2&15)<<4)|(enc3>>2);
chr3=((enc3&3)<<6)|enc4;
_251=_251+String.fromCharCode(chr1);
if(enc3!=64){
_251=_251+String.fromCharCode(chr2);
}
if(enc4!=64){
_251=_251+String.fromCharCode(chr3);
}
}while(i<_24f.length);
return _251;
};
Xinha.removeFromParent=function(el){
if(!el.parentNode){
return;
}
var pN=el.parentNode;
pN.removeChild(el);
return el;
};
Xinha.hasParentNode=function(el){
if(el.parentNode){
if(el.parentNode.nodeType==11){
return false;
}
return true;
}
return false;
};
Xinha.viewportSize=function(_258){
_258=(_258)?_258:window;
var x,y;
if(window.innerHeight){
x=_258.innerWidth;
y=_258.innerHeight;
}else{
if(document.documentElement&&document.documentElement.clientHeight){
x=_258.document.documentElement.clientWidth;
y=_258.document.documentElement.clientHeight;
}else{
if(document.body){
x=_258.document.body.clientWidth;
y=_258.document.body.clientHeight;
}
}
}
return {"x":x,"y":y};
};
Xinha.findPosX=function(obj){
var _25b=0;
if(obj.offsetParent){
while(obj.offsetParent){
_25b+=obj.offsetLeft;
obj=obj.offsetParent;
}
}else{
if(obj.x){
_25b+=obj.x;
}
}
return _25b;
};
Xinha.findPosY=function(obj){
var _25d=0;
if(obj.offsetParent){
while(obj.offsetParent){
_25d+=obj.offsetTop;
obj=obj.offsetParent;
}
}else{
if(obj.y){
_25d+=obj.y;
}
}
return _25d;
};
Xinha.prototype.setLoadingMessage=function(_25e,_25f,_260){
if(!this.config.showLoading||!document.getElementById("loading_sub_"+this._textArea.name)){
return;
}
var elt=document.getElementById("loading_sub_"+this._textArea.name);
elt.innerHTML=Xinha._lc(_25e,_25f,_260);
};
Xinha.prototype.removeLoadingMessage=function(){
if(!this.config.showLoading||!document.getElementById("loading_"+this._textArea.name)){
return;
}
document.body.removeChild(document.getElementById("loading_"+this._textArea.name));
};
Xinha.toFree=[];
Xinha.freeLater=function(obj,prop){
Xinha.toFree.push({o:obj,p:prop});
};
Xinha.free=function(obj,prop){
if(obj&&!prop){
for(var p in obj){
Xinha.free(obj,p);
}
}else{
if(obj){
try{
obj[prop]=null;
}
catch(x){
}
}
}
};
Xinha.collectGarbageForIE=function(){
Xinha.flushEvents();
for(var x=0;x<Xinha.toFree.length;x++){
if(!Xinha.toFree[x].o){
alert("What is "+x+" "+Xinha.toFree[x].o);
}
Xinha.free(Xinha.toFree[x].o,Xinha.toFree[x].p);
Xinha.toFree[x].o=null;
}
};
HTMLArea=Xinha;
Xinha.init();
Xinha.addDom0Event(window,"unload",Xinha.collectGarbageForIE);

