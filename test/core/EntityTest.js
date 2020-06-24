var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Entity", function(){

  it("should initialize", function(){

    var center = new Kompute.Vector3D(50, 60, 70);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Entity("entity1", center, size);

    var box = new Kompute.Box(center, size);

    expect(entity.id).to.eql("entity1");
    expect(entity.size).to.eql(size);
    expect(entity.position).to.eql(center);
    expect(entity.box).to.eql(box);
    expect(entity.nearbyObject).to.eql(null);
    expect(entity.velocity).to.eql(new Kompute.Vector3D());
    expect(entity.maxSpeed).to.eql(Infinity);
    expect(entity.lookDirection).to.eql(new Kompute.Vector3D(0, 0, -1));
    expect(entity.hasLookTarget).to.eql(false);
    expect(entity.lookTarget).to.eql(new Kompute.Vector3D());
    expect(entity.lookSpeed).to.eql(0.1);
    expect(entity.isHidden).to.eql(false);
  });

  it("should have a nearbyObject after being inserted to world", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(100, 200, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    expect(entity.nearbyObject).to.eql(null);
    world.insertEntity(entity);
    expect(entity.nearbyObject).not.to.eql(null);

    var nearbyBox = world.nearby.createBox(center.x, center.y, center.z, entitySize.x, entitySize.y, entitySize.z);
    var nearbyObj = world.nearby.createObject("entity1", nearbyBox);

    world.nearby.insert(nearbyObj);

    var entityNearbyObj = entity.nearbyObject;
    var entityNearbyObjBox = entityNearbyObj.box;

    expect(entityNearbyObj.id).to.eql(nearbyObj.id);
    expect(entityNearbyObj.binInfo).to.eql(nearbyObj.binInfo);
    expect(entityNearbyObjBox.minX).to.eql(nearbyObj.box.minX);
    expect(entityNearbyObjBox.minY).to.eql(nearbyObj.box.minY);
    expect(entityNearbyObjBox.minZ).to.eql(nearbyObj.box.minZ);
    expect(entityNearbyObjBox.maxX).to.eql(nearbyObj.box.maxX);
    expect(entityNearbyObjBox.maxY).to.eql(nearbyObj.box.maxY);
    expect(entityNearbyObjBox.maxZ).to.eql(nearbyObj.box.maxZ);
  });

  it("should have world after being inserted to world", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(100, 200, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    expect(entity.world).to.eql(null);
    world.insertEntity(entity);
    expect(entity.world).to.eql(world);
  });

  it("should set position", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(300, 300, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);

    expect(entity.position).to.eql(center);
    expect(world.nearby.query(0, 0, 0).size).to.eql(1);
    expect(world.nearby.query(40, 40, 40).size).to.eql(0);

    var newPos = new Kompute.Vector3D(50, 50, 50);
    var result = entity.setPosition(newPos);
    expect(entity.position).to.eql(newPos);
    expect(entity.box).to.eql(new Kompute.Box(newPos, entitySize));
    expect(result).to.eql(true);

    expect(world.nearby.query(0, 0, 0).size).to.eql(0);
    expect(world.nearby.query(40, 40, 40).size).to.eql(1);

    var count = 0;
    world.updateEntity = function(){
      count ++;
    }

    entity.setPosition(new Kompute.Vector3D(10, 20, 30));
    entity.setPosition(new Kompute.Vector3D(30, 40, 50));
    entity.setPosition(new Kompute.Vector3D(60, 40, 30), true);
    expect(count).to.eql(2);
  });

  it("should not set position if hidden", function(){
    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(300, 300, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);
    world.hideEntity(entity);

    expect(entity.setPosition(new Kompute.Vector3D(10000, 10000, 1000))).to.eql(false);

    expect(entity.position).to.eql(center);
  });

  it("should set size", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(3000, 3000, 3000, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);

    expect(entity.size).to.eql(entitySize);
    expect(world.nearby.query(0, 0, 0).size).to.eql(1);
    expect(world.nearby.query(0, 190, 0).size).to.eql(0);

    var newSize = new Kompute.Vector3D(5, 400, 5);
    var result = entity.setSize(newSize);

    expect(entity.size).to.eql(newSize);
    expect(entity.box).to.eql(new Kompute.Box(center, newSize));
    expect(result).to.eql(true);

    expect(world.nearby.query(0, 0, 0).size).to.eql(1);
    expect(world.nearby.query(0, 190, 0).size).to.eql(1);

    var count = 0;
    world.updateEntity = function(){
      count ++;
    };

    entity.setSize(new Kompute.Vector3D(10, 20, 30));
    entity.setSize(new Kompute.Vector3D(30, 40, 50));
    entity.setSize(new Kompute.Vector3D(60, 40, 30), true);
    expect(count).to.eql(2);
  });

  it("should not set size if hidden", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(3000, 3000, 3000, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);
    world.hideEntity(entity);

    expect(entity.setSize(1000, 1000, 1000)).to.eql(false);
    expect(entity.size).to.eql(new Kompute.Vector3D(5, 5, 5));
  });

  it("should set position and size", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(3000, 3000, 3000, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);

    var count = 0;
    world.updateEntity = function(){
      count ++;
    };

    var result = entity.setPositionAndSize(new Kompute.Vector3D(10, 30, 40), new Kompute.Vector3D(60, 70, 80));

    expect(entity.position).to.eql(new Kompute.Vector3D(10, 30, 40));
    expect(entity.size).to.eql(new Kompute.Vector3D(60, 70, 80));
    expect(count).to.eql(1);
    expect(result).to.eql(true);
  });

  it("should not set position and size if hidden", function(){
    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(3000, 3000, 3000, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);
    world.hideEntity(entity);

    var result = entity.setPositionAndSize(new Kompute.Vector3D(10, 30, 40), new Kompute.Vector3D(60, 70, 80));
    expect(result).to.eql(false);
    expect(entity.position).to.eql(center);
    expect(entity.size).to.eql(entitySize);
  });

  it("should set look direction", function(){
    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(300, 300, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    expect(entity.lookDirection).to.eql(new Kompute.Vector3D(0, 0, -1));

    entity.setLookDirection(new Kompute.Vector3D(1, 0, 0));

    expect(entity.lookDirection).to.eql(new Kompute.Vector3D(1, 0, 0));

    var called = false;
    world.onLookDirectionUpdated = function(){
      called = true;
    }

    world.insertEntity(entity);

    entity.setLookDirection(new Kompute.Vector3D(10, 20, 30));

    expect(entity.lookDirection).to.eql(new Kompute.Vector3D(10, 20, 30).normalize());
    expect(called).to.eql(true);
  });

  it("should execute for each close entity", function(){
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var center1 = new Kompute.Vector3D(10, 10, 10);
    var center2 = new Kompute.Vector3D(-10, -10, -10);
    var center3 = new Kompute.Vector3D(0, 0, 0);
    var center4 = new Kompute.Vector3D(500, 500, 500);

    var world = new Kompute.World(5000, 5000, 5000, 50);

    var entity1 = new Kompute.Entity("entity1", center1, entitySize);
    var entity2 = new Kompute.Entity("entity2", center2, entitySize);
    var entity3 = new Kompute.Entity("entity3", center3, entitySize);
    var entity4 = new Kompute.Entity("entity4", center4, entitySize);

    world.insertEntity(entity1);
    world.insertEntity(entity2);
    world.insertEntity(entity3);
    world.insertEntity(entity4);

    var expected = {entity1: entity1, entity2: entity2};

    var obj = {};
    var callback = function(entity){
      obj[entity.id] = entity
    };

    entity3.executeForEachCloseEntity(callback);

    expect(obj).to.eql(expected);
  });

  it("should stop executing for each close entity when function returns true", function(){
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var center1 = new Kompute.Vector3D(10, 10, 10);
    var center2 = new Kompute.Vector3D(-10, -10, -10);
    var center3 = new Kompute.Vector3D(0, 0, 0);
    var center4 = new Kompute.Vector3D(500, 500, 500);

    var world = new Kompute.World(5000, 5000, 5000, 50);

    var entity1 = new Kompute.Entity("entity1", center1, entitySize);
    var entity2 = new Kompute.Entity("entity2", center2, entitySize);
    var entity3 = new Kompute.Entity("entity3", center3, entitySize);
    var entity4 = new Kompute.Entity("entity4", center4, entitySize);

    world.insertEntity(entity1);
    world.insertEntity(entity2);
    world.insertEntity(entity3);
    world.insertEntity(entity4);

    var expected = {entity2: entity2};

    var obj = {};
    var callback = function(entity){
      obj[entity.id] = entity;
      return true;
    };

    entity3.executeForEachCloseEntity(callback);

    expect(obj).to.eql(expected);
  });

  it("should check if near to given entity", function(){
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var center1 = new Kompute.Vector3D(10, 10, 10);
    var center2 = new Kompute.Vector3D(-10, -10, -10);
    var center3 = new Kompute.Vector3D(0, 0, 0);
    var center4 = new Kompute.Vector3D(500, 500, 500);

    var world = new Kompute.World(5000, 5000, 5000, 50);

    var entity1 = new Kompute.Entity("entity1", center1, entitySize);
    var entity2 = new Kompute.Entity("entity2", center2, entitySize);
    var entity3 = new Kompute.Entity("entity3", center3, entitySize);
    var entity4 = new Kompute.Entity("entity4", center4, entitySize);

    world.insertEntity(entity1);
    world.insertEntity(entity2);
    world.insertEntity(entity3);
    world.insertEntity(entity4);

    expect(entity3.isNearTo(entity1)).to.eql(true);
    expect(entity3.isNearTo(entity2)).to.eql(true);

    // "Am I near to myself?" seems like a philosophical question.
    // Let's just return false instead of dealing with this.
    expect(entity3.isNearTo(entity3)).to.eql(false);

    expect(entity3.isNearTo(entity4)).to.eql(false);
  });

  it("should update position based on velocity", function(){

    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var entity = new Kompute.Entity("entity1", center, entitySize);

    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D());

    entity.velocity.set(60, 0, 0);
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(1, 0, 0));
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(2, 0, 0));
    entity.velocity.set(60, 0, 120);
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(3, 0, 2));
    entity.velocity.set(0, -60, 0);
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D(3, -1, 2));
  });

  it("should not update if hidden", function(){

    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var world = new Kompute.World(100, 100, 100, 10);

    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);
    world.hideEntity(entity);

    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D());

    entity.velocity.set(60, 0, 0);
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D());
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D());
    entity.velocity.set(60, 0, 120);
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D());
    entity.velocity.set(0, -60, 0);
    entity.update();
    expect(entity.position).to.eql(new Kompute.Vector3D());
  });

  it("should clamp velocity based on maxSpeed", function(){

    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var entity = new Kompute.Entity("entity1", center, entitySize);

    entity.velocity.set(100, 200, 300);
    entity.maxSpeed = 10;

    entity.update();

    expect(entity.velocity.getLength()).to.eql(entity.maxSpeed);
  });

  it("should set look target", function(){
    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var entity = new Kompute.Entity("entity1", center, entitySize);

    var target = new Kompute.Vector3D(200, 400, 500);
    entity.setLookTarget(target);

    expect(entity.hasLookTarget).to.eql(true);
    expect(entity.lookTarget).to.eql(target);
  });

  it("should unset look target", function(){
    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var entity = new Kompute.Entity("entity1", center, entitySize);

    var target = new Kompute.Vector3D(200, 400, 500);
    entity.setLookTarget(target);
    entity.unsetLookTarget();

    expect(entity.hasLookTarget).to.eql(false);
  });

  it("should gradually look at target", function(){
    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var entity = new Kompute.Entity("entity1", center, entitySize);

    var target = new Kompute.Vector3D(100, 0, 0);

    entity.setLookTarget(target);

    var dot = entity.lookDirection.dot(new Kompute.Vector3D().copy(target).sub(entity.position));
    for (var i = 0; i < 1000; i ++){
      entity.update();
      var newDot = entity.lookDirection.normalize().dot(new Kompute.Vector3D().copy(target).sub(entity.position).normalize());
      expect(newDot >= dot).to.eql(true);
      dot = newDot;
    }

    expect(dot).to.eql(1);
  });

  it("should not overshoot when looking at target", function(){
    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var entity = new Kompute.Entity("entity1", center, entitySize);

    var target = new Kompute.Vector3D(100, 0, 0);

    entity.setLookTarget(target);

    entity.lookSpeed = 10000;

    var dot = entity.lookDirection.dot(new Kompute.Vector3D().copy(target).sub(entity.position));
    for (var i = 0; i < 1000; i ++){
      entity.update();
      var newDot = entity.lookDirection.normalize().dot(new Kompute.Vector3D().copy(target).sub(entity.position).normalize());
      expect(newDot >= dot).to.eql(true);
      dot = newDot;
    }

    expect(dot).to.eql(1);
  });
});
