import { SteeringBehavior } from "./SteeringBehavior";

var SeekBehavior = function(steerable){
  SteeringBehavior.call(this, steerable);
}

SeekBehavior.prototype = Object.create(SteeringBehavior.prototype);

SeekBehavior.prototype.compute = function(){

  this.result.linear.set(0, 0, 0);

  var steerable = this.steerable;
  if (!steerable.hasTargetPosition){
    return this.result;
  }

  this.result.linear.copy(steerable.targetPosition).sub(steerable.position).normalize().multiplyScalar(steerable.maxAcceleration);
  return this.result;
}

Object.defineProperty(SeekBehavior.prototype, 'constructor', { value: SeekBehavior,  enumerable: false, writable: true });
export { SeekBehavior };
