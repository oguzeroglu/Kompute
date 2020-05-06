var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("SeekBehavior", function(){

  it("should initiate", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var seekBehavior = new Kompute.SeekBehavior(steerable);

    expect(seekBehavior.result).to.eql(new Kompute.SteerResult());
    expect(seekBehavior.steerable).to.equal(steerable);
  });

  it("should not request movement if steerable has no target position", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var seekBehavior = new Kompute.SeekBehavior(steerable);

    expect(seekBehavior.compute()).to.eql(null);
  });

  it("should compute", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var seekBehavior = new Kompute.SeekBehavior(steerable);

    steerable.setTargetPosition(100, 200, 300);
    steerable.maxAcceleration = 100;

    expect(seekBehavior.compute().linear.getLength()).to.eql(steerable.maxAcceleration);
  });
});
