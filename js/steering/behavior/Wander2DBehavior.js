import { SteeringBehavior } from "./SteeringBehavior";
import { VectorPool } from "../../core/VectorPool";
import { Quaternion } from "../../core/Quaternion";

var vectorPool = new VectorPool(10);
var quaternion = new Quaternion();

var Wander2DBehavior = function(steerable, options){
  SteeringBehavior.call(this, steerable);

  this.normal = options.normal.clone().normalize();
  this.wanderCircleDistance = options.wanderCircleDistance;
  this.wanderCircleRadius = options.wanderCircleRadius;
  this.angleChange = options.angleChange;
  this.angle = 0;
}

Wander2DBehavior.prototype = Object.create(SteeringBehavior.prototype);

Wander2DBehavior.prototype.compute = function(){
  var circleCenter = this.getCircleCenter();
  var displacementForce = this.getDisplacementForce();

  this.result.linear.copy(circleCenter).add(displacementForce);

  this.angle += Math.random() * this.angleChange - this.angleChange * 0.5;

  return this.result;
}

Wander2DBehavior.prototype.getCircleCenter = function(){
  var steerable = this.steerable;
  var dist = this.wanderCircleDistance;
  return vectorPool.get().copy(steerable.velocity).normalize().multiplyScalar(dist);
}

Wander2DBehavior.prototype.getDisplacementForce = function(){
  var displacementForce = vectorPool.get().set(0, 0, 0);
  displacementForce.x = Math.cos(this.angle);
  displacementForce.z = Math.sin(this.angle);
  displacementForce.normalize().multiplyScalar(this.wanderCircleRadius);
  var quatdiff = quaternion.setFromVectors(vectorPool.get().set(0, 1, 0), this.normal);
  displacementForce.applyQuaternion(quatdiff);
  return displacementForce;
}

Object.defineProperty(Wander2DBehavior.prototype, 'constructor', { value: Wander2DBehavior,  enumerable: false, writable: true });
export { Wander2DBehavior };
