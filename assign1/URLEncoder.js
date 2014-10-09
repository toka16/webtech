var symbols = ["!", "#", "$", "&", "'", "(", ")", "*", "+", ",", "/", ":", ";", "=", "?", "@", "[", "]", " ", '"', "%", "-", ".", "<", ">", "\\", "^", "_", "`", "{", "|", "}", "~"];

Array.prototype.isArray = true;
Array.prototype.contains = function(obj){
	for (var i=0; i<this.length; i++){
		if(this[i] === obj) return true;
	}
	return false;
}
String.prototype.isReversed = function(){
	return symbols.contains(this[0]);
}
String.prototype.isASCII = function(){
	return this.charCodeAt(0) <= 127;
}
String.prototype.toUTF8ByteArray = function(){
	var res = [];
	var code = this.charCodeAt(0);
	if(code < (1<<7)){
		var num = copyBits(code, 7);
		res[0] = num;
	}else{
		var i;
		for(i=1; code >= (1<<(6+i*5)); i++){}
		for(var j=0; j<i; j++){
			res[j] = copyBits(code, 6);
			res[j] += (1<<7);
			code = code>>6;
		}
		res[i] = copyBits(code, 8-2-i);
		var temp = 0;
		for (var j=0; j<=i; j++){
			temp += (1<<j);
		}
		res[i] += temp<<8-1-i;
	}
	return res.reverse();
}
String.prototype.encode = function(){
	res = "";
	for (var i=0; i<this.length; i++){
		res+=this[i].toPercentEncode();
	}
	return res;
}
String.prototype.toPercentEncode = function(){
	var ch = this[0];
	if(ch.isASCII()){
		if(ch.isReversed()){
			return "%"+ch.charCodeAt(0).toString(16).toUpperCase();
		}else{
			return ch;
		}
	}else{
		var bytes = ch.toUTF8ByteArray();
		var res = "";
		for(var i=0; i<bytes.length; i++){
			res+="%"+bytes[i].toString(16).toUpperCase();
		}
		return res;
	}
}
String.prototype.toNormalEncode = function(length){
	if(length==1){
		var val = parseInt(this.slice(1,3), 16);
		return String.fromCharCode(val);
	}
	var arr = [];
	for(var i=0; i<length; i++){
		arr.push(parseInt(this.slice(i*3+1, i*3+3), 16));
	}
	var res = 0
	for (var i=0; i<length; i++){
		if(i==0){
			res += copyBits(arr[i], 8-length-1);
		}else{
			res = res<<6;
			res += copyBits(arr[i], 6);
		}
	}
	return String.fromCharCode(res);
}
String.prototype.findUTF8Length = function(){
	var first = parseInt(this.slice(1,3), 16);
	if (first & (1<<7)){
		for (var i=6; i>0; i--){
			if(!(first & (1<<i))){
				return 7-i;
			}
		}
	}else return 1;
}

var URLEncoder = {};
URLEncoder.encode = function(data){
	var res;
	if(data.isArray){
		res = [];
		for (var i=0; i<data.length; i++){
			res.push(URLEncoder.encode(data[i]));
		}
	}else if(typeof(data) === "object"){
		res = "";
		for (i in data){
			res+="&"+URLEncoder.encode(i)+"="+URLEncoder.encode(data[i]);
		}
		res = res.substr(1);
	}else if(typeof(data) === "string"){
		res = data.encode();
	}else{
		res = URLEncoder.encode(data.toString());
	}
	return res;
}

URLEncoder.decode = function(data){
	var res;
	if(data.isArray){
		res = [];
		for (var i=0; i<data.length; i++){
			res.push(URLEncoder.decode(data[i]));
		}
	}else if(typeof(data) === "string"){
		if(data.indexOf("=")>-1){
			res = {};
			var temp = data.replace(/((\w|%)+)=((\w|%)+)/g, function(d0, d1, d2, d3, d4, d5, d6){
				var arg = URLEncoder.decode(d1);
				var val = URLEncoder.decode(d3);
				res[arg] = val;
			} );
		}else{
			res = data.replace(/(%\w\w)+/g, function(d0, d1, d2, d3, d4){
				var value = "";
				var cur;
				for(var i=0; i<d0.length; ){
					cur = d0.slice(i);
					var length = cur.findUTF8Length(cur);
					value += cur.toNormalEncode(length);
					i+=length*3;
				}
				return value;
			});
		}
	}
	return res;
}


function copyBits(src, num){
	var dst = 0;
	for(var i=0; i<num; i++){
		dst+=src & (1<<i);
	}
	return dst;
}
module.exports.encode = URLEncoder.encode;
module.exports.decode = URLEncoder.decode;