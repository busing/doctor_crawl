/**
 * 采集医生基本信息
 * 包括：姓名、医院、科室、职称、擅长、简介、得票
 * @type {[type]}
 */
var system = require('system');
var util=require("./util.js");
var jq=require("./json2.js");
var casper = require('casper').create({
	 verbose: false, 
   	 logLevel: 'debug',
   	 pageSettings:{
   	 	loadImages: false
   	 }
});

var url = casper.cli.get("url");
//医生对象数据
var doctorObj={};
//医生json数据
var doctorJson;
//姓名
var name;
//医院
var hospitoy;
//医院科室
var department;
//职称
var qualifications;
//擅长
var goodat;
//简介
var intro;
//得票
var ticket;

//准备采集 去除头像表格
function pre()
{
	$(".ys_tx").parent().parent().remove();
}

//获取医生姓名
function getName()
{
	//return $.trim($(".doc_name").html());
	var name=$(".lt_name h1 span").eq(0).html().trim();
	return name;
}

//获取医院信息
function getHospitoy()
{
	//return $.trim($(".mr_line1 .clearfix").eq(0).find(".hh a").html());
	var hospitoy=$(".luj a").eq(3).html().trim();
	return hospitoy;
}

//获取科室信息
function getDepartMent()
{
	//return $.trim($(".mr_line1 .clearfix").eq(0).find(".hh a").html());
	var department=$(".luj a").eq(4).html().trim();
	return department;
}

//获取职称信息
function getQualifications()
{
	//return $.trim($(".mr_line1 .clearfix").eq(0).find(".hh a").html());
	var qualifications=$(".middletr tr").eq(1).find("td").eq(2).html().trim();
	return qualifications;
}

//获取擅长信息
function getGoodAt()
{
	//return $.trim($(".mr_line1 .clearfix").eq(1).find(".hh").html());
	var goodat=$(".middletr tr").eq(2).find("td").eq(2).find("#full_DoctorSpecialize").html().trim();
	goodat=goodat.replace("<span><a href=\"#\" class=\"blue cp J_display_intro\">&lt;&lt; 收起</a></span>","")
	return goodat.trim();
}

//获取描述
function getIntro()
{
	//return $("#js_passportUserNameList").html();
	var intro;
	if($(".middletr tr").eq(3).find("td").eq(2).find("#full").length>0)
	{
		intro=$(".middletr tr").eq(3).find("td").eq(2).find("#full").html().trim();
		intro=intro.replace("<span><a href=\"#\" class=\"blue cp J_display_intro\">&lt;&lt; 收起</a></span>","")
	}
	else
	{
		intro=$(".middletr tr").eq(3).find("td").eq(2).html().trim();
	}
	return intro.trim();
}

//获取得票信息
function getTicket()
{
	var ticket="";
	$("#doctorgood tr").eq(0).find("td").eq(0).find("a").each(function(i){
		if($(this).html!=undefined)
		{
			var split="";
			if(i!=0)
			{
				split=(i%2==0?",":"|");
			}
			ticket+=split;
			ticket+=$(this).html().trim();
		}
		
	});
	return ticket;
}

casper.start();
//打开医生信息页面进行采集
casper.thenOpen(url,function(response){

	this.thenEvaluate(util.injectJQuery);
	this.evaluate(pre);

	name=this.evaluate(getName);

	hospitoy=this.evaluate(getHospitoy);

	department=this.evaluate(getDepartMent);
	department=department.replace("&nbsp;","");

	goodat=this.evaluate(getGoodAt);

	intro=this.evaluate(getIntro);

	qualifications=this.evaluate(getQualifications);

	ticket=this.evaluate(getTicket);
	
});


casper.then(function(){
	//构建医生对象
	var doctorObj={
		'name':name,
		'hospitoy':hospitoy,
		'department':department,
		'qualifications':qualifications,
		'goodat':goodat,
		'intro':intro,
		'ticket':ticket,
		'url':url
	};
	//json数据
	doctorJson=JSON.stringify(doctorObj);
	this.echo(doctorJson+""); 
});

//退出采集
casper.run(function(){
	this.exit();
});
