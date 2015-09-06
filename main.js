var fs = require('fs');
var child_process = require('child_process');
var hospitoryUrl="http://www.haodf.com/hospital/DE4roiYGYZwX-bc2dcByMhc7g/menzhen.htm";
// var hospitoyOfDoctorUrl="http://www.haodf.com/hospital/DE4roiYGYZwX-bc2dcByMhc7g/menzhen.htm";

var page=child_process.execSync("casperjs pageOfDoctor.js --url="+hospitoryUrl);
console.log("获取到医生数量页数："+page);
for(var i=1;i<=page;i++)
{
	getDocUrls(i);
}



function getDocUrls(pageNo)
{
	var index=hospitoryUrl.lastIndexOf(".");
	var url=hospitoryUrl.substring(0,index)+"_"+pageNo+hospitoryUrl.substring(index);
	console.log("hospitalUrl："+url);
	//爬取医院有多少页的医生信息
	var urlData= child_process.execSync('casperjs doctorUrlList.js --url='+url,{timeout:1000*30}).toString(); 
	// urlData="http://www.haodf.com/doctor/DE4r08xQdKSLfK1YHTyyMxUNjSNk.htm,http://www.haodf.com/doctor/DE4r08xQdKSLPTLPxtdX6gWDmEzh.htm";
	console.log("urlData:"+urlData);
	var docUrls=urlData.split(",");
	console.log("获取到医生主页的url数量："+docUrls.length);
	getDoctorInfo(docUrls);
}


function getDoctorInfo(urls)
{
	for(i in urls)
	{
		var docUrl=urls[i];
		var doctorInfo = child_process.execSync('casperjs baseinfo.js --url='+docUrl).toString(); 
		console.log(doctorInfo)
		log2File(doctorInfo);
	}
}


function log2File(data)
{

	//记录数据到文件
	fs.exists('d:\\data.txt', function(exists){
		console.log("log to file---->"+exists)
		if(!exists)
		{
			fs.writeFile('d:\\data.txt',data,function(err){});
		}
		else
		{
			fs.appendFile('d:\\data.txt',data);
		}
	   
	});
}
