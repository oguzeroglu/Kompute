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
    var heapNode = { priority: 0, parent: null, next: null };

    expect(aStar.path.waypoints).to.eql([zeroVector, zeroVector, zeroVector]);

    expect(aStar.heapNodes).to.eql({
      100: {200: {300: heapNode}},
      400: {500: {600: heapNode}},
      700: {800: {900: heapNode}}
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

    expect(aStar.getHeapNode(v1.x, v1.y, v1.z)).to.eql({ priority: 0, parent: null, next: null });
    expect(aStar.getHeapNode(v2.x, v2.y, v2.z)).to.eql({ priority: 0, parent: null, next: null });
    expect(aStar.getHeapNode(v3.x, v3.y, v3.z)).to.eql({ priority: 0, parent: null, next: null });
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
});
