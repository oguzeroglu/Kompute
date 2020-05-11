var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("FleeBehavior", function(){

  it("should initialize", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var fleeBehavior = new Kompute.FleeBehavior(steerable);

    expect(fleeBehavior.result).to.eql(new Kompute.SteerResult());
    expect(fleeBehavior.steerable).to.equal(steerable);
  });

  it("should not request acceleration if steerable has no target position", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var fleeBehavior = new Kompute.FleeBehavior(steerable);

    expect(fleeBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should compute the inverse of seek behavior", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var seekBehavior = new Kompute.SeekBehavior(steerable);
    var fleeBehavior = new Kompute.FleeBehavior(steerable);

    steerable.setTargetPosition(new Kompute.Vector3D(100, 200, 300));
    steerable.maxAcceleration = 100;

    var seekResult = seekBehavior.compute().linear;
    var fleeResult = fleeBehavior.compute().linear;

    expect(fleeResult).to.eql(seekResult.multiplyScalar(-1));
  });
});
