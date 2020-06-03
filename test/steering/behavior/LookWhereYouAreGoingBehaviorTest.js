var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("LookWhereYouAreGoing", function(){

  it("should initialize", function(){
    var lookWhereYouAreGoingBehavior = new Kompute.LookWhereYouAreGoingBehavior();

    expect(lookWhereYouAreGoingBehavior.result).to.eql(new Kompute.SteerResult());
  });

  it("should set look target of entity based on its velocity", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(700, 800, 900), new Kompute.Vector3D(10, 10, 10));
    var lookWhereYouAreGoingBehavior = new Kompute.LookWhereYouAreGoingBehavior();

    steerable.velocity.set(100, 500, 700);

    lookWhereYouAreGoingBehavior.compute(steerable);

    expect(steerable.lookTarget).to.eql(new Kompute.Vector3D(800, 1300, 1600));
  });

  it("should not request linear acceleartion", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(700, 800, 900), new Kompute.Vector3D(10, 10, 10));
    var lookWhereYouAreGoingBehavior = new Kompute.LookWhereYouAreGoingBehavior();

    var result = lookWhereYouAreGoingBehavior.compute(steerable);

    expect(result.linear).to.eql(new Kompute.Vector3D());
  });
});
