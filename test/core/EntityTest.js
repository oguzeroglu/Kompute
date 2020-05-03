var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Entity", function(){

  it("should initialize", function(){

    var center = new Kompute.Vector3D(50, 60, 70);
    var size = new Kompute.Vector3D(50, 60, 70);

    var entity = new Kompute.Entity("entity1", center, size);

    expect(entity.id).to.be.eql("entity1");
    expect(entity.size).to.be.eql(size);
    expect(entity.position).to.be.eql(center);
    expect(entity.nearbyObject).to.be.null;
  });

  it("should have a nearbyObject after being inserted to world", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(100, 200, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    expect(entity.nearbyObject).to.be.null;
    world.insertEntity(entity);
    expect(entity.nearbyObject).not.to.be.null;

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

    expect(entity.world).to.be.null;
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

    expect(world.nearby.query(0, 0, 0).size).to.be.eql(0);
    expect(world.nearby.query(40, 40, 40).size).to.be.eql(1);
  });
});
