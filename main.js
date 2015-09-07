/**
 * 主js node main.js
 */
var fs = require('fs');
var child_process = require('child_process');

//医院列表url
var hospitayListUrl="http://www.haodf.com/yiyuan/jiangsu/list.htm";
//爬虫计数器  记录爬取医生信息的数量
var crawl_doctor_count=0;
//采集日志文件目录
var hospitalUrlLog='logs\\doctor.log';
//最后采集的医院url 用于关闭爬虫打开可以增量采集
var lastHospitalUrl="";
//最后采集的页数 默认为1
var lastPageNo=1;

//初始化采集的医院的页数
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

//入口方法
function main()
{
	//获取医院url列表
	var hospitayUrlStr=child_process.execSync("casperjs hospitayUrlList.js --url="+hospitayListUrl).toString();
	console.log("hospitayUrlStr:"+hospitayUrlStr);
	//分割
	var hospitalUrlArrar=hospitayUrlStr.split(",");
	var start=0;
	//判断是否存在日志，如果有日志则根据医院和分页继续采集，没有则从头开始采集
	if(lastHospitalUrl!="")
	{
		start=indexOfArray(hospitalUrlArrar,lastHospitalUrl);
	}
	console.log("start:"+start);
	//遍历医院url
	for(var  i=start;i<hospitalUrlArrar.length;i++)
	{
		var hospitayUrl=hospitalUrlArrar[i];
		//采集医院基本信息（医院的医生分页数、医院名称、医院的id）
		var hospital_info=child_process.execSync("casperjs pageOfDoctor.js --url="+hospitayUrl).toString();
		page=hospital_info.split(",")[0];
		hospitalName=hospital_info.split(",")[1].trim();
		hospitalId=hospital_info.split(",")[2].trim();

		console.log("获取到医生数量页数："+page);
		//开始遍历分页采集医生url 判断是否有日志分页数据，没有则从1开始
		for(var i=lastPageNo;i<=page;i++)
		{
			//采集医生url
			getDocUrls(hospitayUrl,i,hospitalId);
			//每页的数据采集完毕，记录日志，更新采集进度，以便程序被关闭打开可以继续采集
			fs.writeFileSync(hospitalUrlLog,hospitayUrl+","+i);
		}
		lastPageNo=1;
	}
}


//采集医生主页url
function getDocUrls(hospitayUrl,pageNo,hospitalId)
{
	//url增加分页参数
	var index=hospitayUrl.lastIndexOf(".");
	var url=hospitayUrl.substring(0,index)+"_"+pageNo+hospitayUrl.substring(index);
	console.log("get doctor url from ===========> "+url);

	//采集当前页面所有的医生url
	var urlData= child_process.execSync('casperjs doctorUrlList.js --url='+url,{timeout:1000*30}).toString(); 
	var docUrls=urlData.split(",");
	console.log("获取到医生url数量："+docUrls.length);
	//采集医生信息
	getDoctorInfo(docUrls,hospitalId);
}

//批量采集医生信息
function getDoctorInfo(urls,hospitalId)
{
	for(var i in urls)
	{
		var docUrl=urls[i];
		//采集医生信息
		var doctorInfo = child_process.execSync('casperjs baseinfo.js --url='+docUrl).toString(); 
		//计数器
		crawl_doctor_count++;
		console.log("已经爬取医生信息数量："+crawl_doctor_count);
		//将医生信息追加到文件，一个医院一个文件
		logDoctor2File(doctorInfo,hospitalId);
	}
}

//记录医生信息
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

//读取医院的url信息
function readHospitalUrl()
{
	var exists=fs.existsSync(hospitalUrlLog);
	if(exists)
	{
		return fs.readFileSync(hospitalUrlLog);
	}
	return "";
	
}

//indexOf
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

//初始化参数
initProperty();
//启动采集程序
main();