'use strict';
if (!window.rt_push_main) {
    if (window.WEB_SOCKET_LOGGER) {
        window.logger = WEB_SOCKET_LOGGER;
    } else if (window.console && window.console.log && window.console.error) {
        window.logger = window.console;
    } else {
        window.logger = {log: function(msg){}, error: function(msg){}};
    }
    
    window.rt_push_main = {
        connection_state : 0,   //0-unconnected, 1-connecting, 2-connected
        reconnect_timeout : 2,
        ws_url : "wss://ws.game.qq.com/rtpush/websocket/",
        base_url : '//ossweb-img.qq.com/images/clientpop/js/rtpush/',
        params : {appid:'', openid:'', uin:'', bid:'', scene:'', vurl:'', sign:'', timestamp:'', coloring:''},
        isIE : function(ver){
            var b = document.createElement('b')
            b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
            return b.getElementsByTagName('i').length === 1
	    },
        getCookie : function(key) {
            var tmp, reg = new RegExp("(^| )"+key+"=([^;]*)(;|$)","gi");
            if( tmp = reg.exec( unescape(document.cookie) ) )
                return(tmp[2]);
            return null;
        },
        loadScript : function(file, callback) {
            var head=document.getElementsByTagName("head")[0];
            var script= document.createElement('script');
            script.type= 'text/javascript';
            script.onload = script.onreadystatechange = function() {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
                    script.onload = script.onreadystatechange = null;
                    if (callback){
                        callback();
                    }
                }
            };
            script.src= file;
            head.appendChild(script);
        },
        getUinFromCookie : function() {
            if (this.getCookie("skey")) {
                return Number(this.getCookie("uin").substring(1)).toString();
            }
            return "";
        },
        getBidFromUrl : function() {
            var host = window.location.hostname;
            if (/^[0-9a-zA-Z.]+.qq.com$/.test(host)) {
                if (host == 'act.daoju.qq.com') {
                    var arr = window.location.pathname.split('/');
                    return arr[2];
                } else {
                    var arr = host.split(".");
                    return arr[0]; 
                }
            } else {
                return "";
            }
        },
        cutVurl : function(vurl) {
            var pos = vurl.indexOf('://');
            if (pos != -1) {
                return vurl.substr(pos+3);
            } else {
                return;
            }
        },
        setParam : function(name, value) {
            if (this.params[name]) {
                this.params[name] = value;
            }
        },
        connect : function() {
            if (this.connection_state == 0 && window.mosq) {
                window.mosq.connect(
                    this.ws_url, 
                    this.params.bid, 
                    this.params.scene, 
                    this.params.uin, 
                    this.params.sign, 
                    this.params.timestamp,
                    this.params.vurl + this.params.coloring);
                this.connection_state = 1;
                logger.log("connecting..." + '[' + Date() + ']' + ' ['+this.params.vurl+']');
            }
        },
        disconnect : function() {
            if (this.connection_state == 2 && window.mosq) {
                window.mosq.disconnect();
            }
        },
        init : function (_params) {
            var self = this;
            
            //ignore IEs temporarily.
            if (self.isIE()) {
                return;
            }

            //param check.
            _params = _params || {};
            self.params.appid = _params['appid'] || '';
            self.params.openid = _params['openid'] || '';
            self.params.uin = (self.params.appid != "" && self.params.openid != "") ? self.params.appid + "," + self.params.openid : self.getUinFromCookie();
            self.params.bid = _params['bid'] || self.getBidFromUrl();
            self.params.scene = _params['scene'] || 'webtips';
            self.params.vurl = _params['vurl'] ? self.cutVurl(_params['vurl']) : (window.location.hostname + window.location.pathname);
            self.params.sign = _params['sign'] || '';
            self.params.timestamp = _params['timestamp'] || '';
            self.params.coloring = _params['coloring'] ? '#' + _params['coloring'] : '';
            if (self.params.uin == "" || self.params.bid == "" || self.params.scene == "" || self.params.vurl == "") {
                logger.log("param error.");
                return;
            }
        
            //TODO::
            if (self.params.vurl == 'lol.qq.com/client/client.shtml') {
                self.params.uin = Math.floor(Math.random() * 100000000).toString();
            }
            
            self.loadScript(self.base_url+'json2.js', function(){
            self.loadScript(self.base_url+'swfobject.js', function(){
            self.loadScript(self.base_url+'impl.min.js', function(){      
                window.WEB_SOCKET_SWF_LOCATION = "http://"+self.params.bid+".qq.com/rtpush/WebSocketMain.swf";
                window.WEB_SOCKET_DEBUG = true;
                
                rt_push_impl.init();
                window.mosq = new Mosquitto();
                window.mosq.onconnect = function(rc){
                    self.connection_state = 2;
                    logger.log('connected.' + '[' + Date() + ']');
                    if (_params['onConnect'] && typeof _params.onConnect == 'function') {
                        _params.onConnect();
                    }
                };
                window.mosq.ondisconnect = function(rc){
                    self.connection_state = 0;
                    setTimeout(function(){
                        if (_params['onDisconnect'] && typeof _params.onDisconnect == 'function') {
                            _params.onDisconnect();
                        } else {
                            self.connect();
                        }
                    }, self.reconnect_timeout * 1000);
                    logger.log("reconnect after " + self.reconnect_timeout + " seconds..." + '[' + Date() + ']');
                    self.reconnect_timeout = self.reconnect_timeout * 2;
                    if (self.reconnect_timeout >= 300) {
                        self.reconnect_timeout = 300;
                    }
                };
                window.mosq.onmessage = function(topic, payload, qos){
                    var pl = JSON.parse(decodeURIComponent(payload));
                    if (_params['onMessage'] && typeof _params.onMessage == 'function') {
                        _params.onMessage(pl);
                    }
                };
                window.mosq.onping = function() {
                    if (_params['onPing'] && typeof _params.onPing == 'function') {
                        _params.onPing();
                    }
                }
                self.connect();
            });
            });
            });
        }
    }
    
    if (window.location.host + window.location.pathname != 'lol.qq.com/act/a20150703msg/index.htm') {
        if (window.RTPUSH_ACTIVE_CONNECT && typeof window.RTPUSH_ACTIVE_CONNECT === 'function') {
            window.RTPUSH_ACTIVE_CONNECT();
        } else {
            window.rt_push_main.init({coloring : 'passive'});
        }
    }
}
/*  |xGv00|1e24f53dfbf31815d0ddb17ef88015cb */