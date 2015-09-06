var system = require('system');
var util=require("./util.js");
var jq=require("./json2.js");
var url = system.args[1];
var casper = require('casper').create({
	 verbose: false, 
   	 logLevel: 'debug',
   	 pageSettings:{
   	 	loadImages: false
   	 }
});

// var url="http://www.haodf.com/doctor/DE4r08xQdKSLfiboENv5LwmK7DLi.htm";
var url = casper.cli.get("url");
var doctorObj={};
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


function pre()
{
	$(".ys_tx").parent().parent().remove();
}

function getName()
{
	//return $.trim($(".doc_name").html());
	var name=$(".lt_name h1 span").eq(0).html().trim();
	return name;
}

function getHospitoy()
{
	//return $.trim($(".mr_line1 .clearfix").eq(0).find(".hh a").html());
	var hospitoy=$(".luj a").eq(3).html().trim();
	return hospitoy;
}

function getDepartMent()
{
	//return $.trim($(".mr_line1 .clearfix").eq(0).find(".hh a").html());
	var department=$(".luj a").eq(4).html().trim();
	return department;
}

function getStartTr()
{
	var startTr=0;
	return $(".ys_tx").length>0?1:0;
}

function getQualifications()
{
	//return $.trim($(".mr_line1 .clearfix").eq(0).find(".hh a").html());
	var qualifications=$(".middletr tr").eq(1).find("td").eq(2).html().trim();
	return qualifications;
}

function getGoodAt()
{
	//return $.trim($(".mr_line1 .clearfix").eq(1).find(".hh").html());
	var goodat=$(".middletr tr").eq(2).find("td").eq(2).find("#full_DoctorSpecialize").html().trim();
	goodat=goodat.replace("<span><a href=\"#\" class=\"blue cp J_display_intro\">&lt;&lt; 收起</a></span>","")
	return goodat.trim();
}

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
	// this.echo("name："+name); 
	// this.echo("hospitoy："+hospitoy); 
	// this.echo("department："+department); 
	// this.echo("goodat："+goodat);  
	// this.echo("intro："+intro); 
	// this.echo("qualifications："+qualifications); 
	// this.echo("ticket: "+ticket); 

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

	doctorJson=JSON.stringify(doctorObj);
	this.echo(doctorJson); 

});


casper.run(function(){
	this.exit();
});
