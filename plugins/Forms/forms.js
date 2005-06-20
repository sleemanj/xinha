// Form plugin for HTMLArea
// Distributed under the same terms as HTMLArea itself.
// This notice MUST stay intact for use (see license.txt).


function Forms(editor) {
	this.editor = editor;
	var cfg = editor.config;
	var bl = Forms.btnList;
	var self = this;
	// register the toolbar buttons provided by this plugin
  var toolbar = ["linebreak"];
	for (var i = 0; i < bl.length; ++i) {
		var btn = bl[i];
		if (!btn) {
			toolbar.push("separator");
		} else {
			var id = btn[0];
			cfg.registerButton(id, HTMLArea._lc(btn[1]), editor.imgURL("ed_" + btn[0] + ".gif", "Forms"), false,
					   function(editor, id) {
						   // dispatch button press event
						   self.buttonPress(editor, id);
					   });
			toolbar.push(id);
		}
	}
	// add a new line in the toolbar
	cfg.toolbar.push(toolbar);
};

Forms._pluginInfo = {
  name          : "Forms",
	origin        : "version: 1.0, by Nelson Bright, BrightWork, Inc., http://www.brightworkweb.com",
	version       : "2.0",
	developer     : "Udo Schmal",
	developer_url : "",
	sponsor       : "L.N.Schaffrath NeueMedien",
	sponsor_url   : "http://www.schaffrath-neuemedien.de/",
	c_owner       : "Udo Schmal & Schaffrath-NeueMedien",
	license       : "htmlArea"
};

// the list of buttons added by this plugin
Forms.btnList = [
	// form properties button
  null,			// separator
	["form",        "Form"],
	null,			// separator
	// form elements
	["textarea",    "Textarea"],
	["select",      "Selection Field"],
	["checkbox",    "Checkbox"],
	["radio",       "Radio Button"],
	["text",        "Text Field"],
  ["password",    "Password Field"],
  ["file",        "File Field"],
	["button",      "Button"],
  ["submit",      "Submit Button"],
  ["reset",       "Reset Button"], 
	["image",       "Image Button"],
	["hidden",      "Hidden Field"],
  ["label",       "Label"],
  ["fieldset",    "Field Set"]
	];

Forms.prototype._lc = function(string) {
    return HTMLArea._lc(string, 'Forms');
}

Forms.prototype.onGenerate = function() {
  var style_id = "Form-style"
  var style = this.editor._doc.getElementById(style_id);
  if (style == null) {
    style = this.editor._doc.createElement("link");
    style.id = style_id;
    style.rel = 'stylesheet';
    style.href = _editor_url + 'plugins/Forms/forms.css';
    this.editor._doc.getElementsByTagName("HEAD")[0].appendChild(style);
  }
}

