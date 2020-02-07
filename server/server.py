import sys

import tornado.ioloop
import tornado.web
import tornado.websocket


class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        # Originを確認せずに無条件でTrueを返す
        return True

    def open(self):
        print("New connection from: %s" % self.request.remote_ip)

    def on_message(self, message):
        print("Message: %s" % message)

    def on_close(self):
        print("Closed connection from: %s" % self.request.remote_ip)


def make_app(debug=False):
    print("Starting server (debug=%s)" % str(debug))
    return tornado.web.Application([
        (r"/websocket", WebSocketHandler),
        ],
        debug=debug
    )


def get_optin_val(option):
    """
    指定されたオプションを探し、オプションの次に与えられた引数を返す
    
    Parameters
    ----------
    option : str
        オプション
    
    Returns
    -------
    str
        オプションに対応する引数
        無かった場合は、Noneがを返す
    """
    is_found = False
    for v in sys.argv:
        if is_found: return v
        if v == option: is_found = True
    return None


def is_existed_option(option):
    """
    当該オプションがコマンドライン引数として指定してあるかどうかを確認する
    
    Parameters
    ----------
    option : str
        確認したいオプション
    
    Returns
    -------
    bool
        True: 当該オプションが存在する場合は
        False: 当該オプションが存在しない場合
    """
    return option in sys.argv


if __name__ == "__main__":
    # ポート番号を決定する
    DEFAULT_PORT = 8080
    port = get_optin_val("-p")
    if port == None: port = DEFAULT_PORT
    elif port.isnumeric(): port = int(port)
    else: port = DEFAULT_PORT

    # デバッグモードの確認
    debug = is_existed_option("--debug")
    
    # インスタンス生成
    app = make_app(debug=debug)
    
    # ポート番号を指定する
    print("port=%d" % port)
    app.listen(port)
    
    # サーバーをスタートする
    tornado.ioloop.IOLoop.current().start()
