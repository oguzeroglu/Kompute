import { Entity } from "../core/Entity";
import { Vector3D } from "../core/Vector3D";
import { VectorPool } from "../core/VectorPool";
import { logger } from "../debug/Logger";

var LOGGER_COMPONENT_NAME = "Steerable";
var LOG_NOT_INSERTED_TO_WORLD = "Not inserted to a world.";
var LOG_HAS_NO_BEHAVIOR = "Has no behavior.";
var LOG_JUMP_COMPLETED = "Jump completed.";
var LOG_JUMP_READY = "Jump ready.";
var LOG_EQUATION_CANNOT_BE_SOLVED = "Equation cannot be solved.";
var LOG_JUMP_INITIATED = "Jump initiated.";
var LOG_NO_JUMP_BEHAVIOR_SET = "No jump behavior set.";
var LOG_IS_HIDDEN = "Steerable is hidden.";

var delta = 1/60;
var vectorPool = new VectorPool(10);

var Steerable = function(id, center, size){
  Entity.call(this, id, center, size);

  this.hasTargetPosition = false;
  this.hasTargetEntity = false;
  this.hasHideTargetEntity = false;

  this.targetPosition = new Vector3D();
  this.targetEntity = null;
  this.hideTargetEntity = null;

  this.linearAcceleration = new Vector3D();
  this.maxAcceleration = Infinity;

  this.isJumpInitiated = false;
  this.isJumpReady = false;
  this.isJumpTakenOff = false;

  this.jumpSpeed = Infinity;
  this.jumpTime = 0;
}

Steerable.prototype = Object.create(Entity.prototype);

Steerable.prototype.update = function(){

  if (this.isHidden){
    logger.log(LOGGER_COMPONENT_NAME, LOG_IS_HIDDEN, this.id);
    return;
  }

  if (!this.world){
    logger.log(LOGGER_COMPONENT_NAME, LOG_NOT_INSERTED_TO_WORLD, this.id);
    return;
  }

  if (!this.behavior){
    logger.log(LOGGER_COMPONENT_NAME, LOG_HAS_NO_BEHAVIOR, this.id);
    return;
  }

  var steerResult = this.behavior.compute(this);

  this.linearAcceleration.copy(steerResult.linear);

  var len = this.linearAcceleration.getLength();
  if (len > this.maxAcceleration){
    this.linearAcceleration.copy(this.linearAcceleration.normalize().multiplyScalar(this.maxAcceleration));
  }

  if (this.isJumpTakenOff){
    this.linearAcceleration.y += this.world.gravity;
    this.jumpTime += delta;
    if (this.jumpTime >= this.jumpDescriptor.getEquationResult(this).time){
      logger.log(LOGGER_COMPONENT_NAME, LOG_JUMP_COMPLETED, this.id);
      this.onJumpCompleted();
    }
  }

  var vect = vectorPool.get().copy(this.linearAcceleration).multiplyScalar(delta);
  this.velocity.add(vect);
  Entity.prototype.update.call(this);

  if (this.isJumpInitiated && !this.isJumpTakenOff && !this.isJumpReady){
    var distToTakeoffPosition = vectorPool.get().copy(this.position).sub(this.jumpDescriptor.takeoffPosition).getLength();
    if (distToTakeoffPosition < this.jumpDescriptor.takeoffPositionSatisfactionRadius){
      logger.log(LOGGER_COMPONENT_NAME, LOG_JUMP_READY, this.id);
      this.onJumpReady();
    }
  }
}

Steerable.prototype.setJumpBehavior = function(behavior){
  if (this.isJumpInitiated){
    return;
  }

  this.jumpBehavior = behavior;
}

Steerable.prototype.setBehavior = function(behavior){
  if (this.isJumpInitiated){
    return;
  }

  this.behavior = behavior;
}

Steerable.prototype.unsetTargetPosition = function(){
  if (this.isJumpInitiated){
    return;
  }

  this.hasTargetPosition = false;
}

Steerable.prototype.setTargetPosition = function(position){
  if (this.isJumpInitiated){
    return;
  }

  this.targetPosition.copy(position);
  this.hasTargetPosition = true;
}

Steerable.prototype.setTargetEntity = function(entity){
  if (this.isJumpInitiated){
    return;
  }

  this.targetEntity = entity;
  this.hasTargetEntity = true;
}

Steerable.prototype.unsetTargetEntity = function(){
  if (this.isJumpInitiated){
    return;
  }

  this.hasTargetEntity = false;
  this.targetEntity = null;
}

Steerable.prototype.setHideTargetEntity = function(entity){
  if (this.isJumpInitiated){
    return;
  }

  this.hideTargetEntity = entity;
  this.hasHideTargetEntity = true;
}

Steerable.prototype.unsetHideTargetEntity = function(){
  if (this.isJumpInitiated){
    return;
  }

  this.hasHideTargetEntity = false;
  this.hideTargetEntity = null;
}

Steerable.prototype.jump = function(toRunupBehavior, jumpDescriptor){

  var result = jumpDescriptor.solveQuadraticEquation(this);
  if (!result){
    logger.log(LOGGER_COMPONENT_NAME, LOG_EQUATION_CANNOT_BE_SOLVED, this.id);
    return false;
  }

  this.isJumpInitiated = false;
  this.isJumpReady = false;
  this.isJumpTakenOff = false;

  this.unsetTargetEntity();
  this.unsetHideTargetEntity();

  this.setTargetPosition(jumpDescriptor.takeoffPosition);
  this.setBehavior(toRunupBehavior);

  this.jumpDescriptor = jumpDescriptor;

  this.isJumpInitiated = true;

  this.jumpTime = 0;

  logger.log(LOGGER_COMPONENT_NAME, LOG_JUMP_INITIATED, this.id);

  return true;
}

Steerable.prototype.cancelJump = function(){
  if (!(this.isJumpInitiated || this.isJumpReady || this.isJumpTakenOff)){
    return false;
  }

  this.onJumpCompleted(true);

  return true;
}

Steerable.prototype.onJumpReady = function(){
  this.isJumpReady = true;
  this.isJumpInitiated = false;
  this.setBehavior(this.jumpBehavior);
  this.isJumpInitiated = true;

  if (!this.jumpBehavior){
    logger.log(LOGGER_COMPONENT_NAME, LOG_NO_JUMP_BEHAVIOR_SET, this.id);
  }
}

Steerable.prototype.onJumpTakeOff = function(){
  this.isJumpTakenOff = true;

  var jumpDescriptor = this.jumpDescriptor;
  var equationResult = jumpDescriptor.getEquationResult(this);

  this.setLimitVelocity(false);

  this.velocity.set(equationResult.vx, this.jumpSpeed, equationResult.vz);
}

Steerable.prototype.onJumpCompleted = function(isCancel){
  this.jumpTime = 0;
  this.isJumpInitiated = false;
  this.isJumpReady = false;
  this.isJumpTakenOff = false;

  if (!isCancel){
    this.position.y = this.jumpDescriptor.landingPosition.y;
  }

  this.velocity.set(0, 0, 0);
  this.linearAcceleration.set(0, 0, 0);

  this.setLimitVelocity(true);

  if (!isCancel && this.jumpCompletionCallback){
    this.jumpCompletionCallback(this);
  }
}

Steerable.prototype.setJumpCompletionListener = function(callback){
  this.jumpCompletionCallback = callback;
}

Steerable.prototype.removeJumpCompletionListener = function(){
  this.jumpCompletionCallback = null;
}

Object.defineProperty(Steerable.prototype, 'constructor', { value: Steerable,  enumerable: false, writable: true });
export { Steerable };
