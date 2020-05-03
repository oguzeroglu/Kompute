var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Steerable", function(){

  it("should initialize", function(){

    var center = new Kompute.Vector3D(50, 60, 70);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    var box = new Kompute.Box(center, size);

    expect(entity.id).to.be.eql("steerable1");
    expect(entity.size).to.be.eql(size);
    expect(entity.position).to.be.eql(center);
    expect(entity.box).to.be.eql(box);
    expect(entity.nearbyObject).to.be.null;
    expect(entity.velocity).to.be.eql(new Kompute.Vector3D());
    expect(entity.maxSpeed).to.be.eql(Infinity);
    expect(entity.linearAcceleration).to.be.eql(new Kompute.Vector3D());
    expect(entity.maxAcceleration).to.be.eql(Infinity);
  });

  it("should update", function(){

    var center = new Kompute.Vector3D(0, 0, 0);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Steerable("steerable1", center, size);

    entity.update();
    expect(entity.position).to.be.eql(center);
    entity.linearAcceleration.set(10, 0, 0);
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(10, 0, 0));
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(30, 0, 0));
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(60, 0, 0));
  });

  it("should clamp acceleartion based on maxAcceleration", function(){

    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var entity = new Kompute.Steerable("steerable1", center, entitySize);

    entity.linearAcceleration.set(100, 200, 300);
    entity.maxAcceleration = 10;

    entity.update();

    expect(entity.linearAcceleration.getLength()).to.be.eql(entity.maxAcceleration);
  });
});
