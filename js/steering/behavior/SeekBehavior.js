import { SteeringBehavior } from "./SteeringBehavior";
import { logger } from "../../debug/Logger";

var LOGGER_COMPONENT_NAME = "SeekBehavior";
var LOG_NO_TARGET_POSITION = "No target position.";
var LOG_SPEEDING_UP = "Speeding up.";

var SeekBehavior = function(){
  SteeringBehavior.call(this);
}

SeekBehavior.prototype = Object.create(SteeringBehavior.prototype);

SeekBehavior.prototype.compute = function(steerable){

  this.result.linear.set(0, 0, 0);

  if (!steerable.hasTargetPosition){
    logger.log(LOGGER_COMPONENT_NAME, LOG_NO_TARGET_POSITION);
    return this.result;
  }

  this.result.linear.copy(steerable.targetPosition).sub(steerable.position).normalize().multiplyScalar(steerable.maxAcceleration);

  logger.log(LOGGER_COMPONENT_NAME, LOG_SPEEDING_UP);

  return this.result;
}

Object.defineProperty(SeekBehavior.prototype, 'constructor', { value: SeekBehavior,  enumerable: false, writable: true });
export { SeekBehavior };
