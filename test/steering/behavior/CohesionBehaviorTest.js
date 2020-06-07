var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("CohesionBehavior", function(){

  var loggedMsg;

  beforeEach(function(){
    loggedMsg = null;
    Kompute.logger.logMethod = function(msg){
      if (loggedMsg != null){
        return;
      }
      loggedMsg = msg;
    }
  });

  afterEach(function(){
    Kompute.logger.logMethod = console.log;
    Kompute.logger.disable();
  });

  it("should initialize", function(){
    var cohesionBehavior = new Kompute.CohesionBehavior();

    expect(cohesionBehavior.result).to.eql(new Kompute.SteerResult());
  });

  it("should not request acceleration if no nearby steerables exist", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var cohesionBehavior = new Kompute.CohesionBehavior();

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);

    Kompute.logger.enable();

    expect(cohesionBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D());
    expect(loggedMsg).to.eql("[CohesionBehavior]: No close entities exist.");
  });

  it("should delegate to SeekBehavior", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steerable2 = new Kompute.Steerable("steerable2", new Kompute.Vector3D(10, 10, 10), new Kompute.Vector3D(10, 10, 10));
    var steerable3 = new Kompute.Steerable("steerable3", new Kompute.Vector3D(30, 20, 100), new Kompute.Vector3D(10, 10, 10));
    var steerable4 = new Kompute.Steerable("steerable4", new Kompute.Vector3D(-30, 40, -60), new Kompute.Vector3D(10, 10, 10));

    var cohesionBehavior = new Kompute.CohesionBehavior();
    var seekBehavior = new Kompute.SeekBehavior();

    steerable.maxAcceleration = 10;

    var world = new Kompute.World(1000, 1000, 1000, 500);
    world.insertEntity(steerable);
    world.insertEntity(steerable2);
    world.insertEntity(steerable3);
    world.insertEntity(steerable4);

    Kompute.logger.enable();

    var cohesionResult = cohesionBehavior.compute(steerable);
    var seekResult = seekBehavior.compute(steerable);

    expect(cohesionResult.linear).to.eql(seekResult.linear);
    expect(steerable.targetPosition.toFixed(8)).to.eql(new Kompute.Vector3D(10/3, 70/3, 50/3).toFixed(8));
    expect(loggedMsg).to.eql("[CohesionBehavior]: Close entities exist.");
  });
});
