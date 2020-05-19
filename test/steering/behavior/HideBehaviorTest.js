var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("HideBehavior", function(){

  it("should initialize", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var hideBehavior = new Kompute.HideBehavior({
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150,
      threatDistance: 2000
    });

    steerable.setBehavior(hideBehavior);

    expect(hideBehavior.result).to.eql(new Kompute.SteerResult());
    expect(hideBehavior.steerable).to.equal(steerable);
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

    steerable.setBehavior(hideBehavior);

    expect(hideBehavior.compute().linear).to.eql(new Kompute.Vector3D());
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

    steerable.setBehavior(hideBehavior);

    steerable.setHideTargetEntity(hideTarget);

    var hideableEntity = new Kompute.Entity("hideable", new Kompute.Vector3D(-100, 200, -450), new Kompute.Vector3D(100, 100, 100));

    var hidingPosition = hideBehavior.getHidingPosition(hideableEntity);

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

    steerable.setBehavior(hideBehavior);

    expect(hideBehavior.hidingSpotFound).to.eql(false);
    expect(hideBehavior.compute().linear).to.eql(new Kompute.Vector3D());
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

    steerable.setBehavior(hideBehavior);

    hideBehavior.findHidingSpot();

    expect(hideBehavior.hidingSpotFound).to.eql(true);
    expect(hideBehavior.bestHidingSpot).to.eql(hideBehavior.getHidingPosition(obstacle2));

    obstacle.setPosition(new Kompute.Vector3D(6, 6, 6));

    hideBehavior.findHidingSpot();

    expect(hideBehavior.hidingSpotFound).to.eql(true);
    expect(hideBehavior.bestHidingSpot).to.eql(hideBehavior.getHidingPosition(obstacle));

    obstacle.setPosition(new Kompute.Vector3D(600, 600, 600));
    obstacle2.setPosition(new Kompute.Vector3D(600, 600, 600));

    hideBehavior.findHidingSpot();

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

    steerable.setBehavior(hideBehavior);

    var result = hideBehavior.compute();

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

    steerable.setBehavior(hideBehavior);

    var result = hideBehavior.compute();

    var arriveBehavior = new Kompute.ArriveBehavior({ satisfactionRadius: 50, slowDownRadius: 100 });

    arriveBehavior.setSteerable(steerable);

    var result2 = arriveBehavior.compute();

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

    steerable.setBehavior(hideBehavior);

    var result = hideBehavior.compute();

    expect(result.linear).to.eql(new Kompute.Vector3D());
  });
});
