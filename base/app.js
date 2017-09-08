/*
* @Author: victorsun
* @Date:   2017-09-08 09:56:26
* @Last Modified by:   victorsun
* @Last Modified time: 2017-09-08 16:25:42
*/

// 滚动条隐藏
var child = $("#pc .container-fluid .content");
var ul = $("#pc .container-fluid .content ul");
child.css("marginRight","-"+(child.width()-ul.width())+"px");

// 提交按钮
$("#pc button:nth-child(1)").click(function(){
	addTo($(".userInput").val());
	addFrom();
});

// 前端添加用户发送消息内容
function addTo(val){
	if(!val){
		alert("输入内容不能为空!");
		return;
	}
	var content = '<li class="to">'+ val +
				'<img src="avatar.jpg" alt="avatar"></li>';
	// 追加内容
	$("#pc .container-fluid>div:nth-child(2) ul").append(content);
	// 滚动到顶部
	var ele = $("#pc .container-fluid>div:nth-child(2)");
	ele[0].scrollTop = ele[0].scrollHeight;
	// 清空输入框
	$(".userInput").val("");
}
// 前端添加小智发送消息内容
function addFrom(val){
	val = val? val : "系统出故障了哦!";
	var content = '<li class="from">' + val + '</li>';
	// 追加内容
	$("#pc .container-fluid>div:nth-child(2) ul").append(content);
	// 滚动到顶部
	var ele = $("#pc .container-fluid>div:nth-child(2)");
	ele[0].scrollTop = ele[0].scrollHeight;
}






/**
 * test
 */
$("#btn").click(function(){
	$("#pc").css("display","block");
	$("#pc").animate({"right":"0"}, 500);
});