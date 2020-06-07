var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("AlignBehavior", function(){

  var loggedMsg;

  beforeEach(function(){
    loggedMsg = null;
    Kompute.logger.logMethod = function(msg){
      loggedMsg = msg;
    }
  });

  afterEach(function(){
    Kompute.logger.logMethod = console.log;
    Kompute.logger.disable();
  });

  it("should initialize", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var alignBehavior = new Kompute.AlignBehavior();

    steerable.setBehavior(alignBehavior);

    expect(alignBehavior.result).to.eql(new Kompute.SteerResult());
  });

  it("should not request acceleration if no nearby steerables exist", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var alignBehavior = new Kompute.AlignBehavior();

    steerable.setBehavior(alignBehavior);

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);

    Kompute.logger.enable();

    expect(alignBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D());
    expect(loggedMsg).to.eql("[AlignBehavior]: No close entities exist. (steerable1)");
  });

  it("should compute", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steerable2 = new Kompute.Steerable("steerable2", new Kompute.Vector3D(10, 10, 10), new Kompute.Vector3D(10, 10, 10));
    var steerable3 = new Kompute.Steerable("steerable3", new Kompute.Vector3D(-10, -10, -10), new Kompute.Vector3D(10, 10, 10));
    var steerable4 = new Kompute.Steerable("steerable4", new Kompute.Vector3D(-300, -300, -300), new Kompute.Vector3D(10, 10, 10));

    var alignBehavior = new Kompute.AlignBehavior();

    steerable2.velocity.set(10, 20, 30);
    steerable3.velocity.set(40, 50, 60);
    steerable4.velocity.set(400, 500, 600);

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(steerable2);
    world.insertEntity(steerable3);
    world.insertEntity(steerable4);

    Kompute.logger.enable();

    expect(alignBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D(25, 35, 45));
    expect(loggedMsg).to.eql("[AlignBehavior]: Close entities exist. (steerable1)");
  });
});
