/*
* @Author: victorsun
* @Date:   2017-09-14 14:32:07
* @Last Modified by:   victorsun
* @Last Modified time: 2017-09-14 16:46:15
*/

//判断当前浏览类型
class BrowserType {
	static BrowserType() {
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
		var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
		var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
		var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
		var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
		var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

		if (isIE) {
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
			reIE.test(userAgent);
			var fIEVersion = parseFloat(RegExp["$1"]);
			if (fIEVersion == 10) {
				return "IE10";
			} else if (fIEVersion == 11) {
				return "IE11";
			} else {
				return "0"
			} //IE版本过低
		} //isIE end

		if (isFF) {
			return "FF";
		}
		if (isOpera) {
			return "Opera";
		}
		if (isSafari) {
			return "Safari";
		}
		if (isChrome) {
			return "Chrome";
		}
		if (isEdge) {
			return "Edge";
		}
	}
}

export default BrowserType; 