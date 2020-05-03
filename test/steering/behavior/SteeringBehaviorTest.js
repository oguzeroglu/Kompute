var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("SteeringBehavior", function(){

  it("should initiate", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steeringBehavior = new Kompute.SteeringBehavior(steerable);

    expect(steeringBehavior.result).to.be.eql(new Kompute.SteerResult());
    expect(steeringBehavior.steerable).to.be.equal(steerable);
  });


  it("should compute", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steeringBehavior = new Kompute.SteeringBehavior(steerable);

    expect(steeringBehavior.compute()).to.be.equal(steeringBehavior.result);
  });
});
