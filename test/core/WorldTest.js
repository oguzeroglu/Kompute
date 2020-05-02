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
});
