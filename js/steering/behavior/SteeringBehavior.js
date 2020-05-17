import { SteerResult } from "../SteerResult";

var SteeringBehavior = function(){
  this.result = new SteerResult();
}

SteeringBehavior.prototype.compute = function(){
  this.result.linear.set(0, 0, 0);
  return this.result;
}

SteeringBehavior.prototype.setSteerable = function(steerable){
  this.steerable = steerable;
}

export { SteeringBehavior }
