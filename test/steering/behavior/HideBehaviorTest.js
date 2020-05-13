var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("HideBehavior", function(){

  it("should initialize", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var hideBehavior = new Kompute.HideBehavior(steerable, {
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150
    });

    expect(hideBehavior.result).to.eql(new Kompute.SteerResult());
    expect(hideBehavior.steerable).to.equal(steerable);
    expect(hideBehavior.satisfactionRadius).to.eql(50);
    expect(hideBehavior.slowDownRadius).to.eql(100);
    expect(hideBehavior.hideDistance).to.eql(150);
  });

  it("should not request acceleration if steerable has no hide target entity", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var hideBehavior = new Kompute.HideBehavior(steerable, {
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150
    });

    expect(hideBehavior.compute().linear).to.eql(new Kompute.Vector3D());
  });

  it("should get hiding position", function(){
    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var hideTarget = new Kompute.Steerable("steerable2", new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(10, 10, 10));

    var hideBehavior = new Kompute.HideBehavior(steerable, {
      arriveSatisfactionRadius: 50,
      arriveSlowDownRadius: 100,
      hideDistance: 150
    });

    steerable.setHideTargetEntity(hideTarget);

    var hideableEntity = new Kompute.Entity("hideable", new Kompute.Vector3D(-100, 200, -450), new Kompute.Vector3D(100, 100, 100));

    var hidingPosition = hideBehavior.getHidingPosition(hideableEntity);

    var testBox = new Kompute.Box(new Kompute.Vector3D(), new Kompute.Vector3D()).setFromTwoVectors(hideTarget.position, hidingPosition, 0.001);

    expect(testBox.intersectsBox(hideableEntity.box)).to.eql(true);

    var v1 = new Kompute.Vector3D().copy(hidingPosition).sub(hideTarget.position).normalize();
    var v2 = new Kompute.Vector3D().copy(hidingPosition).sub(hideableEntity.position).normalize();

    expect(v1.dot(v2)).to.eql(1);
  });
});
