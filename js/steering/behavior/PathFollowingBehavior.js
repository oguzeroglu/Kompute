import { SeekBehavior } from "./SeekBehavior";
import { VectorPool } from "../../core/VectorPool";

var vectorPool = new VectorPool(10);

var PathFollowingBehavior = function(options){
  SeekBehavior.call(this);

  this.path = options.path;
  this.satisfactionRadius = options.satisfactionRadius || 0;

  this.onJumpCompletionCallback = this.onJumpCompleted.bind(this);
}

PathFollowingBehavior.prototype = Object.create(SeekBehavior.prototype);

PathFollowingBehavior.prototype.getNext = function(){
  var path = this.path;
  path.next();
  return path.getCurrentWaypoint();
}

PathFollowingBehavior.prototype.getCurrentWaypoint = function(){
  return this.path.getCurrentWaypoint();
}

PathFollowingBehavior.prototype.compute = function(){
  this.result.linear.set(0, 0, 0);
  var steerable = this.steerable;
  var path = this.path;

  var currentWayPoint = this.getCurrentWaypoint();
  if (!currentWayPoint){
    return this.result;
  }

  var jumpDescriptor = this.isJumpNeeded();
  if (jumpDescriptor){
    this.beforeJumpBehavior = steerable.behavior;
    steerable.jumpDescriptor = jumpDescriptor;
    steerable.onJumpReady();
    steerable.setJumpCompletionListener(this.onJumpCompletionCallback);
    return this.result;
  }

  var distance = vectorPool.get().copy(currentWayPoint).sub(steerable.position).getLength();

  if (distance <= this.satisfactionRadius){
    currentWayPoint = this.getNext();

    if (!currentWayPoint){
      return this.result;
    }
  }

  steerable.setTargetPosition(currentWayPoint);
  return SeekBehavior.prototype.compute.call(this);
}

PathFollowingBehavior.prototype.isJumpNeeded = function(){

  var path = this.path;
  var jumpDescriptors = path.jumpDescriptors;
  var steerable = this.steerable;

  for (var i = 0; i < jumpDescriptors.length; i ++){
    var jumpDescriptor = jumpDescriptors[i];
    var distToTakeoffPosition = vectorPool.get().copy(steerable.position).sub(jumpDescriptor.takeoffPosition).getLength();
    if (distToTakeoffPosition < jumpDescriptor.runupSatisfactionRadius){
      var quadraticEquationResult = jumpDescriptor.solveQuadraticEquation(steerable);
      if (quadraticEquationResult){
        return jumpDescriptor;
      }
    }
  }

  return false;
}

PathFollowingBehavior.prototype.onJumpCompleted = function(){
  var steerable = this.steerable;
  var jumpDescriptor = steerable.jumpDescriptor;
  var landingPosition = jumpDescriptor.landingPosition;
  var path = this.path;

  var landingPositionIndex = path.getWaypointIndex(landingPosition);

  while(path.index != landingPositionIndex){
    path.next();
  }

  steerable.setBehavior(this.beforeJumpBehavior);
}

Object.defineProperty(PathFollowingBehavior.prototype, 'constructor', { value: PathFollowingBehavior,  enumerable: false, writable: true });
export { PathFollowingBehavior };
