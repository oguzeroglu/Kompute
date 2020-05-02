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

export { Box };
