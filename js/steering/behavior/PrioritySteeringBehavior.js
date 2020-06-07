import { SteeringBehavior } from "./SteeringBehavior";
import { logger } from "../../debug/Logger";

var LOGGER_COMPONENT_NAME = "PrioritySteeringBehavior";
var LOG_COMPUTED = "Computed.";
var LOG_NOT_COMPUTED = "Not computed.";

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
      logger.log(LOGGER_COMPONENT_NAME, LOG_COMPUTED);
      return this.result;
    }
  }

  logger.log(LOGGER_COMPONENT_NAME, LOG_NOT_COMPUTED);
  return this.result;
}

Object.defineProperty(PrioritySteeringBehavior.prototype, 'constructor', { value: PrioritySteeringBehavior,  enumerable: false, writable: true });
export { PrioritySteeringBehavior };
