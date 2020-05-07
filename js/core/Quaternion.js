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
export { Quaternion };
