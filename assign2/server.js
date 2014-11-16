function Server(router){
	var http = require("http");
	var r = router;
	this.startAt = function(port){
		var server = http.createServer(function(request, response){
			var url = request.url;
			var obj = r.match(url);
			if(obj === undefined){
				response.writeHead(404, {});
				response.end("no such address");
			}else{
				if(request.method === "GET"){
					if(obj.callback.get === undefined){
						if(obj.errorHandler === undefined){
							response.writeHead(404, {});
							response.end();
						}else{
							obj.errorHandler("GET method not suported", request, response);
						}
					}else{
						obj.callback.get(request, response, obj.parametres);
					}
				}else if(request.method === "POST"){
					if(obj.callback.post === undefined){
						if(obj.errorHandler === undefined){
							response.writeHead(404, {});
							response.end();
						}else{
							obj.errorHandler("POST method not suported", request, response);
						}
					}else{
						obj.callback.post(request, response, obj.parametres);
					}
				}else if(request.method === "DELETE"){
					if(obj.callback.delete === undefined){
						if(obj.errorHandler === undefined){
							response.writeHead(404, {});
							response.end();
						}else{
							obj.errorHandler("DELETE method not suported", request, response);
						}
					}else{
						obj.callback.delete(request, response, obj.parametres);
					}
				}
			}
		});
		try{
			server.listen(port);
			return 0;
		}catch(e){
			return -1;
		}
	};
}

module.exports = Server;