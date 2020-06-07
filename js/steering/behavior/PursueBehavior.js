import { SeekBehavior } from "./SeekBehavior";
import { VectorPool } from "../../core/VectorPool";
import { logger } from "../../debug/Logger";

var LOGGER_COMPONENT_NAME = "PursueBehavior";
var LOG_NO_TARGET_ENTITY = "Entity has no target entity.";
var LOG_SEEKING = "Seeking.";

var vectorPool = new VectorPool(10);

var PursueBehavior = function(options){
  SeekBehavior.call(this);

  this.maxPredictionTime = options.maxPredictionTime;
}

PursueBehavior.prototype = Object.create(SeekBehavior.prototype);

PursueBehavior.prototype.compute = function(steerable){

  this.result.linear.set(0, 0, 0);

  if (!steerable.hasTargetEntity){
    logger.log(LOGGER_COMPONENT_NAME, LOG_NO_TARGET_ENTITY, steerable.id);
    return this.result;
  }

  var targetEntity = steerable.targetEntity;

  var targetPosition = targetEntity.position;
  var speed = steerable.velocity.getLength();

  var predictionTime = this.maxPredictionTime;
  if (speed > 0){
    var distance = vectorPool.get().copy(targetPosition).sub(steerable.position).getLength();
    var tmpPredictionTime = distance / speed;
    if (tmpPredictionTime < this.maxPredictionTime){
      predictionTime = tmpPredictionTime;
    }
  }

  var v = vectorPool.get().copy(targetEntity.velocity).multiplyScalar(predictionTime).add(targetPosition);
  steerable.setTargetPosition(v);

  logger.log(LOGGER_COMPONENT_NAME, LOG_SEEKING, steerable.id);

  return SeekBehavior.prototype.compute.call(this, steerable);
}

Object.defineProperty(PursueBehavior.prototype, 'constructor', { value: SeekBehavior,  enumerable: false, writable: true });
export { PursueBehavior };
