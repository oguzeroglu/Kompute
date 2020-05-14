import { ArriveBehavior } from "./ArriveBehavior";
import { VectorPool } from "../../core/VectorPool";
import { Vector3D } from "../../core/Vector3D";
import { Steerable } from "../Steerable";

var vectorPool = new VectorPool(10);

var HideBehavior = function(steerable, options){
  ArriveBehavior.call(this, steerable, {
    satisfactionRadius: options.arriveSatisfactionRadius,
    slowDownRadius: options.arriveSlowDownRadius
  });

  this.hideDistance = options.hideDistance;
  this.threatDistance = options.threatDistance;

  this.hidingSpotFound = false;
  this.bestHidingSpot = new Vector3D();
}

HideBehavior.prototype = Object.create(ArriveBehavior.prototype);

HideBehavior.prototype.compute = function(){
  this.result.linear.set(0, 0, 0);

  var steerable = this.steerable;

  if (!steerable.hideTargetEntity){
    return this.result;
  }

  if (vectorPool.get().copy(steerable.position).sub(steerable.hideTargetEntity.position).getLength() > this.threatDistance){
    return this.result;
  }

  this.findHidingSpot();

  if (!this.hidingSpotFound){
    return this.result;
  }

  steerable.setTargetPosition(this.bestHidingSpot);

  return ArriveBehavior.prototype.compute.call(this);
}

HideBehavior.prototype.findHidingSpot = function(){
  this.hidingSpotFound = false;
  var steerable = this.steerable;

  var closest = null;

  var self = this;

  steerable.executeForEachCloseEntity(function(entity){
    if (entity instanceof Steerable){
      return;
    }

    var hidingPosition = self.getHidingPosition(entity);

    var dist = vectorPool.get().copy(hidingPosition).sub(steerable.position).getLength();

    if (closest == null || dist < closest){
      closest = dist;
      self.hidingSpotFound = true;
      self.bestHidingSpot.copy(hidingPosition);
    }
  });
}

HideBehavior.prototype.getHidingPosition = function(hideableEntity){
  var steerable = this.steerable;
  var targetPosition = steerable.hideTargetEntity.position;

  var hideableRadius = hideableEntity.box.getBoundingRadius();

  var distanceAwayFromHideable = hideableRadius + this.hideDistance;

  var hideableEntityPosition = hideableEntity.position;

  return vectorPool.get().copy(hideableEntityPosition).sub(targetPosition).normalize().multiplyScalar(distanceAwayFromHideable).add(hideableEntityPosition);
}

Object.defineProperty(HideBehavior.prototype, 'constructor', { value: HideBehavior,  enumerable: false, writable: true });
export { HideBehavior };