Forms.prototype.buttonPress = function(editor,button_id, node) {
  function optionValues(text,value) {
		this.text = text;
		this.value = value;
	}
  function setAttr(el, attr, value) {
    if (value != "")
      el.setAttribute(attr, value);
    else
      el.removeAttribute(attr);
  }
  var outparam = new Object();
  var type = button_id;
  var sel = editor._getSelection();
  var range = editor._createRange(sel);
  if (button_id=="form") { //Form
  	// see if selection is inside an existing 'form' tag 
	  var pe = editor.getParentElement();
	  var frm = null;
	  while (pe && (pe.nodeType == 1) && (pe.tagName.toLowerCase() != 'body')) {
		  if(pe.tagName.toLowerCase() == "form") {
			  frm = pe;
			  break;
		  } else 
        pe = pe.parentNode;
	  }
	  if (frm) { 
      outparam.f_name = frm.name;
      outparam.f_action = frm.action;
      outparam.f_method = frm.method;
      outparam.f_enctype = frm.enctype;
      outparam.f_target = frm.target;
    } else {;
      outparam.f_name = "";
  	  outparam.f_action = "";
	    outparam.f_method = "";
      outparam.f_enctype = "";
      outparam.f_target = "";
    }
  	editor._popupDialog("plugin://Forms/form", function(param) {
  		if (param) {
	  		if(frm) {
			    frm.name	 = param["f_name"];
          setAttr(frm, "action", param["f_action"]);
          setAttr(frm, "method", param["f_method"]);
          setAttr(frm, "enctype",param["f_enctype"]);
          setAttr(frm, "target", param["f_target"]);
		    } else {
          frm = '<form name="' + param["f_name"] + '"';
          if (param["f_action"] != "") frm += ' action="' + param["f_action"] + '"';
				  if (param["f_method"] != "") frm += ' method="' + param["f_method"] + '"';
          if (param["f_enctype"] != "") frm += ' enctype="' + param["f_enctype"] + '"';
          if (param["f_target"] != "") frm += ' target="' + param["f_target"] + '"';
          frm += '>';
			    editor.surroundHTML(frm, '&nbsp;</form>');
        }
      }
	  }, outparam);
    
  } else { // form element (checkbox, radio, text, password, textarea, select, button, submit, reset, image, hidden)
	  var tagName = "";
	  // see if selection is an form element
	  if (typeof node == "undefined") {
		  node = editor.getParentElement();
		  var tag = node.tagName.toLowerCase()
		  if (node && !(tag == "textarea" || tag == "select" || tag == "input" || tag == "label" || tag == "fieldset"))
			  node = null;
	  }

	  if(node) {
		  type = node.tagName.toLowerCase();
      outparam.f_name = node.name;
      tagName = node.tagName;
      if (type == "input") {
        outparam.f_type = node.type;
        type = node.type;
      }
      switch (type) {
        case "textarea":
    		  outparam.f_cols = node.cols;
				  outparam.f_rows = node.rows;
				  outparam.f_value = node.innerHTML;
          outparam.f_wrap = node.getAttribute("wrap");
          outparam.f_readonly = node.getAttribute("readonly");
          outparam.f_disabled = node.getAttribute("disabled");
          outparam.f_tabindex = node.getAttribute("tabindex");
          outparam.f_accesskey = node.getAttribute("accesskey");
			    break;
        case "select":
			    outparam.f_size = parseInt(node.size);
				  outparam.f_multiple = node.getAttribute("multiple");
          outparam.f_disabled = node.getAttribute("disabled");
          outparam.f_tabindex = node.getAttribute("tabindex");
          var a_options = new Array(); 
			    for (var i=0; i<=node.options.length-1; i++) {
            a_options[i] = new optionValues(node.options[i].text, node.options[i].value);
			    };
			    outparam.f_options = a_options;
				  break;
			  case "text":
			  case "password":
				  outparam.f_value = node.value;
					outparam.f_size = node.size;
					outparam.f_maxlength = node.maxLength;
          outparam.f_readonly = node.getAttribute("readonly");
          outparam.f_disabled = node.getAttribute("disabled");
          outparam.f_tabindex = node.getAttribute("tabindex");
          outparam.f_accesskey = node.getAttribute("accesskey");
					break;
				case "hidden":
          outparam.f_value = node.value;
          break;
				case "submit":
				case "reset":
				  outparam.f_value = node.value;
          outparam.f_disabled = node.getAttribute("disabled");
          outparam.f_tabindex = node.getAttribute("tabindex");
          outparam.f_accesskey = node.getAttribute("accesskey");
				  break;
				case "checkbox":
				case "radio": 
				  outparam.f_value = node.value;
		  		outparam.f_checked = node.checked;
          outparam.f_disabled = node.getAttribute("disabled");
          outparam.f_tabindex = node.getAttribute("tabindex");
          outparam.f_accesskey = node.getAttribute("accesskey");
			   	break;
				case "button": 
				  outparam.f_value = node.value;
					outparam.f_onclick = node.getAttribute("onclick");
          outparam.f_disabled = node.getAttribute("disabled");
          outparam.f_tabindex = node.getAttribute("tabindex");
          outparam.f_accesskey = node.getAttribute("accesskey");
				  break;
				case "image":
				  outparam.f_value = node.value;
					outparam.f_src = node.src;
          outparam.f_disabled = node.getAttribute("disabled");
          outparam.f_tabindex = node.getAttribute("tabindex");
          outparam.f_accesskey = node.getAttribute("accesskey");
				  break;
        case "file":
          outparam.f_disabled = node.getAttribute("disabled");
          outparam.f_tabindex = node.getAttribute("tabindex");
          outparam.f_accesskey = node.getAttribute("accesskey");
				  break;
        case "label":
          outparam.f_text = node.innerHTML;
          outparam.f_for = node.getAttribute("for");
          outparam.f_accesskey = node.getAttribute("accesskey");
          break;
        case "fieldset":
          if(node.firstChild.tagName.toLowerCase()=="legend")
            outparam.f_legend = node.firstChild.innerHTML;
          else
            outparam.f_legend = "";
          break;
      }    
		} else {
      outparam.f_name = "";
      switch (button_id) {
        case "textarea":
        case "select":
        case "label":
        case "fieldset":
          tagName = button_id;
          break;
        default:
          tagName = "input";
          outparam.f_type = button_id;
          break;
      }
      outparam.f_options = "";
      outparam.f_cols = "20";
		  outparam.f_rows = "4";
		  outparam.f_multiple = "false";
     	outparam.f_value = "";
		  outparam.f_size = "";
		  outparam.f_maxlength = "";
		  outparam.f_checked = "";
		  outparam.f_src = "";
		  outparam.f_onclick = "";
      outparam.f_wrap = "";
      outparam.f_readonly = "false";
      outparam.f_disabled = "false";
      outparam.f_tabindex = "";
      outparam.f_accesskey = "";
      outparam.f_for = "";
      outparam.f_text = "";
      outparam.f_legend = "";
	  };
  	editor._popupDialog("plugin://Forms/" + tagName + ".html", function(param) {
	  	if (param) {
		  	if(node) {
			    //node.name = param["f_name"];
          setAttr(node, "name", param["f_name"]);
			    if (type == "textarea") {
            if (isNaN(parseInt(param["f_cols"],10)) || parseInt(param["f_cols"],10) <= 0)
              param["f_cols"] = "";
            setAttr(node, "cols", param["f_cols"]);
            if(isNaN(parseInt(param["f_rows"],10)) || parseInt(param["f_rows"],10) <= 0)
              param["f_rows"] = "";
					  setAttr(node, "rows", param["f_rows"]);
				    setAttr(node, "value", param["f_value"]); //for ta in editor
            setAttr(node, "wrap", param["f_wrap"]);
            setAttr(node, "tabindex", param["f_tabindex"]);
            setAttr(node, "accesskey", param["f_accesskey"]);
            setAttr(node, "readonly", param["f_readonly"]);
            setAttr(node, "disabled", param["f_disabled"]);
            node.innerHTML = param["f_value"]; //for ta on web page
			    } else if(type == "select") {
				    if(isNaN(parseInt(param["f_size"],10)) || parseInt(param["f_size"],10) <= 0)
              param["f_size"] = "";
            setAttr(node, "size", param["f_size"]);
					  setAttr(node, "multiple" ,param["f_multiple"]);
            setAttr(node, "disabled", param["f_disabled"]);
            setAttr(node, "tabindex", param["f_tabindex"]);
            node.options.length = 0;
				    var optionsList =  param["f_options"];
				    for (i=0; i<= optionsList.length-1; i++) {
					    node.options[i] = new Option(optionsList[i].text, optionsList[i].value)
				    }
			    } else if(type == "label") {
				    setAttr(node, "for", param["f_for"]);
					  setAttr(node, "accesskey" ,param["f_accesskey"]);
            node.innerHTML = param["f_text"];
          } else if(type == "fieldset") {
            if(outparam.f_legend != "")
				      if(node.firstChild.tagName.toLowerCase()=="legend")
                node.firstChild.innerHTML = param["f_legend"];
              else {
                // not implemented jet
              }
          } else {  //type == "input"
				    for (field in param) {
					    switch (field) {
                case "f_tabindex": setAttr(node, "tabindex", param["f_tabindex"]); break;
                case "f_accesskey": setAttr(node, "accesskey", param["f_accesskey"]); break;
                case "f_readonly": setAttr(node, "readonly", param["f_readonly"]); break;
                case "f_disabled": setAttr(node, "disabled", param["f_disabled"]); break;
						    case "f_type": node.type = param["f_type"]; break;
						    case "f_value": setAttr(node,"value", param["f_value"]); break;
						    case "f_size": 
							    if(isNaN(parseInt(param["f_size"],10)) || parseInt(param["f_size"],10) <= 0)
                    param["f_size"] = "";
								  setAttr(node, "size", param["f_size"]); break;
						    case "f_maxlength":
							    if(isNaN(parseInt(param["f_maxlength"],10)) || parseInt(param["f_maxlength"],10) <= 0)
                    param["f_maxlength"] = "";
								  setAttr(node, "maxLength", param["f_maxlength"]); break;
						    case "f_checked": setAttr(node, "checked", param["f_checked"]); break;
						    case "f_src": setAttr(node, "src", param["f_src"]); break;
						    case "f_onclick": setAttr(node, "onclick", param["f_onclick"]); 
                     node.onclick = "";
							       if(param["f_onclick"]!="") {
								       node.onclick = param["f_onclick"];
							       } break;
					    }
				    }
			    }
        } else {
			    if(type == "textarea") {
				    text = '<textarea name="' + param["f_name"] + '"' +
				                    ' cols="' + param["f_cols"] + '"' +
  				                  ' rows="' + param["f_rows"] + '"';
            if (param["f_wrap"] != "") text += ' wrap="' + param["f_wrap"] + '"';
            if (param["f_tabindex"] != "") text += ' tabindex="' + param["f_tabindex"] + '"';
            if (param["f_accesskey"] != "") text += ' accesskey="' + param["f_accesskey"] + '"';
            if (param["f_readonly"] == "true") text += ' readonly="true"'; //don't know why ="true"
            if (param["f_disabled"] == "true") text += ' disabled="true"'; //don't know why ="true"
            text += '>' + param["f_value"] + '</textarea>';
			    } else if(type == "select") {
				    text = '<select name="'+param["f_name"]+'"';
				    if (param["f_size"]) text += ' size="'+parseInt(param["f_size"],10)+'"';
				    if (param["f_tabindex"] != "") text += ' tabindex="' + param["f_tabindex"] + '"';
            if (param["f_multiple"] == "true") text += ' multiple="true"'; //don't know why ="true"
            if (param["f_disabled"] == "true") text += ' disabled="true"'; //don't know why ="true"
				    text += '>';
				    var optionsList =  param["f_options"];
				    for (i=0; i<= optionsList.length-1; i++) {
					    text += '<option value="'+optionsList[i].value+'">'+optionsList[i].text+'</option>';
				    }
				    text += '</select>';
          } else if(type == "label") {
            text = '<label';
            if (param["f_for"] != "") text += ' for="'+param["f_for"]+'"';
            if (param["f_accesskey"] != "") text += ' accesskey="' + param["f_accesskey"] + '"';					  
            text += '>' + param["f_text"] + '</label>';
          } else if(type == "fieldset") {
            text = '<fieldset>';
            if (param["f_legend"] != "") text += '<legend>' + param["f_legend"] + '</legend>';
				    text += '</fieldset>';
			    } else {
				    text = '<input type="'+type+'"' +
				           ' name="'+param["f_name"]+'"';
				    for (field in param) {
					    var value = param[field];
					    if (!value) continue;
					    switch (field) {
						    case "f_value": if (param["f_value"] != "") text += ' value="'+param["f_value"]+'"'; break;
						    case "f_size": if (param["f_size"] != "") text += ' size="'+parseInt(param["f_size"],10)+'"'; break;
						    case "f_maxlength": if (param["f_maxlength"] != "") text += ' maxlength="'+parseInt(param["f_maxlength"],10)+'"'; break;
						    case "f_checked": if (param["f_checked"] == "true") text += ' checked'; break;
						    case "f_src": if (param["f_src"] != "") text += ' src="'+param["f_src"]+'"'; break;
						    case "f_onclick": if (param["f_onclick"] != "") text += ' onClick="'+param["f_onclick"]+'"'; break;
                case "f_tabindex": if (param["f_tabindex"] != "") text += ' tabindex="'+param["f_tabindex"]+'"'; break;
                case "f_accesskey": if (param["f_accesskey"] != "") text += ' accesskey="'+param["f_accesskey"]+'"';
                case "f_readonly": if (param["f_readonly"] == "true") text += ' readonly="true"'; //don't know why ="true"
                case "f_disabled": if (param["f_disabled"] == "true") text += ' disabled="true"'; break;//don't know why ="true"
					    }
				    }
				    text += '>';
			    }
	        editor.insertHTML(text);
        }
      }
	  }, outparam);
  }  
};
