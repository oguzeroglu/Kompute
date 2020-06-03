import { SteeringBehavior } from "./SteeringBehavior";

var SeekBehavior = function(){
  SteeringBehavior.call(this);
}

SeekBehavior.prototype = Object.create(SteeringBehavior.prototype);

SeekBehavior.prototype.compute = function(steerable){

  this.result.linear.set(0, 0, 0);

  if (!steerable.hasTargetPosition){
    return this.result;
  }

  this.result.linear.copy(steerable.targetPosition).sub(steerable.position).normalize().multiplyScalar(steerable.maxAcceleration);
  return this.result;
}

Object.defineProperty(SeekBehavior.prototype, 'constructor', { value: SeekBehavior,  enumerable: false, writable: true });
export { SeekBehavior };
