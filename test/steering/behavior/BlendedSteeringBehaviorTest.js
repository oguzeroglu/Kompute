var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("BlendedSteeringBehavior", function(){

  it("should initialize", function(){

    var list = [
      {
        behavior: Kompute.ArriveBehavior,
        weight: 10,
        parameters: {satisfactionRadius: 10, slowDownRadius: 20}
      },
      {
        behavior: Kompute.AvoidBehavior,
        weight: 30,
        parameters: {maxSeeAhead: 300, maxAvoidForce: 100}
      }
    ];

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var blendedSteeringBehavior = new Kompute.BlendedSteeringBehavior(steerable, list);

    expect(blendedSteeringBehavior.result).to.eql(new Kompute.SteerResult());
    expect(blendedSteeringBehavior.steerable).to.equal(steerable);
    expect(blendedSteeringBehavior.behaviors).to.eql({
      0: {behavior: new Kompute.ArriveBehavior(steerable, {satisfactionRadius: 10, slowDownRadius: 20}), weight: 10},
      1: {behavior: new Kompute.AvoidBehavior(steerable, {maxSeeAhead: 300, maxAvoidForce: 100}), weight: 30}
    });
  });

  it("should request 0 acceleration if no behavior added", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var blendedSteeringBehavior = new Kompute.BlendedSteeringBehavior(steerable, []);

    expect(blendedSteeringBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should request weighted sum of injected behaviors", function(){

    var list = [
      {behavior: MockBehavior, parameters: {linear: new Kompute.Vector3D(10, 20, 30)}, weight: 10},
      {behavior: MockBehavior, parameters: {linear: new Kompute.Vector3D(40, -20, 60)}, weight: 50},
      {behavior: MockBehavior, parameters: {linear: new Kompute.Vector3D(-10, 100, -30)}, weight: 1}
    ];

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var blendedSteeringBehavior = new Kompute.BlendedSteeringBehavior(steerable, list);

    var result = blendedSteeringBehavior.compute();

    expect(result.linear).to.eql(new Kompute.Vector3D((10 * 10 + 40 * 50 - 10), (20 * 10 - 20 * 50 + 100), (30 * 10 + 60 * 50 - 30)));
  });
});

class MockBehavior extends Kompute.SteeringBehavior{
  constructor(steerable, options){
    super(steerable);

    this.options = options;
  }

  compute(){
    this.result.linear.copy(this.options.linear);

    return this.result;
  }
}
