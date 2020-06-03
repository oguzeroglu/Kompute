var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("JumpDescriptor", function(){

  it("should initialize", function(){

    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(100, 0, 0),
      landingPosition: new Kompute.Vector3D(150, 100, 0),
      runupSatisfactionRadius: 50,
      takeoffPositionSatisfactionRadius: 35,
      takeoffVelocitySatisfactionRadius: 20
    });

    expect(jumpDescriptor.takeoffPosition).to.eql(new Kompute.Vector3D(100, 0, 0));
    expect(jumpDescriptor.landingPosition).to.eql(new Kompute.Vector3D(150, 100, 0));
    expect(jumpDescriptor.runupSatisfactionRadius).to.eql(50);
    expect(jumpDescriptor.delta).to.eql(new Kompute.Vector3D(50, 100, 0));
    expect(jumpDescriptor.checkTimeResult).to.eql({ vx: 0, vz: 0, isAchievable: false });
    expect(jumpDescriptor.takeoffPositionSatisfactionRadius).to.eql(35);
    expect(jumpDescriptor.takeoffVelocitySatisfactionRadius).to.eql(20);
  });

  it("should check time", function(){

    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(),
      landingPosition: new Kompute.Vector3D(),
      runupSatisfactionRadius: 0,
      takeoffPositionSatisfactionRadius: 0,
      takeoffVelocitySatisfactionRadius: 0
    });

    jumpDescriptor.delta = new Kompute.Vector3D(10, 20, 30);

    var res = jumpDescriptor.checkTime(2, 100);

    expect(res.isAchievable).to.eql(true);
    expect(res.vx).to.eql(5);
    expect(res.vz).to.eql(15);

    res = jumpDescriptor.checkTime(2, 1);
    expect(res.isAchievable).to.eql(false);
  });

  it("should solve quadratic equation", function(){

    var center = new Kompute.Vector3D(50, 60, 70);
    var size = new Kompute.Vector3D(50, 60, 70);

    var steerable = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(steerable);
    world.setGravity(-10);

    steerable.maxSpeed = 100;
    steerable.jumpSpeed = 100;

    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(),
      landingPosition: new Kompute.Vector3D(10, 20, 30),
      runupSatisfactionRadius: 0,
      takeoffPositionSatisfactionRadius: 0,
      takeoffVelocitySatisfactionRadius: 0
    });

    var result = jumpDescriptor.solveQuadraticEquation(steerable);

    expect(result.isAchievable).to.eql(true);

    var vx = result.vx;
    var vz = result.vz;
    var time = result.time;

    expect(vx * time).to.eql(10);
    expect(vz * time).to.eql(30);
    expect((100 * time) + (0.5 * -10 * time * time)).to.eql(20);

    steerable.maxSpeed = 1;
    result = jumpDescriptor.solveQuadraticEquation(steerable);

    expect(result).to.eql(false);
  });

  it("should cache equation result", function(){

    var center = new Kompute.Vector3D(50, 60, 70);
    var size = new Kompute.Vector3D(50, 60, 70);

    var steerable = new Kompute.Steerable("steerable1", center, size);

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(steerable);
    world.setGravity(-10);

    steerable.maxSpeed = 100;
    steerable.jumpSpeed = 200;

    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(),
      landingPosition: new Kompute.Vector3D(10, 20, 30),
      runupSatisfactionRadius: 0,
      takeoffPositionSatisfactionRadius: 0,
      takeoffVelocitySatisfactionRadius: 0
    });

    var cached = jumpDescriptor.getEquationResult(steerable);
    expect(cached).to.eql(null);

    var obj = { test: true };
    jumpDescriptor.setCache(steerable, obj);

    cached = jumpDescriptor.getEquationResult(steerable);

    expect(cached).to.equal(obj);
  });
});
