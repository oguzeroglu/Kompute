var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("VectorPool", function(){

  it("should initialize", function(){

    var vectorPool = new Kompute.VectorPool(10);

    expect(vectorPool.index).to.eql(0);
    expect(vectorPool.vectors).to.have.length(10);
  });

  it("should get", function(){

    var vectorPool = new Kompute.VectorPool(10);

    expect(vectorPool.get()).to.eql(new Kompute.Vector3D());
  });

  it("should handle out of bounds", function(){

    var vectorPool = new Kompute.VectorPool(10);

    var vect;
    for (var i = 0; i < 30; i ++){
      vect = vectorPool.get();
    }

    expect(vect).to.eql(new Kompute.Vector3D());
  });
});
