var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("EvadeBehavior", function(){

  it("should initialize", function(){

    var evadeBehavior = new Kompute.EvadeBehavior({maxPredictionTime: 100});

    expect(evadeBehavior.result).to.eql(new Kompute.SteerResult());
    expect(evadeBehavior.maxPredictionTime).to.eql(100);
  });

  it("should not request acceleration if steerable has no target entity", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var evadeBehavior = new Kompute.EvadeBehavior({maxPredictionTime: 100});

    expect(evadeBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D());
  });

  it("should compute the inverse of pursue behavior", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(5, 5, 5), new Kompute.Vector3D(10, 10, 10));
    var targetSteerable = new Kompute.Steerable("target", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    targetSteerable.velocity.set(100, 200, 300);

    steerable.setTargetEntity(targetSteerable);

    var pursueBehavior = new Kompute.PursueBehavior({maxPredictionTime: 10});
    var evadeBehavior = new Kompute.EvadeBehavior({maxPredictionTime: 10});

    steerable.maxAcceleration = 100;
    steerable.velocity.set(10, 10, 10);

    var pursueResult = pursueBehavior.compute(steerable);
    var evadeResult = evadeBehavior.compute(steerable);

    expect(evadeResult.linear).to.eql(pursueResult.linear.multiplyScalar(-1));
  });
});
