var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("CohesionBehavior", function(){

  it("should initialize", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var cohesionBehavior = new Kompute.CohesionBehavior();

    steerable.setBehavior(cohesionBehavior);

    expect(cohesionBehavior.result).to.eql(new Kompute.SteerResult());
    expect(cohesionBehavior.steerable).to.equal(steerable);
  });

  it("should not request acceleration if no nearby steerables exist", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var cohesionBehavior = new Kompute.CohesionBehavior();

    steerable.setBehavior(cohesionBehavior);

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);

    expect(cohesionBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should delegate to SeekBehavior", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steerable2 = new Kompute.Steerable("steerable2", new Kompute.Vector3D(10, 10, 10), new Kompute.Vector3D(10, 10, 10));
    var steerable3 = new Kompute.Steerable("steerable3", new Kompute.Vector3D(30, 20, 100), new Kompute.Vector3D(10, 10, 10));
    var steerable4 = new Kompute.Steerable("steerable4", new Kompute.Vector3D(-30, 40, -60), new Kompute.Vector3D(10, 10, 10));

    var cohesionBehavior = new Kompute.CohesionBehavior();
    var seekBehavior = new Kompute.SeekBehavior();

    steerable.setBehavior(cohesionBehavior);
    seekBehavior.setSteerable(steerable);

    steerable.maxAcceleration = 10;

    var world = new Kompute.World(1000, 1000, 1000, 500);
    world.insertEntity(steerable);
    world.insertEntity(steerable2);
    world.insertEntity(steerable3);
    world.insertEntity(steerable4);

    var cohesionResult = cohesionBehavior.compute();
    var seekResult = seekBehavior.compute();

    expect(cohesionResult.linear).to.eql(seekResult.linear);
    expect(steerable.targetPosition.toFixed(8)).to.eql(new Kompute.Vector3D(10/3, 70/3, 50/3).toFixed(8));
  });
});
