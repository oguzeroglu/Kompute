var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("JumpBehavior", function(){

  it("should initialize", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var jumpBehavior = new Kompute.JumpBehavior();

    steerable.setJumpBehavior(jumpBehavior);

    expect(jumpBehavior.result).to.eql(new Kompute.SteerResult());
    expect(jumpBehavior.steerable).to.equal(steerable);
  });

  it("should not request acceleration if jump is not initiated", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var jumpBehavior = new Kompute.JumpBehavior();

    steerable.setJumpBehavior(jumpBehavior);

    expect(jumpBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });
});
