var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("JumpDescriptor", function(){

  it("should initialize", function(){

    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(100, 0, 0),
      landingPosition: new Kompute.Vector3D(150, 100, 0),
      runupRadius: 50
    });

    expect(jumpDescriptor.takeoffPosition).to.eql(new Kompute.Vector3D(100, 0, 0));
    expect(jumpDescriptor.landingPosition).to.eql(new Kompute.Vector3D(150, 100, 0));
    expect(jumpDescriptor.runupRadius).to.eql(50);
    expect(jumpDescriptor.delta).to.eql(new Kompute.Vector3D(50, 100, 0));
  });
});
