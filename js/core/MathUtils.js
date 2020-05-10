import { VectorPool } from "./VectorPool";
import { Vector3D } from "./Vector3D";

var vectorPool = new VectorPool(10);

var MathUtils = function(){

}

MathUtils.prototype.clamp = function(val, min, max){
  return Math.max(min, Math.min(max, val));
}

MathUtils.prototype.computeNormalFrom3Vectors = function(vec1, vec2, vec3){
  var dir1 = vectorPool.get().copy(vec1).sub(vec2);
  var dir2 = vectorPool.get().copy(vec1).sub(vec3);
  var dir = dir1.cross(dir2);
  return vectorPool.get().copy(dir).normalize();
}

export { MathUtils };
