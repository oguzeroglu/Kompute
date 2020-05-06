import { SeekBehavior } from "./SeekBehavior";
import { VectorPool } from "../../core/VectorPool";

var vectorPool = new VectorPool(10);

var PursueBehavior = function(steerable, options){
  SeekBehavior.call(this, steerable);

  this.maxPredictionTime = options.maxPredictionTime;
}

PursueBehavior.prototype = Object.create(SeekBehavior.prototype);

PursueBehavior.prototype.compute = function(){

  this.result.linear.set(0, 0, 0);

  var steerable = this.steerable;

  if (!steerable.hasTargetEntity){
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
  steerable.setTargetPosition(v.x, v.y, v.z);

  return SeekBehavior.prototype.compute.call(this);
}

Object.defineProperty(PursueBehavior.prototype, 'constructor', { value: SeekBehavior,  enumerable: false, writable: true });
export { PursueBehavior };
