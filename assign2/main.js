var Router = require("./router");
var Server = require("./server");
var fs = require("fs");

var router = new Router();
router.add("/users/{id:n}/{permName:s}", 
			{
				get: function(request, response, params){
					response.writeHead(200, {"Content-Type": "text/html"});
					response.write("id: "+params.id);
					response.write("<br>");
					response.write("name: "+params.permName);
					response.end();
				}
			},
			function(error, request, response){
				response.writeHead(404, {});
				response.end(error);
			})
		.add("/", {
					get: function(request, response, params){
						response.writeHead(200, {"Content-Type": "text/html"});
						response.write("wellcome to my server");
						response.end();
					},
					post: function(request, response, params){
						response.writeHead(200, {"Content-Type": "text/html"});
						response.end("POST not suported");
					},
					delete: function(request, response, params){
						response.writeHead(200, {"Content-Type": "text/html"});
						response.end("POST not suported");
					}
				},
				function(error, request, response){
					response.writeHead(404, {});
					response.end(error);
				})
		.add("/download/{name:s}/{type:s}",
				{
					get: function(request, response, params){
						var filename = params.name+"."+params.type;
						fs.readFile(filename, function(err, data){
							if(err){
								response.writeHead(500, {});
								response.end("file not found");
							}else{
								var cType;
								if(params.type === "jpg" || params.type === "png")
									cType = "image/" + params.type;
								else if(params.type === "html" || params.type === "css" || params.type === "js")
									cType = "text/" + params.type;

								response.writeHead(200, {
															"Content-Type": cType,
															"Content-Disposition": "attachment; filename="+filename
														});
								response.write(data);
								response.end();
							}
						});
					},
					post: this.get,
				},
				function(error, request, response){
					response.writeHead(404, {});
					response.end(error);
				}
		);

var server = new Server(router);
if(server.startAt(4444) === 0){
	console.log("server started");
}else{
	console.log("error");
}