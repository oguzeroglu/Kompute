import { SteeringBehavior } from "./SteeringBehavior";
import { VectorPool } from "../../core/VectorPool";

var vectorPool = new VectorPool(10);

var ArriveBehavior = function(steerable, options){
  SteeringBehavior.call(this, steerable);

  this.satisfactionRadius = options.satisfactionRadius;
  this.slowDownRadius = options.slowDownRadius;
  this.stopImmediately = options.stopImmediately;
}

ArriveBehavior.prototype = Object.create(SteeringBehavior.prototype);

ArriveBehavior.prototype.compute = function(){

  var steerable = this.steerable;
  if (!steerable.hasTargetPosition){
    return null;
  }

  var toTarget = vectorPool.get().copy(steerable.targetPosition).sub(steerable.position);
  var distance = toTarget.getLength();

  var targetVelocity = vectorPool.get().set(0, 0, 0);

  if (distance <= this.satisfactionRadius){
    if (this.stopImmediately){
      return null;
    }
  }else{
    targetVelocity.copy(toTarget).normalize().multiplyScalar(steerable.maxSpeed);
  }

  if (distance <= this.slowDownRadius){
    targetVelocity.multiplyScalar(distance / this.slowDownRadius);
  }

  this.result.linear.copy(targetVelocity).sub(steerable.velocity);

  return this.result;
}

Object.defineProperty(ArriveBehavior.prototype, 'constructor', { value: ArriveBehavior,  enumerable: false, writable: true });
export { ArriveBehavior };
