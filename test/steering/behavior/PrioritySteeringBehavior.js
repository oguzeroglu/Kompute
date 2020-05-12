var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("PrioritySteeringBehavior", function(){

  it("should initialize", function(){

    var list = [
      {
        behavior: Kompute.ArriveBehavior,
        parameters: {satisfactionRadius: 10, slowDownRadius: 20}
      },
      {
        behavior: Kompute.AvoidBehavior,
        parameters: {maxSeeAhead: 300, maxAvoidForce: 100}
      }
    ];

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var prioritySteeringBehavior = new Kompute.PrioritySteeringBehavior(steerable, { threshold: 10, list: list});

    expect(prioritySteeringBehavior.result).to.eql(new Kompute.SteerResult());
    expect(prioritySteeringBehavior.steerable).to.equal(steerable);
    expect(prioritySteeringBehavior.threshold).to.equal(10);
    expect(prioritySteeringBehavior.list).to.eql([
      new Kompute.ArriveBehavior(steerable, {satisfactionRadius: 10, slowDownRadius: 20}),
      new Kompute.AvoidBehavior(steerable, {maxSeeAhead: 300, maxAvoidForce: 100})
    ]);
  });

  it("should request 0 acceleration if no behavior added", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var prioritySteeringBehavior = new Kompute.PrioritySteeringBehavior(steerable, { threshold: 10, list: []});

    expect(prioritySteeringBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should compute", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var list = [
      {behavior: MockBehavior, parameters: {linear: new Kompute.Vector3D(1, 1, 1)}},
      {behavior: MockBehavior, parameters: {linear: new Kompute.Vector3D(100, 100, 100)}},
    ];

    var prioritySteeringBehavior = new Kompute.PrioritySteeringBehavior(steerable, { threshold: 10, list: list});
    var prioritySteeringBehavior2 = new Kompute.PrioritySteeringBehavior(steerable, { threshold: 0, list: list});
    var prioritySteeringBehavior3 = new Kompute.PrioritySteeringBehavior(steerable, { threshold: 100000, list: list});

    expect(prioritySteeringBehavior.compute().linear).to.eql(new Kompute.Vector3D(100, 100, 100));
    expect(prioritySteeringBehavior2.compute().linear).to.eql(new Kompute.Vector3D(1, 1, 1));
    expect(prioritySteeringBehavior3.compute().linear).to.eql(new Kompute.Vector3D());
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
