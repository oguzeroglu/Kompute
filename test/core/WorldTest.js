var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("World", function(){

  it("should initialize", function(){

    var world = new Kompute.World(100, 200, 300, 10);

    expect(world.entititesByID).to.be.eql({});
    expect(world.nearby).to.exist;
  });

  it("should insert entity", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(100, 200, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);

    expect(world.entititesByID).to.be.eql({entity1: entity});

    var res = world.nearby.query(0, 0, 0);
    expect(res.size).to.be.eql(1);

    for (var key of res.keys()){
      expect(key).to.be.eql(entity.nearbyObject);
    }
  });

  it("should update entity", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(400, 400, 400, 20);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);
    var res1 = world.nearby.query(0, 0, 0);
    expect(res1.size).to.be.eql(1);

    world.updateEntity(entity, new Kompute.Vector3D(100, 100, 100), entitySize);

    var res2 = world.nearby.query(0, 0, 0);
    expect(res2.size).to.be.eql(0);

    var res3 = world.nearby.query(90, 90, 90);
    expect(res3.size).to.be.eql(1);
    for (var key of res3.keys()){
      expect(key).to.be.eql(entity.nearbyObject);
    }
  });

  it("should get entity by ID", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(400, 400, 400, 20);
    var entity1 = new Kompute.Entity("entity1", center, entitySize);
    var entity2 = new Kompute.Entity("entity2", center, entitySize);

    world.insertEntity(entity1);
    world.insertEntity(entity2);

    expect(world.getEntityByID("entity1")).to.be.equal(entity1);
    expect(world.getEntityByID("entity2")).to.be.equal(entity2);
    expect(world.getEntityByID("entity3")).to.be.eql(null);
  });

  it("should remove entity", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(400, 400, 400, 20);
    var entity = new Kompute.Entity("entity", center, entitySize);

    world.insertEntity(entity);
    expect(world.getEntityByID("entity")).not.to.be.eql(null);
    expect(world.nearby.bin.size).not.to.be.eql(0);
    world.removeEntity(entity);
    expect(world.getEntityByID("entity")).to.be.eql(null);
    expect(world.nearby.bin.size).to.be.eql(0);
  });

  it("should get nearby objects", function(){

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

    var res = world.getNearbyObjects(new Kompute.Vector3D(0, 0, 0));
    var array = Array.from(res);

    expect(array).to.have.length(3);
    expect(array[0].id).to.be.eql(entity2.id);
    expect(array[1].id).to.be.eql(entity3.id);
    expect(array[2].id).to.be.eql(entity1.id);
  });
});
