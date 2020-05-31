var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Steerable", function(){

  it("should initialize", function(){

    var center = new Kompute.Vector3D(50, 60, 70);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    var box = new Kompute.Box(center, size);

    expect(entity.id).to.eql("steerable1");
    expect(entity.size).to.eql(size);
    expect(entity.position).to.eql(center);
    expect(entity.box).to.eql(box);
    expect(entity.nearbyObject).to.eql(null);
    expect(entity.velocity).to.eql(new Kompute.Vector3D());
    expect(entity.maxSpeed).to.eql(Infinity);
    expect(entity.linearAcceleration).to.eql(new Kompute.Vector3D());
    expect(entity.maxAcceleration).to.eql(Infinity);
    expect(entity.hasTargetPosition).to.eql(false);
    expect(entity.hasTargetEntity).to.eql(false);
    expect(entity.targetPosition).to.eql(new Kompute.Vector3D());
    expect(entity.targetEntity).to.eql(null);
    expect(entity.isJumpInitiated).to.eql(false);
    expect(entity.isJumpTakenOff).to.eql(false);
    expect(entity.isJumpReady).to.eql(false);
    expect(entity.jumpSpeed).to.eql(Infinity);
    expect(entity.jumpTime).to.eql(0);
  });

  it("should update", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    entity.setBehavior(new MockSteeringBehavior());

    entity.update();
    expect(entity.position).to.eql(center);
    entity.linearAcceleration.set(60, 0, 0);
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(1 / 60, 0, 0));
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(3 / 60, 0, 0));
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(6 / 60, 0, 0));
  });

  it("should clamp acceleartion based on maxAcceleration", function(){

    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var entity = new Kompute.Steerable("steerable1", center, entitySize);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    entity.setBehavior(new MockSteeringBehavior());

    entity.linearAcceleration.set(100, 200, 300);
    entity.maxAcceleration = 10;

    entity.update();

    expect(entity.linearAcceleration.getLength()).to.eql(entity.maxAcceleration);
  });

  it("should not update if not inserted to world", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    entity.update();
    expect(entity.position).to.eql(center);
    entity.linearAcceleration.set(10, 0, 0);
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(0, 0, 0));
  });

  it("should not update if does not have any behavior", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    entity.update();
    expect(entity.position).to.eql(center);
    entity.linearAcceleration.set(10, 0, 0);
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(0, 0, 0));
  });

  it("should not update if there is no movement request from behavior", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    entity.setBehavior(new Kompute.SteeringBehavior());

    entity.update();
    expect(entity.position).to.eql(center);
    entity.linearAcceleration.set(10, 0, 0);
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(0, 0, 0));
  });

  it("should set target position", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    entity.setTargetPosition(new Kompute.Vector3D(100, 200, 300));

    expect(entity.hasTargetPosition).to.eql(true);
    expect(entity.targetPosition).to.eql(new Kompute.Vector3D(100, 200, 300));
  });

  it("should unset target position", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    entity.setTargetPosition(new Kompute.Vector3D(100, 200, 300));
    entity.unsetTargetPosition();

    expect(entity.hasTargetPosition).to.eql(false);
  });

  it("should set target entity", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);
    var target = new Kompute.Steerable("steerable2", center, size);

    entity.setTargetEntity(target);

    expect(entity.hasTargetEntity).to.eql(true);
    expect(entity.targetEntity).to.equal(target);
  });

  it("should unset target entity", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);
    var target = new Kompute.Steerable("steerable2", center, size);

    entity.setTargetEntity(target);
    entity.unsetTargetEntity();

    expect(entity.hasTargetEntity).to.eql(false);
    expect(entity.targetEntity).to.eql(null);
  });

  it("should set hide target entity", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);
    var target = new Kompute.Steerable("steerable2", center, size);

    entity.setHideTargetEntity(target);

    expect(entity.hasHideTargetEntity).to.eql(true);
    expect(entity.hideTargetEntity).to.equal(target);
  });

  it("should unset hide target entity", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);
    var target = new Kompute.Steerable("steerable2", center, size);

    entity.setHideTargetEntity(target);
    entity.unsetHideTargetEntity();

    expect(entity.hasHideTargetEntity).to.eql(false);
    expect(entity.hideTargetEntity).to.eql(null);
  });

  it ("should set behavior", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var behavior = new MockSteeringBehavior();

    entity.setBehavior(behavior);

    expect(entity.behavior).to.equal(behavior);
    expect(behavior.steerable).to.equal(entity);
  });

  it ("should set jump behavior", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var behavior = new MockSteeringBehavior();

    entity.setJumpBehavior(behavior);

    expect(entity.jumpBehavior).to.equal(behavior);
    expect(behavior.steerable).to.equal(entity);
  });

  it("should not set behavior if a jump is initiated", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var behavior = new MockSteeringBehavior();

    entity.isJumpInitiated = true;

    entity.setBehavior(behavior);

    expect(entity.behavior).to.eql(undefined);
    expect(behavior.steerable).to.eql(undefined);
  });

  it("should not set jump behavior if a jump is initiated", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var behavior = new MockSteeringBehavior();

    entity.isJumpInitiated = true;

    entity.setJumpBehavior(behavior);

    expect(entity.jumpBehavior).to.eql(undefined);
    expect(behavior.steerable).to.eql(undefined);
  });

  it("should not set target position if a jump is initiated", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    entity.isJumpInitiated = true;

    entity.setTargetPosition(new Kompute.Vector3D(100, 200, 300));

    expect(entity.hasTargetPosition).to.eql(false);
    expect(entity.targetPosition).to.eql(new Kompute.Vector3D());
  });

  it("should not unset target position if a jump is initiated", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    entity.setTargetPosition(new Kompute.Vector3D(100, 200, 300));

    entity.isJumpInitiated = true;

    entity.unsetTargetPosition();

    expect(entity.hasTargetPosition).to.eql(true);
    expect(entity.targetPosition).to.eql(new Kompute.Vector3D(100, 200, 300));
  });

  it("should not set target entity if a jump is initiated", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);
    var target = new Kompute.Steerable("steerable2", center, size);

    entity.isJumpInitiated = true;

    entity.setTargetEntity(target);

    expect(entity.hasTargetEntity).to.eql(false);
    expect(entity.targetEntity).to.eql(null);
  });

  it("should not unset target entity if a jump is initiated", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);
    var target = new Kompute.Steerable("steerable2", center, size);

    entity.setTargetEntity(target);

    entity.isJumpInitiated = true;

    entity.unsetTargetEntity();

    expect(entity.hasTargetEntity).to.eql(true);
    expect(entity.targetEntity).to.equal(target);
  });

  it("should not set hide target entity if a jump is initiated", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);
    var target = new Kompute.Steerable("steerable2", center, size);

    entity.isJumpInitiated = true;

    entity.setHideTargetEntity(target);

    expect(entity.hasHideTargetEntity).to.eql(false);
    expect(entity.hideTargetEntity).to.eql(null);
  });

  it("should not unset hide target entity if a jump is initiated", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);
    var target = new Kompute.Steerable("steerable2", center, size);

    entity.setHideTargetEntity(target);

    entity.isJumpInitiated = true;

    entity.unsetHideTargetEntity();

    expect(entity.hasHideTargetEntity).to.eql(true);
    expect(entity.hideTargetEntity).to.equal(target);
  });

  it("should jump", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    var toRunupBehavior = new MockSteeringBehavior();
    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(100, 200, 300),
      landingPosition: new Kompute.Vector3D(400, 500, 600),
      runupSatisfactionRadius: 100,
      takeoffPositionSatisfactionRadius: 35,
      takeoffVelocitySatisfactionRadius: 20
    });

    entity.jumpTime = 999;

    var result = entity.jump(toRunupBehavior, jumpDescriptor);

    expect(entity.behavior).to.equal(toRunupBehavior);
    expect(entity.hasTargetEntity).to.eql(false);
    expect(entity.hasHideTargetEntity).to.eql(false);
    expect(entity.hasTargetPosition).to.eql(true);
    expect(entity.targetPosition).to.eql(new Kompute.Vector3D(100, 200, 300));
    expect(entity.isJumpInitiated).to.eql(true);
    expect(entity.isJumpReady).to.eql(false);
    expect(entity.isJumpTakenOff).to.eql(false);
    expect(entity.jumpTime).to.eql(0);
    expect(result).to.eql(true);
  });

  it("should complete jumping", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    var toRunupBehavior = new MockSteeringBehavior();
    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(100, 200, 300),
      landingPosition: new Kompute.Vector3D(400, 500, 600),
      runupSatisfactionRadius: 100,
      takeoffPositionSatisfactionRadius: 35,
      takeoffVelocitySatisfactionRadius: 20
    });

    entity.jump(toRunupBehavior, jumpDescriptor);
    jumpDescriptor.equationResult.vx = 100;
    jumpDescriptor.equationResult.vz = -100;
    jumpDescriptor.equationResult.time = (1/60) * 5;

    entity.isJumpTakenOff = true;

    for (var i = 0; i < 5; i ++){
      entity.update();
    }

    expect(entity.isJumpTakenOff).to.eql(false);
  });

  it("should not jump if jump not isAchievable", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    entity.maxSpeed = 1;
    entity.jumpSpeed = 1;

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    world.setGravity(-1000);

    var toRunupBehavior = new MockSteeringBehavior();
    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(100, 200, 300),
      landingPosition: new Kompute.Vector3D(400, 500, 600),
      runupSatisfactionRadius: 100,
      takeoffPositionSatisfactionRadius: 35,
      takeoffVelocitySatisfactionRadius: 20
    });

    var result = entity.jump(toRunupBehavior, jumpDescriptor);

    expect(result).to.eql(false);
    expect(entity.isJumpInitiated).to.eql(false);
  });

  it("should trigger onJumpReady if position within run-up radius", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    var toRunupBehavior = new MockSteeringBehavior();
    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(10, 10, 10),
      landingPosition: new Kompute.Vector3D(400, 500, 600),
      runupSatisfactionRadius: 100,
      takeoffPositionSatisfactionRadius: 35,
      takeoffVelocitySatisfactionRadius: 20
    });

    var called = false;
    entity.onJumpReady = function(){
      called = true;
    };

    entity.linearAcceleration.set(0, 0, 0);
    entity.jump(toRunupBehavior, jumpDescriptor);
    entity.update();

    expect(called).to.eql(true);
  });

  it("should not trigger onJumpReady if position out of run-up radius", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    var toRunupBehavior = new MockSteeringBehavior();
    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(500, 500, 500),
      landingPosition: new Kompute.Vector3D(400, 500, 600),
      runupSatisfactionRadius: 100,
      takeoffPositionSatisfactionRadius: 35,
      takeoffVelocitySatisfactionRadius: 20
    });

    var called = false;
    entity.onJumpReady = function(){
      called = true;
    };

    entity.linearAcceleration.set(0, 0, 0);
    entity.jump(toRunupBehavior, jumpDescriptor);
    entity.update();

    expect(called).to.eql(false);
  });

  it("should not trigger onJumpReady if jump is already ready", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    var toRunupBehavior = new MockSteeringBehavior();
    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(10, 10, 10),
      landingPosition: new Kompute.Vector3D(400, 500, 600),
      runupSatisfactionRadius: 100,
      takeoffPositionSatisfactionRadius: 35,
      takeoffVelocitySatisfactionRadius: 20
    });

    var called = false;
    entity.onJumpReady = function(){
      called = true;
    };

    entity.linearAcceleration.set(0, 0, 0);
    entity.jump(toRunupBehavior, jumpDescriptor);
    entity.isJumpReady = true;
    entity.update();

    expect(called).to.eql(false);
  });

  it("should not trigger onJumpReady if jump is taken off", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    var toRunupBehavior = new MockSteeringBehavior();
    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(10, 10, 10),
      landingPosition: new Kompute.Vector3D(400, 500, 600),
      runupSatisfactionRadius: 100,
      takeoffPositionSatisfactionRadius: 35,
      takeoffVelocitySatisfactionRadius: 20
    });

    var called = false;
    entity.onJumpReady = function(){
      called = true;
    };

    entity.linearAcceleration.set(0, 0, 0);
    entity.jump(toRunupBehavior, jumpDescriptor);
    entity.isJumpTakenOff = true;
    entity.update();

    expect(called).to.eql(false);
  });

  it("should perform onJumpReady", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var mockBehavior = new MockSteeringBehavior();

    entity.jumpBehavior = mockBehavior;

    entity.onJumpReady();

    expect(entity.isJumpReady).to.eql(true);
    expect(entity.isJumpInitiated).to.eql(true);
    expect(entity.isJumpTakenOff).to.eql(false);
    expect(entity.behavior).to.equal(mockBehavior);
    expect(mockBehavior.steerable).to.equal(entity);
  });

  it("should consider gravity when updating if jump took off", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    entity.setBehavior(new MockSteeringBehavior());
    entity.jumpDescriptor = {equationResult: {time: 999}};

    entity.isJumpTakenOff = true;

    var pos1 = entity.position.clone();
    entity.update();
    var pos2 = entity.position.clone();
    expect(pos1).to.eql(pos2);

    world.setGravity(-100);

    entity.update();
    expect(entity.position.y < pos1.y).to.eql(true);
  });

  it("should cleanup after jump", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(10, 10, 10),
      landingPosition: new Kompute.Vector3D(400, 500, 600),
      runupSatisfactionRadius: 100,
      takeoffPositionSatisfactionRadius: 35,
      takeoffVelocitySatisfactionRadius: 20
    });

    entity.jumpDescriptor = jumpDescriptor;

    jumpDescriptor.landingPosition.y = 999 + Math.random();

    entity.isJumpInitiated = true;
    entity.isJumpReady = true;
    entity.isJumpTakenOff = true;

    entity.linearAcceleration.set(1000, 1000, 1000);
    entity.velocity.set(1000, 1000, 1000);

    entity.onJumpCompleted();

    expect(entity.isJumpInitiated).to.eql(false);
    expect(entity.isJumpReady).to.eql(false);
    expect(entity.isJumpTakenOff).to.eql(false);
    expect(entity.position.y).to.eql(jumpDescriptor.landingPosition.y);
    expect(entity.linearAcceleration).to.eql(new Kompute.Vector3D());
    expect(entity.velocity).to.eql(new Kompute.Vector3D());
    expect(entity.jumpTime).to.eql(0);
  });

  it("should set jump completion listener", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    entity.jumpDescriptor = { landingPosition: new Kompute.Vector3D() };

    var called = false;
    var callback = function(){
      called = true;
    };

    entity.setJumpCompletionListener(callback);
    expect(called).to.eql(false);
    entity.onJumpCompleted();
    expect(called).to.eql(true);
  });

  it("should remove jump completion listener", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    entity.jumpDescriptor = { landingPosition: new Kompute.Vector3D() };

    var called = false;
    var callback = function(){
      called = true;
    };

    entity.setJumpCompletionListener(callback);
    expect(called).to.eql(false);
    entity.removeJumpCompletionListener();
    entity.onJumpCompleted();
    expect(called).to.eql(false);
  });
});

class MockSteeringBehavior extends Kompute.SteeringBehavior{
  constructor(params){
    super(params);
  }

  compute(){
    this.result.linear.copy(this.steerable.linearAcceleration);
    return this.result;
  }
}
