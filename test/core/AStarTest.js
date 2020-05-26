var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("AStar", function(){

  it("should initialize", function(){

    var v1 = new Kompute.Vector3D(100, 200, 300);
    var v2 = new Kompute.Vector3D(400, 500, 600);
    var v3 = new Kompute.Vector3D(700, 800, 900);

    var graph = new Kompute.Graph();

    graph.addVertex(v1);
    graph.addVertex(v2);
    graph.addVertex(v3);

    var aStar = new Kompute.AStar(graph);

    var zeroVector = new Kompute.Vector3D();
    var heapNode1 = { priority: 0, parent: null, next: null, x: 100, y: 200, z: 300 };
    var heapNode2 = { priority: 0, parent: null, next: null, x: 400, y: 500, z: 600 };
    var heapNode3 = { priority: 0, parent: null, next: null, x: 700, y: 800, z: 900 };

    expect(aStar.path.waypoints).to.eql([zeroVector, zeroVector, zeroVector]);

    expect(aStar.heapNodes).to.eql({
      100: {200: {300: heapNode1}},
      400: {500: {600: heapNode2}},
      700: {800: {900: heapNode3}}
    });

    expect(aStar.graph).to.equal(graph);

    expect(aStar.heap).to.eql(new Kompute.MinHeap(3));
  });

  it("should get heap node", function(){

    var v1 = new Kompute.Vector3D(100, 200, 300);
    var v2 = new Kompute.Vector3D(400, 500, 600);
    var v3 = new Kompute.Vector3D(700, 800, 900);

    var graph = new Kompute.Graph();

    graph.addVertex(v1);
    graph.addVertex(v2);
    graph.addVertex(v3);

    var aStar = new Kompute.AStar(graph);

    expect(aStar.getHeapNode(v1.x, v1.y, v1.z)).to.eql({ priority: 0, parent: null, next: null, x: 100, y: 200, z: 300 });
    expect(aStar.getHeapNode(v2.x, v2.y, v2.z)).to.eql({ priority: 0, parent: null, next: null, x: 400, y: 500, z: 600 });
    expect(aStar.getHeapNode(v3.x, v3.y, v3.z)).to.eql({ priority: 0, parent: null, next: null, x: 700, y: 800, z: 900 });
    expect(aStar.getHeapNode(600, 700, 100)).to.eql(null);
  });

  it("should check if node belongs to a vector", function(){
    var v1 = new Kompute.Vector3D(100, 200, 300);
    var v2 = new Kompute.Vector3D(400, 500, 600);
    var v3 = new Kompute.Vector3D(700, 800, 900);

    var graph = new Kompute.Graph();

    graph.addVertex(v1);
    graph.addVertex(v2);
    graph.addVertex(v3);

    var aStar = new Kompute.AStar(graph);

    var heapNode1 = aStar.getHeapNode(v1.x, v1.y, v1.z);
    var heapNode2 = aStar.getHeapNode(v2.x, v2.y, v2.z);
    var heapNode3 = aStar.getHeapNode(v3.x, v3.y, v3.z);

    expect(aStar.isNodeBelongToVector(heapNode1, v1)).to.eql(true);
    expect(aStar.isNodeBelongToVector(heapNode2, v2)).to.eql(true);
    expect(aStar.isNodeBelongToVector(heapNode3, v3)).to.eql(true);
    expect(aStar.isNodeBelongToVector(heapNode1, v2)).to.eql(false);
    expect(aStar.isNodeBelongToVector(heapNode1, v3)).to.eql(false);
    expect(aStar.isNodeBelongToVector(heapNode2, v1)).to.eql(false);
    expect(aStar.isNodeBelongToVector(heapNode2, v3)).to.eql(false);
    expect(aStar.isNodeBelongToVector(heapNode3, v1)).to.eql(false);
    expect(aStar.isNodeBelongToVector(heapNode3, v2)).to.eql(false);
  });

  it("should generate path", function(){

    var v1 = new Kompute.Vector3D(100, 200, 300);
    var v2 = new Kompute.Vector3D(400, 500, 600);
    var v3 = new Kompute.Vector3D(700, 800, 900);

    var graph = new Kompute.Graph();

    graph.addVertex(v1);
    graph.addVertex(v2);
    graph.addVertex(v3);

    var aStar = new Kompute.AStar(graph);

    aStar.getHeapNode(v1.x, v1.y, v1.z).next = aStar.getHeapNode(v3.x, v3.y, v3.z);

    var path = aStar.generatePath(v1);

    expect(path.waypoints).to.eql([v1, v3, new Kompute.Vector3D()]);
    expect(path.length).to.eql(2);

    aStar.getHeapNode(v3.x, v3.y, v3.z).next = aStar.getHeapNode(v2.x, v2.y, v2.z);

    path = aStar.generatePath(v1);

    expect(path.waypoints).to.eql([v1, v3, v2]);
    expect(path.length).to.eql(3);
  });
});
