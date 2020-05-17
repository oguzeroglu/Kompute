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
}

Steerable.prototype.setBehavior = function(behavior){
  behavior.setSteerable(this);
  this.behavior = behavior;
}

Steerable.prototype.unsetTargetPosition = function(){
  this.hasTargetPosition = false;
}

Steerable.prototype.setTargetPosition = function(position){
  this.targetPosition.copy(position);
  this.hasTargetPosition = true;
}

Steerable.prototype.setTargetEntity = function(entity){
  this.targetEntity = entity;
  this.hasTargetEntity = true;
}

Steerable.prototype.unsetTargetEntity = function(){
  this.hasTargetEntity = false;
  this.targetEntity = null;
}

Steerable.prototype.setHideTargetEntity = function(entity){
  this.hideTargetEntity = entity;
  this.hasHideTargetEntity = true;
}

Steerable.prototype.unsetHideTargetEntity = function(){
  this.hasHideTargetEntity = false;
  this.hideTargetEntity = null;
}

Object.defineProperty(Steerable.prototype, 'constructor', { value: Steerable,  enumerable: false, writable: true });
export { Steerable };
