import { PursueBehavior } from "./PursueBehavior";

var EvadeBehavior = function(options){
  PursueBehavior.call(this, options);
}

EvadeBehavior.prototype = Object.create(PursueBehavior.prototype);

EvadeBehavior.prototype.compute = function(){
  PursueBehavior.prototype.compute.call(this);
  this.result.linear.negate();
  return this.result;
}

Object.defineProperty(EvadeBehavior.prototype, 'constructor', { value: EvadeBehavior,  enumerable: false, writable: true });
export { EvadeBehavior };
