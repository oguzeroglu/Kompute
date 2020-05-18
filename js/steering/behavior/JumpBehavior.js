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
  var equationResult = jumpDescriptor.equationResult;

  var posDiff = vectorPool.get().copy(steerable.position).sub(jumpDescriptor.takeoffPosition).getLength();
  if (posDiff <= jumpDescriptor.takeoffPositionSatisfactionRadius){
    var targetVelocity = vectorPool.get().set(equationResult.vx, 0, equationResult.vz);
    var velocityDiff = vectorPool.get().copy(steerable.velocity).sub(targetVelocity).getLength();
    if (velocityDiff <= jumpDescriptor.takeoffVelocitySatisfactionRadius){
      steerable.onJumpTakeOff();
      return this.result;
    }
  }

  throw new Error("NOT IMPLEMENTED");
}

Object.defineProperty(JumpBehavior.prototype, 'constructor', { value: JumpBehavior,  enumerable: false, writable: true });
export { JumpBehavior };
