var fs = require('fs');
var spawn = require('child_process');
var hospitoryUrl="http://www.haodf.com/hospital/DE4roiYGYZwX-bc2dcByMhc7g/menzhen.htm";
// var hospitoyOfDoctorUrl="http://www.haodf.com/hospital/DE4roiYGYZwX-bc2dcByMhc7g/menzhen.htm";
var docUrls=new Array();


free=spawn.exec("casperjs pageOfDoctor.js --url="+hospitoryUrl);
free.stdout.on('data',function(data){
	var page=data;
	console.log("获取到医生数量页数："+page);
	for(var i=1;i<=3;i++)
	{
		getDocUrls(i);
	}
});


function getDocUrls(pageNo)
{
	var index=hospitoryUrl.lastIndexOf(".");
	var url=hospitoryUrl.substring(0,index)+"_"+pageNo+hospitoryUrl.substring(index);
	console.log("hospitalUrl："+url);
	//爬取医院有多少页的医生信息
	free = spawn.exec('casperjs doctorUrlList.js --url='+url); 
	free.stdout.on('data',function(data){
		docUrls=data.split(",");
		console.log("获取到医生主页的url数量："+docUrls.length);
		getDoctorInfo(docUrls);
	});
}


function getDoctorInfo(urls)
{
	for(i in urls)
	{
		var docUrl=docUrls[i];
		free = spawn.exec('casperjs baseinfo.js --url='+docUrl); 
		free.stdout.on('data',function(data){
			console.log(data)
			log2File(data);
		});
	}
}


function log2File(data)
{
	//记录数据到文件
	fs.exists('data.txt', function(exists){
		if(!exists)
		{
			fs.writeFile('data.txt',data,function(err){});
		}
		else
		{
			fs.appendFile('data.txt',data);
		}
	   
	});
}



// 注册子进程关闭事件 
free.on('exit', function (code, signal) { 
	console.log('child process eixt ,exit:' + code); 
});