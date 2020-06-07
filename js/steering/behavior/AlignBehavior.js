import { SteeringBehavior } from "./SteeringBehavior";
import { Steerable } from "../Steerable";
import { logger } from "../../debug/Logger";

var LOGGER_COMPONENT_NAME = "AlignBehavior";
var LOG_CLOSE_ENTITIES_EXIST = "Close entities exist.";
var LOG_NO_CLOSE_ENTITIES_EXIST = "No close entities exist.";

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
    logger.log(LOGGER_COMPONENT_NAME, LOG_CLOSE_ENTITIES_EXIST, steerable.id);
  }else{
    logger.log(LOGGER_COMPONENT_NAME, LOG_NO_CLOSE_ENTITIES_EXIST, steerable.id);
  }

  return this.result;
}

Object.defineProperty(AlignBehavior.prototype, 'constructor', { value: AlignBehavior,  enumerable: false, writable: true });
export { AlignBehavior };
