import { Entity } from "../core/Entity";
import { Vector3D } from "../core/Vector3D";
import { VectorPool } from "../core/VectorPool";

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
}

Steerable.prototype = Object.create(Entity.prototype);

Steerable.prototype.update = function(){
  if (!this.world || !this.behavior){
    return;
  }

  var steerResult = this.behavior.compute();

  this.linearAcceleration.copy(steerResult.linear);

  var len = this.linearAcceleration.getLength();
  if (len > this.maxAcceleration){
    this.linearAcceleration.copy(this.linearAcceleration.normalize().multiplyScalar(this.maxAcceleration));
  }

  var vect = vectorPool.get().copy(this.linearAcceleration).multiplyScalar(delta);
  this.velocity.add(vect);
  Entity.prototype.update.call(this);

  if (this.isJumpInitiated && !this.isJumpTakenOff && !this.isJumpReady){
    var distToTakeoffPosition = vectorPool.get().copy(this.position).sub(this.jumpDescriptor.takeoffPosition).getLength();
    if (distToTakeoffPosition < this.jumpDescriptor.runupRadius){
      this.onJumpReady();
    }
  }
}

Steerable.prototype.setJumpBehavior = function(behavior){
  if (this.isJumpInitiated){
    return;
  }
  
  behavior.setSteerable(this);
  this.jumpBehavior = behavior;
}

Steerable.prototype.setBehavior = function(behavior){
  if (this.isJumpInitiated){
    return;
  }

  behavior.setSteerable(this);
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
  this.isJumpInitiated = false;
  this.isJumpReady = false;
  this.isJumpTakenOff = false;

  this.unsetTargetEntity();
  this.unsetHideTargetEntity();

  this.setTargetPosition(jumpDescriptor.takeoffPosition);
  this.setBehavior(toRunupBehavior);

  this.jumpDescriptor = jumpDescriptor;

  this.isJumpInitiated = true;
}

Steerable.prototype.onJumpReady = function(){
  this.isJumpReady = true;
  this.isJumpInitiated = false;
  this.setBehavior(this.jumpBehavior);
  this.isJumpInitiated = true;
}

Object.defineProperty(Steerable.prototype, 'constructor', { value: Steerable,  enumerable: false, writable: true });
export { Steerable };
