const EventEmitter = require('events');

class ConsoleIO {
  constructor() {
    this.eventEmiter = new EventEmitter();
    this.buff = "";
    process.stdin.setEncoding('utf8');
  }
  readLine() {
    var onData = (data)=> {
      this.buff += data;
      if(this.buff.indexOf('\r\n')>-1) {
        process.stdin.destroy();
        this.eventEmiter.emit('lineReaded', this.buff);
      }
    }
    var onEnd = function() {
      process.stdin.destroy();
    }
    process.stdin
      .on('data', onData)
      .on('end', onEnd);
    return this.eventEmiter;
  }
}

module.exports = new ConsoleIO();
