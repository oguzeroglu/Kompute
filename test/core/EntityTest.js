var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Entity", function(){

  it("should initialize", function(){

    var center = new Kompute.Vector3D(50, 60, 70);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Entity("entity1", center, size);

    var box = new Kompute.Box(center, size);

    expect(entity.id).to.be.eql("entity1");
    expect(entity.size).to.be.eql(size);
    expect(entity.position).to.be.eql(center);
    expect(entity.box).to.be.eql(box);
    expect(entity.nearbyObject).to.be.eql(null);
    expect(entity.velocity).to.be.eql(new Kompute.Vector3D());
    expect(entity.maxSpeed).to.be.eql(Infinity);
  });

  it("should have a nearbyObject after being inserted to world", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(100, 200, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    expect(entity.nearbyObject).to.be.eql(null);
    world.insertEntity(entity);
    expect(entity.nearbyObject).not.to.be.eql(null);

    var nearbyBox = world.nearby.createBox(center.x, center.y, center.z, entitySize.x, entitySize.y, entitySize.z);
    var nearbyObj = world.nearby.createObject("entity1", nearbyBox);

    world.nearby.insert(nearbyObj);

    var entityNearbyObj = entity.nearbyObject;
    var entityNearbyObjBox = entityNearbyObj.box;

    expect(entityNearbyObj.id).to.be.eql(nearbyObj.id);
    expect(entityNearbyObj.binInfo).to.be.eql(nearbyObj.binInfo);
    expect(entityNearbyObjBox.minX).to.be.eql(nearbyObj.box.minX);
    expect(entityNearbyObjBox.minY).to.be.eql(nearbyObj.box.minY);
    expect(entityNearbyObjBox.minZ).to.be.eql(nearbyObj.box.minZ);
    expect(entityNearbyObjBox.maxX).to.be.eql(nearbyObj.box.maxX);
    expect(entityNearbyObjBox.maxY).to.be.eql(nearbyObj.box.maxY);
    expect(entityNearbyObjBox.maxZ).to.be.eql(nearbyObj.box.maxZ);
  });

  it("should have world after being inserted to world", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(100, 200, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    expect(entity.world).to.be.eql(null);
    world.insertEntity(entity);
    expect(entity.world).to.be.eql(world);
  });

  it("should set position", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(300, 300, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);

    expect(entity.position).to.be.eql(center);
    expect(world.nearby.query(0, 0, 0).size).to.be.eql(1);
    expect(world.nearby.query(40, 40, 40).size).to.be.eql(0);

    var newPos = new Kompute.Vector3D(50, 50, 50);
    entity.setPosition(newPos);
    expect(entity.position).to.be.eql(newPos);
    expect(entity.box).to.be.eql(new Kompute.Box(newPos, entitySize));

    expect(world.nearby.query(0, 0, 0).size).to.be.eql(0);
    expect(world.nearby.query(40, 40, 40).size).to.be.eql(1);
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

    expect(obj).to.be.eql(expected);
  });

  it("should update position based on velocity", function(){

    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var entity = new Kompute.Entity("entity1", center, entitySize);

    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D());

    entity.velocity.set(60, 0, 0);
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(1, 0, 0));
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(2, 0, 0));
    entity.velocity.set(60, 0, 120);
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(3, 0, 2));
    entity.velocity.set(0, -60, 0);
    entity.update();
    expect(entity.position).to.be.eql(new Kompute.Vector3D(3, -1, 2));
  });

  it("should clamp velocity based on maxSpeed", function(){

    var entitySize = new Kompute.Vector3D(5, 5, 5);
    var center = new Kompute.Vector3D();

    var entity = new Kompute.Entity("entity1", center, entitySize);

    entity.velocity.set(100, 200, 300);
    entity.maxSpeed = 10;

    entity.update();

    expect(entity.velocity.getLength()).to.be.eql(entity.maxSpeed);
  });
});
