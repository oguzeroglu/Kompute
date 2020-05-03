import { SteerResult } from "../SteerResult";

var SteeringBehavior = function(steerable){
  this.steerable = steerable;
  this.result = new SteerResult();
}

SteeringBehavior.prototype.compute = function(){
  return this.result;
}

export { SteeringBehavior }
