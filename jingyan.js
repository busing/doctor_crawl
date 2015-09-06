var util=require("./util.js");
var system = require('system');
// var url = system.args[1];
var url ="http://www.haodf.com/doctor/DE4r08xQdKSLfK1YHTyyMxUNjSNk.htm";

var casper=require('casper').create({
	 verbose: false, 
   	 logLevel: 'debug',
   	 pageSettings:{
   	 	loadImages: false
   	 }
});


var jingyan;



function getJY()
{
	var jy=new Array();;
	$(".spacejy").each(function(i){
		var j=$.trim($(this).html());
		jy.push(j);
	});
	return jy;
}

casper.start();
casper.thenOpen(url,function(){
	this.thenEvaluate(util.injectJQuery);
	jingyan=this.evaluate(getJY);
});

casper.then(function(){
	casper.echo("jingyan:"+jingyan.join(","));
});

casper.run(function(){
	this.exit();
});
