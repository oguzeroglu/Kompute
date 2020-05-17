import { SteeringBehavior } from "./SteeringBehavior";

var JumpBehavior = function(){
  SteeringBehavior.call(this);
}

JumpBehavior.prototype = Object.create(SteeringBehavior.prototype);

JumpBehavior.prototype.compute = function(){
  var linear = this.result.linear;

  linear.set(0, 0, 0);

  var steerable = this.steerable;

  if (!steerable.isJumpInitiated){
    return this.result;
  }
}

Object.defineProperty(JumpBehavior.prototype, 'constructor', { value: JumpBehavior,  enumerable: false, writable: true });
export { JumpBehavior };
