var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("PrioritySteeringBehavior", function(){

  it("should initialize", function(){

    var arriveBehavior = new Kompute.ArriveBehavior({satisfactionRadius: 10, slowDownRadius: 20});
    var avoidBehavior = new Kompute.AvoidBehavior({maxSeeAhead: 300, maxAvoidForce: 100});

    var list = [arriveBehavior, avoidBehavior];

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var prioritySteeringBehavior = new Kompute.PrioritySteeringBehavior({ threshold: 10, list: list});

    steerable.setBehavior(prioritySteeringBehavior);

    expect(prioritySteeringBehavior.result).to.eql(new Kompute.SteerResult());
    expect(prioritySteeringBehavior.steerable).to.equal(steerable);
    expect(prioritySteeringBehavior.threshold).to.equal(10);
    expect(prioritySteeringBehavior.list).to.eql([arriveBehavior, avoidBehavior]);
    expect(arriveBehavior.steerable).to.equal(steerable);
    expect(avoidBehavior.steerable).to.equal(steerable);
  });

  it("should request 0 acceleration if no behavior added", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var prioritySteeringBehavior = new Kompute.PrioritySteeringBehavior({ threshold: 10, list: []});

    steerable.setBehavior(prioritySteeringBehavior);

    expect(prioritySteeringBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should compute", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    var list = [
      new MockBehavior({linear: new Kompute.Vector3D(1, 1, 1)}),
      new MockBehavior({linear: new Kompute.Vector3D(100, 100, 100)})
    ];

    var prioritySteeringBehavior = new Kompute.PrioritySteeringBehavior({ threshold: 10, list: list});
    var prioritySteeringBehavior2 = new Kompute.PrioritySteeringBehavior({ threshold: 0, list: list});
    var prioritySteeringBehavior3 = new Kompute.PrioritySteeringBehavior({ threshold: 100000, list: list});

    prioritySteeringBehavior.setSteerable(steerable);
    prioritySteeringBehavior2.setSteerable(steerable);
    prioritySteeringBehavior3.setSteerable(steerable);

    expect(prioritySteeringBehavior.compute().linear).to.eql(new Kompute.Vector3D(100, 100, 100));
    expect(prioritySteeringBehavior2.compute().linear).to.eql(new Kompute.Vector3D(1, 1, 1));
    expect(prioritySteeringBehavior3.compute().linear).to.eql(new Kompute.Vector3D());
  });
});

class MockBehavior extends Kompute.SteeringBehavior{
  constructor(options){
    super();

    this.options = options;
  }

  compute(){
    this.result.linear.copy(this.options.linear);

    return this.result;
  }
}
