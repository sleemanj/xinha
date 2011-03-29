/*
	Milkbox v3.0 - required: mootools.js v1.3 core + more (see the relative js file for details about used modules)

	by Luca Reghellin (http://www.reghellin.com) Dicember 2010, MIT-style license.
	Inspiration Lokesh Dhakar (http://www.lokeshdhakar.com/projects/lightbox2/)
	AND OF COURSE, SPECIAL THANKS TO THE MOOTOOLS DEVELOPERS AND DEVELOPERS HELPING ALL AROUND THE WORLD
*/


//Class: Milkbox (singleton)
(function(){

var milkbox_singleton = null;

this.Milkbox = new Class({

	Implements:[Options,Events],

	options:{//set all the options here
		overlayOpacity:0.7,
		marginTop:50,
		initialWidth:250,
		initialHeight:250,
		fileboxBorderWidth:'0px',
		fileboxBorderColor:'#000000',
		fileboxPadding:'0px',
		resizeDuration:.5,
		resizeTransition:'sine:in:out',/*function (ex. Transitions.Sine.easeIn) or string (ex. 'bounce:out')*/
		autoPlay:false,
		autoPlayDelay:7,
		removeTitle:true,
		autoSize:true,
		autoSizeMaxHeight:0,//only if autoSize==true
		centered:false,
		imageOfText:'of',
		onXmlGalleries:function(){},
		onClosed:function(){},
		onFileReady:function(){}
	},

	initialize: function(options){
		if (milkbox_singleton) return milkbox_singleton;
		milkbox_singleton = this;

		this.setOptions(options);
		this.autoPlayBkup = { autoPlayDelay:this.options.autoPlayDelay, autoPlay:this.options.autoPlay };
		this.fullOptionsBkup = {};
		this.galleries = [];
		this.formElements = [];
		this.activated;
		this.busy = false;
		this.paused = false;
		this.closed = true;
		this.intId;
		this.loadCheckerId;
		this.externalGalleries = [];
		this.singlePageLinkId = 0;

		this.currentIndex;
		this.currentGallery;
		this.fileReady;
		this.loadedImages = [];
		this.currentFile;

		this.display;

		this.getPageGalleries();
		if(this.galleries.length != 0){ this.prepare(true); }
	},

	prepare:function(checkForm){
		if(checkForm){ this.checkFormElements(); }
		this.prepareHTML();
		this.prepareEventListeners();
		this.activated = true;
	},

	//utility
	open:function(gallery,index){
		if(!this.activated){ this.prepare(true); }

		var i = (index != undefined) ? index : 0;
		var g = (instanceOf(gallery,MilkboxGallery)) ? gallery : this.getGallery(gallery);
		if(!g) return;

		this.closed = false;
		var item = g.get_item(index);
		if(!item) return;

		this.currentGallery = g;
		this.currentIndex = index;

		this.hideFormElements();

		this.display.set_mode(this.currentGallery.type);
		this.display.appear();


		if(this.options.autoPlay || g.options.autoplay){ this.startAutoPlay(true); }

		this.loadFile(item,this.getPreloads());
	},


	//utility
	close:function(hideDisplay){
		if(hideDisplay){ this.display.disappear(); }
		this.showFormElements();
		this.pauseAutoPlay();
		this.stopLoadingCheck();
		this.currentGallery = null;
		this.currentIndex = null;
		this.currentFile = null;
		this.busy = false;
		this.paused = false;
		this.fileReady = false;
		this.closed = true;
		this.fireEvent('close');
	},

	startAutoPlay:function(opening){
		var d = this.currentGallery.options.autoplay_delay || this.options.autoPlayDelay;
		if(d < this.options.resizeDuration*2){ d = this.options.resizeDuration*2 };

		var f = function(){
			this.removeEvent('fileReady',f);
			this.intId = this.navAux.periodical(d*1000,this,[null,'next']);
		}

		if(opening){
			this.addEvent('fileReady',f);
		} else {
			this.intId = this.navAux.periodical(d*1000,this,[null,'next']);
		}

		this.paused = false;
	},

	pauseAutoPlay:function(){
		if(this.intId){
			clearInterval(this.intId);
			this.intId = null;
		}

		this.paused = true;
	},

	//utility
	//list:Array of objects or an object > [ { gallery:'gall1', autoplay:true, delay:6 } ]
	//to permanently define autoplay options for any gallery
	setAutoPlay:function(list){
		var l = (typeOf(list) == 'object') ? [list] : list;
		l.each(function(item){
			var g = this.getGallery(item.gallery);
			if(!g){ return; }
			var a = (item.autoplay == true) ? item.autoplay : false;
			var d = (item.delay && a) ? item.delay : this.options.autoPlayDelay;
			g.setOptions({ autoplay:a, autoplay_delay:d }).refresh();
		},this);
	},


	//utility
	//{href:'file1.jpg',size:'width:900,height:100', title:'text'}
	//show a file on the fly without gallery functionalities
	openWithFile:function(file){
		var g = new MilkboxGallery([file]);
		this.open(g,0);
	},

	getPreloads:function(){
		var items = this.currentGallery.items;
		var index = this.currentIndex;
		if(items.length == 1) return null;

		var next = (index != items.length-1) ? items[index+1] : items[0];
		var prev = (index != 0) ? items[index-1] : items[items.length-1];
		var preloads = (prev == next) ? [prev] : [prev,next]; //if gallery.length == 2, then prev == next
		return preloads;
	},

	//LOADING
	loadFile:function(fileObj,preloads){

		this.fileReady = false;
		this.display.clear_content();
		this.display.hide_bottom();

		if(this.checkFileType(fileObj,'swf')){
			this.loadSwf(fileObj);
		} else if (this.checkFileType(fileObj,'html')){
			this.loadHtml(fileObj);
		} else {//filetype:image
			this.loadImage(fileObj);
		}

		if(!this.checkFileType(fileObj,'swf')) this.startLoadingCheck();
		if(preloads){ this.preloadFiles(preloads); }
	},

	//to prevent the loader to show if the file is cached
	startLoadingCheck:function(){
		var t = 0;
		this.loadCheckerId = (function(){
			t+=1;
			if(t > 5){
				this.display.show_loader();
				this.stopLoadingCheck();
			}
		}).periodical(100,this);
	},

	stopLoadingCheck:function(){
		clearInterval(this.loadCheckerId);
	},

	preloadFiles:function(preloads){
		preloads.each(function(fileObj,index){
			if(!this.checkFileType(fileObj,"swf") && !this.checkFileType(fileObj,"html")){
				this.preloadImage(fileObj.href);
			}
		},this);
	},

	preloadImage:function(file){
		if(!this.loadedImages.contains(file)){
			var imageAsset = new Asset.image(file, {
				onLoad:function(){
					this.loadedImages.push(file);
				}.bind(this)
			});
		}
	},

	loadImage:function(fileObj){
		var file = fileObj.href;
		var imageAsset = new Asset.image(file, {
			onLoad:function(img){
				if(!this.loadedImages.contains(file)){ this.loadedImages.push(file); };//see next/prev events
				this.loadComplete(img,fileObj.caption);
			}.bind(this)
		});
	},

	loadSwf:function(fileObj){
		var swfObj = new Swiff(fileObj.href,{
			width:fileObj.size.width,
			height:fileObj.size.height,
			vars:fileObj.vars,
			params:{ wMode:'opaque', swLiveConnect:'false' }
		});

		this.loadComplete($(swfObj),fileObj.caption);
	},

	loadHtml:function(fileObj){

		var query = (fileObj.vars) ? Object.toQueryString(fileObj.vars) : '';

		var iFrame = new Element('iframe',{
			src:fileObj.href+'?'+query,
			styles:{
				'border-style':'solid',
				'border-width':'0px'
			}
		});

		if(fileObj.size){
			iFrame.set({
				'width':fileObj.size.width,
				'height':fileObj.size.height
			});
		}

		this.loadComplete(iFrame,fileObj.caption);
	},//loadHtml


	//LOAD COMPLETE ********//
	loadComplete:function(file,caption){

		if(this.closed) return;//if an onload event were still running

		this.fileReady = true;//the file is loaded and ready to be showed (see next_prev_aux())
		this.stopLoadingCheck();
		this.currentFile = file;

		var timer = (function(){
			if(this.display.ready){
				this.display.show_file(file,caption,this.currentIndex+1,this.currentGallery.items.length);
				clearInterval(timer);
			}
		}).periodical(100,this);

		this.fireEvent('fileReady');
	},//end loadComplete

	checkFileType:function(file,type){
		var href = (typeOf(file) != 'string') ? file.href : file;
		var regexp = new RegExp("\.("+type+")$","i");
		return href.split('?')[0].test(regexp);
	},

	//GALLERIES
	getPageGalleries:function(){
		var names = [];
		var links = $$('a[data-milkbox]');

		//check names
		links.each(function(link){
			var name = link.get('data-milkbox');
			if(name == 'single'){
				this.galleries.push(new MilkboxGallery(link,{name:'single'+this.singlePageLinkId++}));
			} else if(!names.contains(name)){
				names.push(name);
			}
		},this);

		names.each(function(name){
			this.galleries.push(new MilkboxGallery($$('a[data-milkbox='+name+']'),{ name:name }));
		},this);

		//set default autoplay // override with setAutoPlay
		if(this.options.autoPlay){
			this.galleries.each(function(g){ g.setOptions({autoplay:this.options.autoPlay,autoplay_delay:this.options.autoPlayDelay}); });
		}

		//console.log(this.galleries);
	},//getPageGalleries

	reloadPageGalleries:function(){
		//reload page galleries
		this.removePageGalleryEvents();

		this.galleries = this.galleries.filter(function(gallery){
			if(!gallery.external) gallery.clear();
			return gallery.external;
		});

		this.getPageGalleries();
		this.addPageGalleriesEvents();

		if(!this.activated){ this.prepare(true); }
	},//end reloadPageGalleries

	//list: optional. Can be a single string/object or an array of strings/objects
	resetExternalGalleries:function(list){
		this.galleries = this.galleries.filter(function(gallery){
			if(gallery.external) gallery.clear();
			return !gallery.external;
		});

		if(!list) return;
		var array = (typeOf(list) == 'array') ? list : [list];
		array.each(function(data){ this.addGalleries(data); }, this);
	},

	//utility
	addGalleries:function(data){
		if(!this.activated){ this.prepare(true); }
		if (typeOf(data) == 'string' && data.split('?')[0].test(/\.(xml)$/i)) {
			this.loadXml(data);
		} else {//array or object
			this.setObjectGalleries(data);
		}
		if(!this.activated){ this.prepare(true); }
	},

	loadXml:function(xmlfile){
		var r = new Request({
			method:'get',
			autoCancel:true,
			url:xmlfile,
			onRequest:function(){
				//placeholder
			}.bind(this),
			onSuccess:function(text,xml){
				var t = text.replace(/(<a.+)\/>/gi,"$1></a>");
				this.setXmlGalleries(new Element('div',{ html:t }));
			}.bind(this),
			onFailure:function(transport){ alert('Milkbox :: loadXml: XML file path error or local Ajax test: please test xml galleries on-line'); }
		}).send();
	},

	setXmlGalleries:function(container){
		var c = container;
		var xml_galleries = c.getElements('.gallery');
		var links;
		var aplist = [];
		xml_galleries.each(function(xml_gallery,i){

			var options = {
				name:xml_gallery.getProperty('name'),
				autoplay:Boolean(xml_gallery.getProperty('autoplay')),
				autoplay_delay:Number(xml_gallery.getProperty('autoplay_delay'))
			}

			var links = xml_gallery.getChildren('a').map(function(tag){
				return { href:tag.href, size:tag.get('data-milkbox-size'), title:tag.get('title') }
			},this);

			this.galleries.push(new MilkboxGallery(links,options));
		},this);

		this.fireEvent('xmlGalleries');
	},//end setXmlGalleries

	//[{ name:'gall1', autoplay:true, autoplay_delay:7, files:[{href:'file1.jpg',size:'width:900,height:100', title:'text'},{href:'file2.html',size:'w:800,h:200', title:'text'}] },{...},{...}]
	setObjectGalleries:function(data){
		var array = (typeOf(data) == 'array') ? data : [data];
		array.each(function(newobj){
			var options = {
				name:newobj.name,
				autoplay:newobj.autoplay,
				autoplay_delay:newobj.autoplay_delay
			}
			this.galleries.push(new MilkboxGallery(newobj.files,options));
		},this);
	},

	//utility
	getGallery:function(name){
		var g = this.galleries.filter(function(gallery){ return gallery.name == name; },this);
		return g[0] || null;
	},

	//HTML
	prepareHTML:function(){
		this.display = new MilkboxDisplay({
			init_width:this.options.initialWidth,
			init_height:this.options.initialHeight,
			overlay_opacity:this.options.overlayOpacity,
			margin_top:this.options.marginTop,
			filebox_border_color:this.options.fileboxBorderColor,
			filebox_padding:this.options.fileboxPadding,
			resize_duration:this.options.resizeDuration,
			resize_transition:this.options.resizeTransition,
			centered:this.options.centered,
			auto_size:this.options.autoSize,
			autosize_max_height:this.options.autoSizeMaxHeight,
			image_of_text:this.options.imageOfText
		});
	},

	checkFormElements:function(){
		this.formElements = $$('select, textarea');
		if(this.formElements.length == 0) return;

		this.formElements = this.formElements.map(function(elem){
			elem.store('visibility',elem.getStyle('visibility'));
			elem.store('display',elem.getStyle('display'));
			return elem;
		});
	},

	hideFormElements:function(){
		if(this.formElements.length == 0) return;
		this.formElements.each(function(elem){ elem.setStyle('display','none'); });
	},

	showFormElements:function(){
		if(this.formElements.length == 0) return;
		this.formElements.each(function(elem){
			elem.setStyle('visibility',elem.retrieve('visibility'));
			elem.setStyle('display',elem.retrieve('display'));
		})
	},

	//EVENTS
	addPageGalleriesEvents:function(){
		var pageGalleries = this.galleries.filter(function(gallery){ return !gallery.external });
		pageGalleries.each(function(gallery){
			gallery.items.each(function(item){
				item.element.addEvent('click',function(e){
					e.preventDefault();
					this.open(gallery.name,gallery.get_index_of(item));
				}.bind(this));
			},this);
		},this);
	},

	removePageGalleryEvents:function(){
		var pageGalleries = this.galleries.filter(function(gallery){ return !gallery.external });
		pageGalleries.each(function(gallery){
			gallery.items.each(function(item){
				item.element.removeEvents('click');
			});
		});
	},

	prepareEventListeners:function(){

		this.addPageGalleriesEvents();

		this.display.addEvent('nextClick',function(){
			this.navAux(true,'next');
		}.bind(this));

		this.display.addEvent('prevClick',function(){
			this.navAux(true,'prev');
		}.bind(this));

		this.display.addEvent('playPauseClick',function(){
			if(this.paused){
				this.startAutoPlay();
			} else {
				this.pauseAutoPlay();
			}
			this.display.set_paused(this.paused);
		}.bind(this));

		this.display.addEvent('disappear',function(){
			this.close(false);
		}.bind(this));

		this.display.addEvent('resizeComplete',function(){
			this.busy = false;//see navAux
		}.bind(this));

		//reset overlay height and position onResize
		window.addEvent('resize',function(){
			if(this.display.ready){ this.display.resetOverlaySize(); }
		}.bind(this));

		//keyboard next/prev/close
		window.document.addEvent('keydown',function(e){
			if(this.busy == true || this.closed){ return; }
			if(e.key == 'right' || e.key == 'left' || e.key == 'space'){ e.preventDefault(); }
			if(e.key == 'right' || e.key == 'space'){ this.navAux(e,'next'); }
			else if(e.key == 'left'){ this.navAux(e,'prev'); }
			else if(e.key == 'esc'){ e.stop(); this.close(true); }
		}.bind(this));
	},

	navAux:function(e,direction){

		if(e){//called from a button/key event
			this.pauseAutoPlay();
		} else {//called from autoplay
			if(this.busy || !this.fileReady){ return; }//prevent autoplay()
		}

		this.busy = true; //for keyboard and autoplay

		var i, _i;

		if(direction == "next"){
			i= (this.currentIndex != this.currentGallery.items.length-1) ? this.currentIndex += 1 : this.currentIndex = 0;
			_i= (this.currentIndex != this.currentGallery.items.length-1) ? this.currentIndex + 1 : 0;
		} else {
			i= (this.currentIndex != 0) ? this.currentIndex -= 1 : this.currentIndex = this.currentGallery.items.length-1;
			_i= (this.currentIndex != 0) ? this.currentIndex - 1 : this.currentGallery.items.length-1;
		};

		this.loadFile(this.currentGallery.get_item(i),[this.currentGallery.get_item(_i)]);
	}


});//END MILKBOX CLASS CODE

})();//END SINGLETON CODE






