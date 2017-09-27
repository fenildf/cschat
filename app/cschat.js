/*
* @Author: victorsun
* @Date:   2017-09-08 09:56:26
* @Last Modified by:   victorsun
* @Last Modified time: 2017-09-27 16:33:10
*/

import './cschat.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import config from './config.json';

import message from './test.json';


class CsChat {
	constructor(avatar,uid) {  // 构造函数
		/**
		 * 公共常量
		 */
		// 是否启用此插件
		this.open = config.open;
		// 超时重连时间(s)
		this.timeout = config.timeout;
		// 心跳间隔(s)
		this.hbInterval = config.hbInterval;
		// 用户头像
		this.avatar = avatar;
		// 用户id
		this.uid = uid;
		// 时间管理器
		this.timestamp = [];

		/**
		 * 初始化
		 */
		this.init();
	}
	
	/**
	 * 页面初始化
	 * ---------------------------------------------------------------
	 */
	init(){

		// 初始化 websocket
		if(this.open){
			this.initWebSocket();
		}

		// 支持websocket才会加载组件
		if(this.open){
			// 初始化模板
			this.initTpl();
			// 初始化元素
			this.getElements();
			// 初始化页面布局
			this.initLayout();
			// 初始化事件
			this.initEvent();
			// 初始化数据
			this.initMsg();
		}
		
	}
	// 初始化模板
	initTpl(){
		const tpl = `
			<div id="cschat-pc-img">
				<!-- <img src="xiaozhi01.png" /> -->
				<div></div>
			</div>
			<div id="cschat-pc">
				<div class="container-fluid">
					<!-- 标题 start -->
					<div class="row">
						<div class="col-xs-2">
							<!-- <img src="xiaozhi02.png" height="46" width="46" alt="" /> -->
							<div></div>
						</div>
						<div class="col-xs-10">
							<h4>${config.name}</h4>
							<small>${config.description}</small>
						</div>
					</div>
					<!-- 标题 end -->
					<!-- 置顶消息 start -->
					<div class="row"></div>
					<!-- 置顶消息 end -->
					<!-- 内容 start -->
					<div class="row">
						<ul>
							<!-- <li class="from">...</li>
							<li class="to">...<img src="avatar.jpg" alt="avatar"></li>
							<li class="sys">...</li> -->
						</ul>
					</div>
					<!-- 内容 end -->
					<!-- 编辑区 start -->
					<div class="row">
						<!-- 编辑框 -->
						<div class="col-xs-12"><textarea class="userInput"></textarea></div>
						<!-- 功能按钮 -->
						<div class="col-xs-8"></div>
						<!-- 提交按钮 -->
						<div class="col-xs-4"><button class="btn btn-primary">发送</button></div>
					</div>
					<!-- 编辑区 end -->
				</div>
			</div>
			<div id="cschat-mobile-img">
				<!-- <img src="xiaozhi01.png" /> -->
				<div></div>
			</div>
			<div id="cschat-mobile">
				<div class="container-fluid">
					<!-- 标题 start -->
					<div class="row">
						<div class="col-xs-2">
							<!-- <img src="xiaozhi02.png" height="46" width="46" alt="" /> -->
							<div></div>
						</div>
						<div class="col-xs-10">
							<h4>${config.name}</h4>
							<small>${config.description}</small>
						</div>
					</div>
					<!-- 标题 end -->
					<!-- 置顶消息 start -->
					<div class="row"></div>
					<!-- 置顶消息 end -->
					<!-- 内容 start -->
					<div class="row">
						<ul>
							<!-- <li class="from">...</li>
							<li class="to">...<img src="avatar.jpg" alt="avatar"></li>
							<li class="sys">...</li> -->
						</ul>
					</div>
					<!-- 内容 end -->
					<!-- 编辑区 start -->
					<div class="row">
						<!-- 编辑框 -->
						<div class="col-xs-12"><textarea class="userInput"></textarea></div>
						<!-- 功能按钮 -->
						<div class="col-xs-8"></div>
						<!-- 提交按钮 -->
						<div class="col-xs-4"><button class="btn btn-primary">发送</button></div>
					</div>
					<!-- 编辑区 end -->
				</div>
			</div>
		`;
		// 插入html
		$("body").append(tpl);
	}
	// 获取页面元素
	getElements() {
		// PC
		if(clientType()==1){
			this.xzAvatar = $("#cschat-pc-img div"); // 小智头像
			this.dialog = $("#cschat-pc"); // 小智会话框
			this.alertArea = $("#cschat-pc .container-fluid>.row:nth-child(2)"); // 置顶消息区域
			this.eleContent = $("#cschat-pc .container-fluid>.row:nth-child(3)"); // 内容区
			this.ul = $("#cschat-pc .container-fluid>.row:nth-child(3) ul"); // 消息列表 ul
			this.btnSubmit =  $("#cschat-pc .row:nth-child(4) button:nth-child(1)"); // 提交按钮
			this.inputUser = $("#cschat-pc .userInput"); // 用户输入框
		}
		// mobile
		if(clientType()==2){
			this.xzAvatar = $("#cschat-mobile-img div"); // 小智头像
			this.dialog = $("#cschat-mobile"); // 小智会话框
			this.alertArea = $("#cschat-mobile .container-fluid>.row:nth-child(2)"); // 置顶消息区域
			this.eleContent = $("#cschat-mobile .container-fluid>.row:nth-child(3)"); // 内容区
			this.ul = $("#cschat-mobile .container-fluid>.row:nth-child(3) ul"); // 消息列表 ul
			this.btnSubmit =  $("#cschat-mobile .row:nth-child(4) button:nth-child(1)"); // 提交按钮
			this.inputUser = $("#cschat-mobile .userInput"); // 用户输入框
		}
	}
	
