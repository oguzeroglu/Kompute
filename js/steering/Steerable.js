import { Entity } from "../core/Entity";
import { Vector3D } from "../core/Vector3D";

var Steerable = function(id, center, size){
  Entity.call(this, id, center, size);

  this.linearAcceleration = new Vector3D();
  this.maxAcceleration = Infinity;
}

Steerable.prototype = Object.create(Entity.prototype);
Object.defineProperty(Steerable.prototype, 'constructor', { value: Steerable,  enumerable: false, writable: true });

Steerable.prototype.update = function(){
  var len = this.linearAcceleration.getLength();
  if (len > this.maxAcceleration){
    this.linearAcceleration.copy(this.linearAcceleration.normalize().multiplyScalar(this.maxAcceleration));
  }

  this.velocity.add(this.linearAcceleration);
  Entity.prototype.update.call(this);
}

export { Steerable };
