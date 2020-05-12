import { SteeringBehavior } from "./SteeringBehavior";

var PrioritySteeringBehavior = function(steerable, options){
  SteeringBehavior.call(this, steerable);

  this.threshold = options.threshold;

  this.list = [];

  for (var i = 0; i < options.list.length; i ++){
    var description = options.list[i];
    var behaviorConstructor = description.behavior;
    this.list.push(new behaviorConstructor(steerable, description.parameters));
  }
}

PrioritySteeringBehavior.prototype = Object.create(SteeringBehavior.prototype);

PrioritySteeringBehavior.prototype.compute = function(){
  this.result.linear.set(0, 0, 0);

  for (var i = 0; i < this.list.length; i ++){
    var result = this.list[i].compute();
    if (result.linear.getLength() > this.threshold){
      this.result.linear.copy(result.linear);
      return this.result;
    }
  }

  return this.result;
}

Object.defineProperty(PrioritySteeringBehavior.prototype, 'constructor', { value: PrioritySteeringBehavior,  enumerable: false, writable: true });
export { PrioritySteeringBehavior };
