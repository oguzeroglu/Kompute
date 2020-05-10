var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("MathUtils", function(){

  var MathUtils = new Kompute.MathUtils();

  it("should clamp", function(){

    var min = 10;
    var max = 100;

    expect(MathUtils.clamp(min, min, max)).to.eql(min);
    expect(MathUtils.clamp(max, min, max)).to.eql(max);
    expect(MathUtils.clamp((min + max) / 2, min, max)).to.eql((min + max) / 2);
    expect(MathUtils.clamp(min - max, min, max)).to.eql(min);
    expect(MathUtils.clamp(max * 2, min, max)).to.eql(max);
  });

  it("should compute normal from 3 vectors", function(){

    for (var i = 0 ; i < 1000; i ++){
      var v1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
      var v2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
      var v3 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
      var normal = MathUtils.computeNormalFrom3Vectors(v1, v2, v3);
      expect(Math.round(v1.clone().sub(v2).dot(normal))).to.eql(0);
      expect(Math.round(v1.clone().sub(v3).dot(normal))).to.eql(0);
      expect(Math.round(v2.clone().sub(v1).dot(normal))).to.eql(0);
      expect(Math.round(v2.clone().sub(v3).dot(normal))).to.eql(0);
      expect(Math.round(v3.clone().sub(v1).dot(normal))).to.eql(0);
      expect(Math.round(v3.clone().sub(v2).dot(normal))).to.eql(0);
    }
  });
});
