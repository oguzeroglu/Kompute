import { Entity } from "../core/Entity";
import { Vector3D } from "../core/Vector3D";

var Steerable = function(id, center, size){
  Entity.call(this, id, center, size);

  this.linearAcceleration = new Vector3D();
  this.maxAcceleration = Infinity;
}

Steerable.prototype = Object.create(Entity.prototype);

Steerable.prototype.update = function(){
  if (!this.world || !this.behavior){
    return;
  }

  var steerResult = this.behavior.compute();
  if (!steerResult){
    return;
  }

  this.linearAcceleration.copy(steerResult.linear);
  
  var len = this.linearAcceleration.getLength();
  if (len > this.maxAcceleration){
    this.linearAcceleration.copy(this.linearAcceleration.normalize().multiplyScalar(this.maxAcceleration));
  }

  this.velocity.add(this.linearAcceleration);
  Entity.prototype.update.call(this);
}

Steerable.prototype.setBehavior = function(behaviorConstructor){
  var behavior = new behaviorConstructor(this);
  this.behavior = behavior;
}

Object.defineProperty(Steerable.prototype, 'constructor', { value: Steerable,  enumerable: false, writable: true });
export { Steerable };
