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
var upareaUrlList;

//获取所有的医生信息url
function getUpareaUrl()
{
	var urlList=new Array();
	urlList.push($(".jeshi_tree").find(".kstl2").eq(0).find("a").eq(0).attr("href"));
	$(".jeshi_tree").find(".kstl").each(function(i){
		urlList.push($(this).find("a").eq(0).attr("href"));
	});

	return urlList;
}

casper.start();

casper.thenOpen(url,function(){
	casper.thenEvaluate(util.injectJQuery);
	upareaUrlList=casper.evaluate(getUpareaUrl);
});

casper.then(function(){
	casper.echo(upareaUrlList.join(","));
});

casper.run(function(){
	this.exit();
});
