var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("SteeringBehavior", function(){

  it("should initialize", function(){

    var steeringBehavior = new Kompute.SteeringBehavior();

    expect(steeringBehavior.result).to.eql(new Kompute.SteerResult());
  });


  it("should not request acceleration", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steeringBehavior = new Kompute.SteeringBehavior();

    expect(steeringBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D(0, 0, 0));
  });
});
