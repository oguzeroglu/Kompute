var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Box", function(){

  it("should set from center and size", function(){

    var center = new Kompute.Vector3D(100, 200, 300);
    var size = new Kompute.Vector3D(500, 600, 700);

    var box = new Kompute.Box(center, size);

    expect(box.min.x).to.be.eql(-150);
    expect(box.min.y).to.be.eql(-100);
    expect(box.min.z).to.be.eql(-50);

    expect(box.max.x).to.be.eql(350);
    expect(box.max.y).to.be.eql(500);
    expect(box.max.z).to.be.eql(650);
  });
});
