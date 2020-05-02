var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Vector3D", function(){

  it("should set 0 by default", function(){

    var vect = new Kompute.Vector3D();

    expect(vect.x).to.be.eql(0);
    expect(vect.y).to.be.eql(0);
    expect(vect.z).to.be.eql(0);
  });

  it("should set", function(){

    var vect = new Kompute.Vector3D(10, 20, 30);

    expect(vect.x).to.be.eql(10);
    expect(vect.y).to.be.eql(20);
    expect(vect.z).to.be.eql(30);
  });

  it("should multiply scalar", function(){

    var vect = new Kompute.Vector3D(10, 20, 30);

    vect.multiplyScalar(10);

    expect(vect.x).to.be.eql(100);
    expect(vect.y).to.be.eql(200);
    expect(vect.z).to.be.eql(300);
  });
});
