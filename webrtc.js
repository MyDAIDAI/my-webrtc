var constraints = {video: true, audio: true}

function WebRTC(url, localEle, remoteEle) {
  // 链接信令服务器
  this.ws = this.initWebsocket(url);
  // 初始化本地流数据
  this.localStream = null;
  // 初始化远程流数据
  this.remoteStream = null;
  // 初始化端链接
  this.peerConnect = null;
  this.localEle = localEle;
  this.remoteEle = remoteEle;
  this.ws.onopen = function () {
    console.log('websocket connected')
  };
  this.ws.onmessage = function (event) {
    console.log('serve: ' + event.data)
  };
  this.ws.onclose = function () {
    console.log('websocket closed')
  };
  this.getUserMedia(constraints);
  return this
}

/**
 * 初始化websocket链接
 * @param url
 * @returns {WebSocket}
 */
WebRTC.prototype.initWebsocket = function (url) {
  var ws = new WebSocket(url);
  return ws;
};
/**
 * 本地媒体流获取
 * @param constraints
 */
WebRTC.prototype.getUserMedia = function (constraints) {
  var that = this;
  // 浏览器getUser兼容
  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia;
  if (navigator.getUserMedia) {
    navigator.getUserMedia(constraints, function (stream) {
      that.localStream = stream;
      that.playVideo(that.localEle, stream);
    }, function (error) {
      console.log('getUserMedia error: ' + error);
    })
  } else {
    console.log('getUserMedia not supported');
  }
}
/**
 * 视频播放
 * @param ele
 * @param stream
 */
WebRTC.prototype.playVideo = function (ele, stream) {
  if (stream) {
    // 浏览器src兼容
    // ele.src = window.URL.createObjectURL(stream)
    if (ele.srcObject) {
      ele.srcObject = stream
    } else {
      ele.src = window.URL.createObjectURL(stream)
    }
    ele.onloadedmetadata = function () {
      ele.play();
      // 根据状态值判断是否关闭音频
    }
  } else {
    console.log('stream is null');
  }
}
window.Webrtc = WebRTC