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
    expect(world.getEntityByID("entity3")).to.be.null;
  });
});
