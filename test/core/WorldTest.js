var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("World", function(){

  it("should initialize", function(){

    var world = new Kompute.World(100, 200, 300, 10);

    expect(world.entititesByID).to.eql({});
    expect(world.nearby).to.exist;
    expect(world.gravity).to.eql(0);
  });

  it("should insert entity", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(100, 200, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);

    expect(world.entititesByID).to.eql({entity1: entity});

    var res = world.nearby.query(0, 0, 0);
    expect(res.size).to.eql(1);

    for (var key of res.keys()){
      expect(key).to.eql(entity.nearbyObject);
    }
  });

  it("should insert graph", function(){

    var graph = new Kompute.Graph();

    graph.addVertex(new Kompute.Vector3D(100, 200, 300));
    graph.addVertex(new Kompute.Vector3D(400, 500, 600));
    graph.addVertex(new Kompute.Vector3D(2000, 2000, 2000));

    var world = new Kompute.World(1000, 1000, 1000, 10);

    world.insertGraph(graph);

    expect(graph.world).to.equal(world);

    var entities = [];
    world.forEachEntity(function(entity){
      entities.push(entity);
    });

    expect(entities.length).to.eql(3);

    var nearbyObjects = world.getNearbyObjects(new Kompute.Vector3D(100, 200, 300));
    var array = Array.from(nearbyObjects);

    expect(array.length).to.eql(1);

    var vertex = world.getEntityByID(array[0].id);

    expect(vertex.graph).to.equal(graph);
    expect(vertex.position).to.eql(new Kompute.Vector3D(100, 200, 300));
  });

  it("should update entity", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(400, 400, 400, 20);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);
    var res1 = world.nearby.query(0, 0, 0);
    expect(res1.size).to.eql(1);

    world.updateEntity(entity, new Kompute.Vector3D(100, 100, 100), entitySize);

    var res2 = world.nearby.query(0, 0, 0);
    expect(res2.size).to.eql(0);

    var res3 = world.nearby.query(90, 90, 90);
    expect(res3.size).to.eql(1);
    for (var key of res3.keys()){
      expect(key).to.eql(entity.nearbyObject);
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

    expect(world.getEntityByID("entity1")).to.equal(entity1);
    expect(world.getEntityByID("entity2")).to.equal(entity2);
    expect(world.getEntityByID("entity3")).to.eql(null);
  });

  it("should remove entity", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(400, 400, 400, 20);
    var entity = new Kompute.Entity("entity", center, entitySize);

    world.insertEntity(entity);
    expect(world.getEntityByID("entity")).not.to.eql(null);
    expect(world.nearby.bin.size).not.to.eql(0);
    world.removeEntity(entity);
    expect(world.getEntityByID("entity")).to.eql(null);
    expect(world.nearby.bin.size).to.eql(0);
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
    expect(array[0].id).to.eql(entity2.id);
    expect(array[1].id).to.eql(entity3.id);
    expect(array[2].id).to.eql(entity1.id);
  });

  it("should invoke onEntityInserted", function(){

    var world = new Kompute.World(5000, 5000, 5000, 50);
    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));

    var parameter = false;
    world.onEntityInserted = function(param){
      parameter = param;
    };

    world.insertEntity(entity);

    expect(parameter).to.equal(entity);
  });

  it("should invoke onEntityUpdated", function(){
    var world = new Kompute.World(5000, 5000, 5000, 50);
    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));

    var parameter = false;
    world.onEntityUpdated = function(param){
      parameter = param;
    };

    world.insertEntity(entity);

    entity.setPosition(new Kompute.Vector3D(100, 200, 300));

    expect(parameter).to.equal(entity);
  });

  it("should invoke onEntityLookDirectionUpdated", function(){
    var world = new Kompute.World(5000, 5000, 5000, 50);
    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));

    var parameter = false;
    world.onEntityLookDirectionUpdated = function(param){
      parameter = param;
    };

    world.insertEntity(entity);

    entity.setLookDirection(new Kompute.Vector3D(10, 20, 30));

    expect(parameter).to.equal(entity);
  });

  it("should invoke onEntityRemoved", function(){
    var world = new Kompute.World(5000, 5000, 5000, 50);
    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));

    var parameter = false;
    world.onEntityRemoved = function(param){
      parameter = param;
    };

    world.insertEntity(entity);
    world.removeEntity(entity);

    expect(parameter).to.equal(entity);
  });

  it("should execute for each entity", function(){

    var world = new Kompute.World(5000, 5000, 5000, 50);
    var entity1 = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));
    var entity2 = new Kompute.Entity("entity2", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));
    var entity3 = new Kompute.Entity("entity3", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));

    world.insertEntity(entity1);
    world.insertEntity(entity2);

    var obj = { entity1: false, entity2: false, entity3: false };

    world.forEachEntity(function(entity){
      obj[entity.id] = true;
    });

    expect(obj).to.eql({ entity1: true, entity2: true, entity3: false });
  });

  it("should set gravity", function(){

    var world = new Kompute.World(5000, 5000, 5000, 50);

    world.setGravity(-10);

    expect(world.gravity).to.eql(-10);
  });
});
