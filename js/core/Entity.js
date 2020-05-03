import { Box } from "./Box";
import { Vector3D } from "./Vector3D";
import { VectorPool } from "./VectorPool";

var delta = 1/60;
var vectorPool = new VectorPool(10);

var Entity = function(id, center, size){
  this.id = id;
  this.size = size;
  this.position = center.clone();

  this.world = null;

  this.box = new Box(center, size);

  this.nearbyObject = null;

  this.maxSpeed = Infinity;
  this.velocity = new Vector3D();
}

Entity.prototype.update = function(){
  var speed = this.velocity.getLength();
  if (speed > this.maxSpeed){
    this.velocity.copy(this.velocity.normalize().multiplyScalar(this.maxSpeed));
  }

  var vect = vectorPool.get().copy(this.velocity).multiplyScalar(delta);
  this.setPosition(this.position.add(vect));
}

Entity.prototype.setPosition = function(position){
  this.position.copy(position);
  this.box.setFromCenterAndSize(position, this.size);

  if (this.world){
    this.world.updateEntity(this, this.position, this.size);
  }
}

Entity.prototype.executeForEachCloseEntity = function(func){
  if (!this.world){
    return;
  }
  var res = this.world.getNearbyObjects(this.position);
  for (var obj of res){
    if (obj.id != this.id){
      func(this.world.getEntityByID(obj.id));
    }
  }
}

export { Entity };
