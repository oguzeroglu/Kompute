var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("Wander2DBehavior", function(){

  it("should initialize", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var wanderBehavior = new Kompute.Wander2DBehavior(steerable, {
      angleChange: Math.PI / 100,
      normal: new Kompute.Vector3D(0, 1, 0),
      wanderCircleDistance: 100,
      wanderCircleRadius: 50
    });

    expect(wanderBehavior.result).to.eql(new Kompute.SteerResult());
    expect(wanderBehavior.steerable).to.equal(steerable);
    expect(wanderBehavior.angle).to.eql(0);
    expect(wanderBehavior.normal).to.eql(new Kompute.Vector3D(0, 1, 0));
    expect(wanderBehavior.wanderCircleDistance).to.eql(100);
    expect(wanderBehavior.wanderCircleRadius).to.eql(50);
    expect(wanderBehavior.angleChange).to.eql(Math.PI / 100);
  });

  it("should get circle center", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var wanderBehavior = new Kompute.Wander2DBehavior(steerable, {
      angleChange: Math.PI / 100,
      normal: new Kompute.Vector3D(0, 1, 0),
      wanderCircleDistance: 10,
      wanderCircleRadius: 50
    });

    steerable.position.set(100, 200, 300);
    steerable.velocity.set(1000, 0, 0);

    expect(wanderBehavior.getCircleCenter()).to.eql(new Kompute.Vector3D(10, 0, 0));
  });

  it("should get displacement force", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    for (var i = 0; i < 1000; i ++){
      var normal = new Kompute.Vector3D(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      var wanderBehavior = new Kompute.Wander2DBehavior(steerable, {
        angleChange: Math.PI / 100,
        normal: normal,
        wanderCircleDistance: 100 * Math.random(),
        wanderCircleRadius: 100 * Math.random()
      });
      wanderBehavior.angle = Math.PI * (Math.random() - 0.5);
      steerable.position.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
      steerable.velocity.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
      var displacementForce = wanderBehavior.getDisplacementForce();
      expect(displacementForce.normalize().dot(normal.normalize()).toFixed(8)).to.eql(0);
    }
  });

  it("should update angle", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    var angle = 0;

    for (var i = 0; i < 1000; i ++){
      var normal = new Kompute.Vector3D(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      var wanderBehavior = new Kompute.Wander2DBehavior(steerable, {
        angleChange: Math.PI / 100,
        normal: normal,
        wanderCircleDistance: 100 * Math.random(),
        wanderCircleRadius: 100 * Math.random()
      });
      steerable.position.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
      steerable.velocity.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
      wanderBehavior.compute();
      var newAngle = wanderBehavior.angle;
      expect(Math.abs(newAngle - angle) <= Math.PI / 100).to.eql(true);
      angle = newAngle;
    }
  });

  it("should compute", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    steerable.position.set(100, 300, 400);
    steerable.velocity.set(-1000, 230, 500);

    var wanderBehavior = new Kompute.Wander2DBehavior(steerable, {
      angleChange: Math.PI / 100,
      normal: new Kompute.Vector3D(0, 1, 0),
      wanderCircleDistance: 100,
      wanderCircleRadius: 50
    });

    var angle = wanderBehavior.angle
    var circleCenter = wanderBehavior.getCircleCenter();
    var dispForce = wanderBehavior.getDisplacementForce();

    var result = wanderBehavior.compute();

    expect(result.linear).to.eql(circleCenter.add(dispForce));
    expect(wanderBehavior.angle != angle).to.eql(true);
  });
});
