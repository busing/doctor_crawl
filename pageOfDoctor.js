/**
 * 采集医院有多少页的医生信息
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
//医院的医生信息页数
var pageOfDoctor=0;
//医院名称
var hospitoyName="";
//医院id
var hospitalId="";

//获取医生分页数
function getPageOfDoctor()
{
	var s= $(".p_bar").find(".p_text").eq(0).html();
	var pageArray=s.split("&nbsp;");
	return pageArray[1];
}

//获取医院名称
function getHospitoyName()
{
	return $("#headpA_blue").find("a").eq(0).html();
}

//获取医院的id
function getHospitoyId()
{
	var href= $("#headpA_blue").find("a").eq(0).attr("href");
	href=href.substring(href.lastIndexOf("/")+1,href.lastIndexOf("."));
	return href;
}

casper.start();
casper.thenOpen(url,function(){
	casper.thenEvaluate(util.injectJQuery);
	pageOfDoctor=casper.evaluate(getPageOfDoctor);
	pageOfDoctor=pageOfDoctor==null?1:pageOfDoctor;
	hospitoyName=casper.evaluate(getHospitoyName);
	hospitalId=casper.evaluate(getHospitoyId);
});

casper.then(function(){
	casper.echo(pageOfDoctor+","+hospitoyName+","+hospitalId);
});

casper.run(function(){
	this.exit();
});
