var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Graph", function(){

  it("should initialize", function(){

    var graph = new Kompute.Graph();

    expect(graph.connections).to.eql({});
    expect(graph.totalVertexCount).to.eql(0);
    expect(graph.world).to.eql(null);
    expect(graph.vertexIDs).to.eql([]);
  });

  it("should add vertex", function(){

    var graph = new Kompute.Graph();

    var vertex = new Kompute.Vector3D(10, 20, 30);

    var res = graph.addVertex(vertex);

    expect(graph.connections[10][20][30]).to.eql([]);
    expect(res).to.eql(true);
    expect(graph.totalVertexCount).to.eql(1);

    var vertex2 = new Kompute.Vector3D(10, 20, 40);

    var res2 = graph.addVertex(vertex2);

    expect(graph.connections[10][20][40]).to.eql([]);
    expect(graph.connections[10][20][30]).to.eql([]);
    expect(graph.totalVertexCount).to.eql(2);
    expect(res).to.eql(true);

    expect(graph.addVertex(vertex)).to.eql(false);
    expect(graph.addVertex(vertex2)).to.eql(false);
    expect(graph.totalVertexCount).to.eql(2);
  });

  it("should remove vertex", function(){
    var graph = new Kompute.Graph();

    var vertex = new Kompute.Vector3D(10, 20, 30);

    expect(graph.removeVertex(vertex)).to.eql(false);

    graph.addVertex(vertex);
    graph.removeVertex(vertex);

    expect(graph.connections).to.eql({});

    graph.addVertex(vertex);
    graph.addVertex(new Kompute.Vector3D(40, 50, 60));
    graph.removeVertex(vertex);

    expect(graph.connections).to.eql({40: {50: {60: []}}});
    expect(graph.totalVertexCount).to.eql(1);

    var vertex2 = new Kompute.Vector3D(40, 100, 70);
    graph.addVertex(vertex2);
    graph.removeVertex(vertex2);
    expect(graph.connections).to.eql({40: {50: {60: []}}});
    expect(graph.totalVertexCount).to.eql(1);

    graph.removeVertex(new Kompute.Vector3D(40, 50, 60));
    expect(graph.connections).to.eql({});
    expect(graph.totalVertexCount).to.eql(0);

    graph.addVertex(vertex);
    graph.addVertex(vertex2);
    graph.addEdge(vertex, vertex2);

    var edge = new Kompute.Edge(vertex, vertex2);
    expect(graph.connections).to.eql({
      10: {20: {30: [edge]}},
      40: {100: {70: []}}
    });

    graph.removeVertex(vertex2);
    expect(graph.connections).to.eql({10: {20: {30: []}}});
  });

  it("should check if it has vertex", function(){
    var graph = new Kompute.Graph();

    var vertex = new Kompute.Vector3D(10, 20, 30);

    expect(graph.hasVertex(vertex)).to.eql(false);

    graph.addVertex(vertex);

    expect(graph.hasVertex(vertex)).to.eql(true);

    graph.removeVertex(vertex);

    expect(graph.hasVertex(vertex)).to.eql(false);
  });

  it("should add edge", function(){
    var graph = new Kompute.Graph();

    var vertex = new Kompute.Vector3D(10, 20, 30);
    var vertex2 = new Kompute.Vector3D(40, 50, 60);

    var edge = new Kompute.Edge(vertex, vertex2);

    var result = graph.addEdge(vertex, vertex2);
    expect(result).to.eql(false);
    expect(graph.connections).to.eql({});

    graph.addVertex(vertex);
    var result2 = graph.addEdge(vertex, vertex2);
    expect(result2).to.eql(false);
    expect(graph.connections).to.eql({10:{20:{30: []}}});

    graph.addVertex(vertex2);

    var result3 = graph.addEdge(vertex, vertex2);
    expect(result3).to.eql(true);
    expect(graph.connections).to.eql({
      10: {20: {30: [edge]}},
      40: {50: {60: []}}
    });

    var result4 = graph.addEdge(vertex, vertex2);
    expect(result4).to.eql(false);
    expect(graph.connections).to.eql({
      10: {20: {30: [edge]}},
      40: {50: {60: []}}
    });
  });

  it("should add jump descriptor", function(){
    var graph = new Kompute.Graph();

    var vertex = new Kompute.Vector3D(10, 20, 30);
    var vertex2 = new Kompute.Vector3D(40, 50, 60);

    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: vertex, landingPosition: vertex2,
      runupSatisfactionRadius: 100, takeoffPositionSatisfactionRadius: 100,
      takeoffVelocitySatisfactionRadius: 100
    });

    expect(graph.addJumpDescriptor(jumpDescriptor)).to.eql(false);

    graph.addVertex(vertex);

    expect(graph.addJumpDescriptor(jumpDescriptor)).to.eql(false);

    graph.addVertex(vertex2);

    expect(graph.addJumpDescriptor(jumpDescriptor)).to.eql(true);

    var edge = new Kompute.Edge(vertex, vertex2);
    edge.jumpDescriptor = jumpDescriptor;

    expect(graph.connections[10][20][30]).to.eql([edge]);

    graph = new Kompute.Graph();

    graph.addVertex(vertex);
    graph.addVertex(vertex2);

    graph.addEdge(vertex, vertex2);

    edge = graph.connections[10][20][30][0];

    expect(edge.jumpDescriptor).to.eql(null);

    expect(graph.addJumpDescriptor(jumpDescriptor)).to.eql(true);

    expect(edge.jumpDescriptor).to.equal(jumpDescriptor);
  });

  it("should remove edge", function(){
    var graph = new Kompute.Graph();

    var vertex = new Kompute.Vector3D(10, 20, 30);
    var vertex2 = new Kompute.Vector3D(40, 50, 60);

    expect(graph.removeEdge(vertex, vertex2)).to.eql(false);
    expect(graph.connections).to.eql({});

    graph.addVertex(vertex);

    expect(graph.removeEdge(vertex, vertex2)).to.eql(false);
    expect(graph.connections).to.eql({10: {20: {30: []}}});

    graph.addVertex(vertex2);
    expect(graph.removeEdge(vertex, vertex2)).to.eql(false);
    expect(graph.connections).to.eql({
      10: {20: {30: []}},
      40: {50: {60: []}}
    });

    graph.addEdge(vertex, vertex2);
    expect(graph.connections).not.to.eql({
      10: {20: {30: []}},
      40: {50: {60: []}}
    });

    expect(graph.removeEdge(vertex2, vertex)).to.eql(false);

    expect(graph.removeEdge(vertex, vertex2)).to.eql(true);
    expect(graph.connections).to.eql({
      10: {20: {30: []}},
      40: {50: {60: []}}
    });
  });

  it("should perform forEachNeighbor operation", function(){
    var graph = new Kompute.Graph();

    var vertex = new Kompute.Vector3D(10, 20, 30);
    var vertex2 = new Kompute.Vector3D(40, 50, 60);

    graph.addVertex(vertex);
    graph.addVertex(vertex2);

    graph.addEdge(vertex, vertex2);

    var param1 = null, param2 = null, param3 = null, count = 0;

    var fn = function(neighborVertex, cost, jumpDescriptor){
      param1 = neighborVertex;
      param2 = cost;
      param3 = jumpDescriptor;
      count ++;
    };

    graph.forEachNeighbor(vertex, fn);

    expect(count).to.eql(1);
    expect(param1).to.eql(vertex2);
    expect(param2).to.eql(vertex2.clone().sub(vertex).getLength());
    expect(param3).to.eql(null);

    var called = false;
    var fn2 = function(){
      called = true;
    };

    graph.forEachNeighbor(vertex2, fn2);
    expect(called).to.eql(false);

    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: vertex,
      landingPosition: vertex2,
      runupSatisfactionRadius: 100,
      takeoffPositionSatisfactionRadius: 100,
      takeoffVelocitySatisfactionRadius: 100
    });

    graph.addJumpDescriptor(jumpDescriptor);

    graph.forEachNeighbor(vertex, fn);
    expect(param3).to.equal(jumpDescriptor);
  });

  it("should run for each vertex", function(){
    var graph = new Kompute.Graph();

    var vertices = [];

    var v1 = new Kompute.Vector3D(100, 200, 300);
    var v2 = new Kompute.Vector3D(200, 300, 400);
    var v3 = new Kompute.Vector3D(500, 600, 700);

    graph.addVertex(v1);
    graph.addVertex(v2);
    graph.addVertex(v3);

    var fn = function(x, y, z){
      vertices.push(new Kompute.Vector3D(x, y, z));
    };

    graph.forEachVertex(fn);

    expect(vertices.length).to.eql(3);

    var totX = vertices[0].x + vertices[1].x + vertices[2].x;
    var totY = vertices[0].y + vertices[1].y + vertices[2].y;
    var totZ = vertices[0].z + vertices[1].z + vertices[2].z;

    expect(totX).to.eql(800);
    expect(totY).to.eql(1100);
    expect(totZ).to.eql(1400);
  });

  it("should find closest vertex to point", function(){

    var graph = new Kompute.Graph();

    var v1 = new Kompute.Vector3D(0, 0, 0);
    var v2 = new Kompute.Vector3D(50, 50, 50);
    var v3 = new Kompute.Vector3D(-50, -50, -50);

    graph.addVertex(v1);
    graph.addVertex(v2);
    graph.addVertex(v3);

    var world = new Kompute.World(1000, 1000, 1000, 10);

    expect(graph.findClosestVertexToPoint(new Kompute.Vector3D())).to.eql(null);

    world.insertGraph(graph);

    expect(graph.findClosestVertexToPoint(new Kompute.Vector3D(5, 5, 5))).to.eql(v1);
    expect(graph.findClosestVertexToPoint(new Kompute.Vector3D(60, 60, 60))).to.eql(v2);
    expect(graph.findClosestVertexToPoint(new Kompute.Vector3D(-60, -60, -60))).to.eql(v3);

    expect(graph.findClosestVertexToPoint(new Kompute.Vector3D(500, 500, 500))).to.eql(null);
  });

  it("should run for each edge", function(){
    var graph = new Kompute.Graph();

    var v1 = new Kompute.Vector3D(0, 0, 0);
    var v2 = new Kompute.Vector3D(50, 50, 50);
    var v3 = new Kompute.Vector3D(-50, -50, -50);

    graph.addVertex(v1);
    graph.addVertex(v2);
    graph.addVertex(v3);

    graph.addEdge(v1, v2);
    graph.addEdge(v2, v3);
    graph.addEdge(v3, v1);

    var edges = [];
    graph.forEachEdge(function(edge){
      edges.push(edge);
    });

    expect(edges.length).to.eql(3);
    expect(edges[0]).to.eql(new Kompute.Edge(v1, v2));
    expect(edges[1]).to.eql(new Kompute.Edge(v2, v3));
    expect(edges[2]).to.eql(new Kompute.Edge(v3, v1));
  });

  it("should clone", function(){

    var graph = new Kompute.Graph();

    var vec1 = new Kompute.Vector3D(100, 200, 300);
    var vec2 = new Kompute.Vector3D(300, 400, 500);
    var vec3 = new Kompute.Vector3D(500, 600, 700);

    graph.addVertex(vec1);
    graph.addVertex(vec2);
    graph.addVertex(vec3);

    graph.addEdge(vec1, vec3);
    graph.addEdge(vec3, vec2);
    graph.addEdge(vec1, vec2);

    var cloned = graph.clone();

    expect(graph).to.eql(cloned);
    expect(graph).not.to.equal(cloned);
  });
});

