import { ArriveBehavior } from "./ArriveBehavior";
import { VectorPool } from "../../core/VectorPool";
import { Steerable } from "../Steerable";

var vectorPool = new VectorPool(10);

var HideBehavior = function(steerable, options){
  ArriveBehavior.call(this, steerable, {
    satisfactionRadius: options.arriveSatisfactionRadius,
    slowDownRadius: options.arriveSlowDownRadius
  });
}

HideBehavior.prototype = Object.create(ArriveBehavior.prototype);

HideBehavior.prototype.compute = function(){
  this.result.linear.set(0, 0, 0);

  var steerable = this.steerable;

  if (!steerable.hideTargetEntity){
    return this.result;
  }
}

Object.defineProperty(HideBehavior.prototype, 'constructor', { value: HideBehavior,  enumerable: false, writable: true });
export { HideBehavior };
