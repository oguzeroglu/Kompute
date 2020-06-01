import { Wander2DBehavior } from "./Wander2DBehavior";
import { VectorPool } from "../../core/VectorPool";
import { Vector3D } from "../../core/Vector3D";

var vectorPool = new VectorPool(10);

var Wander3DBehavior = function(options){
  Wander2DBehavior.call(this, {
    wanderCircleDistance: options.wanderSphereDistance,
    angleChange: options.angleChange,
    normal: new Vector3D()
  });

  this.angle2 = 0;

  this.wanderSphereRadius = options.wanderSphereRadius;
}

Wander3DBehavior.prototype = Object.create(Wander2DBehavior.prototype);

Wander3DBehavior.prototype.compute = function(steerable){
  var circleCenter = this.getCircleCenter(steerable);
  var displacementForce = this.getDisplacementForce();

  this.result.linear.copy(circleCenter).add(displacementForce);

  this.angle += Math.random() * this.angleChange - this.angleChange * 0.5;
  this.angle2 += Math.random() * this.angleChange - this.angleChange * 0.5;

  return this.result;
}

Wander3DBehavior.prototype.getDisplacementForce = function(){
  var displacementForce = vectorPool.get().set(0, 0, 0);
  displacementForce.x = Math.sin(this.angle) * Math.cos(this.angle2);
  displacementForce.y = Math.sin(this.angle) * Math.sin(this.angle2);
  displacementForce.z = Math.cos(this.angle);

  return displacementForce.normalize().multiplyScalar(this.wanderSphereRadius);
}

Object.defineProperty(Wander3DBehavior.prototype, 'constructor', { value: Wander3DBehavior,  enumerable: false, writable: true });
export { Wander3DBehavior };
