/// <reference types="node" resolution-mode="require"/>
import EventEmitter from "events";
import { WebSocketServer, WebSocket } from "ws";
import chokidar from "chokidar";
export declare class HotReload {
    eventEmitter: EventEmitter;
    port: number;
    addrs: string;
    id: number;
    webSocketServer: WebSocketServer;
    webSocketsClients: Array<{
        id: number;
        webSocketClient: WebSocket;
    }>;
    watcher: chokidar.FSWatcher;
    watchingFiles: string[];
    constructor(port: number, addrs: string);
    addToWatch(path: any): void;
    reload(message: any): void;
    getEventEmitter(): EventEmitter;
}
