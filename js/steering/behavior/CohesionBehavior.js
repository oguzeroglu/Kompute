import { SeekBehavior } from "./SeekBehavior";
import { Steerable } from "../Steerable";
import { logger } from "../../debug/Logger";

var LOGGER_COMPONENT_NAME = "CohesionBehavior";
var LOG_CLOSE_ENTITIES_EXIST = "Close entities exist.";
var LOG_NO_CLOSE_ENTITIES_EXIST = "No close entities exist.";

var CohesionBehavior = function(){
  SeekBehavior.call(this);
}

CohesionBehavior.prototype = Object.create(SeekBehavior.prototype);

CohesionBehavior.prototype.compute = function(steerable){
  var linear = this.result.linear;

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
    logger.log(LOGGER_COMPONENT_NAME, LOG_CLOSE_ENTITIES_EXIST);
    linear.multiplyScalar(1 / count);
    steerable.setTargetPosition(linear);
    return SeekBehavior.prototype.compute.call(this, steerable);
  }

  logger.log(LOGGER_COMPONENT_NAME, LOG_NO_CLOSE_ENTITIES_EXIST);

  return this.result;
}

Object.defineProperty(CohesionBehavior.prototype, 'constructor', { value: CohesionBehavior,  enumerable: false, writable: true });
export { CohesionBehavior };
