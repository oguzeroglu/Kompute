var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Steerable", function(){

  it("should initialize", function(){

    var center = new Kompute.Vector3D(50, 60, 70);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    var box = new Kompute.Box(center, size);

    expect(entity.id).to.be.eql("steerable1");
    expect(entity.size).to.be.eql(size);
    expect(entity.position).to.be.eql(center);
    expect(entity.box).to.be.eql(box);
    expect(entity.nearbyObject).to.be.null;
    expect(entity.velocity).to.be.eql(new Kompute.Vector3D());
    expect(entity.maxSpeed).to.be.eql(Infinity);
    expect(entity.linearAcceleration).to.be.eql(new Kompute.Vector3D());
    expect(entity.maxAcceleration).to.be.eql(Infinity);
  });

  it("should update", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    entity.setBehavior(MockSteeringBehavior);

    entity.update();
    expect(entity.position).to.be.eql(center);
    entity.linearAcceleration.set(10, 0, 0);
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(10, 0, 0));
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(30, 0, 0));
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(60, 0, 0));
  });

  it("should clamp acceleartion based on maxAcceleration", function(){

    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var entity = new Kompute.Steerable("steerable1", center, entitySize);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    entity.setBehavior(MockSteeringBehavior);

    entity.linearAcceleration.set(100, 200, 300);
    entity.maxAcceleration = 10;

    entity.update();

    expect(entity.linearAcceleration.getLength()).to.be.eql(entity.maxAcceleration);
  });

  it("should not update if not inserted to world", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    entity.update();
    expect(entity.position).to.be.eql(center);
    entity.linearAcceleration.set(10, 0, 0);
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(0, 0, 0));
  });

  it("should not update if does not have any behavior", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    entity.update();
    expect(entity.position).to.be.eql(center);
    entity.linearAcceleration.set(10, 0, 0);
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(0, 0, 0));
  });

  it("should not update if there is no movement request from behavior", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(entity);

    entity.setBehavior(Kompute.SteeringBehavior);

    entity.update();
    expect(entity.position).to.be.eql(center);
    entity.linearAcceleration.set(10, 0, 0);
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(0, 0, 0));
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(0, 0, 0));
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
