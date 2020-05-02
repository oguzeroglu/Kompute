var Vector3D = function(x, y, z){
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

Vector3D.prototype.set = function(x, y, z){
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
}

Vector3D.prototype.copy = function(vect){
  return this.set(vect.x, vect.y, vect.z);
}

Vector3D.prototype.multiplyScalar = function(scalar){
  this.set(this.x * scalar, this.y * scalar, this.z * scalar);
  return this;
}

export { Vector3D };
