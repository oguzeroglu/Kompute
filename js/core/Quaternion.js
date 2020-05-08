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

Quaternion.prototype.clone = function(){
  return new Quaternion().copy(this);
}

Quaternion.prototype.dot = function(quaternion){
  return (this.x * quaternion.x) + (this.y * quaternion.y) + (this.z * quaternion.z) + (this.w * quaternion.w);
}

Quaternion.prototype.radialDistanceTo = function(quaternion){
  return 2 * Math.acos(Math.abs(mathUtils.clamp(this.dot(quaternion), - 1, 1)));
}

Quaternion.prototype.getLength = function(){
  return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
}

Quaternion.prototype.normalize = function(){
  var len = this.getLength();

  if (len != 0){
    return this.set(this.x / len, this.y / len, this.z / len, this.w / len);
  }

  return this.set(0, 0, 0, 1);
}

Quaternion.prototype.sphericalLinearInterpolation = function(quaternion, t){
  if (t == 0){
    return this;
  }
  if (t == 1){
    return this.copy(quaternion);
  }

  var x = this.x, y = this.y, z = this.z, w = this.w;

  var cosHalfTheta = w * quaternion.w + x * quaternion.x + y * quaternion.y + z * quaternion.z;

  if (cosHalfTheta < 0){
    this.set(-quaternion.x, -quaternion.y, -quaternion.z, -quaternion.w);
    cosHalfTheta = -cosHalfTheta;
  }else{
    this.copy(quaternion);
  }

  if (cosHalfTheta >= 1){
    return this.set(x, y, z, w);
  }

  var sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;

  if (sqrSinHalfTheta < Number.EPSILON){
    var s = 1 - t;
    return this.set(s * x + t * this.x, s * y + t * this.y, s * z + t * this.z, s * w + t * this.w).normalize();
  }

  var sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
  var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
  var ratioA = Math.sin(( 1 - t) * halfTheta) / sinHalfTheta;
  var ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

  return this.set(x * ratioA + this.x * ratioB, y * ratioA + this.y * ratioB, z * ratioA + this.z * ratioB, w * ratioA + this.w * ratioB);
}

export { Quaternion };
