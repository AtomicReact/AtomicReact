import EventEmitter from "events";
import WS, { WebSocketServer, WebSocket } from "ws";
import chokidar from "chokidar";

export class HotReload {
  eventEmitter: EventEmitter;
  port: number;
  addrs: string;
  id: number;
  webSocketServer: WebSocketServer;
  webSocketsClients: Array<{
    id: number, webSocketClient: WebSocket
  }>;
  watcher: chokidar.FSWatcher;
  watchingFiles: string[];

  constructor(port: number, addrs: string) {
    this.eventEmitter = new EventEmitter();
    this.port = port || 1337;
    this.addrs = addrs || "127.0.0.1";

    /* WebSocket */
    this.id = 0;
    this.webSocketServer = new WS.Server({ port: this.port });
    this.webSocketsClients = [];
    this.webSocketServer.on("connection", ((myWebSocketClient: WebSocket) => {
      let mId = this.id;
      // console.log('houve uma connexao vindo do hotReload');
      myWebSocketClient.on("close", ((code, reason) => {
        // console.log('wsc onClose> code: ',code);
        // console.log('wsc onClose> reason: ',reason);
        let newWebSocketsClients = [];
        this.webSocketsClients.forEach(function (objWebSocketClient) {
          if (objWebSocketClient.id != mId) {
            newWebSocketsClients.push(objWebSocketClient);
          }
        });
        this.webSocketsClients = newWebSocketsClients;
      }));

      this.webSocketsClients.push({ id: mId, webSocketClient: myWebSocketClient });

      this.id = this.id + 1;
    }));

    /* Watcher */
    this.watcher = chokidar.watch([]);
    this.watcher.on('change', ((file, stats) => {
      this.reload("<atomicreact.hotreload.RELOAD>");
    }));

    this.watchingFiles = [];
  }
  addToWatch(path) {
    if (this.watchingFiles.indexOf(path) == -1) {
      this.watchingFiles.push(path);
      this.watcher.add(path);
    }
  }
  reload(message) {
    this.eventEmitter.emit('reload', message);
    try {
      this.webSocketsClients.forEach((objWebSocketClient) => {
        objWebSocketClient.webSocketClient.send(message);
      });
    } catch (e) { }
  }
  getEventEmitter() {
    return this.eventEmitter;
  }
}