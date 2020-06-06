import { SteeringBehavior } from "./SteeringBehavior";
import { Box } from "../../core/Box";
import { Vector3D } from "../../core/Vector3D";
import { VectorPool } from "../../core/VectorPool";
import { logger } from "../../debug/Logger";

var box = new Box(new Vector3D(), new Vector3D());
var vectorPool = new VectorPool(10);

var LOGGER_COMPONENT_NAME = "AvoidBehavior";
var NO_THREATENING_ENTITY_FOUND = "No threatening entity found.";
var THREATENING_ENTITY_FOUND = "Threatening entity found.";

var AvoidBehavior = function(options){
  SteeringBehavior.call(this);

  this.maxSeeAhead = options.maxSeeAhead;
  this.maxAvoidForce = options.maxAvoidForce;
}

AvoidBehavior.prototype = Object.create(SteeringBehavior.prototype);

AvoidBehavior.prototype.findMostThreateningObstacle = function(steerable){
  var mostThreatening = null;

  var maxSeeAhead = this.maxSeeAhead;

  var position = steerable.position;
  var velocity = vectorPool.get().copy(steerable.velocity);
  velocity.normalize().multiplyScalar(maxSeeAhead);
  var vec2 = vectorPool.get().copy(velocity).add(position);
  box.setFromTwoVectors(position, vec2, 0.001);
  box.expandByPoint(steerable.box.min);
  box.expandByPoint(steerable.box.max);

  steerable.executeForEachCloseEntity(function(entity){
    if (box.intersectsBox(entity.box)){
      if (!mostThreatening){
        mostThreatening = entity;
      }else{
        var distance = vectorPool.get().copy(position).sub(entity.position).getLength();
        var curDistance = vectorPool.get().copy(position).sub(mostThreatening.position).getLength();
        if (distance <= curDistance){
          mostThreatening = entity;
        }
      }
    }
  });

  return mostThreatening;
}

AvoidBehavior.prototype.compute = function(steerable){
  this.result.linear.set(0, 0, 0);

  var mostThreateningObstacle = this.findMostThreateningObstacle(steerable);

  if (!mostThreateningObstacle){
    logger.log(LOGGER_COMPONENT_NAME, NO_THREATENING_ENTITY_FOUND);
    return this.result;
  }

  logger.log(LOGGER_COMPONENT_NAME, THREATENING_ENTITY_FOUND);

  this.result.linear.copy(steerable.velocity).normalize().multiplyScalar(steerable.velocity.getLength() / steerable.maxSpeed).add(steerable.position).sub(mostThreateningObstacle.position).normalize().multiplyScalar(this.maxAvoidForce);;
  return this.result;
}

Object.defineProperty(AvoidBehavior.prototype, 'constructor', { value: AvoidBehavior,  enumerable: false, writable: true });
export { AvoidBehavior };
