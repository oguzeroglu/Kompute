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
  this.max.set(-Infinity, -Infinity, -Infinity);
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

Box.prototype.setFromTwoVectors = function(vec1, vec2, thickness){
  this.makeEmpty();
  this.expandByPoint(vec1);
  this.expandByPoint(vec2);
  var v = vectorPool.get().copy(vec1);
  v.x = vec1.x + thickness;
  this.expandByPoint(v);
  v.x = vec1.x - thickness;
  this.expandByPoint(v);
  v.x = vec1.x;
  v.y = vec1.y + thickness;
  this.expandByPoint(v);
  v.y = vec1.y - thickness;
  this.expandByPoint(v);
  v.y = vec1.y;
  v.z = vec1.z + thickness;
  this.expandByPoint(v);
  v.z = vec1.z - thickness;
  this.expandByPoint(v);

  v.copy(vec2);
  v.x = vec2.x + thickness;
  this.expandByPoint(v);
  v.x = vec2.x - thickness;
  this.expandByPoint(v);
  v.x = vec2.x;
  v.y = vec2.y + thickness;
  this.expandByPoint(v);
  v.y = vec2.y - thickness;
  this.expandByPoint(v);
  v.y = vec2.y;
  v.z = vec2.z + thickness;
  this.expandByPoint(v);
  v.z = vec2.z - thickness;
  this.expandByPoint(v);

  return this;
}

export { Box };
