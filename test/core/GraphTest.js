var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Graph", function(){

  it("should initialize", function(){

    var graph = new Kompute.Graph();

    expect(graph.connections).to.eql({});
    expect(graph.totalVertexCount).to.eql(0);
    expect(graph.world).to.eql(null);
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

    var param1 = null, param2 = null, count = 0;

    var fn = function(neighborVertex, cost){
      param1 = neighborVertex;
      param2 = cost;
      count ++;
    };

    graph.forEachNeighbor(vertex, fn);

    expect(count).to.eql(1);
    expect(param1).to.eql(vertex2);
    expect(param2).to.eql(vertex2.clone().sub(vertex).getLength());

    var called = false;
    var fn2 = function(){
      called = true;
    };

    graph.forEachNeighbor(vertex2, fn2);
    expect(called).to.eql(false);
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
});