	// 初始化页面布局
	initLayout(){
		this.xzAvatar.parent().css("display","block");
		this.clientHeight = $(window).height(); // 浏览器可视区域高度
		// PC端需要适应高度
		if(clientType()==1){
			let imgHeight = ( this.clientHeight - this.xzAvatar.height() ) / 2 - 70;
			let dialogHeight = ( this.clientHeight - this.dialog.height() ) / 2;
			this.xzAvatar.css({"top":imgHeight});
			this.dialog.css("top",dialogHeight);
		}
		// 隐藏滚动条
		this.eleContent.css("marginRight","-"+(this.eleContent.width()-this.ul.width())+"px");
	}
	// 初始化消息内容
	initMsg() {
		const initMsg = config.initMsg;
		const msg = message.msg;
		initMsg.concat(msg).forEach( (ele)=> {
			switch(ele.type){
				case "top":
					this.addTopMsg(ele.msg);
					break;
				case "sys":
					this.addSysMsg(ele.msg);
					break;
				case "from":
					this.addFrom(ele.msg);
					break;
				case "to":
					this.addTo(ele.msg,this.avatar);
					break;
			}

		});
	}
	initEvent(){
		// 设置小智头像点击事件
		// const _this = this;
		this.xzAvatar.click(()=>{
			this.dialog.css("display","block");
			if(clientType()==1){
				this.dialog.animate({"right":"0"}, 500);
			}
			if(clientType()==2){
				// 横屏状态下禁止使用
				if(window.screen.width > window.screen.height){
					alert("请在竖屏状态下使用哦");
					return;
				}
				this.dialog.animate({"bottom":"0"}, 500);
			}
			this.msgAdjust();
		});
		// 提交按钮
		this.btnSubmit.click(()=>{
			let content = this.inputUser.val();
			this.addTo(content,this.avatar);
			this.sendMsg("to",content);
		});
		// 监听回车按键发送消息
		$(document).keydown((event)=>{
			let e = event || window.event || arguments.callee.caller.arguments[0];
			if(e && e.keyCode==13 && e.target.tagName == "TEXTAREA" && e.target.className == "userInput"){
				// 阻止换行操作，防止 textarea 中多一个换行符
				e.preventDefault();
				this.btnSubmit.click();
			}
		});
		// 点击alert关闭按钮
		this.alertArea.on('click', (event)=>{
		    // 【 事件委托 】
		    let ele = event.target?event.target:event.srcElement;
		    if(ele.tagName === "SPAN" && ele.innerHTML == "×"){
		    	// 获取最细的置顶消息内容框
				this.alertArea.find(".alert").on('closed.bs.alert', ()=>{
		    		this.msgAdjust();
		    	});
		    }
		});
		// 窗口大小改变
		$(window).on("resize",()=>{
			this.initLayout();
		});
		// 关闭dialog
		$(document).on("click",(e)=>{
			if (e.target!= this.xzAvatar[0] && e.target!= this.dialog[0] && !$.contains(this.dialog[0], e.target)){
				this.dialog.fadeOut(500,()=>{
					if(clientType()==1){
						this.dialog.css("right","-400px");
					}
					if(clientType()==2){
						this.dialog.css("bottom","-450px");
					}
				});
			}
		});
	}
	/*
	 * ---------------------------------------------------------------
	 */
	
