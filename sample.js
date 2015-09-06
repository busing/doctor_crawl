var casper = require('casper').create({
	 verbose: false, 
   	 logLevel: 'debug',
   	 pageSettings:{
   	 	loadImages: false
   	 }
});

var indexUrl="http://www.haodf.com/doctor/DE4r08xQdKSLPGmCb66N34PvWMSU.htm";
var jingyanUrl="http://www.haodf.com/doctor/DE4r08xQdKSLPGmCb66N34PvWMSU/jingyan/2.htm";

var urls=[indexUrl];

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
//看病经验
var experienceArr=new Array();

//主页url
var mainUrl;

//得票
var ticket;

var jy=new Array();


function injectJQuery()
{
	document.write("<script src='http://libs.baidu.com/jquery/1.9.1/jquery.min.js'></script>");
	String.prototype.trim = function() 
	{ 
		return this.replace(/\s+/g, ""); 
	} 
}


function getName()
{
	//return $.trim($(".doc_name").html());
	return $.trim($(".lt_name h1 span").eq(0).html());
}

function getHospitoy()
{
	//return $.trim($(".mr_line1 .clearfix").eq(0).find(".hh a").html());
	return $.trim($(".luj a").eq(3).html());
}

function getDepartMent()
{
	//return $.trim($(".mr_line1 .clearfix").eq(0).find(".hh a").html());
	return $.trim($(".luj a").eq(4).html());
}

function getQualifications()
{
	//return $.trim($(".mr_line1 .clearfix").eq(0).find(".hh a").html());
	return $.trim($(".middletr tr").eq(1).find("td").eq(2).html());
}

function getGoodAt()
{
	//return $.trim($(".mr_line1 .clearfix").eq(1).find(".hh").html());
	var s=$.trim($(".middletr tr").eq(2).find("td").eq(2).find("#full_DoctorSpecialize").html());
	s=s.replace("<span><a href=\"#\" class=\"blue cp J_display_intro\">&lt;&lt; 收起</a></span>","")
	return $.trim(s);
}

function getMainUrl()
{
	//return $.trim($(".mr_line1 .clearfix").eq(0).find(".hh a").html());
	return $.trim($(".luj a").eq(5).attr("href"));
}


function getIntroUrl()
{
	var $a=$(".mr_line1").find("p").find("a");
	return indexUrl+$.trim($a.attr("href"));
}

function getIntro()
{
	//return $("#js_passportUserNameList").html();
	var s=$.trim($(".middletr tr").eq(3).find("td").eq(2).find("#full").html());
	s=s.replace("<span><a href=\"#\" class=\"blue cp J_display_intro\">&lt;&lt; 收起</a></span>","")
	return s.trim();
}


function getTicket()
{
	var ticketStr="";
	$("#doctorgood tr").eq(0).find("td").eq(0).find("a").each(function(i){
		if($(this).html!=undefined)
		{
			var split="";
			if(i!=0)
			{
				split=(i%2==0?",":"|");
			}
			ticketStr+=split;
			ticketStr+=$(this).html();
		}
		
	});
	return ticketStr;
}


function getJY()
{
	var jy=new Array();;
	$(".spacejy").each(function(i){
		// var j=$(this).find("tr").eq(2).find("table").find("tr").eq(1).find("td").eq(0).html();
		var j=$.trim($(this).html());
		jy.push(j);
	});
	return jy;
}


casper.start().eachThen(urls, function(response){
	this.thenOpen(response.data,function(response){
		this.thenEvaluate(injectJQuery);
		if(this.getCurrentUrl().indexOf("ajaxdoctorintro")<=0)
		{
			name=this.evaluate(getName);

			hospitoy=this.evaluate(getHospitoy);

			department=this.evaluate(getDepartMent);
			department=department.replace("&nbsp;","");

			goodat=this.evaluate(getGoodAt);
			
			intro=this.evaluate(getIntro);
			
			qualifications=this.evaluate(getQualifications);

			mainUrl=this.evaluate(getMainUrl);

			ticket=this.evaluate(getTicket);
		}
		else
		{
			
		}
		
	});
});

casper.thenOpen(jingyanUrl,function(){
	this.thenEvaluate(injectJQuery);
	jy=this.evaluate(getJY);
});


casper.then(function(){
	this.echo("name："+name); 
	this.echo("hospitoy："+hospitoy); 
	this.echo("department："+department); 
	this.echo("qualifications："+qualifications); 
	this.echo("goodat："+goodat);  
	this.echo("intro："+intro); 
	this.echo("mainUrl: "+mainUrl); 
	this.echo("ticket: "+ticket); 
	this.echo("jingyan: "+jy); 
	
});


casper.run(function(){
	this.exit();
});
