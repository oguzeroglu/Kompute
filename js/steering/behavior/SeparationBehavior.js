import { SteeringBehavior } from "./SteeringBehavior";
import { VectorPool } from "../../core/VectorPool";
import { Steerable } from "../Steerable";

var vectorPool = new VectorPool(10);

var SeparationBehavior = function(options){
  SteeringBehavior.call(this);

  this.strength = options.strength;
}

SeparationBehavior.prototype = Object.create(SteeringBehavior.prototype);

SeparationBehavior.prototype.compute = function(){
  var linear = this.result.linear;
  var steerable = this.steerable;

  linear.set(0, 0, 0);

  var steerable = this.steerable;

  var strength = this.strength;
  steerable.executeForEachCloseEntity(function(entity){
    if (!(entity instanceof Steerable)){
      return;
    }

    var vec = vectorPool.get().copy(steerable.position).sub(entity.position);

    var len = vec.getLength();

    if (len == 0){
      return;
    }

    vec.normalize().multiplyScalar(strength / len);
    linear.add(vec);
  });

  return this.result;
}

Object.defineProperty(SeparationBehavior.prototype, 'constructor', { value: SeparationBehavior,  enumerable: false, writable: true });
export { SeparationBehavior };
