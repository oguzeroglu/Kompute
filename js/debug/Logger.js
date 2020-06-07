var Logger = function(){

  this.logMethod = console.log;

  this.isEnabled = false;

  this.lastMessageMap = {};
}

Logger.prototype.enable = function(){
  this.isEnabled = true;
}

Logger.prototype.disable = function(){
  this.isEnabled = false;
}

Logger.prototype.log = function(component, msg , id){
  if (!this.isEnabled || this.lastMessageMap[id] == msg){
    return;
  }

  this.logMethod("[" + component + "]: " + msg + " (" + id + ")");

  this.lastMessageMap[id] = msg;
}

export var logger = new Logger();
