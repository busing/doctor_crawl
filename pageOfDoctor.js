var util=require("./util.js");
var system = require('system');
var casper=require('casper').create({
	 verbose: false, 
   	 logLevel: 'debug',
   	 pageSettings:{
   	 	loadImages: false
   	 }
});
var url = casper.cli.get("url");

var pageOfDoctor=0;

var casper=require('casper').create({
	 verbose: false, 
   	 logLevel: 'debug',
   	 pageSettings:{
   	 	loadImages: false
   	 }
});



function getPageOfDoctor()
{
	var s= $(".p_bar").find(".p_text").eq(0).html();
	var pageArray=s.split("&nbsp;");
	return pageArray[1];
}

casper.start();
casper.thenOpen(url,function(){
	casper.thenEvaluate(util.injectJQuery);
	pageOfDoctor=casper.evaluate(getPageOfDoctor);
});

casper.then(function(){
	casper.echo(pageOfDoctor);
});

casper.run(function(){
	this.exit();
});
