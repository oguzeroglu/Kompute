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
    var heapNode1 = { priority: 0, parent: null, x: 100, y: 200, z: 300, closedTag: null };
    var heapNode2 = { priority: 0, parent: null, x: 400, y: 500, z: 600, closedTag: null };
    var heapNode3 = { priority: 0, parent: null, x: 700, y: 800, z: 900, closedTag: null };

    expect(aStar.path.waypoints).to.eql([zeroVector, zeroVector, zeroVector]);

    expect(aStar.heapNodes).to.eql({
      100: {200: {300: heapNode1}},
      400: {500: {600: heapNode2}},
      700: {800: {900: heapNode3}}
    });

    expect(aStar.graph).to.equal(graph);

    expect(aStar.heap).to.eql(new Kompute.MinHeap(3));

    expect(aStar.searchID).to.eql(0);
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

    expect(aStar.getHeapNode(v1.x, v1.y, v1.z)).to.eql({ priority: 0, parent: null, x: 100, y: 200, z: 300, closedTag: null });
    expect(aStar.getHeapNode(v2.x, v2.y, v2.z)).to.eql({ priority: 0, parent: null, x: 400, y: 500, z: 600, closedTag: null });
    expect(aStar.getHeapNode(v3.x, v3.y, v3.z)).to.eql({ priority: 0, parent: null, x: 700, y: 800, z: 900, closedTag: null });
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

    aStar.getHeapNode(v1.x, v1.y, v1.z).parent = aStar.getHeapNode(v3.x, v3.y, v3.z);

    var path = aStar.generatePath(v1);

    expect(path.waypoints).to.eql([v1, v3, new Kompute.Vector3D()]);
    expect(path.length).to.eql(2);
    expect(path.isRewinding).to.eql(true);
    expect(path.index).to.eql(1);

    expect(path.getCurrentWaypoint()).to.eql(v3);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(v1);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(false);

    aStar.getHeapNode(v3.x, v3.y, v3.z).parent = aStar.getHeapNode(v2.x, v2.y, v2.z);

    path = aStar.generatePath(v1);

    expect(path.waypoints).to.eql([v1, v3, v2]);
    expect(path.length).to.eql(3);
    expect(path.isRewinding).to.eql(true);
    expect(path.index).to.eql(2);

    expect(path.getCurrentWaypoint()).to.eql(v2);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(v3);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(v1);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(false);
  });

  it("should mark node as closed", function(){
    var v1 = new Kompute.Vector3D(100, 200, 300);

    var graph = new Kompute.Graph();

    graph.addVertex(v1);

    var aStar = new Kompute.AStar(graph);

    var node = aStar.getHeapNode(v1.x, v1.y, v1.z);

    expect(node.closedTag).to.eql(null);

    aStar.markNodeAsClosed(node, 10);

    expect(node.closedTag).to.eql(10);
  });

  it("should get if node marked as closed", function(){
    var v1 = new Kompute.Vector3D(100, 200, 300);
    var v2 = new Kompute.Vector3D(400, 500, 600);
    var v3 = new Kompute.Vector3D(700, 800, 900);

    var graph = new Kompute.Graph();

    graph.addVertex(v1);
    graph.addVertex(v2);
    graph.addVertex(v3);

    var aStar = new Kompute.AStar(graph);

    var node1 = aStar.getHeapNode(v1.x, v1.y, v1.z);
    var node2 = aStar.getHeapNode(v2.x, v2.y, v2.z);
    var node3 = aStar.getHeapNode(v3.x, v3.y, v3.z);

    expect(aStar.isNodeClosed(node1, 0)).to.eql(false);
    expect(aStar.isNodeClosed(node2, 0)).to.eql(false);
    expect(aStar.isNodeClosed(node3, 0)).to.eql(false);

    aStar.markNodeAsClosed(node1, 0);
    expect(aStar.isNodeClosed(node1, 0)).to.eql(true);

    aStar.markNodeAsClosed(node2, 0);
    expect(aStar.isNodeClosed(node2, 0)).to.eql(true);

    aStar.markNodeAsClosed(node3, 0);
    expect(aStar.isNodeClosed(node3, 0)).to.eql(true);

    expect(aStar.isNodeClosed(node1, 1)).to.eql(false);
    expect(aStar.isNodeClosed(node2, 1)).to.eql(false);
    expect(aStar.isNodeClosed(node3, 1)).to.eql(false);
  });

  it("should find shortest path", function(){

    var graph = new Kompute.Graph();
    var aStar = new Kompute.AStar(graph);

    expect(aStar.findShortestPath(new Kompute.Vector3D(), new Kompute.Vector3D(100, 200, 300))).to.eql(false);

    graph.addVertex(new Kompute.Vector3D(100, 200, 300));
    aStar = new Kompute.AStar(graph);

    var path = aStar.findShortestPath(new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(100, 200, 300));
    expect(path.waypoints).to.eql([new Kompute.Vector3D(100, 200, 300)]);

    graph.addVertex(new Kompute.Vector3D(500, 400, 100));
    aStar = new Kompute.AStar(graph);
    path = aStar.findShortestPath(new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(500, 400, 100));
    expect(path).to.eql(false);
    graph.addEdge(new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(500, 400, 100));
    path = aStar.findShortestPath(new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(500, 400, 100));
    expect(path.getCurrentWaypoint()).to.eql(new Kompute.Vector3D(100, 200, 300));
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(new Kompute.Vector3D(500, 400, 100));
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(false);

    graph = new Kompute.Graph();
    var v1 = new Kompute.Vector3D();
    var v2 = new Kompute.Vector3D(10, 10, 10);
    var v22 = new Kompute.Vector3D(11, 11, 11);
    var v3 = new Kompute.Vector3D(20, 20, 20);
    var v4 = new Kompute.Vector3D(500, 500, 500);

    graph.addVertex(v1);
    graph.addVertex(v2);
    graph.addVertex(v22);
    graph.addVertex(v3);
    graph.addVertex(v4);

    graph.addEdge(v1, v4);
    graph.addEdge(v4, v3);
    graph.addEdge(v1, v2);
    graph.addEdge(v2, v22);
    graph.addEdge(v22, v3);

    aStar = new Kompute.AStar(graph);
    path = aStar.findShortestPath(v1, v3);

    expect(path.getCurrentWaypoint()).to.eql(v1);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(v2);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(v22);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(v3);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(false);

    graph.removeVertex(v2);
    aStar = new Kompute.AStar(graph);
    path = aStar.findShortestPath(v1, v3);
    expect(path.getCurrentWaypoint()).to.eql(v1);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(v4);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(v3);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(false);
  });
});
