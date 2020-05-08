var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Quaternion", function(){

  it("should initialize without parameters", function(){

    var quaternion = new Kompute.Quaternion();

    expect(quaternion.x).to.eql(0);
    expect(quaternion.y).to.eql(0);
    expect(quaternion.z).to.eql(0);
    expect(quaternion.w).to.eql(1);
  });

  it("should initialize with parameters", function(){

    var quaternion = new Kompute.Quaternion(4, 5, 6, 7);

    expect(quaternion.x).to.eql(4);
    expect(quaternion.y).to.eql(5);
    expect(quaternion.z).to.eql(6);
    expect(quaternion.w).to.eql(7);
  });

  it("should set", function(){

    var quaternion = new Kompute.Quaternion();

    quaternion.set(10, 20, 30, 40);

    expect(quaternion).to.eql(new Kompute.Quaternion(10, 20, 30, 40));
  });

  it("should copy", function(){

    var q1 = new Kompute.Quaternion();
    var q2 = new Kompute.Quaternion(10, 20, 30, 40);

    q1.copy(q2);

    expect(q1).to.eql(q2);
  });

  it("should perform dot product with another quaternion", function(){

    var q1 = new Kompute.Quaternion(10, 20, 30, 40);
    var q2 = new Kompute.Quaternion(-10, -20, -30, -40);

    expect(q1.dot(q2)).to.eql(-100-400-900-1600);
  });

  it("should calculate radial distance to another quaternion", function(){

    var q1 = new Kompute.Quaternion(0, 0, 0, 1);
    var q2 = new Kompute.Quaternion(0.7071067811865475, 0, 0, 0.7071067811865476);

    expect(q1.radialDistanceTo(q2)).to.eql(Math.PI/2);
    expect(q1.radialDistanceTo(q1)).to.eql(0);
    expect(q2.radialDistanceTo(q2)).to.eql(0);
  });
});
