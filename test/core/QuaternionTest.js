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

  it("should calculate length", function(){

    var q1 = new Kompute.Quaternion(10, 20, 30, 40);

    expect(q1.getLength()).to.eql(Math.sqrt((10 * 10) + (20 * 20) + (30 * 30) + (40 * 40)));
  });

  it("should normalize", function(){

    var quaternion = new Kompute.Quaternion(0, 0, 0, 0);

    expect(quaternion.normalize()).to.eql(new Kompute.Quaternion());

    quaternion.set(10, 30, 60, 70);

    expect(quaternion.normalize().getLength()).to.eql(1);
  });

  it("should clone", function(){

    var q1 = new Kompute.Quaternion(10, 20, 30, 40);

    expect(q1.clone()).to.eql(q1);
    expect(q1.clone()).not.to.equal(q1);
  });

  it("should perform spherical linear interpolation", function(){

    var q1 = new Kompute.Quaternion(0, 0, 0, 1);
    var q2 = new Kompute.Quaternion(0.7071067811865475, 0, 0, 0.7071067811865476);

    expect(q1.clone().sphericalLinearInterpolation(q2.clone(), 0)).to.eql(q1);
    expect(q1.clone().sphericalLinearInterpolation(q2.clone(), 1)).to.eql(q2);

    var half1 = q1.clone().sphericalLinearInterpolation(q2.clone(), 0.5);
    var half2 = q2.clone().sphericalLinearInterpolation(q1.clone(), 0.5);

    expect(half1).to.eql(half2);

    var radialDistance = half1.radialDistanceTo(q1);

    expect(radialDistance.toFixed(5)).to.eql((Math.PI / 4).toFixed(5));
  });

  it("should rotate towards to another quaternion", function(){

    var q1 = new Kompute.Quaternion(0, 0, 0, 1);
    var q2 = new Kompute.Quaternion(0.7071067811865475, 0, 0, 0.7071067811865476);

    expect(q1.clone().rotateTowards(q2, 10)).to.eql(q2);
    expect(q2.clone().rotateTowards(q1, 10)).to.eql(q1);
    expect(q1.clone().rotateTowards(q2, 0.5 * Math.PI / 2)).to.eql(q2.clone().rotateTowards(q1, 0.5 * Math.PI/2));
  });
});
