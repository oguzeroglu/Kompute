var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("RandomWaypointBehavior", function(){

  it("should initialize", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var path = new Kompute.Path();

    var randomWaypointBehavior = new Kompute.RandomWaypointBehavior(steerable, { path: path, satisfactionRadius: 50 });

    expect(randomWaypointBehavior.result).to.eql(new Kompute.SteerResult());
    expect(randomWaypointBehavior.steerable).to.equal(steerable);
    expect(randomWaypointBehavior.path).to.equal(path);
    expect(randomWaypointBehavior.satisfactionRadius).to.eql(50);
  });

  it("should get next randomly", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var path = new Kompute.Path();

    var vp1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp3 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());

    path.addWaypoint(vp1);
    path.addWaypoint(vp2);
    path.addWaypoint(vp3);

    var randomWaypointBehavior = new Kompute.RandomWaypointBehavior(steerable, { path: path, satisfactionRadius: 50 });

    for (var i = 0; i < 1000; i ++){
      var vp = randomWaypointBehavior.getNext();
      expect(vp.eql(vp1) || vp.eql(vp2) || vp.eql(vp3)).to.eql(true);
    }
  });

  it("should delegate to PathFollowingBehavior", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(1000, 1000, 1000), new Kompute.Vector3D(10, 10, 10));
    var path = new Kompute.Path();

    steerable.maxAcceleration = 100;

    var vp1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp3 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());

    path.addWaypoint(vp1);
    path.addWaypoint(vp2);
    path.addWaypoint(vp3);

    var pathFollowingBehavior = new Kompute.PathFollowingBehavior(steerable, { path: path, satisfactionRadius: 50 });
    var randomWaypointBehavior = new Kompute.RandomWaypointBehavior(steerable, { path: path, satisfactionRadius: 50 });

    randomWaypointBehavior.currentWayPoint = vp1;
    expect(pathFollowingBehavior.compute().linear).to.eql(randomWaypointBehavior.compute().linear);
  });
});
