/**
*
* jsGET
*
* jsGET is a http GET-Variables clone for javascript, using the hash part of the URL (index.html#...).
* You can set and get variables, and run a listener to hash changes, e.g. when the the history back button gets pressed.
* This allows you to create a usable history navigation in your ajax application. It should work with all A-grade browsers.
*
* @author Fabian Vogelsteller <fabian@feindura.org>
* @copyright Fabian Vogelsteller
* @license http://www.gnu.org/licenses GNU General Public License version 3
*
* @version 0.1
*
* ### Properties
* - vars:         (object) the hash variables object loaded by get(), set(), remove(), or clear() or load().
* - vars.current: (object) the current variables.
* - vars.old:     (object) the old variables, before they where changed with set(), remove(), clear() or the browser history back button.
* - vars.changed: (object) the variabels which have changed since the last call of get(), set(), remove(), or clear(), load() or the browser history back button.
*
* ### Methods
* - load():                                 loads the current hash variables into the vars.current property as JSON object.
* - clear():                                clears the hash part of the URL. (because it's not completely possible, it sets it to "#_")
* - get(get):                               (string) try to get a hash variable with the given name.
* - set(set):                               (string,number,object) sets the given parameters to the hash variales. If it's a string it should have the following format: "key=value".
* - remove(remove):                         (string,array) the variable name(s) which should be removed from the hash variables
* - addListener(listener,callAlways,bind):  (listener: function, callAlways: boolean, bind: object instance) creates a listener which calls the given function, when a hash change appears. The called function will get the vars property (vars.current,vars.old,vars.changed) and use the "bind" parameter as "this", when specified.
*                                           The return of the addListener() method is a setInterval ID and must be passed to the removeListener() method to stop the listening.
*                                           When callAlways is FALSE, it only calls when the browser history buttons are pressed and not when get(), set(), remove() or clear() is called.
* - removeListener(listenerID):             (the setInterval Id received from a addListener() method) removes a listener set with the addListener() method.
*
* ### ATTENTION!
* Everytime you call set(), remove() or clear() a new hash string will be set,
* that means you also create a new history step in the browser history!
*
* These are 'special' characters to jsGET and will therefor be encoded when they are part of a key or value:
*   # & =
*/

