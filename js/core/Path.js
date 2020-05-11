var Path = function(options){

  options = options || {};

  this.index = 0;

  this.loop = !!options.loop;
  this.rewind = !!options.rewind;

  this.isRewinding = false;
  this.isFinished = false;

  this.waypoints = [];
}

Path.prototype.addWaypoint = function(waypoint){
  this.waypoints.push(waypoint.clone());
}

Path.prototype.getCurrentWaypoint = function(){
  return this.isFinished ? false : (this.waypoints[this.index] || false);
}

Path.prototype.next = function(){
  if (this.isFinished){
    return;
  }

  var len = this.waypoints.length;

  if (!this.isRewinding){
    this.index ++;

    if (this.index == len){

      if (this.rewind){
        this.index = len - 2;
        this.isRewinding = true;
      }else if (this.loop){
        this.index = 0;
      }else{
        this.isFinished = true;
      }
    }
  }else{

    this.index --;

    if (this.index == -1){
      if (this.loop){
        this.index = 1;
        this.isRewinding = false;
      }else{
        this.isFinished = true;
      }
    }
  }
}

export { Path };
