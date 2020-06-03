import { SteeringBehavior } from "./SteeringBehavior";

var PrioritySteeringBehavior = function(options){
  SteeringBehavior.call(this);

  this.threshold = options.threshold;

  this.list = options.list;
}

PrioritySteeringBehavior.prototype = Object.create(SteeringBehavior.prototype);

PrioritySteeringBehavior.prototype.compute = function(steerable){
  this.result.linear.set(0, 0, 0);

  for (var i = 0; i < this.list.length; i ++){
    var result = this.list[i].compute(steerable);
    if (result.linear.getLength() > this.threshold){
      this.result.linear.copy(result.linear);
      return this.result;
    }
  }

  return this.result;
}

Object.defineProperty(PrioritySteeringBehavior.prototype, 'constructor', { value: PrioritySteeringBehavior,  enumerable: false, writable: true });
export { PrioritySteeringBehavior };
