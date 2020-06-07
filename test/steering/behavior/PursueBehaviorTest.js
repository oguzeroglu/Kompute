var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("PursueBehavior", function(){

  var loggedMsg;

  beforeEach(function(){
    loggedMsg = null;
    Kompute.logger.logMethod = function(msg){
      loggedMsg = msg;
    }
  });

  afterEach(function(){
    Kompute.logger.logMethod = console.log;
    Kompute.logger.disable();
  });

  it("should initialize", function(){

    var pursueBehavior = new Kompute.PursueBehavior({maxPredictionTime: 100});

    expect(pursueBehavior.result).to.eql(new Kompute.SteerResult());
    expect(pursueBehavior.maxPredictionTime).to.eql(100);
  });

  it("should not request acceleration if steerable has no target entity", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var pursueBehavior = new Kompute.PursueBehavior({maxPredictionTime: 100});

    Kompute.logger.enable();

    expect(pursueBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D());
    expect(loggedMsg).to.eql("[PursueBehavior]: Entity has no target entity.");
  });

  it("should compute based on maxPredictionTime if steerable is far away", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(1000, 1000, 1000), new Kompute.Vector3D(10, 10, 10));
    var targetSteerable = new Kompute.Steerable("target", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    targetSteerable.velocity.set(100, 200, 300);

    steerable.setTargetEntity(targetSteerable);

    var pursueBehavior = new Kompute.PursueBehavior({maxPredictionTime: 10});
    var seekBehavior = new Kompute.SeekBehavior();

    steerable.maxAcceleration = 100;

    steerable.velocity.set(10, 10, 10);

    var targetFinalPosition = targetSteerable.position.clone().add(targetSteerable.velocity.clone().multiplyScalar(10));

    var pursueResult = pursueBehavior.compute(steerable).linear;

    steerable.setTargetPosition(new Kompute.Vector3D(targetFinalPosition.x, targetFinalPosition.y, targetFinalPosition.z));
    var seekResult = seekBehavior.compute(steerable).linear;

    expect(pursueResult).to.eql(seekResult);
  });

  it("should compute based on distance if steerable is not far away", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(5, 5, 5), new Kompute.Vector3D(10, 10, 10));
    var targetSteerable = new Kompute.Steerable("target", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    targetSteerable.velocity.set(100, 200, 300);

    steerable.setTargetEntity(targetSteerable);

    var pursueBehavior = new Kompute.PursueBehavior({maxPredictionTime: 10});
    var seekBehavior = new Kompute.SeekBehavior();

    steerable.maxAcceleration = 100;

    steerable.velocity.set(10, 10, 10);

    var targetFinalPosition = targetSteerable.position.clone().add(targetSteerable.velocity.clone().multiplyScalar(
      new Kompute.Vector3D(5, 5, 5).getLength() / steerable.velocity.getLength()
    ));

    var pursueResult = pursueBehavior.compute(steerable).linear;
    steerable.setTargetPosition(new Kompute.Vector3D(targetFinalPosition.x, targetFinalPosition.y, targetFinalPosition.z));
    var seekResult = seekBehavior.compute(steerable).linear;

    expect(pursueResult).to.eql(seekResult);
  });

  it("should set target position of steerable", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(5, 5, 5), new Kompute.Vector3D(10, 10, 10));
    var targetSteerable = new Kompute.Steerable("target", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    targetSteerable.velocity.set(100, 200, 300);

    steerable.setTargetEntity(targetSteerable);

    var pursueBehavior = new Kompute.PursueBehavior({maxPredictionTime: 10});

    steerable.setBehavior(pursueBehavior);

    steerable.maxAcceleration = 100;
    steerable.velocity.set(10, 10, 10);

    var targetFinalPosition = targetSteerable.position.clone().add(targetSteerable.velocity.clone().multiplyScalar(
      new Kompute.Vector3D(5, 5, 5).getLength() / steerable.velocity.getLength()
    ));

    Kompute.logger.enable();

    pursueBehavior.compute(steerable);

    expect(steerable.targetPosition).to.eql(targetFinalPosition);
    expect(loggedMsg).to.eql("[PursueBehavior]: Seeking.");
  });
});
