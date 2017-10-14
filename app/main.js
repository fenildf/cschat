/*
* @Author: victorsun
* @Date:   2017-09-05 10:03:16
* @Last Modified by:   victorsun
* @Last Modified time: 2017-10-13 17:50:55
*/

// 浏览器中调用方式
// cschat("http://www.csxiaoyao.com/src/img/logo.png","1724338257");

import CsChat from './cschat';
import browserType from './browserType.js';

window.cschat = function(avatar,uin){
	if(browserType.BrowserType()){
		var csChat = new CsChat(avatar,uin);
	}else{
		alert("浏览器不支持");
	}
}