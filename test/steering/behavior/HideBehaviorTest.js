var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("HideBehavior", function(){

  it("should initialize", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var hideBehavior = new Kompute.HideBehavior(steerable, { arriveSatisfactionRadius: 50, arriveSlowDownRadius: 100 });

    expect(hideBehavior.result).to.eql(new Kompute.SteerResult());
    expect(hideBehavior.steerable).to.equal(steerable);
    expect(hideBehavior.satisfactionRadius).to.eql(50);
    expect(hideBehavior.slowDownRadius).to.eql(100);
  });

  it("should not request acceleration if steerable has no hide target entity", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var hideBehavior = new Kompute.HideBehavior(steerable, { arriveSatisfactionRadius: 50, arriveSlowDownRadius: 100 });

    expect(hideBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });
});
