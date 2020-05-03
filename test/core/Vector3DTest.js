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

  it("should copy", function(){

    var vect = new Kompute.Vector3D();
    var vect2 = new Kompute.Vector3D(100, 200, 300);

    vect.copy(vect2);

    expect(vect).to.be.eql(vect2);
  });

  it("should clone", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);

    expect(vect.clone()).to.be.eql(vect);
  });

  it("should min", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);
    var vect2 = new Kompute.Vector3D(-100, 300, 50);

    vect.min(vect2);

    expect(vect.x).to.be.eql(-100);
    expect(vect.y).to.be.eql(200);
    expect(vect.z).to.be.eql(50);
  });

  it("should max", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);
    var vect2 = new Kompute.Vector3D(500, 300, -350);

    vect.max(vect2);

    expect(vect.x).to.be.eql(500);
    expect(vect.y).to.be.eql(300);
    expect(vect.z).to.be.eql(300);
  });

  it("should get length", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);

    expect(vect.getLength()).to.be.eql(Math.sqrt(140000));
  });

  it("should add", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);

    expect(vect.add(new Kompute.Vector3D(500, 600, 700))).to.be.eql(new Kompute.Vector3D(600, 800, 1000));
  });

  it("should normalize", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);

    expect(vect.normalize().getLength()).to.be.eql(1);
  });
});
