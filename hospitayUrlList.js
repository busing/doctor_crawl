/**
 * 采集省地市所有的医院主页url
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
//url ="http://www.haodf.com/yiyuan/jiangsu/list.htm";

//医院urlList
var hospitoyUrlList;

//获取医院url
function getUrlOfHospitoy()
{
	var urlList=new Array();
	$(".m_ctt_green").each(function(i){
		$(this).find("li").each(function(){
			var temp_url="http://www.haodf.com"+$(this).find("a").eq(0).attr("href");
			temp_url=temp_url.substring(0,temp_url.lastIndexOf("."))+"/menzhen"+temp_url.substring(temp_url.lastIndexOf("."));
			urlList.push(temp_url);
		});
	});
	return urlList;
}

casper.start();

casper.thenOpen(url,function(){
	casper.thenEvaluate(util.injectJQuery);
	hospitoyUrlList=casper.evaluate(getUrlOfHospitoy);
});

casper.then(function(){
	casper.echo(hospitoyUrlList.join(","));
});

casper.run(function(){
	this.exit();
});