	/**
	 * 公共方法
	 * ---------------------------------------------------------------
	 */
	// 置顶消息对 ul 的位置调整
	msgAdjust(){
		let height = 0;
		// 获取最细的置顶消息内容框
		const alertContent = this.alertArea.find(".alert");
		alertContent.each(function(key,val){
			height += val.clientHeight;
		});
		this.ul.animate({"marginTop":height + "px"},500);
	}
	// 滚动到最新消息
	scrollToLatest(){
		this.eleContent[0].scrollTop = this.eleContent[0].scrollHeight;
	}
	// 自动打时间戳
	// 原理：检测时间管理器数组，如果当前时间与最后一次时间戳相差超过两分钟，则添加
	checkTimestamp(){
		let now = Date.parse(new Date());
		// 如果是第一次检测，直接添加当前时间
		if(this.timestamp.length == 0){
			this.timestamp.push(now);
			this.addTimestamp(now);
		}
		// 否则检测与最后一次时间的时差
		else{
			let lastTime = this.timestamp[this.timestamp.length-1];
			if( now - lastTime >= 60*1000 ){
				this.timestamp.push(now);
				this.addTimestamp(now);
			}
		}
	}

	/**
	 * ---------------------------------------------------------------
	 */
	
	/**
	 * 前端对5种消息的 DOM 操作
	 * ---------------------------------------------------------------
	 */
	// 添加置顶消息
	addTopMsg(val){
		val = val? val : "当前聊天人数过多……";
		let content = 
			`<div class="alert alert-warning alert-dismissible pull-left fade in" role="alert">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>`;
		if(config.showMsgType === "true"){
			content += `<strong>置顶消息:</strong> `;
		}
		content = content + val + `</div>`;
		// 追加内容
		this.alertArea.prepend(content);
		// 调整内容区域内容位置
		this.msgAdjust();
	}

	// 添加系统消息
	addSysMsg(val){
		val = val? val : "系统出故障了哦!";
		let content = '<li class="sys">';
		if(config.showMsgType == "true"){
			content += '<strong>系统消息：</strong> ';
		}
		content = content + val + '</li>';
		// 追加内容
		this.ul.append(content);
		// 滚动到最新消息
		this.scrollToLatest();
	}

	// 添加时间戳
	addTimestamp(val){
		let content = '<li class="sys">';
		let time = new Date(val).format("yyyy-MM-dd hh:mm:ss");
		content = content + time + '</li>';

		// 追加内容
		this.ul.append(content);
		// 滚动到最新消息
		this.scrollToLatest();
	}

	// 添加用户发送消息
	addTo(val,avatar){
		if(!val){
			alert("输入内容不能为空!");
			return;
		}
		// 检测添加时间戳
		this.checkTimestamp();

		const content = '<li class="to">'+ val + '<img src="' + avatar + '" alt="avatar" /></li>';
		// 追加内容
		this.ul.append(content);
		// 清空输入框
		this.inputUser.val("");
		// 滚动到顶部
		this.scrollToLatest();
	}
	// 添加小智发送消息
	addFrom(val){
		val = val? val : "系统出故障了哦!";
		// 检测添加时间戳
		this.checkTimestamp();

		const content = '<li class="from">' + val + '</li>';
		// 追加内容
		this.ul.append(content);
		// 滚动到最新消息
		this.scrollToLatest();
	}
	/**
	 * websocket
	 * ---------------------------------------------------------------
	 * 1. 连接建立（页面初始化）
	 *    发送
	 *    {'type':'init', 'uid':'19931128', 'url':'http://www.……', 'service':'CF' }
	 *    接收
	 *    {'code':'200', 'type':'init', 'result':'alert("成功");'}
	 * 2. 发送 & 接收数据
	 *    发送
	 *    {'type':'to', 'msg':'xxxxx' }
	 *    接收
	 *    {'code':'200', 'type':'from', 'msg':'xxxxx', 'result':'' }
	 *    {'code':'200', 'type':'top', 'msg':'xxxxx', 'result':'' }
	 *    {'code':'200', 'type':'sys', 'msg':'xxxxx', 'result':'alert("xxx");' }
	 * 3. 心跳（1.检查登录态  2.连接状态检查并重连  3.上报用户操作数据(心跳msg)）
	 *    发送
	 *    {'type': 'hb', 'statistics':'' }
	 *    {'type':'init', 'uin':'19931128', 'url':'http://www.……', 'service':'CF' }
	 *    接收
	 *    {'code':'200', 'type':'hb', 'result':'' }
	 *    {'code':'200', 'type':'init', 'result':'alert("成功");'}
	 * 4. 错误返回，code非200即错误返回，直接执行result
	 *    {'code':'500', 'result':'alert("执行失败");' }
	 * 
	 */
	// websocket 初始化
	initWebSocket(){
		if (window.WebSocket) {

			this.ws = new WebSocket(config.server);
			// open
			this.ws.onopen = (event) => {
				this.initConnect();
				console.log("Connection open ...");
			};
			// received
			this.ws.onmessage = (event) => {
				this.receiveMsg(event.data);
				console.log("Received data ...");
			};
			// close
			this.ws.onclose = (event) => {
				console.log("Connection closed ...");
				this.ws.close();
			};
			// error
			this.ws.onerror = (event) => {
				console.log(event);
			};
		} else {
			// 不支持 websocket
	        this.open = false;
	    }
	}
	// 初始化连接
	initConnect(){
		this.uid = this.uid?this.uid:0;
		this.sendMsg("init");
	}

