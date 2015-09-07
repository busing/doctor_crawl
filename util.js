/**
 * 工具类
 */

//注入jquery文件
function injectJQuery()
{
	document.write("<script src='http://libs.baidu.com/jquery/1.9.1/jquery.min.js'></script>");
	String.prototype.trim = function() 
	{ 
		return this.replace(/\s*/g, ""); 
	} 
}

//String trim 方法
String.prototype.trim= function(){  
    // 用正则表达式将前后空格  
    // 用空字符串替代。  
    return this.replace(/\s*/g, "");  
}

//模块导出方法
module.exports.injectJQuery = injectJQuery;