describe("Graph - Integration", function(){

  it("should find closest vertex to point", function(){
    var aVec = new Kompute.Vector3D(200, 150, -200);
    var bVec = new Kompute.Vector3D(100, 150, -200);
    var cVec = new Kompute.Vector3D(100, 150, -100);
    var dVec = new Kompute.Vector3D(100, 150, 0);
    var eVec = new Kompute.Vector3D(200, 150, 0);
    var fVec = new Kompute.Vector3D(200, 150, 200);
    var gVec = new Kompute.Vector3D(0, 150, 200);
    var hVec = new Kompute.Vector3D(0, 150, 100);
    var jVec = new Kompute.Vector3D(0, 150, 0);
    var xVec = new Kompute.Vector3D(-200, 150, 0);
    var yVec = new Kompute.Vector3D(-200, 150, -200);
    var zVec = new Kompute.Vector3D(-200, 150, 200);
    var wVec = new Kompute.Vector3D(-100, 150, -200);

    var graph = new Kompute.Graph();

    graph.addVertex(aVec);
    graph.addVertex(bVec);
    graph.addVertex(cVec);
    graph.addVertex(dVec);
    graph.addVertex(eVec);
    graph.addVertex(fVec);
    graph.addVertex(gVec);
    graph.addVertex(hVec);
    graph.addVertex(jVec);
    graph.addVertex(xVec);
    graph.addVertex(yVec);
    graph.addVertex(zVec);
    graph.addVertex(wVec);

    var world = new Kompute.World(5000, 5000, 5000, 100);
    world.insertGraph(graph);

    var executedLen = 0;

    graph.forEachVertex(function(x, y, z){
      var vec = new Kompute.Vector3D(x, y, z);
      expect(graph.findClosestVertexToPoint(vec)).to.eql(vec);
      executedLen ++;
    });

    expect(executedLen).to.eql(13);
  });
});
