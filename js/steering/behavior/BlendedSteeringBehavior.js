import { SteeringBehavior } from "./SteeringBehavior";
import { VectorPool } from "../../core/VectorPool";

var vectorPool = new VectorPool(10);

var BlendedSteeringBehavior = function(list){
  SteeringBehavior.call(this);

  this.definitions = list;
}

BlendedSteeringBehavior.prototype = Object.create(SteeringBehavior.prototype);

BlendedSteeringBehavior.prototype.setSteerable = function(steerable){
  for (var i = 0; i < this.definitions.length; i++){
    this.definitions[i].behavior.setSteerable(steerable);
  }

  SteeringBehavior.prototype.setSteerable.call(this, steerable);
}

BlendedSteeringBehavior.prototype.compute = function(){

  this.result.linear.set(0, 0, 0);

  for (var i = 0; i < this.definitions.length; i ++){
    var elem = this.definitions[i];
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
