import { SteeringBehavior } from "./SteeringBehavior";
import { VectorPool } from "../../core/VectorPool";

var vectorPool = new VectorPool(10);

var JumpBehavior = function(){
  SteeringBehavior.call(this);
}

JumpBehavior.prototype = Object.create(SteeringBehavior.prototype);

JumpBehavior.prototype.compute = function(){
  var linear = this.result.linear;

  linear.set(0, 0, 0);

  var steerable = this.steerable;

  if (!steerable.isJumpReady || steerable.isJumpTakenOff){
    return this.result;
  }

  var jumpDescriptor = steerable.jumpDescriptor;
  var equationResult = jumpDescriptor.getEquationResult(steerable);

  if (equationResult.time == 0){
    return this.result;
  }

  var targetVelocity = vectorPool.get().set(equationResult.vx, 0, equationResult.vz);

  var posDiff = vectorPool.get().copy(steerable.position).sub(jumpDescriptor.takeoffPosition).getLength();
  if (posDiff <= jumpDescriptor.takeoffPositionSatisfactionRadius){
    var velocityDiff = vectorPool.get().copy(steerable.velocity).sub(targetVelocity).getLength();
    if (velocityDiff <= jumpDescriptor.takeoffVelocitySatisfactionRadius){
      steerable.onJumpTakeOff();
      return this.result;
    }
  }

  return this.matchVelocity(equationResult.time, targetVelocity);
}

JumpBehavior.prototype.matchVelocity = function(time, targetVelocity){
  var linear = this.result.linear;
  var steerable = this.steerable;
  targetVelocity.sub(steerable.velocity).multiplyScalar(1 / time);
  linear.copy(targetVelocity);
  return this.result;
}

Object.defineProperty(JumpBehavior.prototype, 'constructor', { value: JumpBehavior,  enumerable: false, writable: true });
export { JumpBehavior };
