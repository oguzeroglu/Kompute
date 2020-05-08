import { MathUtils } from "./MathUtils";

var mathUtils = new MathUtils();

var Quaternion = function(x, y, z, w){
  this.set(x || 0, y || 0, z || 0, w === undefined ? 1 : w);
}

Quaternion.prototype.set = function(x, y, z, w){
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;

  return this;
}

Quaternion.prototype.copy = function(quaternion){
  this.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

  return this;
}

Quaternion.prototype.dot = function(quaternion){
  return (this.x * quaternion.x) + (this.y * quaternion.y) + (this.z * quaternion.z) + (this.w * quaternion.w);
}

Quaternion.prototype.radialDistanceTo = function(quaternion){
  return 2 * Math.acos(Math.abs(mathUtils.clamp(this.dot(quaternion), - 1, 1)));
}

export { Quaternion };
