import { SteeringBehavior } from "./SteeringBehavior";
import { VectorPool } from "../../core/VectorPool";
import { logger } from "../../debug/Logger";

var vectorPool = new VectorPool(10);

var LOGGER_COMPONENT_NAME = "JumpBehavior";
var LOG_JUMP_NOT_READY = "Jump not ready.";
var LOG_JUMP_ALREADY_TOOK_OFF = "Jump already took off.";
var LOG_EQUATION_RESULT_TIME_ZERO = "Equation result time is zero.";
var LOG_TAKING_OFF = "Taking off.";
var LOG_MATCHING_VELOCITY = "Matching velocity.";

var JumpBehavior = function(){
  SteeringBehavior.call(this);
}

JumpBehavior.prototype = Object.create(SteeringBehavior.prototype);

JumpBehavior.prototype.compute = function(steerable){
  var linear = this.result.linear;

  linear.set(0, 0, 0);

  if (!steerable.isJumpReady){
    logger.log(LOGGER_COMPONENT_NAME, LOG_JUMP_NOT_READY, steerable.id);
    return this.result;
  }

  if (steerable.isJumpTakenOff){
    logger.log(LOGGER_COMPONENT_NAME, LOG_JUMP_ALREADY_TOOK_OFF, steerable.id);
    return this.result;
  }

  var jumpDescriptor = steerable.jumpDescriptor;
  var equationResult = jumpDescriptor.getEquationResult(steerable);

  if (equationResult.time == 0){
    logger.log(LOGGER_COMPONENT_NAME, LOG_EQUATION_RESULT_TIME_ZERO, steerable.id);
    return this.result;
  }

  var targetVelocity = vectorPool.get().set(equationResult.vx, 0, equationResult.vz);

  var posDiff = vectorPool.get().copy(steerable.position).sub(jumpDescriptor.takeoffPosition).getLength();
  if (posDiff <= jumpDescriptor.takeoffPositionSatisfactionRadius){
    var velocityDiff = vectorPool.get().copy(steerable.velocity).sub(targetVelocity).getLength();
    if (velocityDiff <= jumpDescriptor.takeoffVelocitySatisfactionRadius){
      steerable.onJumpTakeOff();
      logger.log(LOGGER_COMPONENT_NAME, LOG_TAKING_OFF, steerable.id);
      return this.result;
    }
  }

  logger.log(LOGGER_COMPONENT_NAME, LOG_MATCHING_VELOCITY, steerable.id);

  return this.matchVelocity(equationResult.time, targetVelocity, steerable);
}

JumpBehavior.prototype.matchVelocity = function(time, targetVelocity, steerable){
  var linear = this.result.linear;
  targetVelocity.sub(steerable.velocity).multiplyScalar(1 / time);
  linear.copy(targetVelocity);
  return this.result;
}

Object.defineProperty(JumpBehavior.prototype, 'constructor', { value: JumpBehavior,  enumerable: false, writable: true });
export { JumpBehavior };
