/*
* @Author: victorsun
* @Date:   2017-09-08 09:56:26
* @Last Modified by:   victorsun
* @Last Modified time: 2017-09-13 11:06:22
*/

import './cschat.less';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// const CsChat = {
class CsChat {
	constructor(avatar,uid) {  // 构造函数
		this.avatar : avatar,
		this.uid : uid
	}

	tpl : `
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
							<h4>小智智能客服</h4>
							<small>颜值爆表，既能萌萌哒，又能。。。</small>

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
		`,
	/**
	 * 初始化信息
	 */
	
	// jQuery elements
	clientHeight : {}, // 浏览器可视区域高度
	xzAvatar : {}, // 小智头像
	dialog : {}, // 小智会话框
	alertArea : {}, // 置顶消息区域
	eleContent : {}, // 内容区
	ul : {}, // 消息列表 ul
	btnSubmit : {}, // 提交按钮
	inputUser : {}, // 用户输入框

	getElements : () => {
		clientHeight = $(window).height(); // 浏览器可视区域高度
		xzAvatar = $("#pc-img div"); // 小智头像
		dialog = $("#pc"); // 小智会话框
		alertArea = $("#pc .container-fluid>.row:nth-child(2)"); // 置顶消息区域
		eleContent = $("#pc .container-fluid>.row:nth-child(3)"); // 内容区
		ul = $("#pc .container-fluid>.row:nth-child(3) ul"); // 消息列表 ul
		btnSubmit =  $("#pc .row:nth-child(4) button:nth-child(1)"); // 提交按钮
		inputUser = $(".userInput"); // 用户输入框
	},

	// 初始化消息内容
	initMsg() {
		addFrom("CS逍遥剑仙，你好呀，我是小智智能客服");
		addFrom("上个月你一共参加了20场排位赛，胜率80%，在好友中排名第一，再接再厉哦！");
		addTo("请教对局技巧",avatar);
		addSysMsg("小智很厉害的哦~~~");
		addFrom("我们为您准备了一份秘籍……");
		addTo("我想知道我的好友的战绩",avatar);
		addFrom("<a href='http://www.csxiaoyao.com'>http://www.csxiaoyao.com</a>");
		addTo("谢谢啊，你好厉害啊，你叫什么名字呀？",avatar);
		var top1 = "欢迎使用小智";
		var top2 = "欢迎使用小智智能客服，小智智能客服，小智智能客服，小智智能客服";
		addTopMsg(top1);
		addTopMsg(top2);
	},

	// 前端添加置顶消息内容
	addTopMsg(val){
		val = val? val : "当前聊天人数过多……";
		var content = 
			`<div class="alert alert-warning alert-dismissible pull-left fade in" role="alert">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
				<strong>置顶消息:</strong> `+ val +`
			</div>`;
		// 追加内容
		alertArea.prepend(content);
		// 调整内容区域内容位置
		msgAdjust();
	},
	// 置顶消息对 ul 的位置调整
	msgAdjust(){
		var height = 0;
		// 获取最细的置顶消息内容框
		var alertContent = alertArea.find(".alert");
		alertContent.each(function(key,val){
			height += val.clientHeight;
		});
		ul.animate({"marginTop":height + "px"},500);
	},

	// 前端添加用户发送消息内容
	addTo(val,avatar){
		if(!val){
			alert("输入内容不能为空!");
			return;
		}
		var content = '<li class="to">'+ val + '<img src="' + avatar + '" alt="avatar" /></li>';
		// 追加内容
		ul.append(content);
		// 滚动到顶部
		scrollToLatest();
		// 清空输入框
		inputUser.val("");
	},
	// 前端添加小智发送消息内容
	addFrom(val){
		val = val? val : "系统出故障了哦!";
		var content = '<li class="from">' + val + '</li>';
		// 追加内容
		ul.append(content);
		// 滚动到最新消息
		scrollToLatest();
	},

	// 前端添加系统消息内容
	addSysMsg(val){
		val = val? val : "系统出故障了哦!";
		var content = '<li class="sys"><strong>系统消息：</strong>' + val + '</li>';
		// 追加内容
		ul.append(content);
		// 滚动到最新消息
		scrollToLatest();
	},

	// 滚动到最新消息
	scrollToLatest(){
		eleContent[0].scrollTop = eleContent[0].scrollHeight;
	},

	// 加载配置，布局等
	load(){
		var imgHeight = ( clientHeight - xzAvatar.height() ) / 2 - 70;
		var dialogHeight =  ( clientHeight - dialog.height() ) / 2;
		xzAvatar.css("top",imgHeight);
		dialog.css("top",dialogHeight);
		// 隐藏滚动条
		hideScroll();
	},

	// 滚动条隐藏
	hideScroll(){
		eleContent.css("marginRight","-"+(eleContent.width()-ul.width())+"px");
	},



	// 初始化，加载数据
	init(){
		// 插入html
		$("body").append(this.tpl);

		// 获取元素
		this.getElements();

		// 加载布局配置
		this.load();

		// 初始化数据
		this.initMsg();

		// 设置小智头像点击事件
		this.xzAvatar.click(function(){
			this.dialog.css("display","block");
			this.dialog.animate({"right":"0"}, 500);
			this.msgAdjust();
		});

		// 提交按钮
		this.btnSubmit.click(function(){
			this.addTo(inputUser.val(),this.avatar);
			this.addFrom();
		});
		// 监听回车按键发送消息
		$(document).keydown(function(event){
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if(e && e.keyCode==13 && e.target.tagName == "TEXTAREA" && e.target.className == "userInput"){
				// 阻止换行操作，防止 textarea 中多一个换行符
				e.preventDefault();
				btnSubmit.click();
			}
		});

		// 点击alert关闭按钮
		alertArea.on('click', function(event){
		    // 【 事件委托 】
		    var ele = event.target?event.target:event.srcElement;
		    if(ele.tagName === "SPAN" && ele.innerHTML == "×"){
		    	// 获取最细的置顶消息内容框
				alertArea.find(".alert").on('closed.bs.alert', function(){
		    		msgAdjust();
		    	});
		    }
		});

		// 窗口大小改变
		$(window).on("resize",function (e) {
			getElements();
			load();
		});

		// 关闭dialog
		$(document).on("click",function (e) {
			var pop = dialog[0];
			var avatar = xzAvatar[0];
			if (e.target!= avatar && e.target!= pop && !$.contains(pop, e.target)){
				dialog.fadeOut(500,function(){
					dialog.css("right","-400px");
				});
			}
		});

	}

};

export default CsChat; 
