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

Logger.prototype.log = function(component, msg){
  if (!this.isEnabled || this.lastMessageMap[component] == msg){
    return;
  }

  this.logMethod("[" + component + "]: " + msg);

  this.lastMessageMap[component] = msg;
}

export var logger = new Logger();
