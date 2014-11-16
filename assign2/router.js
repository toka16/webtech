
function Router(){
	function getTemplate(route){
		var types = {
			n: "[0-9]",
			s: "[a-z, A-Z]"
		}
		var parNames = [];
		var exp = route.replace(/\{(\w+):(\w)\}/g, function(arg0, name, type){
			parNames.push(name);
			return "("+types[type]+"+)";
		});
		exp = exp.replace(/\//g, function(){
			return "\\/";
		});
		exp = "^"+exp+"$";
		return {
			regexp: exp,
			params: parNames
		};
	}
	var routes = {};
	this.add = function(route, callbacks, errorHandler){
		var temp = getTemplate(route);
		routes[route] = {
			callback: callbacks,
			errorHandler: errorHandler,
			template: RegExp(temp.regexp),
			paramNames: temp.params
		}
		return this;
	}

	this.remove = function(route){
		if(routes[route] !== undefined){
			delete routes[route];
		}
		return this;
	}

	this.match = function(url){
		for(var i in routes){
			if(url.match(routes[i].template)){
				var params = {};
				url.replace(routes[i].template, function(){
					for(var j=0; j<routes[i].paramNames.length; j++){
						params[routes[i].paramNames[j]] = arguments[j+1];
					}

				});
				return {
					callback: routes[i].callback,
					errorHandler: routes[i].errorHandler,
					parametres: params
				}
			}
		}
	}
}

module.exports = Router;