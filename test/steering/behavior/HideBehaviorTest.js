var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("HideBehavior", function(){

  var loggedMsg;

  beforeEach(function(){
    loggedMsg = null;
    Kompute.logger.logMethod = function(msg){
      if (loggedMsg != null){
        return;
      }
      loggedMsg = msg;
    }
  });

  afterEach(function(){
    Kompute.logger.logMethod = console.log;
    Kompute.logger.disable();
  });

  it("should initialize", function(){
    var hideBehavior = new Kompute.HideBehavior({
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150,
      threatDistance: 2000
    });

    expect(hideBehavior.result).to.eql(new Kompute.SteerResult());
    expect(hideBehavior.satisfactionRadius).to.eql(50);
    expect(hideBehavior.slowDownRadius).to.eql(100);
    expect(hideBehavior.hideDistance).to.eql(150);
    expect(hideBehavior.bestHidingSpot).to.eql(new Kompute.Vector3D());
    expect(hideBehavior.hidingSpotFound).to.eql(false);
    expect(hideBehavior.threatDistance).to.eql(2000);
  });

  it("should not request acceleration if steerable has no hide target entity", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var hideBehavior = new Kompute.HideBehavior({
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150,
      threatDistance: 2000
    });

    Kompute.logger.enable();

    expect(hideBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D());
    expect(loggedMsg).to.eql("[HideBehavior]: No hide target entity set. (steerable1)");
  });

  it("should get hiding position", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var hideTarget = new Kompute.Steerable("steerable2", new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(10, 10, 10));

    var hideBehavior = new Kompute.HideBehavior({
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150,
      threatDistance: 2000
    });

    steerable.setHideTargetEntity(hideTarget);

    var hideableEntity = new Kompute.Entity("hideable", new Kompute.Vector3D(-100, 200, -450), new Kompute.Vector3D(100, 100, 100));

    var hidingPosition = hideBehavior.getHidingPosition(hideableEntity, steerable);

    var testBox = new Kompute.Box(new Kompute.Vector3D(), new Kompute.Vector3D()).setFromTwoVectors(hideTarget.position, hidingPosition, 0.001);

    expect(testBox.intersectsBox(hideableEntity.box)).to.eql(true);

    var v1 = new Kompute.Vector3D().copy(hidingPosition).sub(hideTarget.position).normalize();
    var v2 = new Kompute.Vector3D().copy(hidingPosition).sub(hideableEntity.position).normalize();

    expect(v1.dot(v2)).to.eql(1);
  });

  it("should not request acceleration if no hiding spot is found", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var obstacle = new Kompute.Entity("entity1", new Kompute.Vector3D(400, 400, 400), new Kompute.Vector3D(10, 10, 10));
    var hideTarget = new Kompute.Steerable("steerable2", new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(obstacle);
    world.insertEntity(hideTarget);

    steerable.setHideTargetEntity(hideTarget);

    var hideBehavior = new Kompute.HideBehavior({
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150,
      threatDistance: 2000
    });

    Kompute.logger.enable();

    expect(hideBehavior.hidingSpotFound).to.eql(false);
    expect(hideBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D());
    expect(loggedMsg).to.eql("[HideBehavior]: No hiding spot found. (steerable1)");
  });

  it("should find best hiding spot", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var obstacle = new Kompute.Entity("entity1", new Kompute.Vector3D(30, 30, 30), new Kompute.Vector3D(10, 10, 10));
    var obstacle2 = new Kompute.Entity("entity2", new Kompute.Vector3D(10, 10, 10), new Kompute.Vector3D(10, 10, 10));
    var noiseSteerable = new Kompute.Steerable("steerable3", new Kompute.Vector3D(5, 5, 5), new Kompute.Vector3D(10, 10, 10));
    var hideTarget = new Kompute.Steerable("steerable2", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(obstacle);
    world.insertEntity(obstacle2);
    world.insertEntity(hideTarget);
    world.insertEntity(noiseSteerable);

    steerable.setHideTargetEntity(hideTarget);

    var hideBehavior = new Kompute.HideBehavior({
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150,
      threatDistance: 2000
    });

    hideBehavior.findHidingSpot(steerable);

    expect(hideBehavior.hidingSpotFound).to.eql(true);
    expect(hideBehavior.bestHidingSpot).to.eql(hideBehavior.getHidingPosition(obstacle2, steerable));

    obstacle.setPosition(new Kompute.Vector3D(6, 6, 6));

    hideBehavior.findHidingSpot(steerable);

    expect(hideBehavior.hidingSpotFound).to.eql(true);
    expect(hideBehavior.bestHidingSpot).to.eql(hideBehavior.getHidingPosition(obstacle, steerable));

    obstacle.setPosition(new Kompute.Vector3D(600, 600, 600));
    obstacle2.setPosition(new Kompute.Vector3D(600, 600, 600));

    hideBehavior.findHidingSpot(steerable);

    expect(hideBehavior.hidingSpotFound).to.eql(false);
  });

  it("should set target position of steerable", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var obstacle = new Kompute.Entity("entity1", new Kompute.Vector3D(30, 30, 30), new Kompute.Vector3D(10, 10, 10));
    var hideTarget = new Kompute.Steerable("steerable2", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(obstacle);

    steerable.setHideTargetEntity(hideTarget);

    var hideBehavior = new Kompute.HideBehavior({
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150,
      threatDistance: 2000
    });

    var result = hideBehavior.compute(steerable);

    expect(result.linear).not.to.eql(new Kompute.Vector3D());
    expect(steerable.targetPosition).to.eql(hideBehavior.bestHidingSpot);
  });

  it("should delegate to ArriveBehavior", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var obstacle = new Kompute.Entity("entity1", new Kompute.Vector3D(30, 30, 30), new Kompute.Vector3D(10, 10, 10));
    var hideTarget = new Kompute.Steerable("steerable2", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(obstacle);

    steerable.maxSpeed = 100;
    steerable.maxAcceleration = 100;

    steerable.setHideTargetEntity(hideTarget);

    var hideBehavior = new Kompute.HideBehavior({
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150,
      threatDistance: 2000
    });

    Kompute.logger.enable();

    var result = hideBehavior.compute(steerable);
    expect(loggedMsg).to.eql("[HideBehavior]: Hiding. (steerable1)");

    var arriveBehavior = new Kompute.ArriveBehavior({ satisfactionRadius: 50, slowDownRadius: 100 });

    var result2 = arriveBehavior.compute(steerable);

    expect(result.linear).to.eql(result2.linear);
  });

  it("should not request acceleration if target not within threatDistance", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var obstacle = new Kompute.Entity("entity1", new Kompute.Vector3D(30, 30, 30), new Kompute.Vector3D(10, 10, 10));
    var hideTarget = new Kompute.Steerable("steerable2", new Kompute.Vector3D(400, 400, 400), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(obstacle);

    steerable.maxSpeed = 100;
    steerable.maxAcceleration = 100;

    steerable.setHideTargetEntity(hideTarget);

    var hideBehavior = new Kompute.HideBehavior({
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150,
      threatDistance: 20
    });

    Kompute.logger.enable();

    var result = hideBehavior.compute(steerable);

    expect(result.linear).to.eql(new Kompute.Vector3D());
    expect(loggedMsg).to.eql("[HideBehavior]: Target entity is out of threat distance. (steerable1)");
  });

  it("should not consider Vertex instances when finding hiding spots", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steerable2 = new Kompute.Steerable("steerable2", new Kompute.Vector3D(100, 0, 0), new Kompute.Vector3D(10, 10, 10));

    var world = new Kompute.World(1000, 1000, 1000, 50);
    world.insertEntity(steerable);
    world.insertEntity(steerable2);

    steerable.setHideTargetEntity(steerable2);

    var hideBehavior = new Kompute.HideBehavior({
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150,
      threatDistance: 2000
    });

    var graph = new Kompute.Graph();
    graph.addVertex(new Kompute.Vector3D(5, 0, 0));

    world.insertGraph(graph);

    hideBehavior.findHidingSpot(steerable);

    expect(hideBehavior.hidingSpotFound).to.eql(false);
  });
});
