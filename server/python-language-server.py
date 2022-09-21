 # Licensed to the Apache Software Foundation (ASF) under one or more
 # contributor license agreements.  See the NOTICE file distributed with
 # this work for additional information regarding copyright ownership.
 # The ASF licenses this file to You under the Apache License, Version 2.0
 # (the "License"); you may not use this file except in compliance with
 # the License.  You may obtain a copy of the License at
 #
 #     http://www.apache.org/licenses/LICENSE-2.0
 #
 # Unless required by applicable law or agreed to in writing, software
 # distributed under the License is distributed on an "AS IS" BASIS,
 # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 # See the License for the specific language governing permissions and
 # limitations under the License.

import json
import subprocess
import threading
from pyls_jsonrpc import streams
from tornado import ioloop, process, websocket, web


class PythonWebSocketHandler(websocket.WebSocketHandler):
    writer = None

    def open(self, *args: str, **kwargs: str):
        proc = process.Subprocess(
            ['pylsp','-v'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE
        )

        self.writer = streams.JsonRpcStreamWriter(proc.stdin)

        def consume():
            ioloop.IOLoop()
            reader = streams.JsonRpcStreamReader(proc.stdout)
            reader.listen(lambda msg: self.write_message(json.dumps(msg)))
        
        thread = threading.Thread(target=consume)
        thread.daemon = True
        thread.start()

    def on_message(self, message):
        self.writer.write(json.loads(message))

    def check_origin(self, origin):
        return True

if __name__ == "__main__":
    app = web.Application([
        (r"/python", PythonWebSocketHandler),
    ])
    app.listen(3001)
    ioloop.IOLoop.current().start()
