var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("BlendedSteeringBehavior", function(){

  it("should initialize", function(){

    var arriveBehavior = new Kompute.ArriveBehavior({satisfactionRadius: 10, slowDownRadius: 20});
    var avoidBehavior = new Kompute.AvoidBehavior({maxSeeAhead: 300, maxAvoidForce: 100});

    var list = [ { behavior: arriveBehavior, weight: 10 }, { behavior: avoidBehavior, weight: 30 } ];

    var blendedSteeringBehavior = new Kompute.BlendedSteeringBehavior(list);

    expect(blendedSteeringBehavior.result).to.eql(new Kompute.SteerResult());
    expect(blendedSteeringBehavior.definitions).to.equal(list);
  });

  it("should request 0 acceleration if no behavior added", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var blendedSteeringBehavior = new Kompute.BlendedSteeringBehavior([]);

    expect(blendedSteeringBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D());
  });

  it("should request weighted sum of injected behaviors", function(){

    var mb1 = new MockBehavior({linear: new Kompute.Vector3D(10, 20, 30)});
    var mb2 = new MockBehavior({linear: new Kompute.Vector3D(40, -20, 60)});
    var mb3 = new MockBehavior({linear: new Kompute.Vector3D(-10, 100, -30)});

    var list = [ {behavior: mb1, weight: 10}, {behavior: mb2, weight: 50}, {behavior: mb3, weight: 1} ];

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var blendedSteeringBehavior = new Kompute.BlendedSteeringBehavior(list);

    var result = blendedSteeringBehavior.compute(steerable);

    expect(result.linear).to.eql(new Kompute.Vector3D((10 * 10 + 40 * 50 - 10), (20 * 10 - 20 * 50 + 100), (30 * 10 + 60 * 50 - 30)));
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