var MilkboxDisplay= new Class({

	Implements:[Options,Events],

	options:{
		init_width:100,
		init_height:100,
		overlay_opacity:1,
		margin_top:0,
		filebox_border_color:'#000000',
		filebox_padding:'0px',
		resize_duration:.5,
		resize_transition:'sine:in:out',
		centered:false,
		auto_size:false,
		autosize_max_height:0,
		image_of_text:'of',
		onNextClick:function(){},
		onPrevClick:function(){},
		onPlayPause:function(){},
		onDisappear:function(){},
		onResizeComplete:function(){}
	},

	initialize: function(options){
		this.setOptions(options);

		this.overlay;
		this.mainbox;
		this.filebox;
		this.bottom;
		this.controls;
		this.caption;
		this.close;
		this.next;
		this.prev;
		this.playpause;
		this.paused = false;
		this.count;

		this.mode = 'standard';
		this.ready = false;//after overlay and mainbox become visible == true

		this.overlay_show_fx;
		this.overlay_hide_fx;

		this.mainbox_show_fx;
		this.mainbox_hide_fx;
		this.mainbox_resize_fx;

		this.current_file = null;

		this.build_html();
		this.prepare_effects();
		this.prepare_events();

	},//end init

	build_html:function(){
		this.overlay = new Element('div', {
			'id':'mbox-overlay',
			'styles':{
				'visibility':'visible',
				'position':'fixed',
				'display':'none',
				'z-index':410000,  // required to be a high number > 400000 as the 'filemanager as tinyMCE plugin' sits at z-index 400K+
				'left':0,
				'width':'100%',
				'opacity':0,
				'height':0,
				'overflow':'hidden',
				'margin':0,
				'padding':0
			}
		}).inject($(document.body));

		this.mainbox = new Element('div', {
			'id':'mbox-mainbox',
			'styles': {
				'position':(this.options.centered) ? 'fixed' : 'absolute',
				'overflow':'hidden',
				'display':'none',
				'z-index':410001,   // required to be > overlay.z-index
				'width':this.options.init_width,
				'height':this.options.init_height,
				'opacity':0,
				'margin':0,
				'left':'50%',
				'marginLeft':-(this.options.init_width/2),
				'marginTop':(this.options.centered) ? -(this.options.init_height/2) : '',
				'top':(this.options.centered) ? '50%' : ''
			}
		}).inject($(document.body));

		this.filebox = new Element('div#mbox-filebox').inject(this.mainbox);

		this.bottom = new Element('div#mbox-bottom').setStyle('visibility','hidden').inject(this.mainbox);//;
		this.controls = new Element('div#mbox-controls')//.setStyle('visibility','hidden');
		this.caption = new Element('div#mbox-caption',{'html':'test'}).setStyle('display','none');

		this.bottom.adopt(new Element('div.mbox-reset'),this.controls, this.caption, new Element('div.mbox-reset'));

		this.close = new Element('div#mbox-close');
		this.next = new Element('div#mbox-next');
		this.prev = new Element('div#mbox-prev');
		this.playpause = new Element('div#mbox-playpause');
		this.count = new Element('div#mbox-count');

		//$$(this.next, this.prev, this.count, this.playpause).setStyle('display','none');
		$$(this.next, this.prev, this.close, this.playpause).setStyles({
			'outline':'none',
			'cursor':'pointer'
		});

		this.controls.adopt(new Element('div.mbox-reset'), this.close, this.next, this.prev, this.playpause, new Element('div.mbox-reset'), this.count);
	},

	prepare_effects:function(){
		this.overlay_show_fx = new Fx.Tween(this.overlay,{
				duration:'short',
				link:'cancel',
				property:'opacity',
				onStart:function(){
					//console.log('overlay_show_fx start');
					this.element.setStyles({
						'top':-window.getScroll().y,
						'height':window.getScrollSize().y + window.getScroll().y,
						'display':'block'
					});
				},
				onComplete:function(){
					//console.log('overlay_show_fx complete');
					this.mainbox_show_fx.start(1);
				}.bind(this)
		});

		this.overlay_hide_fx = new Fx.Tween(this.overlay,{
				duration:'short',
				link:'cancel',
				property:'opacity',
				onStart:function(){},
				onComplete:function(){
					this.overlay.setStyle('display','none');
				}.bind(this)
		});

		this.mainbox_show_fx = new Fx.Tween(this.mainbox,{
				duration:'short',
				link:'cancel',
				property:'opacity',
				onStart:function(){
					//console.log('mainbox_show_fx start');
					this.mainbox.setStyle('display','block');
				}.bind(this),
				onComplete:function(){
					//console.log('mainbox_show_fx complete');
					this.ready = true;
				}.bind(this)
		});

		this.mainbox_hide_fx = new Fx.Tween(this.mainbox,{
				duration:'short',
				link:'cancel',
				property:'opacity',
				onStart:function(){
					this.ready = false;
				}.bind(this),
				onComplete:function(){
					this.overlay.setStyle('display','none');
				}.bind(this)
		});


		this.mainbox_resize_fx = new Fx.Morph(this.mainbox,{
				duration:this.options.resize_duration*1000,
				transition:this.options.resize_transition,
				link:'cancel',
				onStart:function(){
					//console.log('resize_fx start');
				},
				onComplete:function(){
					this.show_bottom();
					this.filebox.setStyle('height',this.current_file.height+'px');
					this.filebox.setStyle('opacity',0).grab(this.current_file).tween('opacity',1);
					this.fireEvent('resizeComplete');
				}.bind(this)
		});

		this.filebox.set('tween',{ duration:'short', link:'chain' });
	},//end prepare_effects

	prepare_events:function(){
		$$(this.overlay,this.close).addEvent('click', function(){ this.disappear(); }.bind(this));
		this.prev.addEvent('click',function(){ this.fireEvent('prevClick') }.bind(this));
		this.next.addEvent('click',function(){ this.fireEvent('nextClick') }.bind(this));
		this.playpause.addEvent('click',function(){ this.fireEvent('playPauseClick') }.bind(this) );
	},

	show_file:function(file,caption,index,length){

		//this.clear_display();
		this.hide_loader();

		if(file.match && file.match('img') && (this.options.auto_size || this.options.centered)){
			var file = this.get_resized_image(file);
		};

		var file_size = { w:file.width.toInt(), h:file.height.toInt() };
		if(!file_size.w || !file_size.h){ alert('Milkbox error: you must pass size values if the file is swf or html or a free file (openWithFile)'); return; }//data-milkbox-size not passed
		file_size = Object.map(file_size,function(value){ return value.toInt(); });

		this.caption.innerHTML = (caption) ? caption : '';
		this.update_count(index,length);

		var filebox_addsize = this.filebox.getStyle('border-width').toInt()*2+this.filebox.getStyle('padding').toInt()*2;
		var final_w = file_size.w+filebox_addsize;

		//so now I can predict the caption height
		var caption_adds = this.caption.getStyles('paddingRight','marginRight');
		this.caption.setStyle('width',final_w-caption_adds.paddingRight.toInt()-caption_adds.marginRight.toInt());
		$$(this.bottom,this.controls).setStyle('height',Math.max(this.caption.getDimensions().height,this.controls.getComputedSize().totalHeight));
		var mainbox_size = this.mainbox.getComputedSize();

		var final_h = file_size.h+filebox_addsize+this.bottom.getComputedSize().totalHeight;

		var target_size = {
			w:final_w,
			h:final_h,
			total_w:final_w+mainbox_size.totalWidth-mainbox_size.width,
			total_h:final_h+mainbox_size.totalHeight-mainbox_size.height
		}

		this.current_file = file;
		this.resize_to(target_size);
	},//show_file

	//image:<img>, maxsize:{ w,h }
	get_resized_image:function(image){

		var max_size;
		var ratio;
		var check;

		var i_size = { w:image.get('width').toInt(), h:image.get('height').toInt() };

		//cut out some pixels to make it better
		var w_size = window.getSize();
		var max_size = {
			w:w_size.x-60,
			h:w_size.y-68-this.options.margin_top*2
		};

		var max_dim = Math.max( max_size.h, max_size.w );

		if(max_dim == max_size.w){
			ratio = max_dim/i_size.w;
			check = 'h';
		} else {
			ratio = max_dim/i_size.h;
			check = 'w';
		}

		ratio = (ratio <= 1) ? ratio : 1;

		i_size = Object.map(i_size,function(value){ return Math.floor(value*ratio); });

		ratio = (max_size[check]/i_size[check] <= 1) ? max_size[check]/i_size[check] : 1;
		i_size = Object.map(i_size,function(value){ return Math.floor(value*ratio); });

		if(this.options.autosize_max_height > 0){
			ratio = (this.options.autosize_max_height/i_size.height < 1) ? this.options.autosize_max_height/i_size.height : 1;
			i_size = Object.map(i_size,function(value){ return Math.floor(value*ratio); });
		}

		image.set({ 'width':i_size.w, 'height':i_size.h });

		return image;
	},//get_resized_image

	resize_to:function(target_size){
		this.mainbox_resize_fx.start({
			'width':target_size.w,
			'height':target_size.h,
			'marginLeft':-(target_size.total_w/2).round(),
			'marginTop':(this.options.centered) ? -(target_size.total_h/2).round() : ''
		});
	},

	show_loader:function(){
		this.mainbox.addClass('mbox-loading');
	},

	hide_loader:function(){
		this.mainbox.removeClass('mbox-loading');
	},

	clear_content:function(){
		this.filebox.empty();
		this.caption.empty();
		this.count.empty();
		$$(this.bottom,this.controls).setStyle('height','');
	},

	hide_bottom:function(){
		this.caption.setStyle('display','none');
		this.bottom.setStyle('visibility','hidden');
	},

	show_bottom:function(){
		this.caption.setStyle('display','block');
		this.bottom.setStyle('visibility','visible');
	},

	appear:function(){
		if(!this.options.centered){ this.mainbox.setStyle('top',window.getScroll().y+this.options.margin_top); }
		this.overlay_show_fx.start(this.options.overlay_opacity);
	},

	disappear:function(){
		this.cancel_effects();

		this.current_file = null;
		this.ready = false;
		this.mode = 'standard';

		$$(this.prev, this.next, this.playpause, this.count).setStyle('display','none');
		this.playpause.setStyle('backgroundPosition','0 0');

		this.count.empty();
		this.caption.setStyle('display','none').empty();
		this.bottom.setStyle('visibility','hidden');

		//TODO anche opacity a 0 se si usa un tween per il file
		this.filebox.setStyle('height','').empty();

		this.mainbox.setStyles({
			'opacity':0,
			'display':'none',
			'width':this.options.init_width,
			'height':this.options.init_height,
			'marginLeft':-(this.options.init_width/2),
			'marginTop':(this.options.centered) ? -(this.options.init_height/2) : '',
			'top':(this.options.centered) ? '50%' : ''
		});

		this.overlay_hide_fx.start(0);

		this.fireEvent('disappear');
	},//end disappear

	cancel_effects:function(){
		[this.mainbox_resize_fx,
		this.mainbox_hide_fx,
		this.mainbox_show_fx,
		this.overlay_hide_fx,
		this.overlay_show_fx
		].each(function(fx){ fx.cancel(); });
	},

	set_mode:function(gallery_type){

		this.mode = gallery_type;
		var close_w = this.close.getComputedSize().width;
		var prev_w = this.prev.getComputedSize().width;
		var next_w = this.next.getComputedSize().width;
		var playpause_w = this.playpause.getComputedSize().width;
		var offset = this.mainbox.getStyle('border-right-width').toInt();//for design purposes

		switch(gallery_type){
			case 'autoplay':
				$$(this.playpause,this.close,this.next,this.prev,this.count).setStyle('display','block');
				this.controls.setStyle('width',close_w+prev_w+next_w+playpause_w+offset);
				break;
			case 'single':
				$$(this.playpause,this.next,this.prev,this.count).setStyle('display','none');
				this.controls.setStyle('width',close_w+offset);
				break;
			case 'standard':
				$$(this.close,this.next,this.prev,this.count).setStyle('display','block');
				this.playpause.setStyle('display','none');
				this.controls.setStyle('width',close_w+prev_w+next_w+offset);
				break;
			default:
				return;
		}

		this.caption.setStyle('margin-right',this.controls.getComputedSize().totalWidth);
	},//end set_mode

	set_paused:function(paused){
		this.paused = paused;
		var pos = (this.paused) ? '0 -66px' : '';
		this.playpause.setStyle('background-position',pos);
	},

	update_count:function(index,length){
		this.count.set('text',index+' '+this.options.image_of_text+' '+length);
	},

	resetOverlaySize:function(){
		if(this.overlay.getStyle('opacity') == 0){ return; };//resize only if visible
		var h = window.getSize().y;
		this.overlay.setStyles({ 'height':h });
	}

});//END





