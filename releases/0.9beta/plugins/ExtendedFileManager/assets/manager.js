function comboSelectValue(c,_2){
var _3=c.getElementsByTagName("option");
for(var i=_3.length;--i>=0;){
var op=_3[i];
op.selected=(op.value==_2);
}
c.value=_2;
}
function i18n(_6){
return HTMLArea._lc(_6,"ExtendedFileManager");
}
function setAlign(_7){
var _8=document.getElementById("f_align");
for(var i=0;i<_8.length;i++){
if(_8.options[i].value==_7){
_8.selectedIndex=i;
break;
}
}
}
function onTargetChanged(){
var f=document.getElementById("f_other_target");
if(this.value=="_other"){
f.style.visibility="visible";
f.select();
f.focus();
}else{
f.style.visibility="hidden";
}
}
if(manager_mode=="link"){
var offsetForInputs=(HTMLArea.is_ie)?155:140;
}else{
var offsetForInputs=(HTMLArea.is_ie)?220:200;
}
init=function(){
var h=100+250+offsetForInputs;
__dlg_init(null,{width:650,height:h});
__dlg_translate("ExtendedFileManager");
var _c=document.getElementById("uploadForm");
if(_c){
_c.target="imgManager";
}
if(manager_mode=="image"&&typeof colorPicker!="undefined"&&document.getElementById("bgCol_pick")){
var _d=document.getElementById("bgCol_pick");
var _e=document.getElementById("f_backgroundColor");
var _f=new colorPicker({cellsize:"5px",callback:function(_10){
_e.value=_10;
}});
_d.onclick=function(){
_f.open("top,right",_e);
};
var _11=document.getElementById("bdCol_pick");
var _12=document.getElementById("f_borderColor");
var _13=new colorPicker({cellsize:"5px",callback:function(_14){
_12.value=_14;
}});
_11.onclick=function(){
_13.open("top,right",_12);
};
}
var _15=window.dialogArguments;
if(manager_mode=="image"&&_15){
var _16=new RegExp("^https?://");
if(_15.f_url.length>0&&!_16.test(_15.f_url)&&typeof _15.baseHref=="string"){
_15.f_url=_15.baseHref+_15.f_url;
}
var _17=new RegExp("(https?://[^/]*)?"+base_url.replace(/\/$/,""));
_15.f_url=_15.f_url.replace(_17,"");
var rd=_resized_dir.replace(HTMLArea.RE_Specials,"\\$1");
var rp=_resized_prefix.replace(HTMLArea.RE_Specials,"\\$1");
var _1a=new RegExp("^(.*/)"+rd+"/"+rp+"_([0-9]+)x([0-9]+)_([^/]+)$");
if(_1a.test(_15.f_url)){
_15.f_url=RegExp.$1+RegExp.$4;
_15.f_width=RegExp.$2;
_15.f_height=RegExp.$3;
}
document.getElementById("f_url").value=_15["f_url"];
document.getElementById("f_alt").value=_15["f_alt"];
document.getElementById("f_title").value=_15["f_title"];
document.getElementById("f_border").value=_15["f_border"];
document.getElementById("f_width").value=_15["f_width"];
document.getElementById("f_height").value=_15["f_height"];
document.getElementById("f_margin").value=_15["f_margin"];
document.getElementById("f_padding").value=_15["f_padding"];
document.getElementById("f_borderColor").value=_15["f_borderColor"];
document.getElementById("f_backgroundColor").value=_15["f_backgroundColor"];
setAlign(_15["f_align"]);
document.getElementById("f_url").focus();
document.getElementById("orginal_width").value=_15["f_width"];
document.getElementById("orginal_height").value=_15["f_height"];
var _1a=new RegExp("^(.*/)([^/]+)$");
if(_1a.test(_15["f_url"])){
changeDir(RegExp.$1);
var _1b=document.getElementById("dirPath");
for(var i=0;i<_1b.options.length;i++){
if(_1b.options[i].value==encodeURIComponent(RegExp.$1)){
_1b.options[i].selected=true;
break;
}
}
}
document.getElementById("f_preview").src=_backend_url+"__function=thumbs&img="+_15.f_url;
}else{
if(manager_mode=="link"&&_15){
var _1d=document.getElementById("f_target");
var _1e=true;
var _16=new RegExp("^https?://");
if(_15.f_href.length>0&&!_16.test(_15.f_href)&&typeof _15.baseHref=="string"){
_15.f_href=_15.baseHref+_15.f_href;
}
var _1f=new RegExp("(https?://[^/]*)?"+base_url.replace(/\/$/,""));
_15.f_href=_15.f_href.replace(_1f,"");
var _20;
var _1a=new RegExp("^(.*/)([^/]+)$");
if(_1a.test(_15["f_href"])){
_20=RegExp.$1;
}else{
_20=document.cookie.match(/EFMStartDirlink=(.*?)(;|$)/);
if(_20){
_20=_20[1];
}
}
if(_20){
changeDir(_20);
var _1b=document.getElementById("dirPath");
for(var i=0;i<_1b.options.length;i++){
if(_1b.options[i].value==encodeURIComponent(RegExp.$1)){
_1b.options[i].selected=true;
break;
}
}
}
if(_15){
if(typeof _15["f_usetarget"]!="undefined"){
_1e=_15["f_usetarget"];
}
if(typeof _15["f_href"]!="undefined"){
document.getElementById("f_href").value=_15["f_href"];
document.getElementById("f_title").value=_15["f_title"];
comboSelectValue(_1d,_15["f_target"]);
if(_1d.value!=_15.f_target){
var opt=document.createElement("option");
opt.value=_15.f_target;
opt.innerHTML=opt.value;
_1d.appendChild(opt);
opt.selected=true;
}
}
}
if(!_1e){
document.getElementById("f_target_label").style.visibility="hidden";
document.getElementById("f_target").style.visibility="hidden";
document.getElementById("f_target_other").style.visibility="hidden";
}
var opt=document.createElement("option");
opt.value="_other";
opt.innerHTML=i18n("Other");
_1d.appendChild(opt);
_1d.onchange=onTargetChanged;
document.getElementById("f_href").focus();
}else{
if(!_15){
var _20=document.cookie.match(new RegExp("EFMStartDir"+manager_mode+"=(.*?)(;|$)"));
if(_20){
_20=_20[1];
changeDir(_20);
var _1b=document.getElementById("dirPath");
for(var i=0;i<_1b.options.length;i++){
if(_1b.options[i].value==encodeURIComponent(_20)){
_1b.options[i].selected=true;
break;
}
}
}
}
}
}
};
function pasteButton(_22){
var _23=document.getElementById("pasteBtn");
if(!_23.firstChild){
var a=document.createElement("a");
a.href="javascript:void(0);";
var img=document.createElement("img");
img.src=window.opener._editor_url+"plugins/ExtendedFileManager/img/edit_paste.gif";
img.alt=i18n("Paste");
a.appendChild(img);
_23.appendChild(a);
}
_23.onclick=function(){
if(typeof imgManager!="undefined"){
imgManager.paste(_22);
}
if(_22.action=="moveFile"||_22.action=="moveDir"){
this.onclick=null;
this.removeChild(this.firstChild);
}
};
switch(_22.action){
case "copyFile":
_23.firstChild.title=i18n("Copy \"$file="+_22.file+"$\" from \"$dir="+decodeURIComponent(_22.dir)+"$\" here");
break;
case "copyDir":
_23.firstChild.title=i18n("Copy folder \"$file="+_22.file+"$\" from \"$dir="+decodeURIComponent(_22.dir)+"$\" here");
break;
case "moveFile":
_23.firstChild.title=i18n("Move \"$file="+_22.file+"$\" from \"$dir="+decodeURIComponent(_22.dir)+"$\" here");
break;
break;
case "moveDir":
_23.firstChild.title=i18n("Move folder \"$file="+_22.file+"$\" from \"$dir="+decodeURIComponent(_22.dir)+"$\" here");
break;
}
}
function onCancel(){
__dlg_close(null);
return false;
}
function onOK(){
if(manager_mode=="image"){
var _26=["f_url","f_alt","f_title","f_align","f_border","f_margin","f_padding","f_height","f_width","f_borderColor","f_backgroundColor"];
var _27=new Object();
for(var i in _26){
var id=_26[i];
var el=document.getElementById(id);
if(id=="f_url"&&el.value.indexOf("://")<0&&el.value){
_27[id]=makeURL(base_url,el.value);
}else{
_27[id]=el.value;
}
}
var _2b={w:document.getElementById("orginal_width").value,h:document.getElementById("orginal_height").value};
if((_2b.w!=_27.f_width)||(_2b.h!=_27.f_height)){
var _2c=HTMLArea._geturlcontent(window.opener._editor_url+"plugins/ExtendedFileManager/"+_backend_url+"&__function=resizer&img="+encodeURIComponent(document.getElementById("f_url").value)+"&width="+_27.f_width+"&height="+_27.f_height);
_2c=eval(_2c);
if(_2c){
_27.f_url=makeURL(base_url,_2c);
}
}
__dlg_close(_27);
return false;
}else{
if(manager_mode=="link"){
var _2d={};
for(var i in _2d){
var el=document.getElementById(i);
if(!el.value){
alert(_2d[i]);
el.focus();
return false;
}
}
var _26=["f_href","f_title","f_target"];
var _27=new Object();
for(var i in _26){
var id=_26[i];
var el=document.getElementById(id);
if(id=="f_href"&&el.value.indexOf("://")<0){
_27[id]=makeURL(base_url,el.value);
}else{
_27[id]=el.value;
}
}
if(_27.f_target=="_other"){
_27.f_target=document.getElementById("f_other_target").value;
}
__dlg_close(_27);
return false;
}
}
}
function makeURL(_2e,_2f){
if(_2e.substring(_2e.length-1)!="/"){
_2e+="/";
}
if(_2f.charAt(0)=="/"){
}
_2f=_2f.substring(1);
return _2e+_2f;
}
function updateDir(_30){
var _31=_30.options[_30.selectedIndex].value;
changeDir(_31);
}
function goUpDir(){
var _32=document.getElementById("dirPath");
var _33=_32.options[_32.selectedIndex].text;
if(_33.length<2){
return false;
}
var _34=_33.split("/");
var _35="";
for(var i=0;i<_34.length-2;i++){
_35+=_34[i]+"/";
}
for(var i=0;i<_32.length;i++){
var _37=_32.options[i].text;
if(_37==_35){
_32.selectedIndex=i;
var _38=_32.options[i].value;
changeDir(_38);
break;
}
}
}
function changeDir(_39){
if(typeof imgManager!="undefined"){
imgManager.changeDir(_39);
}
}
function updateView(){
refresh();
}
function toggleConstrains(_3a){
var _3b=document.getElementById("imgLock");
var _3a=document.getElementById("constrain_prop");
if(_3a.checked){
_3b.src="img/locked.gif";
checkConstrains("width");
}else{
_3b.src="img/unlocked.gif";
}
}
function checkConstrains(_3c){
var _3d=document.getElementById("constrain_prop");
if(_3d.checked){
var obj=document.getElementById("orginal_width");
var _3f=parseInt(obj.value);
var obj=document.getElementById("orginal_height");
var _40=parseInt(obj.value);
var _41=document.getElementById("f_width");
var _42=document.getElementById("f_height");
var _43=parseInt(_41.value);
var _44=parseInt(_42.value);
if(_3f>0&&_40>0){
if(_3c=="width"&&_43>0){
_42.value=parseInt((_43/_3f)*_40);
}
if(_3c=="height"&&_44>0){
_41.value=parseInt((_44/_40)*_3f);
}
}
}
}
function showMessage(_45){
var _46=document.getElementById("message");
var _47=document.getElementById("messages");
if(_46.firstChild){
_46.removeChild(_46.firstChild);
}
_46.appendChild(document.createTextNode(i18n(_45)));
_47.style.display="block";
}
function addEvent(obj,_49,fn){
if(obj.addEventListener){
obj.addEventListener(_49,fn,true);
return true;
}else{
if(obj.attachEvent){
var r=obj.attachEvent("on"+_49,fn);
return r;
}else{
return false;
}
}
}
function doUpload(){
var _4c=document.getElementById("uploadForm");
if(_4c){
showMessage("Uploading");
}
}
function refresh(){
var _4d=document.getElementById("dirPath");
updateDir(_4d);
}
function newFolder(){
var _4e=prompt(i18n("Please enter name for new folder..."),i18n("Untitled"));
var _4f=document.getElementById("dirPath");
var dir=_4f.options[_4f.selectedIndex].value;
if(_4e==thumbdir){
alert(i18n("Invalid folder name, please choose another folder name."));
return false;
}
if(_4e&&_4e!=""&&typeof imgManager!="undefined"){
imgManager.newFolder(dir,encodeURI(_4e));
}
}
function resize(){
var win=HTMLArea.viewportSize(window);
document.getElementById("imgManager").style.height=win.y-150-offsetForInputs+"px";
return true;
}
addEvent(window,"load",init);
addEvent(window,"resize",resize);

