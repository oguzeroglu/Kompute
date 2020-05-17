var JumpDescriptor = function(parameters){
  this.takeoffPosition = parameters.takeoffPosition.clone();
  this.landingPosition = parameters.landingPosition.clone();
  this.runupRadius = parameters.runupRadius;

  this.delta = this.landingPosition.clone().sub(this.takeoffPosition);
}

export { JumpDescriptor };
