/// <reference types="node" resolution-mode="require"/>
export class ConsoleIO {
    eventEmiter: EventEmitter;
    buff: string;
    readLine(): EventEmitter;
    destroy(): void;
    pause(): void;
    getEventEmiter(): EventEmitter;
}
import EventEmitter from "events";
