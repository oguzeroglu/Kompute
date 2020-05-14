var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("SeparationBehavior", function(){

  it("should initialize", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var separationBehavior = new Kompute.SeparationBehavior(steerable, { strength: 50 });

    expect(separationBehavior.result).to.eql(new Kompute.SteerResult());
    expect(separationBehavior.steerable).to.equal(steerable);
    expect(separationBehavior.strength).to.eql(50);
  });

  it("should not request acceleration if there's no steerable nearby", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var separationBehavior = new Kompute.SeparationBehavior(steerable, { strength: 50 });

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);

    expect(separationBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should not consider steerables in same position", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steerable2 = new Kompute.Steerable("steerable2", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var separationBehavior = new Kompute.SeparationBehavior(steerable, { strength: 50 });

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(steerable2);

    expect(separationBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should compute", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steerable2 = new Kompute.Steerable("steerable2", new Kompute.Vector3D(10, 10, 10), new Kompute.Vector3D(10, 10, 10));
    var separationBehavior = new Kompute.SeparationBehavior(steerable, { strength: 50 });

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(steerable2);

    var sub = steerable.position.clone().sub(steerable2.position);
    var result = separationBehavior.compute();

    expect(result.linear.getLength() < 50).to.eql(true);
    var dot = sub.normalize().dot(result.linear.normalize());

    expect(dot).to.eql(1);
  });
});
