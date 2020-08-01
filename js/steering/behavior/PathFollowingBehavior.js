import { SeekBehavior } from "./SeekBehavior";
import { VectorPool } from "../../core/VectorPool";
import { logger } from "../../debug/Logger";

var vectorPool = new VectorPool(10);

var LOGGER_COMPONENT_NAME = "PathFollowingBehavior";
var LOG_NO_WAYPOINT = "No waypoint.";
var LOG_JUMP_INITIATED = "Jump initiated.";
var LOG_NEXT_WAYPOINT = "Next waypoint.";
var LOG_PATH_COMPLETED = "Path completed.";

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

PathFollowingBehavior.prototype.compute = function(steerable){
  this.result.linear.set(0, 0, 0);
  var path = this.path;

  var currentWayPoint = this.getCurrentWaypoint();
  if (!currentWayPoint){
    logger.log(LOGGER_COMPONENT_NAME, LOG_NO_WAYPOINT, steerable.id);
    return this.result;
  }

  var jumpDescriptor = this.isJumpNeeded(steerable);
  if (jumpDescriptor){
    this.beforeJumpBehavior = steerable.behavior;
    steerable.jumpDescriptor = jumpDescriptor;
    steerable.onJumpReady();
    steerable.setJumpCompletionListener(this.onJumpCompletionCallback);
    logger.log(LOGGER_COMPONENT_NAME, LOG_JUMP_INITIATED, steerable.id);
    return this.result;
  }

  var distance = vectorPool.get().copy(currentWayPoint).sub(steerable.position).getLength();

  if (distance <= this.satisfactionRadius){
    currentWayPoint = this.getNext();

    logger.log(LOGGER_COMPONENT_NAME, LOG_NEXT_WAYPOINT, steerable.id);

    if (!currentWayPoint){
      logger.log(LOGGER_COMPONENT_NAME, LOG_PATH_COMPLETED, steerable.id);
      return this.result;
    }
  }

  steerable.setTargetPosition(currentWayPoint);
  return SeekBehavior.prototype.compute.call(this, steerable);
}

PathFollowingBehavior.prototype.isJumpNeeded = function(steerable){

  var path = this.path;
  var jumpDescriptors = path.jumpDescriptors;

  for (var i = 0; i < path.jumpDescriptorLength; i ++){
    var jumpDescriptor = jumpDescriptors[i];
    var distToTakeoffPosition = vectorPool.get().copy(steerable.position).sub(jumpDescriptor.takeoffPosition).getLength();
    if (distToTakeoffPosition < jumpDescriptor.takeoffPositionSatisfactionRadius){
      var quadraticEquationResult = jumpDescriptor.solveQuadraticEquation(steerable);
      if (quadraticEquationResult){
        return jumpDescriptor;
      }
    }
  }

  return false;
}

PathFollowingBehavior.prototype.onJumpCompleted = function(steerable){
  var jumpDescriptor = steerable.jumpDescriptor;
  var landingPosition = jumpDescriptor.landingPosition;
  var path = this.path;

  var landingPositionIndex = path.getWaypointIndex(landingPosition);

  while(path.index != landingPositionIndex && !path.isFinished){
    path.next();
  }

  steerable.setBehavior(this.beforeJumpBehavior);
}

Object.defineProperty(PathFollowingBehavior.prototype, 'constructor', { value: PathFollowingBehavior,  enumerable: false, writable: true });
export { PathFollowingBehavior };
