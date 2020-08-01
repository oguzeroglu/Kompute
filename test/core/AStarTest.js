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
    var heapNode1 = { priority: 0, parent: null, x: 100, y: 200, z: 300, closedTag: null, parentTag: null, priorityTag: null, jumpDescriptor: null };
    var heapNode2 = { priority: 0, parent: null, x: 400, y: 500, z: 600, closedTag: null, parentTag: null, priorityTag: null, jumpDescriptor: null };
    var heapNode3 = { priority: 0, parent: null, x: 700, y: 800, z: 900, closedTag: null, parentTag: null, priorityTag: null, jumpDescriptor: null };

    expect(aStar.path.waypoints).to.eql([zeroVector, zeroVector, zeroVector]);

    expect(aStar.heapNodes).to.eql({
      100: {200: {300: heapNode1}},
      400: {500: {600: heapNode2}},
      700: {800: {900: heapNode3}}
    });

    expect(aStar.graph).to.equal(graph);

    expect(aStar.heap).to.eql(new Kompute.MinHeap(3));

    expect(aStar.searchID).to.eql(0);

    expect(aStar._internalID).to.exist;
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

    expect(aStar.getHeapNode(v1.x, v1.y, v1.z)).to.eql({ priority: 0, parent: null, x: 100, y: 200, z: 300, closedTag: null, parentTag: null, priorityTag: null, jumpDescriptor: null });
    expect(aStar.getHeapNode(v2.x, v2.y, v2.z)).to.eql({ priority: 0, parent: null, x: 400, y: 500, z: 600, closedTag: null, parentTag: null, priorityTag: null, jumpDescriptor: null });
    expect(aStar.getHeapNode(v3.x, v3.y, v3.z)).to.eql({ priority: 0, parent: null, x: 700, y: 800, z: 900, closedTag: null, parentTag: null, priorityTag: null, jumpDescriptor: null });
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

    aStar.getHeapNode(v1.x, v1.y, v1.z).parentTag = 0;
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

    aStar.getHeapNode(v3.x, v3.y, v3.z).parentTag = 0;
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

  it("should consider jump descriptors when constructing path", function(){
    var graph = new Kompute.Graph();

    var vertex1 = new Kompute.Vector3D(0, 0, 0);
    var vertex2 = new Kompute.Vector3D(100, 0, 0);
    var vertex3 = new Kompute.Vector3D(300, 0, 0);

    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: vertex2, landingPosition: vertex3,
      takeoffPositionSatisfactionRadius: 100
    });

    graph.addVertex(vertex1);
    graph.addVertex(vertex2);
    graph.addVertex(vertex3);

    graph.addEdge(vertex1, vertex2);
    graph.addEdge(vertex2, vertex3);

    graph.addJumpDescriptor(jumpDescriptor);

    var aStar = new Kompute.AStar(graph);

    var path = aStar.findShortestPath(vertex1, vertex3);

    expect(path.jumpDescriptorLength).to.eql(1);
    expect(path.jumpDescriptors).to.eql([jumpDescriptor, null, null]);
  });

  it("should execute onPathConstructed", function(){

    var graph = new Kompute.Graph();

    var vertex1 = new Kompute.Vector3D(0, 0, 0);
    var vertex2 = new Kompute.Vector3D(0, 100, 0);
    var vertex3 = new Kompute.Vector3D(100, 0, 0);

    graph.addVertex(vertex1);
    graph.addVertex(vertex2);
    graph.addVertex(vertex3);

    graph.addEdge(vertex1, vertex2);
    graph.addEdge(vertex2, vertex3);

    var aStar = new Kompute.AStar(graph);

    var called = false;
    aStar.onPathConstructed = function(){
      called = true;
    };

    expect(called).to.eql(false);
    aStar.findShortestPath(vertex1, vertex2);
    expect(called).to.eql(true);

    called = false;
    aStar.findShortestPath(vertex1, vertex2);
    expect(called).to.eql(true);

    called = false;
    aStar.findShortestPath(vertex2, vertex3);
    expect(called).to.eql(true);

    called = false;
    aStar.findShortestPath(vertex3, vertex1);
    expect(called).to.eql(false);
  });
});

