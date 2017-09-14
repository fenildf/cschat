/*
* @Author: victorsun
* @Date:   2017-09-08 09:56:26
* @Last Modified by:   victorsun
* @Last Modified time: 2017-09-14 11:23:18
*/

import './cschat.less';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import config from './config.json';
import message from './test.json';
// const CsChat = {
class CsChat {
	constructor(avatar,uid) {  // 构造函数
		this.avatar = avatar;
		this.uid = uid;
		this.init();

	}
	
	/**
	 * 页面初始化
	 * ---------------------------------------------------------------
	 */
	init(){
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
	// 初始化模板
	initTpl(){
		const tpl = `
			<div id="pc-img">
				<!-- <img src="xiaozhi01.png" /> -->
				<div></div>
			</div>
			<div id="pc">
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
		this.xzAvatar = $("#pc-img div"); // 小智头像
		this.dialog = $("#pc"); // 小智会话框
		this.alertArea = $("#pc .container-fluid>.row:nth-child(2)"); // 置顶消息区域
		this.eleContent = $("#pc .container-fluid>.row:nth-child(3)"); // 内容区
		this.ul = $("#pc .container-fluid>.row:nth-child(3) ul"); // 消息列表 ul
		this.btnSubmit =  $("#pc .row:nth-child(4) button:nth-child(1)"); // 提交按钮
		this.inputUser = $(".userInput"); // 用户输入框
	}
	
	// 初始化页面布局
	initLayout(){
		this.clientHeight = $(window).height(); // 浏览器可视区域高度
		let imgHeight = ( this.clientHeight - this.xzAvatar.height() ) / 2 - 70;
		let dialogHeight =  ( this.clientHeight - this.dialog.height() ) / 2;
		this.xzAvatar.css("top",imgHeight);
		this.dialog.css("top",dialogHeight);
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
		const _this = this;
		this.xzAvatar.click(()=>{
			this.dialog.css("display","block");
			this.dialog.animate({"right":"0"}, 500);
			this.msgAdjust();
		});
		// 提交按钮
		this.btnSubmit.click(()=>{
			this.addTo(this.inputUser.val(),this.avatar);
			this.addFrom();
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
					this.dialog.css("right","-400px");
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
	/**
	 * ---------------------------------------------------------------
	 */
	
	/**
	 * 前端对4种消息的 DOM 操作
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

	// 添加用户发送消息
	addTo(val,avatar){
		if(!val){
			alert("输入内容不能为空!");
			return;
		}
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
		const content = '<li class="from">' + val + '</li>';
		// 追加内容
		this.ul.append(content);
		// 滚动到最新消息
		this.scrollToLatest();
	}
	/**
	 * ---------------------------------------------------------------
	 */
	

};

export default CsChat; 