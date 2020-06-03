import { SteeringBehavior } from "./SteeringBehavior";
import { Steerable } from "../Steerable";

var AlignBehavior = function(){
  SteeringBehavior.call(this);
}

AlignBehavior.prototype = Object.create(SteeringBehavior.prototype);

AlignBehavior.prototype.compute = function(steerable){
  var linear = this.result.linear;

  linear.set(0, 0, 0);

  var count = 0;

  steerable.executeForEachCloseEntity(function(entity){
    if (!(entity instanceof Steerable)){
      return;
    }

    linear.add(entity.velocity);

    count ++;
  });

  if (count > 0){
    linear.multiplyScalar(1 / count);
    linear.sub(steerable.velocity);
  }

  return this.result;
}

Object.defineProperty(AlignBehavior.prototype, 'constructor', { value: AlignBehavior,  enumerable: false, writable: true });
export { AlignBehavior };
