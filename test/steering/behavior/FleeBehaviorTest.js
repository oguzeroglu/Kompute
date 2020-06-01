var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("FleeBehavior", function(){

  it("should initialize", function(){
    var fleeBehavior = new Kompute.FleeBehavior();

    expect(fleeBehavior.result).to.eql(new Kompute.SteerResult());
  });

  it("should not request acceleration if steerable has no target position", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var fleeBehavior = new Kompute.FleeBehavior();

    expect(fleeBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D());
  });

  it("should compute the inverse of seek behavior", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var seekBehavior = new Kompute.SeekBehavior();
    var fleeBehavior = new Kompute.FleeBehavior();

    steerable.setTargetPosition(new Kompute.Vector3D(100, 200, 300));
    steerable.maxAcceleration = 100;

    var seekResult = seekBehavior.compute(steerable).linear;
    var fleeResult = fleeBehavior.compute(steerable).linear;

    expect(fleeResult).to.eql(seekResult.multiplyScalar(-1));
  });
});
