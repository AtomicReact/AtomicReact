const EventEmitter = require('events');
var WebSocketServer = require('ws').Server;
var chokidar = require('chokidar');

var consoleFlags = require('../ConsoleFlags');

class HotReload {
  constructor(port, addrs) {
    this.eventEmitter = new EventEmitter();
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
      this.reload();
    }).bind(this));

    this.watchingFiles = [];
  }
  addToWatch(path) {
    if(this.watchingFiles.indexOf(path)==-1) {
      this.watchingFiles.push(path);
      this.watcher.add(path);
    }
  }
  reload() {
    this.eventEmitter.emit('changes', "<atomicreact.hotreload.RELOAD>");
    try {
      this.webSocketsClients.forEach(function(objWebSocketClient){
        objWebSocketClient.webSocketClient.send("<atomicreact.hotreload.RELOAD>");
      });
    } catch(e) {}
  }
  getEventEmitter(){
    return this.eventEmitter;
  }
}

module.exports = HotReload;
