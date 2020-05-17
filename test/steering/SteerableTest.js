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

  it ("should set behavior", function(){
    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);
    var entity = new Kompute.Steerable("steerable1", center, size);

    var behavior = new MockSteeringBehavior();

    entity.setBehavior(behavior);

    expect(entity.behavior).to.equal(behavior);
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
