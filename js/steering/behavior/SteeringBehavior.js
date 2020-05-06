import { SteerResult } from "../SteerResult";

var SteeringBehavior = function(steerable){
  this.steerable = steerable;
  this.result = new SteerResult();
}

SteeringBehavior.prototype.compute = function(){
  this.result.linear.set(0, 0, 0);
  return this.result;
}

export { SteeringBehavior }
