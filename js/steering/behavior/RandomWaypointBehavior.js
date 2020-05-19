import { PathFollowingBehavior } from "./PathFollowingBehavior";

var RandomWaypointBehavior = function(options){
  PathFollowingBehavior.call(this, options);
}

RandomWaypointBehavior.prototype = Object.create(PathFollowingBehavior.prototype);

RandomWaypointBehavior.prototype.getNext = function(){
  var path = this.path;
  this.currentWayPoint = path.getRandomWaypoint();
  return this.currentWayPoint;
}

RandomWaypointBehavior.prototype.getCurrentWaypoint = function(){
  if (!this.currentWayPoint){
    return this.getNext();
  }

  return this.currentWayPoint;
}

Object.defineProperty(RandomWaypointBehavior.prototype, 'constructor', { value: RandomWaypointBehavior,  enumerable: false, writable: true });
export { RandomWaypointBehavior };
