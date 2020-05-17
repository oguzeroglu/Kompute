var JumpDescriptor = function(parameters){
  this.takeoffPosition = parameters.takeoffPosition.clone();
  this.landingPosition = parameters.landingPosition.clone();
  this.runupRadius = parameters.runupRadius;

  this.delta = this.landingPosition.clone().sub(this.takeoffPosition);

  this.equationResult = { time: 0, vx: 0, vz: 0, isAchievable: false };

  this.checkTimeResult = { vx: 0, vz: 0, isAchievable: false };
}

JumpDescriptor.prototype.solveQuadraticEquation = function(steerable){

  this.equationResult.isAchievable = false;

  var jumpSpeed = steerable.jumpSpeed;
  var maxSpeed = steerable.maxSpeed;

  var world = steerable.world;
  var gravity = world.gravity;

  var discriminant = (2 * gravity * this.delta.y) + (jumpSpeed * jumpSpeed);
  var discriminantSqrt = Math.sqrt(discriminant);

  var jumpTimeCandidate = (-jumpSpeed + discriminantSqrt) / gravity;

  var result = this.checkTime(jumpTimeCandidate, maxSpeed);

  this.equationResult.time = jumpTimeCandidate;
  this.equationResult.vx = result.vx;
  this.equationResult.vz = result.vz;
  this.equationResult.isAchievable = result.isAchievable;

  if (!result.isAchievable){
    jumpTimeCandidate = (-jumpSpeed - discriminantSqrt) / gravity;
    result = this.checkTime(jumpTimeCandidate, maxSpeed);

    this.equationResult.time = jumpTimeCandidate;
    this.equationResult.vx = result.vx;
    this.equationResult.vz = result.vz;
    this.equationResult.isAchievable = result.isAchievable;
  }

  return this.equationResult;
}

JumpDescriptor.prototype.checkTime = function(time, maxSpeed){

  this.checkTimeResult.isAchievable = false;

  var vx = this.delta.x / time;
  var vz = this.delta.z / time;

  var sq = (vx * vx) + (vz * vz);

  if (sq <= maxSpeed * maxSpeed){
    this.checkTimeResult.isAchievable = true;
    this.checkTimeResult.vx = vx;
    this.checkTimeResult.vz = vz;
  }

  return this.checkTimeResult;
}

export { JumpDescriptor };
