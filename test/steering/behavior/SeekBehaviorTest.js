var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("SeekBehavior", function(){

  it("should initialize", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var seekBehavior = new Kompute.SeekBehavior();

    steerable.setBehavior(seekBehavior);

    expect(seekBehavior.result).to.eql(new Kompute.SteerResult());
    expect(seekBehavior.steerable).to.equal(steerable);
  });

  it("should not request acceleration if steerable has no target position", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var seekBehavior = new Kompute.SeekBehavior();

    steerable.setBehavior(seekBehavior);

    expect(seekBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should compute", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var seekBehavior = new Kompute.SeekBehavior();

    steerable.setBehavior(seekBehavior);

    steerable.setTargetPosition(new Kompute.Vector3D(100, 200, 300));
    steerable.maxAcceleration = 100;

    expect(seekBehavior.compute().linear.getLength()).to.eql(steerable.maxAcceleration);
  });
});
