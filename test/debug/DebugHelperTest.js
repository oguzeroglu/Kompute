var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("DebugHelper", function(){

  it("should initiate", function(){

    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    expect(debugHelper.world).to.be.equal(world);
    expect(debugHelper.threeInstance).to.be.equal(threeInstance);
    expect(debugHelper.scene).to.be.equal(scene);
    expect(debugHelper.limeMaterial).to.be.an(MockMeshBasicMaterial);
    expect(debugHelper.magentaMaterial).to.be.an(MockMeshBasicMaterial);
    expect(debugHelper.meshesByEntityID).to.eql({});
    expect(debugHelper.velocityMeshesByEntityID).to.be.eql({});
    expect(world.onEntityInserted).to.exist;
    expect(world.onEntityRemoved).to.exist;
    expect(world.onEntityUpdated).to.exist;
  });

  it("should not add entity if not active", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    world.insertEntity(new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10)));

    expect(debugHelper.meshesByEntityID).to.eql({});
    expect(scene.children).to.eql([]);
  });

  it("should not update entity if not active", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    world.insertEntity(entity);
    entity.setPosition(new Kompute.Vector3D(10, 20, 30));

    expect(debugHelper.meshesByEntityID).to.eql({});
    expect(scene.children).to.eql([]);
  });

  it("should not delete entity if not active", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    world.insertEntity(entity);
    world.removeEntity(entity);

    expect(debugHelper.meshesByEntityID).to.eql({});
    expect(scene.children).to.eql([]);
  });

  it("should add entity if active", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.activate();

    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 20, 30));
    world.insertEntity(entity);

    expect(debugHelper.meshesByEntityID).to.eql({entity1: scene.children[0]});
    expect(scene.children).to.have.length(1);
    expect(scene.children[0].position).to.eql(new Kompute.Vector3D(100, 300, 500));
    expect(scene.children[0].geometry.size).to.eql(new Kompute.Vector3D(10, 20, 30));
  });

  it("should add velocity mesh for steerable", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.activate();

    var entity = new Kompute.Steerable("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 20, 30));
    world.insertEntity(entity);

    expect(scene.children).to.have.length(2);
    expect(debugHelper.velocityMeshesByEntityID).to.eql({entity1: scene.children[1]});
  });

  it("should update entity if active", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.activate();

    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 10, 10));
    world.insertEntity(entity);

    entity.setPosition(new Kompute.Vector3D(500, 700, 1000));

    expect(debugHelper.meshesByEntityID).to.eql({entity1: scene.children[0]});
    expect(scene.children).to.have.length(1);
    expect(scene.children[0].position).to.eql(new Kompute.Vector3D(500, 700, 1000));
  });

  it("should update velocity mesh of steerable", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.activate();

    var entity = new Kompute.Steerable("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 20, 30));
    world.insertEntity(entity);

    entity.velocity.set(100, 200, 300);
    entity.setPosition(new Kompute.Vector3D());

    var box = new Kompute.Box(new Kompute.Vector3D(), new Kompute.Vector3D()).setFromTwoVectors(new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(), 5);
    var boxWidth = (box.max.x - box.min.x);
    var boxHeight = (box.max.y - box.min.y);
    var boxDepth = (box.max.z - box.min.z);

    var velocityMesh = scene.children[1];

    expect(velocityMesh.scale).to.eql(new Kompute.Vector3D(boxWidth, boxHeight, boxDepth));
    expect(velocityMesh.position).to.eql(new Kompute.Vector3D(50, 100, 150));
  });

  it("should delete entity if active", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.activate();

    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 10, 10));
    world.insertEntity(entity);
    world.removeEntity(entity);

    expect(debugHelper.meshesByEntityID).to.eql({});
    expect(scene.children).to.have.length(0);
  });

  it("should delete velocityMesh if steerable", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.activate();

    var entity = new Kompute.Steerable("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 10, 10));
    world.insertEntity(entity);
    world.removeEntity(entity);

    expect(debugHelper.meshesByEntityID).to.eql({});
    expect(debugHelper.meshesByEntityID).to.eql({});
    expect(scene.children).to.have.length(0);
  });

  it("should activate", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    var entity1 = new Kompute.Entity("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 10, 10));
    var entity2 = new Kompute.Entity("entity2", new Kompute.Vector3D(500, 300, 100), new Kompute.Vector3D(20, 20, 20));

    world.insertEntity(entity1);
    world.insertEntity(entity2);

    debugHelper.activate();

    expect(Object.keys(debugHelper.meshesByEntityID)).to.have.length(2);
    expect(debugHelper.meshesByEntityID.entity1.position).to.eql(new Kompute.Vector3D(100, 300, 500));
    expect(debugHelper.meshesByEntityID.entity2.position).to.eql(new Kompute.Vector3D(500, 300, 100));
    expect(debugHelper.meshesByEntityID.entity1.geometry.size).to.eql(new Kompute.Vector3D(10, 10, 10));
    expect(debugHelper.meshesByEntityID.entity2.geometry.size).to.eql(new Kompute.Vector3D(20, 20, 20));
    expect(scene.children).to.have.length(2);
  });

  it("should deactivate", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    var entity1 = new Kompute.Entity("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 10, 10));
    var entity2 = new Kompute.Entity("entity2", new Kompute.Vector3D(500, 300, 100), new Kompute.Vector3D(20, 20, 20));

    world.insertEntity(entity1);
    world.insertEntity(entity2);

    debugHelper.activate();
    debugHelper.deactivate();

    expect(Object.keys(debugHelper.meshesByEntityID)).to.have.length(0);
    expect(scene.children).to.have.length(0);
  });
});

function mockThreeInstance(){
  return {
    MeshBasicMaterial: MockMeshBasicMaterial,
    BoxBufferGeometry: MockBoxBufferGeometry,
    Mesh: MockMesh
  };
}

class MockMeshBasicMaterial {
  constructor(){}
};

class MockBoxBufferGeometry {
  constructor(width, height, depth){
    this.size = new Kompute.Vector3D(width, height, depth);
  }
};

class MockMesh {
  constructor(geometry){
    this.geometry = geometry;
    this.position = new Kompute.Vector3D();
    this.scale = new Kompute.Vector3D();
  }
};

class MockScene {
  constructor(){
    this.children = [];
  }
  add(mesh){
    this.children.push(mesh);
  }
  remove(mesh){
    this.children.splice(this.children.indexOf(mesh), 1);
  }
};
