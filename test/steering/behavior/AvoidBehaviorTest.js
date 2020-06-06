var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("AvoidBehavior", function(){

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
    var avoidBehavior = new Kompute.AvoidBehavior({ maxSeeAhead: 50, maxAvoidForce: 100 });

    expect(avoidBehavior.result).to.eql(new Kompute.SteerResult());
    expect(avoidBehavior.maxSeeAhead).to.eql(50);
    expect(avoidBehavior.maxAvoidForce).to.eql(100);
  });

  it("should not find most mostThreatening if not going towards the obstacle", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var obstacle = new Kompute.Entity("entity1", new Kompute.Vector3D(20, 0, 20), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(obstacle);

    steerable.velocity = new Kompute.Vector3D(-10, 0, -10);

    var avoidBehavior = new Kompute.AvoidBehavior({ maxSeeAhead: 50, maxAvoidForce: 100 });

    expect(avoidBehavior.findMostThreateningObstacle(steerable)).to.eql(null);
  });

  it("should not find most mostThreatening if there's no nearby object", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var obstacle = new Kompute.Entity("entity1", new Kompute.Vector3D(200, 0, 200), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 5);
    world.insertEntity(steerable);
    world.insertEntity(obstacle);

    steerable.velocity = new Kompute.Vector3D(1000, 0, 1000);

    var avoidBehavior = new Kompute.AvoidBehavior({ maxSeeAhead: 50000, maxAvoidForce: 100 });

    expect(avoidBehavior.findMostThreateningObstacle(steerable)).to.eql(null);
  });

  it("should find most mostThreatening if not going towards the obstacle [hits obstacle by size]", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 80, 10));
    var obstacle = new Kompute.Entity("entity1", new Kompute.Vector3D(40, 40, 40), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(obstacle);

    steerable.velocity.set(100, 0, 100);

    var avoidBehavior = new Kompute.AvoidBehavior({ maxSeeAhead: 100, maxAvoidForce: 100 });

    expect(avoidBehavior.findMostThreateningObstacle(steerable)).to.eql(obstacle);
  });

  it("should find most mostThreatening if not going towards the obstacle [hits obstacle by velocity]", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var obstacle = new Kompute.Entity("entity1", new Kompute.Vector3D(40, 0, 40), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(obstacle);

    steerable.velocity.set(100, 0, 100);

    var avoidBehavior = new Kompute.AvoidBehavior({ maxSeeAhead: 100, maxAvoidForce: 100 });

    expect(avoidBehavior.findMostThreateningObstacle(steerable)).to.eql(obstacle);
  });

  it("should find most mostThreatening for multiple obstacles", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var obstacle1 = new Kompute.Entity("entity1", new Kompute.Vector3D(40, 0, 40), new Kompute.Vector3D(10, 10, 10));
    var obstacle2 = new Kompute.Entity("entity2", new Kompute.Vector3D(41, 0, 41), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(obstacle1);
    world.insertEntity(obstacle2);

    steerable.velocity.set(100, 0, 100);

    var avoidBehavior = new Kompute.AvoidBehavior({ maxSeeAhead: 100000, maxAvoidForce: 100 });

    expect(avoidBehavior.findMostThreateningObstacle(steerable)).to.eql(obstacle1);
  });

  it("should return 0 acceleration if there are no threatening obstacles", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var obstacle = new Kompute.Entity("entity1", new Kompute.Vector3D(20, 0, 20), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(obstacle);

    steerable.velocity = new Kompute.Vector3D(-10, 0, -10);

    var avoidBehavior = new Kompute.AvoidBehavior({ maxSeeAhead: 50, maxAvoidForce: 100 });

    Kompute.logger.enable();

    expect(avoidBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D());
    expect(loggedMsg).to.eql("[AvoidBehavior]: No threatening entity found.");
  });

  it("should go back if going towards an obstacle", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var obstacle = new Kompute.Entity("entity1", new Kompute.Vector3D(0, 0, 20), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(obstacle);

    Kompute.logger.enable();

    steerable.velocity = new Kompute.Vector3D(0, 0, 1);
    steerable.setBehavior(new Kompute.AvoidBehavior({ maxSeeAhead: 500, maxAvoidForce: 100 }));
    steerable.update();
    expect(steerable.velocity.normalize()).to.eql(new Kompute.Vector3D(0, 0, -1));
    expect(loggedMsg).to.eql("[AvoidBehavior]: Threatening entity found.");
  });
});
