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
});
