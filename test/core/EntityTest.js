var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Entity", function(){

  it("should initialize", function(){

    var center = new Kompute.Vector3D(50, 60, 70);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Entity("entity1", center, size);

    expect(entity.id).to.be.eql("entity1");
    expect(entity.center).to.be.eql(center);
    expect(entity.size).to.be.eql(size);
    expect(entity.box).to.be.eql(new Kompute.Box(center, size));
  });

});
