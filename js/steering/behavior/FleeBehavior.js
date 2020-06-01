import { SeekBehavior } from "./SeekBehavior";

var FleeBehavior = function(){
  SeekBehavior.call(this);
}

FleeBehavior.prototype = Object.create(SeekBehavior.prototype);

FleeBehavior.prototype.compute = function(steerable){
  SeekBehavior.prototype.compute.call(this, steerable);
  this.result.linear.negate();
  return this.result;
}

Object.defineProperty(FleeBehavior.prototype, 'constructor', { value: FleeBehavior,  enumerable: false, writable: true });
export { FleeBehavior };