describe("AStar - Integration", function(){

  it("should find shortest path", function(){
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

    graph.addEdge(aVec, bVec);
    graph.addEdge(bVec, aVec);

    graph.addEdge(bVec, cVec);
    graph.addEdge(cVec, bVec);

    graph.addEdge(cVec, dVec);
    graph.addEdge(dVec, cVec);

    graph.addEdge(eVec, dVec);
    graph.addEdge(dVec, eVec);

    graph.addEdge(eVec, fVec);
    graph.addEdge(fVec, eVec);

    graph.addEdge(fVec, gVec);
    graph.addEdge(gVec, fVec);

    graph.addEdge(gVec, hVec);
    graph.addEdge(hVec, gVec);

    graph.addEdge(hVec, jVec);
    graph.addEdge(jVec, hVec);

    graph.addEdge(jVec, xVec);
    graph.addEdge(xVec, jVec);

    graph.addEdge(xVec, yVec);
    graph.addEdge(yVec, xVec);

    graph.addEdge(xVec, zVec);
    graph.addEdge(zVec, xVec);

    graph.addEdge(yVec, wVec);
    graph.addEdge(wVec, yVec);

    graph.addEdge(dVec, jVec);
    graph.addEdge(jVec, dVec);

    var aStar = new Kompute.AStar(graph);

    var find = function(from, to){
      var path = aStar.findShortestPath(from, to);
      if (!path){
        return false;
      }

      var ary = [];

      var cur = path.getCurrentWaypoint();
      while (cur){
        ary.push(cur);
        path.next();
        cur = path.getCurrentWaypoint();
      }

      return ary;
    }

    expect(find(aVec, wVec)).to.eql([aVec, bVec, cVec, dVec, jVec, xVec, yVec, wVec]);
    expect(find(xVec, wVec)).to.eql([xVec, yVec, wVec]);
    expect(find(wVec, aVec)).to.eql([wVec, yVec, xVec, jVec, dVec, cVec, bVec, aVec]);
    expect(find(aVec, zVec)).to.eql([aVec, bVec, cVec, dVec, jVec, xVec, zVec]);
    expect(find(aVec, gVec)).to.eql([aVec, bVec, cVec, dVec, jVec, hVec, gVec]);
    expect(find(jVec, gVec)).to.eql([jVec, hVec, gVec]);
    expect(find(fVec, jVec)).to.eql([fVec, gVec, hVec, jVec]);
  });


  it("should not fail", function(){

    var graph = new Kompute.Graph();

    // extracted from a real world failed scenario
    graph.connections = {"0":{"25":{"0":[{"fromVertex":{"x":0,"y":25,"z":0},"toVertex":{"x":0,"y":25,"z":-100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":0},"toVertex":{"x":100,"y":25,"z":-100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":0},"toVertex":{"x":- 100,"y":25,"z":0},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":0},"toVertex":{"x":100,"y":25,"z":0},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":0},"toVertex":{"x":0,"y":25,"z":100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":0},"toVertex":{"x":100,"y":25,"z":100},"cost":141.4213562373095,"jumpDescriptor":null}],"100":[{"fromVertex":{"x":0,"y":25,"z":100},"toVertex":{"x":-100,"y":25,"z":0},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":100},"toVertex":{"x":0,"y":25,"z":0},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":100},"toVertex":{"x":100,"y":25,"z":0},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":100},"toVertex":{"x":100,"y":25,"z":100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":100},"toVertex":{"x":-100,"y":25,"z":200},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":100},"toVertex":{"x":0,"y":25,"z":200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":100},"toVertex":{"x":100,"y":25,"z":200},"cost":141.4213562373095,"jumpDescriptor":null}],"200":[{"fromVertex":{"x":0,"y":25,"z":200},"toVertex":{"x":0,"y":25,"z":100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":200},"toVertex":{"x":100,"y":25,"z":100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":200},"toVertex":{"x":-100,"y":25,"z":200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":200},"toVertex":{"x":100,"y":25,"z":200},"cost":100,"jumpDescriptor":null}],"-200":[{"fromVertex":{"x":0,"y":25,"z":-200},"toVertex":{"x":-100,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":-200},"toVertex":{"x":100,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":-200},"toVertex":{"x":0,"y":25,"z":-100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":-200},"toVertex":{"x":100,"y":25,"z":-100},"cost":141.4213562373095,"jumpDescriptor":null}],"-100":[{"fromVertex":{"x":0,"y":25,"z":-100},"toVertex":{"x":-100,"y":25,"z":-200},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":-100},"toVertex":{"x":0,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":-100},"toVertex":{"x":100,"y":25,"z":-200},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":-100},"toVertex":{"x":100,"y":25,"z":-100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":-100},"toVertex":{"x":-100,"y":25,"z":0},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":-100},"toVertex":{"x":0,"y":25,"z":0},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":0,"y":25,"z":-100},"toVertex":{"x":100,"y":25,"z":0},"cost":141.4213562373095,"jumpDescriptor":null}]}},"100":{"25":{"0":[{"fromVertex":{"x":100,"y":25,"z":0},"toVertex":{"x":0,"y":25,"z":-100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":0},"toVertex":{"x":100,"y":25,"z":-100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":0},"toVertex":{"x":200,"y":25,"z":-100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":0},"toVertex":{"x":0,"y":25,"z":0},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":0},"toVertex":{"x":0,"y":25,"z":100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":0},"toVertex":{"x":100,"y":25,"z":100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":0},"toVertex":{"x":200,"y":25,"z":100},"cost":141.4213562373095,"jumpDescriptor":null}],"100":[{"fromVertex":{"x":100,"y":25,"z":100},"toVertex":{"x":0,"y":25,"z":0},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":100},"toVertex":{"x":100,"y":25,"z":0},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":100},"toVertex":{"x":0,"y":25,"z":100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":100},"toVertex":{"x":200,"y":25,"z":100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":100},"toVertex":{"x":0,"y":25,"z":200},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":100},"toVertex":{"x":100,"y":25,"z":200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":100},"toVertex":{"x":200,"y":25,"z":200},"cost":141.4213562373095,"jumpDescriptor":null}],"200":[{"fromVertex":{"x":100,"y":25,"z":200},"toVertex":{"x":0,"y":25,"z":100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":200},"toVertex":{"x":100,"y":25,"z":100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":200},"toVertex":{"x":200,"y":25,"z":100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":200},"toVertex":{"x":0,"y":25,"z":200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":200},"toVertex":{"x":200,"y":25,"z":200},"cost":100,"jumpDescriptor":null}],"-200":[{"fromVertex":{"x":100,"y":25,"z":-200},"toVertex":{"x":0,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":-200},"toVertex":{"x":200,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":-200},"toVertex":{"x":0,"y":25,"z":-100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":-200},"toVertex":{"x":100,"y":25,"z":-100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":-200},"toVertex":{"x":200,"y":25,"z":-100},"cost":141.4213562373095,"jumpDescriptor":null}],"-100":[{"fromVertex":{"x":100,"y":25,"z":-100},"toVertex":{"x":0,"y":25,"z":-200},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":-100},"toVertex":{"x":100,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":-100},"toVertex":{"x":200,"y":25,"z":-200},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":-100},"toVertex":{"x":0,"y":25,"z":-100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":-100},"toVertex":{"x":200,"y":25,"z":-100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":-100},"toVertex":{"x":0,"y":25,"z":0},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":100,"y":25,"z":-100},"toVertex":{"x":100,"y":25,"z":0},"cost":100,"jumpDescriptor":null}]}},"200":{"25":{"100":[{"fromVertex":{"x":200,"y":25,"z":100},"toVertex":{"x":100,"y":25,"z":0},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":200,"y":25,"z":100},"toVertex":{"x":100,"y":25,"z":100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":200,"y":25,"z":100},"toVertex":{"x":100,"y":25,"z":200},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":200,"y":25,"z":100},"toVertex":{"x":200,"y":25,"z":200},"cost":100,"jumpDescriptor":null}],"200":[{"fromVertex":{"x":200,"y":25,"z":200},"toVertex":{"x":100,"y":25,"z":100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":200,"y":25,"z":200},"toVertex":{"x":200,"y":25,"z":100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":200,"y":25,"z":200},"toVertex":{"x":100,"y":25,"z":200},"cost":100,"jumpDescriptor":null}],"-200":[{"fromVertex":{"x":200,"y":25,"z":-200},"toVertex":{"x":100,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":200,"y":25,"z":-200},"toVertex":{"x":100,"y":25,"z":-100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":200,"y":25,"z":-200},"toVertex":{"x":200,"y":25,"z":-100},"cost":100,"jumpDescriptor":null}],"-100":[{"fromVertex":{"x":200,"y":25,"z":-100},"toVertex":{"x":100,"y":25,"z":-200},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":200,"y":25,"z":-100},"toVertex":{"x":200,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":200,"y":25,"z":-100},"toVertex":{"x":100,"y":25,"z":-100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":200,"y":25,"z":-100},"toVertex":{"x":100,"y":25,"z":0},"cost":141.4213562373095,"jumpDescriptor":null}]}},"-200":{"25":{"0":[{"fromVertex":{"x":-200,"y":25,"z":0},"toVertex":{"x":-200,"y":25,"z":-100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-200,"y":25,"z":0},"toVertex":{"x":-100,"y":25,"z":0},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-200,"y":25,"z":0},"toVertex":{"x":-200,"y":25,"z":100},"cost":100,"jumpDescriptor":null}],"100":[{"fromVertex":{"x":-200,"y":25,"z":100},"toVertex":{"x":-200,"y":25,"z":0},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-200,"y":25,"z":100},"toVertex":{"x":-100,"y":25,"z":0},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":-200,"y":25,"z":100},"toVertex":{"x":-200,"y":25,"z":200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-200,"y":25,"z":100},"toVertex":{"x":-100,"y":25,"z":200},"cost":141.4213562373095,"jumpDescriptor":null}],"200":[{"fromVertex":{"x":-200,"y":25,"z":200},"toVertex":{"x":-200,"y":25,"z":100},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-200,"y":25,"z":200},"toVertex":{"x":-100,"y":25,"z":200},"cost":100,"jumpDescriptor":null}],"-200":[{"fromVertex":{"x":-200,"y":25,"z":-200},"toVertex":{"x":-100,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-200,"y":25,"z":-200},"toVertex":{"x":-200,"y":25,"z":-100},"cost":100,"jumpDescriptor":null}],"-100":[{"fromVertex":{"x":-200,"y":25,"z":-100},"toVertex":{"x":-200,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-200,"y":25,"z":-100},"toVertex":{"x":-100,"y":25,"z":-200},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":-200,"y":25,"z":-100},"toVertex":{"x":-200,"y":25,"z":0},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-200,"y":25,"z":-100},"toVertex":{"x":-100,"y":25,"z":0},"cost":141.4213562373095,"jumpDescriptor":null}]}},"-100":{"25":{"0":[{"fromVertex":{"x":-100,"y":25,"z":0},"toVertex":{"x":-200,"y":25,"z":-100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":-100,"y":25,"z":0},"toVertex":{"x":0,"y":25,"z":-100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":-100,"y":25,"z":0},"toVertex":{"x":-200,"y":25,"z":0},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-100,"y":25,"z":0},"toVertex":{"x":0,"y":25,"z":0},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-100,"y":25,"z":0},"toVertex":{"x":-200,"y":25,"z":100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":-100,"y":25,"z":0},"toVertex":{"x":0,"y":25,"z":100},"cost":141.4213562373095,"jumpDescriptor":null}],"200":[{"fromVertex":{"x":-100,"y":25,"z":200},"toVertex":{"x":-200,"y":25,"z":100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":-100,"y":25,"z":200},"toVertex":{"x":0,"y":25,"z":100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":-100,"y":25,"z":200},"toVertex":{"x":-200,"y":25,"z":200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-100,"y":25,"z":200},"toVertex":{"x":0,"y":25,"z":200},"cost":100,"jumpDescriptor":null}],"-200":[{"fromVertex":{"x":-100,"y":25,"z":-200},"toVertex":{"x":-200,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-100,"y":25,"z":-200},"toVertex":{"x":0,"y":25,"z":-200},"cost":100,"jumpDescriptor":null},{"fromVertex":{"x":-100,"y":25,"z":-200},"toVertex":{"x":-200,"y":25,"z":-100},"cost":141.4213562373095,"jumpDescriptor":null},{"fromVertex":{"x":-100,"y":25,"z":-200},"toVertex":{"x":0,"y":25,"z":-100},"cost":141.4213562373095,"jumpDescriptor":null}]}}};

    for (var x in graph.connections){
      for (var y in graph.connections[x]){
        for (var z in graph.connections[x][y]){
          var edges = graph.connections[x][y][z];
          for (var i = 0; i < edges.length; i ++){
            var edge = edges[i];
            edge.fromVertex = new Kompute.Vector3D(edge.fromVertex.x, edge.fromVertex.y, edge.fromVertex.z);
            edge.toVertex = new Kompute.Vector3D(edge.toVertex.x, edge.toVertex.y, edge.toVertex.z);
          }
        }
      }
    }

    graph.totalVertexCount = 22;

    var aStar = new Kompute.AStar(graph);

    expect(graph.hasVertex(new Kompute.Vector3D(200, 25, 200))).to.eql(true);
    expect(graph.hasVertex(new Kompute.Vector3D(-100, 25, 200))).to.eql(true);
    expect(graph.hasVertex(new Kompute.Vector3D(100, 25, -100))).to.eql(true);
    expect(graph.hasVertex(new Kompute.Vector3D(0, 25, -200))).to.eql(true);
    expect(graph.hasVertex(new Kompute.Vector3D(0, 25, 100))).to.eql(true);
    expect(graph.hasVertex(new Kompute.Vector3D(-100, 25, 0))).to.eql(true);
    expect(graph.hasVertex(new Kompute.Vector3D(0, 25, 0))).to.eql(true);
    expect(graph.hasVertex(new Kompute.Vector3D(0, 25, 200))).to.eql(true);

    aStar.findShortestPath(new Kompute.Vector3D(200, 25, 200), new Kompute.Vector3D(-100, 25, 200));
    aStar.findShortestPath(new Kompute.Vector3D(100, 25, -100), new Kompute.Vector3D(0, 25, -200));
    aStar.findShortestPath(new Kompute.Vector3D(200, 25, 200), new Kompute.Vector3D(0, 25, 100));
    aStar.findShortestPath(new Kompute.Vector3D(-100, 25, 0), new Kompute.Vector3D(-100, 25, 200));
    aStar.findShortestPath(new Kompute.Vector3D(0, 25, 0), new Kompute.Vector3D(0, 25, 200));
  });
});
