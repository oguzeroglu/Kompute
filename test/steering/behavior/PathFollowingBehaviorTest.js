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
});
