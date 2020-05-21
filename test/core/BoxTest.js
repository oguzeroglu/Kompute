var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Box", function(){

  it("should set from center and size", function(){

    var center = new Kompute.Vector3D(100, 200, 300);
    var size = new Kompute.Vector3D(500, 600, 700);

    var box = new Kompute.Box(center, size);

    expect(box.min.x).to.eql(-150);
    expect(box.min.y).to.eql(-100);
    expect(box.min.z).to.eql(-50);

    expect(box.max.x).to.eql(350);
    expect(box.max.y).to.eql(500);
    expect(box.max.z).to.eql(650);
  });

  it("should make empty", function(){

    var center = new Kompute.Vector3D(100, 200, 300);
    var size = new Kompute.Vector3D(500, 600, 700);

    var box = new Kompute.Box(center, size);

    box.makeEmpty();

    expect(box.min.x).to.eql(Infinity);
    expect(box.min.y).to.eql(Infinity);
    expect(box.min.z).to.eql(Infinity);
    expect(box.max.x).to.eql(-Infinity);
    expect(box.max.y).to.eql(-Infinity);
    expect(box.max.z).to.eql(-Infinity);
  });

  it("should expand by point", function(){

    var center = new Kompute.Vector3D();
    var size = new Kompute.Vector3D(100, 100, 100);
    var box = new Kompute.Box(center, size);

    box.expandByPoint(new Kompute.Vector3D(-100, 200, 300));

    expect(box.min.x).to.eql(-100);
    expect(box.max.x).to.eql(50);
    expect(box.min.y).to.eql(-50);
    expect(box.max.y).to.eql(200);
    expect(box.min.z).to.eql(-50);
    expect(box.max.z).to.eql(300);
  });

  it("should check intersection", function(){

    var size = new Kompute.Vector3D(100, 100, 100);

    var box1 = new Kompute.Box(new Kompute.Vector3D(), size);
    var box2 = new Kompute.Box(new Kompute.Vector3D(10, 10, 10), size);
    var box3 = new Kompute.Box(new Kompute.Vector3D(300, 300, 300), size);

    expect(box1.intersectsBox(box2)).to.eql(true);
    expect(box1.intersectsBox(box3)).to.eql(false);
  });

  it("should check if contains another box", function(){

    var box1 = new Kompute.Box(new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));
    var box2 = new Kompute.Box(new Kompute.Vector3D(10, 10, 10), new Kompute.Vector3D(10, 10, 10));

    expect(box1.containsBox(box2)).to.eql(true);
    expect(box2.containsBox(box1)).to.eql(false);

    var box3 = new Kompute.Box(new Kompute.Vector3D(52, 52, 52), new Kompute.Vector3D(1, 1, 1));
    expect(box1.containsBox(box3)).to.eql(false);
  });

  it("should set from two vectors", function(){

    var box = new Kompute.Box(new Kompute.Vector3D(), new Kompute.Vector3D());

    var v1 = new Kompute.Vector3D(100, 200, 300);
    var v2 = new Kompute.Vector3D(-100, -200, -300);

    box.setFromTwoVectors(v1, v2, 10);
    var center = new Kompute.Vector3D((v1.x + v2.x) / 2, (v1.y + v2.y) / 2, (v1.z + v2.z) / 2);

    expect(center.x < box.max.x).to.eql(true);
    expect(center.y < box.max.y).to.eql(true);
    expect(center.z < box.max.z).to.eql(true);
    expect(center.x > box.min.x).to.eql(true);
    expect(center.y > box.min.y).to.eql(true);
    expect(center.z > box.min.z).to.eql(true);
  });

  it("should get if empty", function(){
    var box = new Kompute.Box(new Kompute.Vector3D(), new Kompute.Vector3D(100, 200, 300));

    expect(box.isEmpty()).to.eql(false);

    box.makeEmpty();

    expect(box.isEmpty()).to.eql(true);
  });

  it("should get bounding radius", function(){
    var box = new Kompute.Box(new Kompute.Vector3D(), new Kompute.Vector3D(10, 20, 30));

    expect(box.getBoundingRadius()).to.eql(Math.sqrt(100 + 400 + 900) / 2);

    box.makeEmpty();

    expect(box.getBoundingRadius()).to.eql(0);
  });
});
