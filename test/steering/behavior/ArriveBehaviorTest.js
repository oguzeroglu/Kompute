var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("ArriveBehavior", function(){

  it("should initiate", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var arriveBehavior = new Kompute.ArriveBehavior(steerable, { satisfactionRadius: 50, slowDownRadius: 100 });

    expect(arriveBehavior.result).to.eql(new Kompute.SteerResult());
    expect(arriveBehavior.steerable).to.equal(steerable);
    expect(arriveBehavior.satisfactionRadius).to.eql(50);
    expect(arriveBehavior.slowDownRadius).to.eql(100);
  });

  it("should not request acceleration if steerable has no target position", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var arriveBehavior = new Kompute.ArriveBehavior(steerable, { satisfactionRadius: 50, slowDownRadius: 100 });

    expect(arriveBehavior.compute().linear).to.eql(new Kompute.Vector3D(0, 0, 0));
  });

  it("should not request acceleration if steerable in satisfactionRadius", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var arriveBehavior = new Kompute.ArriveBehavior(steerable, {
      satisfactionRadius: 50,
      slowDownRadius: 100
    });

    steerable.setTargetPosition(10, 10, 10);

    expect(arriveBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should slow down if steerable in slowDownRadius", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(105, 105, 105), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(steerable);

    steerable.setBehavior(Kompute.ArriveBehavior, { satisfactionRadius: 0.1, slowDownRadius: 200 });
    steerable.setTargetPosition(100, 100, 100);
    steerable.maxSpeed = 0.1;
    steerable.maxAcceleration = 0.1;

    for (var i = 0; i < 1000; i ++){
      steerable.update();
    }

    var vel1 = steerable.velocity.clone();
    steerable.update();
    var vel2 = steerable.velocity.clone();
    steerable.update();
    var vel3 = steerable.velocity.clone();
    expect(vel1.getLength() > vel2.getLength()).to.eql(true);
    expect(vel1.getLength() > vel3.getLength()).to.eql(true);
    expect(vel2.getLength() > vel3.getLength()).to.eql(true);
  });

  it("should arrive", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 10);
    world.insertEntity(steerable);

    steerable.setBehavior(Kompute.ArriveBehavior, { satisfactionRadius: 0.001, slowDownRadius: 10 });
    steerable.setTargetPosition(100, 100, 100);
    steerable.maxSpeed = 1;
    steerable.maxAcceleration = 1;
    for (var i = 0; i < 100000; i ++){
      steerable.update();
    }

    expect(new Kompute.Vector3D(100, 100, 100).sub(steerable.position).getLength() <= 0.001).to.eql(true);
  });
});
