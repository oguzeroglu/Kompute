import { Vector3D } from "./Vector3D";
import { VectorPool } from "./VectorPool";

var vectorPool = new VectorPool(10);

var Box = function(centerPosition, size){
  this.min = new Vector3D();
  this.max = new Vector3D();

  this.setFromCenterAndSize(centerPosition, size);
}


Box.prototype.setFromCenterAndSize = function(center, size){
  var half = vectorPool.get().copy(size).multiplyScalar(0.5);
  this.min.set(center.x - half.x, center.y - half.y, center.z - half.z);
  this.max.set(center.x + half.x, center.y + half.y, center.z + half.z);
  return this;
}

Box.prototype.makeEmpty = function(){
  this.min.set(Infinity, Infinity, Infinity);
  this.max.set(Infinity, Infinity, Infinity);
  return this;
}

Box.prototype.expandByPoint = function(point){
  this.min.min(point);
  this.max.max(point);

  return this;
}

Box.prototype.intersectsBox = function(box){
  return !(box.max.x < this.min.x || box.min.x > this.max.x ||
            box.max.y < this.min.y || box.min.y > this.max.y ||
              box.max.z < this.min.z || box.min.z > this.max.z);
}

export { Box };
