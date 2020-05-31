import { Vector3D } from "./Vector3D";

var Path = function(options){

  options = options || {};

  this.index = 0;

  this.length = 0;

  this.loop = !!options.loop;
  this.rewind = !!options.rewind;

  this.isRewinding = false;
  this.isFinished = false;

  this.waypoints = [];

  if (options.fixedLength){
    for (var i = 0; i < options.fixedLength; i ++){
      this.waypoints.push(new Vector3D());
    }
  }

  this.jumpDescriptors = [];
}

Path.prototype.addJumpDescriptor = function(jumpDescriptor){
  var takeoffPosition = jumpDescriptor.takeoffPosition;
  var landingPosition = jumpDescriptor.landingPosition;

  if (!this.hasWaypoint(takeoffPosition) || !this.hasWaypoint(landingPosition)){
    return false;
  }

  this.jumpDescriptors.push(jumpDescriptor);

  return true;
}

Path.prototype.hasWaypoint = function(waypoint){
  var length = this.length;
  return !!this.waypoints.find(function(wp, index){
    return (index < length) && wp.eql(waypoint);
  });
}

Path.prototype.insertWaypoint = function(waypoint){
  this.waypoints[this.length ++].copy(waypoint);
}

Path.prototype.addWaypoint = function(waypoint){
  this.waypoints.push(waypoint.clone());
  this.length ++;
}

Path.prototype.getCurrentWaypoint = function(){
  return this.isFinished ? false : (this.waypoints[this.index] || false);
}

Path.prototype.onFinished = function(){
  if (this.finishCallback) {
    this.finishCallback();
  }
}

Path.prototype.next = function(){
  if (this.isFinished){
    return;
  }

  var len = this.length

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
        this.onFinished();
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
        this.onFinished();
      }
    }
  }
}

Path.prototype.getRandomWaypoint = function(){
  return this.waypoints[Math.floor(Math.random() * this.length)] || null;
}

export { Path };
