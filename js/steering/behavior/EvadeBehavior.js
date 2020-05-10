import { PursueBehavior } from "./PursueBehavior";

var EvadeBehavior = function(steerable, options){
  PursueBehavior.call(this, steerable, options);
}

EvadeBehavior.prototype = Object.create(PursueBehavior.prototype);

EvadeBehavior.prototype.compute = function(){
  PursueBehavior.prototype.compute.call(this);
  this.result.linear.negate();
  return this.result;
}

Object.defineProperty(EvadeBehavior.prototype, 'constructor', { value: EvadeBehavior,  enumerable: false, writable: true });
export { EvadeBehavior };
