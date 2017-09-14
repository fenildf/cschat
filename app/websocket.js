/*
* @Author: victorsun
* @Date:   2017-09-15 10:03:16
* @Last Modified by:   victorsun
* @Last Modified time: 2017-09-15 16:47:55
*/

class WebSocket {
	constructor(server) {  // 构造函数
		this.ws = new WebSocket(server);
		initWebsocketApi();
	}

	initWebsocketApi(){
		/**
		 * 【 API 】
		 * 两种事件定义方式
		 * ws.onopen = function(event){}
		 * ws.addEventListener('open', function (event) {
		 * 	  ws.send('Hello Server!');
		 * });
		 */
		this.ws.onopen=function(event){
			console.log("Connection open ...");
		};

		this.ws.onmessage = function(event) {
			console.log("Received data: " + event.data);

			if(typeof event.data === String) {
				console.log("Received data string: " + event.data);
			}
			if(event.data instanceof ArrayBuffer){
				var buffer = event.data;
				console.log("Received arraybuffer: " + buffer);
			}
			/**
			 * 可以使用binaryType属性，显式指定收到的二进制数据类型
			 * 
			// 收到的是 blob 数据
			ws.binaryType = "blob";
			console.log(event.data.size);
			// 收到的是 ArrayBuffer 数据
			ws.binaryType = "arraybuffer";
			console.log(event.data.byteLength);
			 */
		};

		this.ws.onclose = function(event) {
			console.log("Connection closed ...");
			console.log("服务器断开代码："+event.code);
			console.log("断开理由："+event.reason);
			console.log("wasClean："+event.wasClean);
			ws.close();
		};

		this.ws.onerror=function(event){
			console.log(event);
		};
	}

	/**
	 * 获取websocket状态
	 */
	getState(){
		/**
		 * 【 readyState 】
		 * CONNECTING：值为0，表示正在连接
		 * OPEN：值为1，表示连接成功，可以通信了
		 * CLOSING：值为2，表示连接正在关闭
		 * CLOSED：值为3，表示连接已经关闭，或者打开连接失败
		 */
		switch (this.ws.readyState) {
		  case WebSocket.CONNECTING:
		    alert("state:CONNECTING");
		    break;
		  case WebSocket.OPEN:
		    alert("state:OPEN");
		    break;
		  case WebSocket.CLOSING:
		    alert("state:CLOSING");
		    break;
		  case WebSocket.CLOSED:
		    alert("state:CLOSED");
		    break;
		  default:
		    // this never happens
		    break;
		}
	}
	

	sendMsg(content){
		/**
		 * 1.发送文本
		 */
		this.ws.send(content);
		/**
		 * 2.发送 Blob 对象
		 */
		// var file = document.querySelector('input[type="file"]').files[0];
		// ws.send(file);
		/**
		 * 3.发送 ArrayBuffer 对象
		 * Sending canvas ImageData as ArrayBuffer
		 * 实例对象的bufferedAmount属性，表示还有多少字节的二进制数据没有发送出去，可以用来判断发送是否结束
		 */
		// var img = canvas_context.getImageData(0, 0, 400, 320);
		// var binary = new Uint8Array(img.data.length);
		// for (var i = 0; i < img.data.length; i++) {
		// 	binary[i] = img.data[i];
		// }
		// ws.send(binary.buffer);

		// var data = new ArrayBuffer(10000000);
		// socket.send(data);
		// if (socket.bufferedAmount === 0) {
		// 	// 发送完毕
		// } else {
		// 	// 发送还没结束
		// }
	}
}

export default WebSocket;