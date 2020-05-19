var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("Wander3DBehavior", function(){
  it("should initialize", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var wanderBehavior = new Kompute.Wander3DBehavior({
      angleChange: Math.PI / 100,
      wanderSphereDistance: 100,
      wanderSphereRadius: 50
    });

    steerable.setBehavior(wanderBehavior);

    expect(wanderBehavior.result).to.eql(new Kompute.SteerResult());
    expect(wanderBehavior.steerable).to.equal(steerable);
    expect(wanderBehavior.angle).to.eql(0);
    expect(wanderBehavior.angle2).to.eql(0);
    expect(wanderBehavior.wanderCircleDistance).to.eql(100);
    expect(wanderBehavior.wanderSphereRadius).to.eql(50);
    expect(wanderBehavior.angleChange).to.eql(Math.PI / 100);
  });

  it("should get circle center", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var wanderBehavior = new Kompute.Wander3DBehavior({
      angleChange: Math.PI / 100,
      wanderSphereDistance: 10,
      wanderSphereRadius: 50
    });

    steerable.setBehavior(wanderBehavior);

    steerable.position.set(100, 200, 300);
    steerable.velocity.set(1000, 0, 0);

    expect(wanderBehavior.getCircleCenter()).to.eql(new Kompute.Vector3D(10, 0, 0));
  });

  it("should get displacement force", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    var wanderBehavior = new Kompute.Wander3DBehavior({
      angleChange: Math.PI / 100,
      wanderSphereDistance: 100,
      wanderSphereRadius: 50
    });

    steerable.setBehavior(wanderBehavior);

    var displacementForce = wanderBehavior.getDisplacementForce();
    expect(displacementForce.getLength()).to.eql(50);
  });

  it("should update angle", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    var angle = 0
    var angle2 = 0;

    for (var i = 0; i < 1000; i ++){
      var normal = new Kompute.Vector3D(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      var wanderBehavior = new Kompute.Wander3DBehavior({
        angleChange: Math.PI / 100,
        wanderSphereDistance: 100 * Math.random(),
        wanderSphereRadius: 100 * Math.random()
      });

      steerable.setBehavior(wanderBehavior);

      steerable.position.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
      steerable.velocity.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
      wanderBehavior.compute();
      var newAngle = wanderBehavior.angle;
      var newAngle2 = wanderBehavior.angle2;
      expect(Math.abs(newAngle - angle) <= Math.PI / 100).to.eql(true);
      expect(Math.abs(newAngle2 - angle2) <= Math.PI / 100).to.eql(true);
      angle = newAngle;
      angle2 = newAngle2;
    }
  });

  it("should compute", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    steerable.position.set(100, 300, 400);
    steerable.velocity.set(-1000, 230, 500);

    var wanderBehavior = new Kompute.Wander3DBehavior({
      angleChange: Math.PI / 100,
      wanderSphereDistance: 100,
      wanderSphereRadius: 50
    });

    steerable.setBehavior(wanderBehavior);

    var angle = wanderBehavior.angle;
    var angle2 = wanderBehavior.angle2;

    var circleCenter = wanderBehavior.getCircleCenter();
    var dispForce = wanderBehavior.getDisplacementForce();

    var result = wanderBehavior.compute();

    expect(result.linear).to.eql(circleCenter.add(dispForce));
    expect(wanderBehavior.angle != angle).to.eql(true);
    expect(wanderBehavior.angle2 != angle2).to.eql(true);
  });
});
