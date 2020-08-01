import { MathUtils } from "../core/MathUtils";

var mathUtils = new MathUtils();

var JumpDescriptor = function(parameters){
  this.takeoffPosition = parameters.takeoffPosition.clone();
  this.landingPosition = parameters.landingPosition.clone();
  this.takeoffPositionSatisfactionRadius = parameters.takeoffPositionSatisfactionRadius;

  this.delta = this.landingPosition.clone().sub(this.takeoffPosition);

  this.checkTimeResult = { vx: 0, vz: 0, isAchievable: false };

  this.cache = {};

  this._internalID = mathUtils.uuidv4();
}

JumpDescriptor.prototype.getEquationResult = function(steerable){
  var jumpSpeed = steerable.jumpSpeed;
  var maxSpeed = steerable.maxSpeed;
  var gravity = steerable.world.gravity;

  var cache = this.cache;

  var obj;

  if (cache[jumpSpeed]){
    if (cache[jumpSpeed][maxSpeed]){
      if (cache[jumpSpeed][maxSpeed][gravity]){
        return cache[jumpSpeed][maxSpeed][gravity];
      }
    }
  }

  return null;
}

JumpDescriptor.prototype.setCache = function(steerable, equationResult){
  var jumpSpeed = steerable.jumpSpeed;
  var maxSpeed = steerable.maxSpeed;
  var gravity = steerable.world.gravity;

  var cache = this.cache;

  if (!cache[jumpSpeed]){
    cache[jumpSpeed] = {};
  }

  if (!cache[jumpSpeed][maxSpeed]){
    cache[jumpSpeed][maxSpeed] = {};
  }

  if (!cache[jumpSpeed][maxSpeed][gravity]){
    cache[jumpSpeed][maxSpeed] = {};
  }

  cache[jumpSpeed][maxSpeed][gravity] = equationResult;
}

JumpDescriptor.prototype.solveQuadraticEquation = function(steerable){

  var equationResult = this.getEquationResult(steerable);
  if (equationResult){
    return equationResult;
  }

  equationResult = { time: 0, vx: 0, vz: 0, isAchievable: false };
  this.setCache(steerable, equationResult);

  equationResult.isAchievable = false;

  var jumpSpeed = steerable.jumpSpeed;
  var maxSpeed = steerable.maxSpeed;

  var world = steerable.world;
  var gravity = world.gravity;

  var discriminant = (2 * gravity * this.delta.y) + (jumpSpeed * jumpSpeed);
  var discriminantSqrt = Math.sqrt(discriminant);

  var jumpTimeCandidate = (-jumpSpeed + discriminantSqrt) / gravity;

  var result = this.checkTime(jumpTimeCandidate, maxSpeed);

  equationResult.time = jumpTimeCandidate;
  equationResult.vx = result.vx;
  equationResult.vz = result.vz;
  equationResult.isAchievable = result.isAchievable;

  if (!result.isAchievable){
    jumpTimeCandidate = (-jumpSpeed - discriminantSqrt) / gravity;
    result = this.checkTime(jumpTimeCandidate, maxSpeed);

    equationResult.time = jumpTimeCandidate;
    equationResult.vx = result.vx;
    equationResult.vz = result.vz;
    equationResult.isAchievable = result.isAchievable;
  }

  if (!equationResult.isAchievable){
    return false;
  }

  return equationResult;
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
