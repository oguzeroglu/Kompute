var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("AlignBehavior", function(){

  it("should initialize", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var alignBehavior = new Kompute.AlignBehavior(steerable, { strength: 50 });

    expect(alignBehavior.result).to.eql(new Kompute.SteerResult());
    expect(alignBehavior.steerable).to.equal(steerable);
  });

  it("should not request acceleration if no nearby steerables exist", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var alignBehavior = new Kompute.AlignBehavior(steerable, { strength: 50 });

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);

    expect(alignBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should compute", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steerable2 = new Kompute.Steerable("steerable2", new Kompute.Vector3D(10, 10, 10), new Kompute.Vector3D(10, 10, 10));
    var steerable3 = new Kompute.Steerable("steerable3", new Kompute.Vector3D(-10, -10, -10), new Kompute.Vector3D(10, 10, 10));
    var steerable4 = new Kompute.Steerable("steerable4", new Kompute.Vector3D(-300, -300, -300), new Kompute.Vector3D(10, 10, 10));

    var alignBehavior = new Kompute.AlignBehavior(steerable, { strength: 50 });

    steerable2.velocity.set(10, 20, 30);
    steerable3.velocity.set(40, 50, 60);
    steerable4.velocity.set(400, 500, 600);

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(steerable2);
    world.insertEntity(steerable3);
    world.insertEntity(steerable4);

    expect(alignBehavior.compute().linear).to.eql(new Kompute.Vector3D(25, 35, 45));
  });
});
