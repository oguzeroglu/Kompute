var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Graph", function(){

  it("should initialize", function(){

    var graph = new Kompute.Graph();

    expect(graph.connections).to.eql({});
  });

  it("should add vertex", function(){

    var graph = new Kompute.Graph();

    var vertex = new Kompute.Vector3D(10, 20, 30);

    var res = graph.addVertex(vertex);

    expect(graph.connections[10][20][30]).to.eql([]);
    expect(res).to.eql(true);

    var vertex2 = new Kompute.Vector3D(10, 20, 40);

    var res2 = graph.addVertex(vertex2);

    expect(graph.connections[10][20][40]).to.eql([]);
    expect(graph.connections[10][20][30]).to.eql([]);
    expect(res).to.eql(true);

    expect(graph.addVertex(vertex)).to.eql(false);
    expect(graph.addVertex(vertex2)).to.eql(false);
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

    var vertex2 = new Kompute.Vector3D(40, 100, 70);
    graph.addVertex(vertex2);
    graph.removeVertex(vertex2);
    expect(graph.connections).to.eql({40: {50: {60: []}}});

    graph.removeVertex(new Kompute.Vector3D(40, 50, 60));
    expect(graph.connections).to.eql({});

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
});
