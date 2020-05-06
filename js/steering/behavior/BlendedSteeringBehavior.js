import { SteeringBehavior } from "./SteeringBehavior";
import { VectorPool } from "../../core/VectorPool";

var vectorPool = new VectorPool(10);

var BlendedSteeringBehavior = function(steerable, list){
  SteeringBehavior.call(this, steerable);

  this.behaviors = {};

  for (var i = 0; i < list.length; i ++){
    var description = list[i];
    var behaviorConstructor = description.behavior;
    this.behaviors[i] = {
      behavior: new behaviorConstructor(steerable, description.parameters),
      weight: description.weight
    }
  }
}

BlendedSteeringBehavior.prototype = Object.create(SteeringBehavior.prototype);

BlendedSteeringBehavior.prototype.compute = function(){

  this.result.linear.set(0, 0, 0);

  for (var key in this.behaviors){
    var elem = this.behaviors[key];
    var behavior = elem.behavior;
    var weight = elem.weight;

    var result = behavior.compute();
    if (result){
      this.result.linear.add(vectorPool.get().copy(result.linear).multiplyScalar(weight));
    }
  }

  return this.result;
}

Object.defineProperty(BlendedSteeringBehavior.prototype, 'constructor', { value: BlendedSteeringBehavior,  enumerable: false, writable: true });
export { BlendedSteeringBehavior };