//Class: MilkboxGallery
//args: source,options
//	*source: element, elements, array
//	*options: name, autoplay, autoplay_delay

var MilkboxGallery = new Class({

	Implements:[Options,Events],

	options:{//set all the options here
		name:null,
		autoplay:null,
		autoplay_delay:null
	},

	initialize:function(source,options){

		this.setOptions(options);

		this.source = source;
		this.external = false;
		this.items = null;
		this.name = this.options.name;
		this.type = null;//'autoplay','standard','single'
		this.prepare_gallery();
		this.prepare_elements();
	},

	prepare_gallery:function(){
		switch(typeOf(this.source)){
			case 'element'://single
				if(this.check_extension(this.source.href)){ this.items = [this.source]; }
				break;
			case 'elements'://html
				this.items = this.source.filter(function(link){ return this.check_extension(link.href); },this);
				break;
			case 'array'://xml, array
				this.items = this.source.filter(function(link){ return this.check_extension(link.href); },this);
				this.external = true;
				break;
			default:
				return;
		}
	},

	//turns everything into an object
	prepare_elements:function(){
		//console.log('items gallery', this.items);
		this.items = this.items.map(function(item){
			var splitted_url = item.href.split('?');
			var output = {};
			output.element = (typeOf(item) == 'element') ? item : null;
			output.href = splitted_url[0];
			output.vars = (splitted_url[1]) ? splitted_url[1].parseQueryString() : null;
			output.size = null;
			output.caption = (output.element) ? output.element.get('title') : item.title;
			var size_string = (output.element) ? output.element.get('data-milkbox-size') : item.size;
			if(size_string){ output.size = Object.map(this.get_item_props(size_string),function(value,key){ return value.toInt(); }); }
			return output;
		},this);

		if(this.items.length == 0) return;

		this.type = (this.items.length == 1) ? 'single' : (this.options.autoplay) ? 'autoplay' : 'standard';
	},

	check_extension:function(string){
		return string.split('?')[0].test(/\.(gif|jpg|jpeg|png|swf|html)$/i);
	},

	get_index_of:function(item){
		var index = (typeOf(item) == 'string') ? this.items.indexOf(this.items.filter(function(i){ i.href == item })[0]) : this.items.indexOf(item);
		return this.items.indexOf(item);
	},

	get_item:function(index){
		return this.items[index];
	},

	get_item_props:function(prop_string){
		var props = {};
		var s = prop_string.split(',').each(function(p,i){
			var clean = p.trim().split(':');
			props[clean[0].trim()] = clean[1].trim();
		},this);
		return props;
	},

	refresh:function(){
		this.type = (this.items.length == 1) ? 'single' : (this.options.autoplay) ? 'autoplay' : 'standard';
	},

	clear:function(){
		this.source = null;
		this.items = null;
	}

});//end MilkboxGallery



//Creating Milkbox instance: you can comment this code and instantiate Milkbox somewhere else instead.
window.addEvent('domready', function(){
	milkbox = new Milkbox({ centered:false });
});
