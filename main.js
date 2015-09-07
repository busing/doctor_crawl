var fs = require('fs');
var child_process = require('child_process');
var property=require("./propertyUtil.js")
var hospitayListUrl="http://www.haodf.com/yiyuan/jiangsu/list.htm";
var crawl_doctor_count=0;
var hospitalUrlLog='logs\\doctor.log';

var lastHospitalUrl="";
var lastPageNo=1;

function initProperty()
{
	var logStr=readHospitalUrl().toString().trim();
	console.log("logStr:"+logStr);
	if(logStr!="")
	{
		lastHospitalUrl=logStr.split(",")[0];
		lastPageNo=logStr.split(",")[1];
		lastPageNo++;
	}
	console.log("lastHospitalUrl:"+lastHospitalUrl);
	console.log("lastPageNo:"+lastPageNo);
}

function main()
{
	var hospitayUrlStr=child_process.execSync("casperjs hospitayUrlList.js --url="+hospitayListUrl).toString();
	console.log("hospitayUrlStr:"+hospitayUrlStr);
	
	var hospitalUrlArrar=hospitayUrlStr.split(",");
	var start=0;
	if(lastHospitalUrl!="")
	{
		start=indexOfArray(hospitalUrlArrar,lastHospitalUrl);
	}
	console.log("start:"+start);
	for(var  i=start;i<hospitalUrlArrar.length;i++)
	{
		var hospitayUrl=hospitalUrlArrar[i];
		console.log("hospitayUrl:"+hospitayUrl);
		var hospital_info=child_process.execSync("casperjs pageOfDoctor.js --url="+hospitayUrl).toString();
		page=hospital_info.split(",")[0];
		hospitalName=hospital_info.split(",")[1].trim();
		hospitalId=hospital_info.split(",")[2].trim();
		console.log("获取到医生数量页数："+page);

		for(var i=lastPageNo;i<=page;i++)
		{
			getDocUrls(hospitayUrl,i,hospitalId);
			fs.writeFileSync(hospitalUrlLog,hospitayUrl+","+i);
		}
		lastPageNo=1;
	}
}



function getDocUrls(hospitayUrl,pageNo,hospitalId)
{

	var index=hospitayUrl.lastIndexOf(".");
	var url=hospitayUrl.substring(0,index)+"_"+pageNo+hospitayUrl.substring(index);
	console.log("get doctor url from ===========> "+url);
	//爬取医院有多少页的医生信息
	var urlData= child_process.execSync('casperjs doctorUrlList.js --url='+url,{timeout:1000*30}).toString(); 
	// urlData="http://www.haodf.com/doctor/DE4r08xQdKSLfK1YHTyyMxUNjSNk.htm,http://www.haodf.com/doctor/DE4r08xQdKSLPTLPxtdX6gWDmEzh.htm";
	// console.log("urlData:"+urlData);
	var docUrls=urlData.split(",");
	console.log("获取到医生url数量："+docUrls.length);
	getDoctorInfo(docUrls,hospitalId);
}


function getDoctorInfo(urls,hospitalId)
{
	for(var i in urls)
	{
		var docUrl=urls[i];
		// console.log("获取医生信息："+docUrl);
		var doctorInfo = child_process.execSync('casperjs baseinfo.js --url='+docUrl).toString(); 
		crawl_doctor_count++;
		console.log("已经爬取医生信息数量："+crawl_doctor_count)
		logDoctor2File(doctorInfo,hospitalId);
	}
}


function logDoctor2File(data,hospitalId)
{
	//记录数据到文件
	var fileName="data\\"+hospitalId+'_doctor.txt';
	var exists=fs.existsSync(fileName);
	console.log("write to file "+fileName);
	if(!exists)
	{
		fs.writeFileSync(fileName, data);
	}
	else
	{
		fs.appendFileSync(fileName, data);
	}
}

function readHospitalUrl()
{
	var exists=fs.existsSync(hospitalUrlLog);
	if(exists)
	{
		return fs.readFileSync(hospitalUrlLog);
	}
	return "";
	
}

function indexOfArray(arr,s)
{
	for(var i in arr)
	{
		if(s==arr[i])
		{
			return i;
		}
	}
	return 0;
}
initProperty();
//启动
main();