import { ArriveBehavior } from "./ArriveBehavior";
import { VectorPool } from "../../core/VectorPool";
import { Vector3D } from "../../core/Vector3D";
import { Steerable } from "../Steerable";
import { Vertex } from "../../core/Vertex";
import { logger } from "../../debug/Logger";

var vectorPool = new VectorPool(10);

var LOGGER_COMPONENT_NAME = "HideBehavior";
var LOG_NO_HIDE_TARGET_ENTITY = "No hide target entity set.";
var LOG_TARGET_ENTITY_OUT_OF_THREAT_DISTANCE = "Target entity is out of threat distance.";
var LOG_NO_HIDING_SPOT_FOUND = "No hiding spot found.";
var LOG_HIDING = "Hiding.";

var HideBehavior = function(options){
  ArriveBehavior.call(this, {
    satisfactionRadius: options.arriveSatisfactionRadius,
    slowDownRadius: options.arriveSlowDownRadius
  });

  this.hideDistance = options.hideDistance;
  this.threatDistance = options.threatDistance;

  this.hidingSpotFound = false;
  this.bestHidingSpot = new Vector3D();
}

HideBehavior.prototype = Object.create(ArriveBehavior.prototype);

HideBehavior.prototype.compute = function(steerable){
  this.result.linear.set(0, 0, 0);

  if (!steerable.hideTargetEntity){
    logger.log(LOGGER_COMPONENT_NAME, LOG_NO_HIDE_TARGET_ENTITY, steerable.id);
    return this.result;
  }

  if (vectorPool.get().copy(steerable.position).sub(steerable.hideTargetEntity.position).getLength() > this.threatDistance){
    logger.log(LOGGER_COMPONENT_NAME, LOG_TARGET_ENTITY_OUT_OF_THREAT_DISTANCE, steerable.id);
    return this.result;
  }

  this.findHidingSpot(steerable);

  if (!this.hidingSpotFound){
    logger.log(LOGGER_COMPONENT_NAME, LOG_NO_HIDING_SPOT_FOUND, steerable.id);
    return this.result;
  }

  logger.log(LOGGER_COMPONENT_NAME, LOG_HIDING, steerable.id);

  steerable.setTargetPosition(this.bestHidingSpot);

  return ArriveBehavior.prototype.compute.call(this, steerable);
}

HideBehavior.prototype.findHidingSpot = function(steerable){

  this.hidingSpotFound = false;

  var closest = null;

  var self = this;

  steerable.executeForEachCloseEntity(function(entity){
    if (entity instanceof Steerable || entity instanceof Vertex || entity.excludeFromHide){
      return;
    }

    var hidingPosition = self.getHidingPosition(entity, steerable);

    var dist = vectorPool.get().copy(hidingPosition).sub(steerable.position).getLength();

    if (closest == null || dist < closest){
      closest = dist;
      self.hidingSpotFound = true;
      self.bestHidingSpot.copy(hidingPosition);
    }
  });
}

HideBehavior.prototype.getHidingPosition = function(hideableEntity, steerable){
  var targetPosition = steerable.hideTargetEntity.position;

  var hideableRadius = hideableEntity.box.getBoundingRadius();

  var distanceAwayFromHideable = hideableRadius + this.hideDistance;

  var hideableEntityPosition = hideableEntity.position;

  return vectorPool.get().copy(hideableEntityPosition).sub(targetPosition).normalize().multiplyScalar(distanceAwayFromHideable).add(hideableEntityPosition);
}

Object.defineProperty(HideBehavior.prototype, 'constructor', { value: HideBehavior,  enumerable: false, writable: true });
export { HideBehavior };
