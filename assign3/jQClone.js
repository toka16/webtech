(function(window, document) {
	// ასეთი ფუნქციის შექმნა საჭიროა რადგან jQClone-ს გლობალურ მეხსიერებაზე პირდაპირი წვდომა არ ქონდეს და მას არგუმენტებად გადმოცემული ელემენტებით მიმართოს

	function jqObject(elem){
		elem.first = function(){
			return $(elem[0]);
		}
		elem.last = function(){
			return $(elem[elem.length-1]);
		}
		elem.each = function(func){
			for(var i=0; i<elem.length; i++){
				func.call(elem[i], i, elem[i]);
			}
		}
		elem.find = function(selector){
			var res = [];
			elem.each(function(){
				if(this.matches(selector)){
					res.push(this);
				}
			});
			return $(res);
		}
		elem.hasClass = function(c){
			return (elem[0].className.indexOf(c) >= 0);
		}
		elem.addClass = function(c){
			elem.each(function(){
				if(!$(this).hasClass(c)){
					this.className += " "+c;
				}
			});
			return elem;
		}
		elem.removeClass = function(c){
			var classes = c.split(" ");
			for(var i=0; i<classes.length; i++){
				elem.each(function(){
					this.className = this.className.replace(classes[i], "");
				});
			}
			return elem;
		}
		elem.toggleClass = function(c, addOrRemove){
			var classes = c.split(" ");
			for(var i=0; i<classes.length; i++){
				if(addOrRemove === undefined)
					elem.each(function(){
						var e = $(this);
						if(e.hasClass(classes[i]))
							e.removeClass(classes[i]);
						else
							e.addClass(classes[i]);
					});
				else
					if(addOrRemove)
						elem.addClass(classes[i]);
					else
						elem.removeClass(classes[i]);
			}
			return elem;
		}
		elem.attr = function(attr){
			if(elem[0])
				return elem[0].getAttribute(attr);
			return null;
		}
		elem.css = function(style, value){
			if(value === undefined){
				if(typeof style == "string"){
					if(elem[0])
						return window.getComputedStyle(elem[0],null).getPropertyValue(style);
					return null;
				}else{
					for(var s in style){
						if (style.hasOwnProperty(s)) {
							elem.css(s, style[s]);
						}
					}
				}
			}else{
				elem.each(function(){
					this.style[style] = value;
				})
			}
			return elem;
		}
		elem.data = function(){
			var el = elem[0];
			if(el){
				if(arguments.length == 0){
					var res = {};
					var atts = el.attributes;
					var arr = [];
					for (var i = 0; i < atts.length; i++){
						var name = atts[i].nodeName;
						if(name.indexOf("data")==0)
							res[atts[i].nodeName] = el.getAttribute(atts[i].nodeName);
					}
					return res;
				}else if(arguments.length == 1 && typeof arguments[0] !== "string"){
					var args = arguments[0];
					// var data = elem.data();
					for(var i in args){
						elem.each(function(){
							this.setAttribute("data-"+i, args[i]);
						});
					}
					return elem;
				}else{
					var res = {};
					var data = elem.data();
					for(var i=0; i<arguments.length; i++){
						var name = arguments[i];
						res[name] = data["data-"+name];
					}
					return res;
				}
			}
			return elem;
		}
		elem.on = function(event, callback){
			if(callback == undefined){
				elem.each(function(){
					this[event].call(this);
				});
			}else{
				elem.each(function(){
					this.addEventListener(event, callback);
				});
			}
		}
		elem.html = function(html){
			if(elem[0]){
				if(html === undefined){
					return elem[0].innerHTML;
				}else{
					elem.each(function(){
						this.innerHTML = html;
					});
				}
			}
			return elem;
		}
		elem.append = function(node){
			if(typeof node == "string"){
				elem.each(function(){
					this.innerHTML += node;
				});
			}else{
				elem.append(node.outerHTML);
			}
			return elem;
		}
		elem.prepend = function(node){
			if(typeof node == "string"){
				elem.each(function(){
					this.innerHTML = node + this.innerHTML;
				});
			}else{
				elem.prepend(node.outerHTML);
			}
			return elem;
		}
		elem.empty = function(){
			elem.each(function(){
				this.innerHTML = "";
			});
			return elem;
		}
		return elem;
	}

	function init(elem, context){
		var node = elem;
		var con = (context === undefined) ? document : context;
		if(typeof elem == "string"){
			node = con.querySelectorAll(elem);
		}
		if(!(node instanceof NodeList || node instanceof Array)){
			node = [node];
		}
		node = (node === null || node === undefined) ? [] : node;   // avoid node to be null or undefined
		node = new jqObject(node);
		return node;
	}

	init.ajax = function(request){
		var req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		if(typeof request == "string"){
			req.open("GET", "http://"+request, false);
		}else{
			req.open(request.type, "http://"+request.url, false);
		}
		req.done = function(callback){
			req.onload = callback;
			return req;
		};
		req.fail = function(callback){
			req.onerror = callback;
			return req;
		}
		req.send();
		return req;
	}

	window.jQClone = init;    
	window.$ = window.jQClone; 
})(window, document);
