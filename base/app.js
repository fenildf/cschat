/*
* @Author: victorsun
* @Date:   2017-09-08 09:56:26
* @Last Modified by:   victorsun
* @Last Modified time: 2017-09-08 16:25:42
*/
/**
 * 初始化信息
 */
var avatar = "avatar.jpg";
// 初始化消息内容
function initMsg(){
	addFrom("CS逍遥剑仙，你好呀，我是小智智能客服");
	addFrom("上个月你一共参加了20场排位赛，胜率80%，在好友中排名第一，再接再厉哦！");
	addTo("请教对局技巧",avatar);
	addSysMsg("小智很厉害的哦~~~");
	addFrom("我们为您准备了一份秘籍……");
	addTo("我想知道我的好友的战绩",avatar);
	addFrom("<a href='http://www.csxiaoyao.com'>http://www.csxiaoyao.com</a>");
	addTo("谢谢啊，你好厉害啊，你叫什么名字呀？",avatar);
	var top = "欢迎使用小智智能客服，小智智能客服，小智智能客服，小智智能客服";
	addTopMsg(top);
	addTopMsg(top);
}

/**
 * jQuery elements
 */

// 浏览器可视区域高度
var clientHeight;
// 小智头像
var xzAvatar;
// 小智会话框
var dialog;
// 内容区
var eleContent;
// 消息列表 ul
var ul;
// 提交按钮
var btnSubmit;
// 用户输入框
var inputUser;

function getElements(){
	// 浏览器可视区域高度
	clientHeight = $(window).height();
	// 小智头像
	xzAvatar = $("#pc-img img");
	// 小智会话框
	dialog = $("#pc");
	// 内容区
	eleContent = $("#pc .container-fluid>.row:nth-child(2)");
	// 消息列表 ul
	ul = $("#pc .container-fluid>.row:nth-child(2) ul");
	// 提交按钮
	btnSubmit =  $("#pc .row:nth-child(3) button:nth-child(1)");
	// 用户输入框
	inputUser = $(".userInput");
};
getElements();

// 滚动条隐藏
function hideScroll(){
	eleContent.css("marginRight","-"+(eleContent.width()-ul.width())+"px");
}


// 监听回车按键发送消息
document.onkeydown=function(event){
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if(e && e.keyCode==13 && e.target.tagName == "TEXTAREA" && e.target.className == "userInput"){
		btnSubmit.click();
	}
};

// 前端添加置顶消息内容
function addTopMsg(val){
	val = val? val : "当前聊天人数过多……";
	var content = 
		`<div class="alert alert-warning alert-dismissible pull-left fade in" role="alert">
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
			<strong>置顶消息:</strong> `+ val +`
		</div>`;
	// 追加内容
	eleContent.prepend(content);
}

// 前端添加用户发送消息内容
function addTo(val,avatar){
	if(!val){
		alert("输入内容不能为空!");
		return;
	}
	var content = '<li class="to">'+ val + '<img src="' + avatar + '" alt="avatar"></li>';
	// 追加内容
	ul.append(content);
	// 滚动到顶部
	scrollToLatest();
	// 清空输入框
	inputUser.val(null);
}
// 前端添加小智发送消息内容
function addFrom(val){
	val = val? val : "系统出故障了哦!";
	var content = '<li class="from">' + val + '</li>';
	// 追加内容
	ul.append(content);
	// 滚动到最新消息
	scrollToLatest();
}

// 前端添加系统消息内容
function addSysMsg(val){
	val = val? val : "系统出故障了哦!";
	var content = '<li class="sys"><strong>系统消息：</strong>' + val + '</li>';
	// 追加内容
	ul.append(content);
	// 滚动到最新消息
	scrollToLatest();
}

// 置顶消息对 ul 的位置调整
function msgAdjust(){
	var height = 0;
	var alertContent = $("#pc .container-fluid>.row:nth-child(2)>.alert");
	alertContent.each(function(key,val){
		height += val.clientHeight;
	});
	ul.animate({"marginTop":height + "px"},500);
}

// 滚动到最新消息
function scrollToLatest(){
	eleContent[0].scrollTop = eleContent[0].scrollHeight;
}



// 初始化，加载数据
(function init(){

	// 加载布局配置
	load();

	// 初始化数据
	initMsg();

	// 设置小智头像点击事件
	xzAvatar.click(function(){
		dialog.css("display","block");
		dialog.animate({"right":"0"}, 500);
		msgAdjust();
	});

	// 提交按钮
	btnSubmit.click(function(){
		addTo(inputUser.val(),avatar);
		addFrom();
	});

	// 点击alert关闭按钮
	eleContent.on('click', function(event){
	    // 【 事件委托 】
	    var ele = event.target?event.target:event.srcElement;
	    if(ele.tagName === "SPAN" && ele.innerHTML == "×"){
	    	// 置顶消息框
			$(this).find(".alert").on('closed.bs.alert', function(){
	    		msgAdjust();
	    	});
	    }
	});
})();

// 加载配置，布局等
function load(){
	var imgHeight = ( clientHeight - xzAvatar.height() ) / 2 - 70;
	var dialogHeight =  ( clientHeight - dialog.height() ) / 2;
	xzAvatar.css("top",imgHeight);
	dialog.css("top",dialogHeight);
	// 隐藏滚动条
	hideScroll();
};

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