var jsGET = {
  vars: {
    old:{},
    current:{},
    changed:{}
  },
  load: function() {
    var hashVars = window.location.hash.split('#');
    if(typeof hashVars[1] != 'undefined' && hashVars[1] && hashVars[1] != '_') {
      hashVars = hashVars[1].split('&');
      for(var i = 0; i < hashVars.length; i++) {
          var hashVar = hashVars[i].split('=');
          this.vars.current[this.decode(hashVar[0])] = (typeof hashVar[1] != 'undefined' ? this.decode(hashVar[1]) : '');
      }
    } else {
      this.vars.current = {};
	}
    return this.vars.current;
  },
  // encode special characters in the input string; use encodeURIComponent() to encode as that one is fast and ensures proper Unicode handling as well: bonus!
  encode: function(s) {
	s = encodeURIComponent(s);
	// BUT! browsers take things like '%26' in the URL anywhere and translate it to '&' before we get our hands on the fragment part, so we need to prevent the browsers from doing this:
	s = s.replace(/%/g, '$'); // we can do this safely as encodeURIComponent() will have encoded any '$' in the original string!
	return s;
  },
  decode: function(s) {
	s = s.replace(/\$/g, '%');
	s = decodeURIComponent(s);
	return s;
  },
  clear: function() {
    window.location.hash = "#_";
    //window.location.href = window.location.href.replace( /#.*$/, "");
    return false;
  },
  get: function(get) {
    this.load();
    return (this.vars.current[get]) ? this.vars.current[get] : null;
  },
  set: function(set) {
    //if (typeof console !== 'undefined' && console.log) console.log('savedHistory');
    this.load();

    if(typeof set != 'object') {
      setSplit = set.split('=');
      set = {};
	  // be aware that the _value_ of the key, value pair can have an embedded '=' (or more) itself:
	  var key = setSplit.shift();
	  var value = setSplit.join('=');
      set[key] = value;
    }

    // var
    var hashString = '';
    var sep = '#';

    // check for change in existing vars
    for(var key in this.vars.current) {
      if(this.vars.current.hasOwnProperty(key)) {
        if(set.hasOwnProperty(key)) {
          hashString += sep+this.encode(key)+'='+this.encode(set[key]);
          delete set[key];
        } else if(typeof this.vars.current[key] != 'undefined') {
		  // given the loop, the condition should be always TRUE
          hashString += sep+this.encode(key)+'='+this.encode(this.vars.current[key]);
        } else {
		  if (typeof console !== 'undefined' && console.log) console.log('jsGET: *** SHOULD NEVER GET HERE! *** @ 101 ' + key);
          hashString += sep+this.encode(key);
		}
        sep = '&';
      }
    }

    // add new vars
    for(var key in set) {
      if(set.hasOwnProperty(key)) {
        // (typeof this.vars.current[key] == 'undefined' || this.get(key) != set[key])) {
		// ^^^ first part should be always TRUE, second part merely filters out the set key=null items,
		//     as get(key) would always produce NULL here...
        if (typeof this.vars.current[key] != 'undefined')
		  if (typeof console !== 'undefined' && console.log) console.log('jsGET: *** SHOULD NEVER GET HERE! *** @ 116');
        if (this.get(key) !== null)
		  if (typeof console !== 'undefined' && console.log) console.log('jsGET: *** SHOULD NEVER GET HERE! *** @ 118');

        hashString += sep+this.encode(key)+'='+this.encode(set[key]);
        sep = '&';
      }
    }
    window.location.hash = hashString;
    return this.load();
  },
  remove: function(remove) {
    this.load();

    if(typeof remove != 'object') {
      removes = [remove]; // new Array(); is discouraged (Crockford / jsLint)
      //removes[0] = remove;
    } else {
      removes = remove;
	}

    // var
    var hashString = '';
    var sep = '#';

    for (var i = 0; i < removes.length; i++) {
      if(this.vars.current.hasOwnProperty(removes[i])) {
        delete this.vars.current[removes[i]];
	  }
    }

    // create new hash string
    for(var key in this.vars.current) {
      if(this.vars.current.hasOwnProperty(key)) {
        if(typeof this.vars.current[key] != 'undefined') {
          hashString += sep+this.encode(key)+'='+this.encode(this.vars.current[key]);
        } else {
		  if (typeof console !== 'undefined' && console.log) console.log('jsGET: *** SHOULD NEVER GET HERE! *** @ 153 ' + key);
          hashString += sep+this.encode(key);
		}
        sep = '&';
      }
    }
    window.location.hash = hashString;
    return this.vars.current;
  },
  addListener: function(listener,callAlways,bind) { // use the returned interval ID for removeListener
    //var
    var self = this;
    var lastHash = '';
    self.vars.old = new self.vars.current.constructor();
	for(var key in self.vars.current) {
		self.vars.old[key] = self.vars.current[key];
	}

    function compareVars(obj1,obj2) {
      for(var key in obj1) {
		if(obj1[key] !== obj2[key]) return false;
	  }
      return true;
    }

    function setChangedVars() {
      var oldVars = new self.vars.old.constructor();
	  for(var key in self.vars.old) {
		oldVars[key] = self.vars.old[key];
	  }
      self.vars.changed = new self.vars.current.constructor();
	  for(var key in self.vars.current) {
		self.vars.changed[key] = self.vars.current[key];
	  }
      // check for changed vars
      for(var key in self.vars.changed) {
        if(self.vars.changed.hasOwnProperty(key) && typeof oldVars[key] != 'undefined' && oldVars[key] == self.vars.changed[key]) {
          delete self.vars.changed[key];
          delete oldVars[key];
        }
	  }
      // merge the rest of self.vars.old with the changedVars
      for(var key in oldVars) {
        if(oldVars.hasOwnProperty(key) && !(key in self.vars.changed)) {
			self.vars.changed[key] = oldVars[key];
		}
      }
    }

    this.pollHash = function() {
        if(lastHash !== window.location.hash) {
          // var
          lastHash = window.location.hash;

          if(callAlways || compareVars(self.vars.current,self.vars.old)) {
            // var
            self.load();
            setChangedVars();
            /*
            if (typeof console !== 'undefined' && console.log) console.log('-----');
            if (typeof console !== 'undefined' && console.log) console.log(self.vars.old);
            if (typeof console !== 'undefined' && console.log) console.log(self.vars.changed);
            */
            // call the given listener function
            if(typeof listener == 'function') {
				listener.apply(bind,[self.vars]);
			}
          } else {
            setChangedVars();
		  }
          /*
          if (typeof console !== 'undefined' && console.log) console.log('-----');
          if (typeof console !== 'undefined' && console.log) console.log(self.vars.current);
          if (typeof console !== 'undefined' && console.log) console.log(self.vars.old);
          if (typeof console !== 'undefined' && console.log) console.log(self.vars.changed);
          */
          self.vars.old = new self.vars.current.constructor();
		  for(var key in self.vars.current) {
			self.vars.old[key] = self.vars.current[key];
		  }
        }
    }
    return setInterval(this.pollHash, 500);
  },
  removeListener: function(listenerID) { // use the interval ID returned by addListener
    delete this.pollHash;
    return clearInterval(listenerID);
  }
}