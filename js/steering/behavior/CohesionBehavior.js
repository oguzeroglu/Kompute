import { SeekBehavior } from "./SeekBehavior";
import { Steerable } from "../Steerable";

var CohesionBehavior = function(){
  SeekBehavior.call(this);
}

CohesionBehavior.prototype = Object.create(SeekBehavior.prototype);

CohesionBehavior.prototype.compute = function(){
  var linear = this.result.linear;
  var steerable = this.steerable;

  linear.set(0, 0, 0);

  var count = 0;

  steerable.executeForEachCloseEntity(function(entity){
    if (!(entity instanceof Steerable)){
      return;
    }

    linear.add(entity.position);

    count ++;
  });

  if (count > 0){
    linear.multiplyScalar(1 / count);
    steerable.setTargetPosition(linear);
    return SeekBehavior.prototype.compute.call(this);
  }

  return this.result;
}

Object.defineProperty(CohesionBehavior.prototype, 'constructor', { value: CohesionBehavior,  enumerable: false, writable: true });
export { CohesionBehavior };
