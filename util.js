function injectJQuery()
{
	document.write("<script src='http://libs.baidu.com/jquery/1.9.1/jquery.min.js'></script>");
	String.prototype.trim = function() 
	{ 
		return this.replace(/\s*/g, ""); 
	} 
}



String.prototype.trim= function(){  
    // 用正则表达式将前后空格  
    // 用空字符串替代。  
    return this.replace(/\s*/g, "");  
}


module.exports.injectJQuery = injectJQuery;