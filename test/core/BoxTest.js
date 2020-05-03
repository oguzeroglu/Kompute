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

  it("should make empty", function(){

    var center = new Kompute.Vector3D(100, 200, 300);
    var size = new Kompute.Vector3D(500, 600, 700);

    var box = new Kompute.Box(center, size);

    box.makeEmpty();

    expect(box.min.x).to.be.eql(Infinity);
    expect(box.min.y).to.be.eql(Infinity);
    expect(box.min.z).to.be.eql(Infinity);
    expect(box.max.x).to.be.eql(Infinity);
    expect(box.max.y).to.be.eql(Infinity);
    expect(box.max.z).to.be.eql(Infinity);
  });

  it("should expand by point", function(){

    var center = new Kompute.Vector3D();
    var size = new Kompute.Vector3D(100, 100, 100);
    var box = new Kompute.Box(center, size);

    box.expandByPoint(new Kompute.Vector3D(-100, 200, 300));

    expect(box.min.x).to.be.eql(-100);
    expect(box.max.x).to.be.eql(50);
    expect(box.min.y).to.be.eql(-50);
    expect(box.max.y).to.be.eql(200);
    expect(box.min.z).to.be.eql(-50);
    expect(box.max.z).to.be.eql(300);
  });

  it("should check intersection", function(){

    var size = new Kompute.Vector3D(100, 100, 100);

    var box1 = new Kompute.Box(new Kompute.Vector3D(), size);
    var box2 = new Kompute.Box(new Kompute.Vector3D(10, 10, 10), size);
    var box3 = new Kompute.Box(new Kompute.Vector3D(300, 300, 300), size);

    expect(box1.intersectsBox(box2)).to.be.true;
    expect(box1.intersectsBox(box3)).to.be.false;
  });
});
