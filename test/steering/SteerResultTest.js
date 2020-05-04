var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("SteerResult", function(){

  it("should initiate", function(){

    var steerResult = new Kompute.SteerResult();

    expect(steerResult.linear).to.eql(new Kompute.Vector3D());
  });
});
