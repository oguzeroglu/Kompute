import { Vector3D } from "./Vector3D";
 
var Box = function(centerPosition, size){
  this.min = new Vector3D();
  this.max = new Vector3D();

  this.setFromCenterAndSize(centerPosition, size);
}


Box.prototype.setFromCenterAndSize = function(center, size){
  size.multiplyScalar(0.5);
  this.min.set(center.x - size.x, center.y - size.y, center.z - size.z);
  this.max.set(center.x + size.x, center.y + size.y, center.z + size.z);
  return this;
}

export { Box };
