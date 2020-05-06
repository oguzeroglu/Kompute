var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("PursueBehavior", function(){

  it("should initialize", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var pursueBehavior = new Kompute.PursueBehavior(steerable, {maxPredictionTime: 100});

    expect(pursueBehavior.result).to.eql(new Kompute.SteerResult());
    expect(pursueBehavior.steerable).to.equal(steerable);
    expect(pursueBehavior.maxPredictionTime).to.eql(100);
  });

  it("should not request acceleration if steerable has no target entity", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var pursueBehavior = new Kompute.PursueBehavior(steerable, {maxPredictionTime: 100});

    expect(pursueBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should compute based on maxPredictionTime if steerable is far away", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(1000, 1000, 1000), new Kompute.Vector3D(10, 10, 10));
    var targetSteerable = new Kompute.Steerable("target", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    targetSteerable.velocity.set(100, 200, 300);

    steerable.setTargetEntity(targetSteerable);

    var pursueBehavior = new Kompute.PursueBehavior(steerable, {maxPredictionTime: 10});
    var seekBehavior = new Kompute.SeekBehavior(steerable);

    steerable.maxAcceleration = 100;

    steerable.velocity.set(10, 10, 10);

    var targetFinalPosition = targetSteerable.position.clone().add(targetSteerable.velocity.clone().multiplyScalar(10));

    var pursueResult = pursueBehavior.compute().linear;

    steerable.setTargetPosition(targetFinalPosition.x, targetFinalPosition.y, targetFinalPosition.z);
    var seekResult = seekBehavior.compute().linear;

    expect(pursueResult).to.eql(seekResult);
  });

  it("should compute based on distance if steerable is not far away", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(5, 5, 5), new Kompute.Vector3D(10, 10, 10));
    var targetSteerable = new Kompute.Steerable("target", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    targetSteerable.velocity.set(100, 200, 300);

    steerable.setTargetEntity(targetSteerable);

    var pursueBehavior = new Kompute.PursueBehavior(steerable, {maxPredictionTime: 10});
    var seekBehavior = new Kompute.SeekBehavior(steerable);

    steerable.maxAcceleration = 100;

    steerable.velocity.set(10, 10, 10);

    var targetFinalPosition = targetSteerable.position.clone().add(targetSteerable.velocity.clone().multiplyScalar(
      new Kompute.Vector3D(5, 5, 5).getLength() / steerable.velocity.getLength()
    ));

    var pursueResult = pursueBehavior.compute().linear;
    steerable.setTargetPosition(targetFinalPosition.x, targetFinalPosition.y, targetFinalPosition.z);
    var seekResult = seekBehavior.compute().linear;

    expect(pursueResult).to.eql(seekResult);
  });

  it("should set target position of steerable", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(5, 5, 5), new Kompute.Vector3D(10, 10, 10));
    var targetSteerable = new Kompute.Steerable("target", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    targetSteerable.velocity.set(100, 200, 300);

    steerable.setTargetEntity(targetSteerable);

    var pursueBehavior = new Kompute.PursueBehavior(steerable, {maxPredictionTime: 10});

    steerable.maxAcceleration = 100;
    steerable.velocity.set(10, 10, 10);

    var targetFinalPosition = targetSteerable.position.clone().add(targetSteerable.velocity.clone().multiplyScalar(
      new Kompute.Vector3D(5, 5, 5).getLength() / steerable.velocity.getLength()
    ));

    pursueBehavior.compute();

    expect(steerable.targetPosition).to.eql(targetFinalPosition);
  });
});
