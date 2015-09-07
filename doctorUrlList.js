/**
 * 从医院的主页面采集当前页面的所有的医生信息url
 */
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

//医生url
var doctorUrlList;

//获取所有的医生信息url
function getUrlOfDoctor()
{
	var urlList=new Array();
	$("#doc_list_index").find("tr").each(function(i){
		urlList.push($(this).find("td").eq(0).find("a").eq(0).attr("href"));
	});
	return urlList;
}

casper.start();

casper.thenOpen(url,function(){
	casper.thenEvaluate(util.injectJQuery);
	doctorUrlList=casper.evaluate(getUrlOfDoctor);
});

casper.then(function(){
	casper.echo(doctorUrlList.join(","));
});

casper.run(function(){
	this.exit();
});
