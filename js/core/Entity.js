import { Box } from "./Box";
import { Vector3D } from "./Vector3D";
import { VectorPool } from "./VectorPool";
import { Quaternion } from "./Quaternion";

var quaternion = new Quaternion();
var quaternion2 = new Quaternion();
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

  this.hasLookTarget = false;
  this.lookTarget = new Vector3D();

  this.lookSpeed = 0.1;

  this.lookDirection = new Vector3D(0, 0, -1);
}

Entity.prototype.update = function(){
  var speed = this.velocity.getLength();
  if (speed > this.maxSpeed){
    this.velocity.copy(this.velocity.normalize().multiplyScalar(this.maxSpeed));
  }

  var vect = vectorPool.get().copy(this.velocity).multiplyScalar(delta);
  this.setPosition(this.position.add(vect));

  if (this.hasLookTarget){
    var desiredDirection = vectorPool.get().copy(this.lookTarget).sub(this.position);
    var desiredQuaternion = quaternion.setFromVectors(this.lookDirection, desiredDirection);
    quaternion2.set(0, 0, 0, 1);
    var v = vectorPool.get().copy(this.lookDirection).applyQuaternion(quaternion2.rotateTowards(quaternion, this.lookSpeed));
    this.setLookDirection(v);
  }
}


Entity.prototype.setPosition = function(position){
  this.position.copy(position);
  this.box.setFromCenterAndSize(position, this.size);

  if (this.world){
    this.world.updateEntity(this, this.position, this.size);
  }
}

Entity.prototype.setLookDirection = function(direction){
  this.lookDirection.copy(vectorPool.get().copy(direction).normalize());

  if (this.world){
    this.world.onLookDirectionUpdated(this);
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

Entity.prototype.setLookTarget = function(target){
  this.lookTarget.copy(target);
  this.hasLookTarget = true;
}

Entity.prototype.unsetLookTarget = function(){
  this.hasLookTarget = false;
}

export { Entity };
