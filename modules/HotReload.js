var WebSocketServer = require('ws').Server;
var chokidar = require('chokidar');

var consoleFlags = require('../ConsoleFlags');

class HotReload {
  constructor(runAtomic, port, addrs) {
    // console.log((runAtomic instanceof Function));
    if(!(runAtomic instanceof Function)) { console.log(consoleFlags.erro, 'runAtomic is not a function'); return null; }
    this.runAtomic = runAtomic;
    this.port = port || 1337;
    this.addrs = addrs || "127.0.0.1";

    /* WebSocket */
    this.id = 0;
    this.webSocketServer = new WebSocketServer({port : this.port});
    this.webSocketsClients = [];
    this.webSocketServer.on("connection", (function(myWebSocketClient) {
      var mId = this.id;
      // console.log('houve uma connexao vindo do hotReload');
      myWebSocketClient.on("close", (function(code, reason) {
        // console.log('wsc onClose> code: ',code);
        // console.log('wsc onClose> reason: ',reason);
        var newWebSocketsClients = [];
        this.webSocketsClients.forEach(function(objWebSocketClient){
          if(objWebSocketClient.id!=mId) {
          newWebSocketsClients.push(objWebSocketClient);
          }
        });
        this.webSocketsClients = newWebSocketsClients;
      }).bind(this));

      this.webSocketsClients.push({id:mId, webSocketClient: myWebSocketClient});

      this.id = this.id + 1;
    }).bind(this));

    /* Watcher */
    this.watcher = chokidar.watch();
    this.watcher.on('change', (function(file, stats) {
      // if (stats) console.log(stats);
      this.sendAtualizar();
    }).bind(this));

    this.watchingFiles = [];
  }
  start() {
    this.runAtomic();
  }
  addToWatch(path) {
    if(this.watchingFiles.indexOf(path)==-1) {
      this.watchingFiles.push(path);
      this.watcher.add(path);
    }
  }
  sendAtualizar() {
    this.runAtomic();
    try {
      this.webSocketsClients.forEach(function(objWebSocketClient){
        objWebSocketClient.webSocketClient.send("atomic.hotreload.reload");
      });
    } catch(e) {}
  }
}

module.exports = HotReload;
