var url = 'ws://192.168.10.221:8991'
var localVideo = document.getElementById('localVideo')
var remoteVideo = document.getElementById('remoteVideo')
var webrtc = new Webrtc(url, localVideo, remoteVideo)