	// 心跳  1.检查登录态  2.连接状态检查并重连  3.上报用户操作数据(心跳msg)
	heartBeatInterval(){
		this.setInterval(()=>{
			// 1. checkLogin
			
			// 2. checkStatus
			checkConnect();
			// 3. uploadData
			let jsonObj =
				{

				};
			this.sendMsg(JSON.stringify(jsonObj));
			
		}, this.hbInterval * 1000);
	}

	// 发送信息
	sendMsg(type,content){
		let jsonObj = {};
		switch(type){
			case "init":
				jsonObj =
					{
					    "type":"init",
					    "uid":this.uid,
					    "url":config.url,
					    "service":config.service
					};
				break;
			case "to":
				jsonObj =
					{
					    "type":"to",
					    "msg":content
					};
				break;
			case "hb":
				jsonObj =
					{
					    "type":"hb",
					    "statistics":content
					};
				break;
		}
		content = JSON.stringify(jsonObj);
		// 自动重连
		this.checkConnect(content);
	}

	// 接收消息，收到json
	receiveMsg(content){
		let data = JSON.parse(content);
		switch(data.type){
			case "from":
				this.addFromMsg(data.msg);
				break;
			case "top":
				this.addTopMsg(data.msg);
				break;
			case "sys":
				this.addSysMsg(data.msg);
				break;
		}
	}

	// 检测连接状态
	checkConnect(content){
		// 状态非连接，则重连
		if (this.ws.readyState !== 1) {
	        this.ws.close();
	        this.initWebSocket();
	        // 如果有内容，则发送
	        if(content){
	        	this.ws.send(content);
	        }
	        // 再次检测状态
	        setTimeout( () => {
	        	this.checkConnect();
	        }, this.timeout * 1000);

	        this.timeout = this.timeout * 2;
	        if (this.timeout >= 60) {
	            this.timeout = 60;
	        }
	        return false;
	    } else {
	    	// 如果有内容，则发送
	        if(content){
	        	this.ws.send(content);
	        }
	    	this.timeout = config.timeout;
	    	return true;
	    };
		
	}
};

// 时间戳转换
Date.prototype.format = function(data){ 
	// 星期转换
	var convertWeek = function(day, language){
		var data;
		switch(language){
			case "ch":
				data = ["日","一","二","三","四","五","六"];
				return data[day];
			case "en":
				data = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
				return data[day];
			default:
				return day;
		}
	}
	var o = {
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
		"M+": this.getMonth() + 1, //month 
		"d+": this.getDate(), //day 
		"h+": this.getHours(), //hour 
		"m+": this.getMinutes(), //minute 
		"s+": this.getSeconds(), //second 
		"S": this.getMilliseconds(), //millisecond 3位
		"T": convertWeek(this.getDay(),"ch"), //week 中文
		"t": convertWeek(this.getDay(),"en"), //week 英文
		"w": this.getDay(), //week number
	}
	// 单独处理年份
	if (/(y+)/.test(data)) {
		// RegExp.$1 第一个子匹配
		data = data.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	// 处理其他属性
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(data)) {
			// 按长度赋值
			data = data.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return data;
}

/**
 * 判断客户端类型
 * 1 PC
 * 2 mobile phone
 */
function clientType(){
	if('ontouchstart' in document){
		return 2;
	}
	return 1;
}


export default CsChat; 
