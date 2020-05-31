var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("PathFollowingBehavior", function(){

  it("should initialize", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var path = new Kompute.Path();

    var pathFollowingBehavior = new Kompute.PathFollowingBehavior({ path: path, satisfactionRadius: 50 });

    steerable.setBehavior(pathFollowingBehavior);

    expect(pathFollowingBehavior.result).to.eql(new Kompute.SteerResult());
    expect(pathFollowingBehavior.steerable).to.equal(steerable);
    expect(pathFollowingBehavior.path).to.equal(path);
    expect(pathFollowingBehavior.satisfactionRadius).to.eql(50);
  });

  it("should not request acceleration if path is finished", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var path = new Kompute.Path();

    var pathFollowingBehavior = new Kompute.PathFollowingBehavior({ path: path, satisfactionRadius: 50 });

    steerable.setBehavior(pathFollowingBehavior);

    expect(pathFollowingBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should go to next target if within satisfaction radius", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var path = new Kompute.Path();

    path.addWaypoint(new Kompute.Vector3D(0, 0, 0));
    path.addWaypoint(new Kompute.Vector3D(100, 200, 300));

    var pathFollowingBehavior = new Kompute.PathFollowingBehavior({ path: path, satisfactionRadius: 50 });

    steerable.setBehavior(pathFollowingBehavior);

    pathFollowingBehavior.compute();

    expect(steerable.targetPosition).to.eql(new Kompute.Vector3D(100, 200, 300));
  });

  it("should delegate to seek behavior", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steerable2 = new Kompute.Steerable("steerable2", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    steerable.maxSpeed = 100;
    steerable.maxAcceleration = 100;
    steerable2.maxSpeed = 100;
    steerable2.maxAcceleration = 100;

    var path = new Kompute.Path();

    path.addWaypoint(new Kompute.Vector3D(0, 0, 0));
    path.addWaypoint(new Kompute.Vector3D(100, 200, 300));

    steerable2.setTargetPosition(new Kompute.Vector3D(100, 200, 300));

    var pathFollowingBehavior = new Kompute.PathFollowingBehavior({ path: path, satisfactionRadius: 50 });
    var seekBehavior = new Kompute.SeekBehavior();

    steerable.setBehavior(pathFollowingBehavior);
    steerable2.setBehavior(seekBehavior);

    var pathResult = pathFollowingBehavior.compute();
    var seekResult = seekBehavior.compute();

    expect(pathResult.linear).to.eql(seekResult.linear);
  });

  it("should trigger steerable jump when there is a jump on the way", function(){

    var wp1 = new Kompute.Vector3D(-225, 25, 25);
    var wp2 = new Kompute.Vector3D(225, 25, 25);
    var wp3 = new Kompute.Vector3D(475, 25, 25);
    var wp4 = new Kompute.Vector3D(925, 25, 25);

    var steerable = new Kompute.Steerable("steerable1", wp1, new Kompute.Vector3D(10, 10, 10));

    steerable.maxAcceleration = 100;
    steerable.maxSpeed = 700;
    steerable.jumpSpeed = 450;

    var world = new Kompute.World(1000, 1000, 1000, 50);

    world.setGravity(-900);

    world.insertEntity(steerable);

    var path = new Kompute.Path();
    path.addWaypoint(wp1);
    path.addWaypoint(wp2);
    path.addWaypoint(wp3);
    path.addWaypoint(wp4);

    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: wp2,
      landingPosition: wp3,
      runupSatisfactionRadius: 50,
      takeoffPositionSatisfactionRadius: 5,
      takeoffVelocitySatisfactionRadius: 200
    });

    path.addJumpDescriptor(jumpDescriptor);

    var pathFollowingBehavior = new Kompute.PathFollowingBehavior({path: path, satisfactionRadius: 20});

    steerable.setBehavior(pathFollowingBehavior);

    var called = false;
    steerable.onJumpReady = function(){
      called = true;
    }

    for (var i = 0; i < 1000; i++){
      steerable.update();
      if (called){
        steerable.behavior = null;
        break;
      }
    }

    expect(called).to.eql(true);
    expect(steerable.jumpDescriptor).to.equal(jumpDescriptor);
    expect(steerable.jumpCompletionCallback).not.to.exist;

    expect(path.index).to.eql(1);
    expect(steerable.behavior).to.eql(null);

    steerable.onJumpCompleted();

    expect(path.index).to.eql(2);
    expect(steerable.behavior).to.equal(pathFollowingBehavior);
  });
});
