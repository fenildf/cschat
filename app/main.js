/*
* @Author: victorsun
* @Date:   2017-09-05 10:03:16
* @Last Modified by:   victorsun
* @Last Modified time: 2017-09-14 16:47:55
*/
import CsChat from './cschat';
import browserType from './browserType.js';

if(browserType.BrowserType()){
	let csChat = new CsChat("http://www.csxiaoyao.com/src/img/logo.png");
}else{
	alert("浏览器不支持");
}
