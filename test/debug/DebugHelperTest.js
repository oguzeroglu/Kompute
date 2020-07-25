var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("DebugHelper", function(){

  it("should initialize", function(){

    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    expect(debugHelper.world).to.equal(world);
    expect(debugHelper.threeInstance).to.equal(threeInstance);
    expect(debugHelper.scene).to.equal(scene);
    expect(debugHelper.limeMaterial).to.be.an(MockMeshBasicMaterial);
    expect(debugHelper.magentaMaterial).to.be.an(MockMeshBasicMaterial);
    expect(debugHelper.redMaterial).to.be.an(MockMeshBasicMaterial);
    expect(debugHelper.orangeMaterial).to.be.an(MockMeshBasicMaterial);
    expect(debugHelper.lineMaterial).to.be.an(MockLineBasicMaterial);
    expect(debugHelper.meshesByEntityID).to.eql({});
    expect(debugHelper.velocityMeshesByEntityID).to.eql({});
    expect(debugHelper.lookMeshesByEntityID).to.eql({});
    expect(debugHelper.pathMeshes).to.eql([]);
    expect(debugHelper.edgeMeshes).to.eql([]);
    expect(debugHelper.worldMesh).to.eql(null);
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

    expect(debugHelper.meshesByEntityID).to.eql({entity1: scene.children[1]});
    expect(scene.children).to.have.length(2);
    expect(scene.children[1].position).to.eql(new Kompute.Vector3D(100, 300, 500));
    expect(scene.children[1].geometry.size).to.eql(new Kompute.Vector3D(10, 20, 30));
  });

  it("should add velocity mesh and look mesh for steerable", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.activate();

    var entity = new Kompute.Steerable("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 20, 30));
    world.insertEntity(entity);

    expect(scene.children).to.have.length(4);
    expect(debugHelper.velocityMeshesByEntityID).to.eql({entity1: scene.children[2]});
    expect(debugHelper.lookMeshesByEntityID).to.eql({entity1: scene.children[3]});
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

    expect(debugHelper.meshesByEntityID).to.eql({entity1: scene.children[1]});
    expect(scene.children).to.have.length(2);
    expect(scene.children[1].position).to.eql(new Kompute.Vector3D(500, 700, 1000));

    entity.setSize(new Kompute.Vector3D(10, 40, 50));
    expect(scene.children[1].scale).to.eql(new Kompute.Vector3D(1, 4, 5));
  });

  it("should hide entity", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.activate();

    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 10, 10));
    world.insertEntity(entity);

    world.hideEntity(entity);

    expect(debugHelper.meshesByEntityID.entity1.visible).to.eql(false);
  });

  it("should show entity", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.activate();

    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 10, 10));
    world.insertEntity(entity);

    world.hideEntity(entity);

    expect(debugHelper.meshesByEntityID.entity1.visible).to.eql(false);

    world.showEntity(entity);

    expect(debugHelper.meshesByEntityID.entity1.visible).to.eql(true);
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

    var velocityMesh = scene.children[2];
    var lookMesh = scene.children[3];

    expect(velocityMesh.scale).to.eql(new Kompute.Vector3D(boxWidth, boxHeight, boxDepth));
    expect(velocityMesh.position).to.eql(new Kompute.Vector3D(50, 100, 150));
    expect(lookMesh.position).to.eql(new Kompute.Vector3D(0, 0, -1).multiplyScalar(debugHelper.LOOK_DISTANCE).add(entity.position));
  });

  it("should update look mesh of steerable", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.activate();

    var entity = new Kompute.Steerable("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 20, 30));
    world.insertEntity(entity);

    entity.setLookDirection(new Kompute.Vector3D(10, 30, 40));

    var lookMesh = scene.children[3];
    expect(lookMesh.position).to.eql(new Kompute.Vector3D(10, 30, 40).normalize().multiplyScalar(debugHelper.LOOK_DISTANCE).add(entity.position));
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
    expect(scene.children).to.have.length(1);
  });

  it("should delete velocityMesh and lookMesh if steerable", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.activate();

    var entity = new Kompute.Steerable("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 10, 10));
    world.insertEntity(entity);
    world.removeEntity(entity);

    expect(debugHelper.meshesByEntityID).to.eql({});
    expect(debugHelper.velocityMeshesByEntityID).to.eql({});
    expect(debugHelper.lookMeshesByEntityID).to.eql({});
    expect(scene.children).to.have.length(1);
  });

  it("should activate", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1100, 1200, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    var entity1 = new Kompute.Entity("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 10, 10));
    var entity2 = new Kompute.Entity("entity2", new Kompute.Vector3D(500, 300, 100), new Kompute.Vector3D(20, 20, 20));

    world.insertEntity(entity1);
    world.insertEntity(entity2);

    world.hideEntity(entity2);

    debugHelper.activate();

    expect(Object.keys(debugHelper.meshesByEntityID)).to.have.length(2);
    expect(debugHelper.meshesByEntityID.entity1.position).to.eql(new Kompute.Vector3D(100, 300, 500));
    expect(debugHelper.meshesByEntityID.entity2.position).to.eql(new Kompute.Vector3D(500, 300, 100));
    expect(debugHelper.meshesByEntityID.entity1.geometry.size).to.eql(new Kompute.Vector3D(10, 10, 10));
    expect(debugHelper.meshesByEntityID.entity2.geometry.size).to.eql(new Kompute.Vector3D(20, 20, 20));
    expect(scene.children).to.have.length(3);

    expect(debugHelper.meshesByEntityID.entity2.visible).to.eql(false);

    var worldMesh = scene.children[0];

    expect(debugHelper.worldMesh).to.equal(worldMesh);
    expect(worldMesh.geometry).to.eql(new MockBoxBufferGeometry(1000, 1100, 1200));
    expect(worldMesh.position).to.eql(new Kompute.Vector3D(0, 0, 0));
  });

  it("should deactivate", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    var entity1 = new Kompute.Entity("entity1", new Kompute.Vector3D(100, 300, 500), new Kompute.Vector3D(10, 10, 10));
    var entity2 = new Kompute.Entity("entity2", new Kompute.Vector3D(500, 300, 100), new Kompute.Vector3D(20, 20, 20));

    var path = new Kompute.Path();
    path.addWaypoint(new Kompute.Vector3D());

    var graph = new Kompute.Graph();

    var v1 = new Kompute.Vector3D(10, 20, 30);
    var v2 = new Kompute.Vector3D(30, 40, 50);
    var v3 = new Kompute.Vector3D(50, 60, 70);

    graph.addVertex(v1);
    graph.addVertex(v2);
    graph.addVertex(v3);

    graph.addEdge(v1, v2);
    graph.addEdge(v2, v3);
    graph.addEdge(v3, v1);

    world.insertEntity(entity1);
    world.insertEntity(entity2);

    debugHelper.activate();
    debugHelper.visualisePath(path);
    debugHelper.visualiseGraph(graph);

    debugHelper.deactivate();

    expect(Object.keys(debugHelper.meshesByEntityID)).to.have.length(0);
    expect(debugHelper.pathMeshes).to.have.length(0);
    expect(debugHelper.edgeMeshes).to.have.length(0);
    expect(scene.children).to.have.length(0);
    expect(debugHelper.worldMesh).to.eql(null);
  });

  it("should visualise path", function(){
    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    var path = new Kompute.Path();

    for (var i = 0; i < 100; i ++){
      path.addWaypoint(new Kompute.Vector3D(100 * Math.random(), 100 * Math.random(), 100 * Math.random()));
    }

    debugHelper.visualisePath(path);

    expect(debugHelper.pathMeshes).to.have.length(100);
    expect(scene.children).to.have.length(100);
    for (var i = 0; i < 100; i ++){
      var child = scene.children[i];
      expect(child.position).to.eql(path.waypoints[i]);
      expect(child.geometry).to.eql(new MockBoxBufferGeometry(5, 5, 5));
    }

    debugHelper.deactivate();
    expect(debugHelper.pathMeshes).to.have.length(0);
    expect(scene.children).to.have.length(0);

    debugHelper.visualisePath(path, 100);
    expect(debugHelper.pathMeshes).to.have.length(100);
    expect(scene.children).to.have.length(100);
    for (var i = 0; i < 100; i ++){
      var child = scene.children[i];
      expect(child.position).to.eql(path.waypoints[i]);
      expect(child.geometry).to.eql(new MockBoxBufferGeometry(100, 100, 100));
    }
  });

  it("should visualise graph", function(){

    var graph = new Kompute.Graph();

    var v1 = new Kompute.Vector3D(10, 20, 30);
    var v2 = new Kompute.Vector3D(30, 40, 50);
    var v3 = new Kompute.Vector3D(50, 60, 70);

    graph.addVertex(v1);
    graph.addVertex(v2);
    graph.addVertex(v3);

    graph.addEdge(v1, v2);
    graph.addEdge(v2, v3);
    graph.addEdge(v3, v1);

    var threeInstance = mockThreeInstance();
    var scene = new MockScene();
    var world = new Kompute.World(1000, 1000, 1000, 10);

    var debugHelper = new Kompute.DebugHelper(world, threeInstance, scene);

    debugHelper.visualiseGraph(graph);

    var geom1 = new MockGeometry();
    geom1.vertices.push(v1);
    geom1.vertices.push(v2);

    var geom2 = new MockGeometry();
    geom2.vertices.push(v2);
    geom2.vertices.push(v3);

    var geom3 = new MockGeometry();
    geom3.vertices.push(v3);
    geom3.vertices.push(v1);

    var line1 = new MockLine(geom1);
    var line2 = new MockLine(geom2);
    var line3 = new MockLine(geom3);

    expect(scene.children.length).to.eql(3);
    expect(scene.children[0]).to.eql(line1);
    expect(scene.children[1]).to.eql(line2);
    expect(scene.children[2]).to.eql(line3);

    expect(debugHelper.edgeMeshes).to.eql([line1, line2, line3]);

    debugHelper.deactivate();

    expect(scene.children.length).to.eql(0);
    expect(debugHelper.edgeMeshes).to.eql([]);
  });
});

function mockThreeInstance(){
  return {
    MeshBasicMaterial: MockMeshBasicMaterial,
    LineBasicMaterial: MockLineBasicMaterial,
    BoxBufferGeometry: MockBoxBufferGeometry,
    Mesh: MockMesh,
    Line: MockLine,
    Geometry: MockGeometry
  };
}

class MockGeometry{
  constructor(){
    this.vertices = [];
  }
}

class MockLineBasicMaterial{
  constructor(){}
}

class MockMeshBasicMaterial {
  constructor(){}
};

class MockBoxBufferGeometry {
  constructor(width, height, depth){
    this.size = new Kompute.Vector3D(width, height, depth);
    this.parameters = {
      width: width, height: height, depth: depth
    };
  }
};

class MockLine {
  constructor(geometry){
    this.geometry = geometry;
  }
}

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
