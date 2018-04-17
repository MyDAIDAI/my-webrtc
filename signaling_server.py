# -*- coding: utf-8 -*-
import os
import tornado
import tornado.web
import tornado.websocket

class MainHandler(tornado.web.RequestHandler):

    def get(self):
        self.render('client.html')

class webRTCServer(tornado.websocket.WebSocketHandler):
    # 用户集合
    users = set()

    def open(self):
        # 连接建立时往房间添加用户
        self.users.add(self)

    def on_message(self, message):
        print('server:' % message)
        # 接收到消息时进行广播，除了自己
        for user in self.users:
            if user != self:
                user.write_message(message)

    def on_close(self):
        # 链接断开时移除用户
        self.users.remove(self)

    def check_origin(self, origin):
        # 允许跨域访问
        return True


if __name__ == '__main__':
    # 定义路由
    settings = {
        "debug": True,
        "template_path": os.path.join(os.path.dirname(__file__), "templates"),
        "static_path": os.path.join(os.path.dirname(__file__), "static"),
    }
    app = tornado.web.Application([
        (r"/", webRTCServer),
        (r"/client", MainHandler),
        ],
        **settings
    )

    # 启动服务器
    http_server = tornado.httpserver.HTTPServer(app)
    # http_server = tornado.httpserver.HTTPServer(app, ssl_options={
    #        "certfile": os.path.join(os.path.abspath("."), "server.crt"),
    #        "keyfile": os.path.join(os.path.abspath("."), "server.key"),})
    http_server.listen(8991)
    tornado.ioloop.IOLoop.current().start()
