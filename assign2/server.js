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
				try{
					if(request.method === "GET"){
						obj.callback.get(request, response, obj.parametres);
					}else if(request.method === "POST"){
						obj.callback.post(request, response, obj.parametres);
					}else if(request.method === "DELETE"){
						obj.callback.delete(request, response, obj.parametres);
					}
				}catch(e){
					if(obj.errorHandler === undefined){
						response.writeHead(404, {});
						response.end();
					}else{
						obj.errorHandler(e, request, response);
					}
				}
			}
		});
		server.on("error", function(e){
			console.log("error occurred while starting server!");
			console.log(e);
		});
		server.listen(port);
	};
}

module.exports = Server;