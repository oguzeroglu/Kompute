import { Vector3D } from "./Vector3D";
import { VectorPool } from "./VectorPool";
import { Path } from "./Path";
import { MinHeap } from "./MinHeap";

var ZERO_VECTOR = new Vector3D();
var vectorPool = new VectorPool(10);

var AStar = function(graph){

  var path = new Path({ fixedLength: graph.totalVertexCount });

  var heapNodes = {};

  graph.forEachVertex(function(x, y, z){
    if (!heapNodes[x]){
      heapNodes[x] = {};
    }

    if (!heapNodes[x][y]){
      heapNodes[x][y] = {};
    }

    if (!heapNodes[x][y][z]){
      heapNodes[x][y][z] = { priority: 0, parent: null, x: parseFloat(x), y: parseFloat(y), z: parseFloat(z), closedTag: null, parentTag: null, jumpDescriptor: null };
    }
  });

  this.heapNodes = heapNodes;
  this.path = path;
  this.graph = graph;
  this.heap = new MinHeap(graph.totalVertexCount);

  this.searchID = 0;
}

AStar.prototype.getHeapNode = function(x, y, z, heapNodes){
  var nx = heapNodes ? heapNodes[x] : this.heapNodes[x];
  if (nx){
    var ny = nx[y];
    if (ny){
      return ny[z] || null;
    }
    return null;
  }
  return null;
}

AStar.prototype.isNodeBelongToVector = function(node, vector){
  return node === this.getHeapNode(vector.x, vector.y, vector.z);
}

AStar.prototype.generatePath = function(endVector){

  var path = this.path;
  path.length = 0;

  var vec = endVector;
  var heapNode = this.getHeapNode(vec.x, vec.y, vec.z);

  while (heapNode){
    path.insertWaypoint(vec);

    var parentTag = heapNode.parentTag;
    heapNode = heapNode.parent;
    if (heapNode && parentTag != this.searchID){
      heapNode = null;
    }

    if (heapNode){
      vec = vectorPool.get().set(heapNode.x, heapNode.y, heapNode.z);
    }
  }

  path.isRewinding = true;
  path.index = path.length - 1;
  path.isFinished = false;

  return path;
}

AStar.prototype.markNodeAsClosed = function(node, searchID){
  node.closedTag = searchID;
}

AStar.prototype.isNodeClosed = function(node, searchID){
  return node.closedTag === searchID;
}

AStar.prototype.findShortestPath = function(fromVector, toVector){

  var heapNodes = this.heapNodes;

  this.searchID ++;

  var searchID = this.searchID;

  var heap = this.heap;

  heap.reset();

  var graph = this.graph;
  if (!graph.hasVertex(fromVector) || !graph.hasVertex(toVector)){
    return false;
  }

  var getHeapNode = this.getHeapNode;
  var isNodeClosed = this.isNodeClosed;
  var markNodeAsClosed = this.markNodeAsClosed;

  var heapNode = this.getHeapNode(fromVector.x, fromVector.y, fromVector.z);
  var vec = vectorPool.get();

  heap.insert(heapNode);

  while (heapNode){
    if (this.isNodeBelongToVector(heapNode, toVector)){
      return this.generatePath(toVector);
    }

    markNodeAsClosed(heapNode, searchID);

    vec.set(heapNode.x, heapNode.y, heapNode.z);
    graph.forEachNeighbor(vec, function(neighborVec, cost, jumpDescriptor){

      var neighborHeapNode = getHeapNode(neighborVec.x, neighborVec.y, neighborVec.z, heapNodes);

      var heuristicCost = neighborVec.getDistanceSq(toVector);

      if (!isNodeClosed(neighborHeapNode, searchID)){
        neighborHeapNode.priority = cost + heuristicCost;
        neighborHeapNode.parent = heapNode;
        neighborHeapNode.parentTag = searchID;
        neighborHeapNode.jumpDescriptor = jumpDescriptor;
        markNodeAsClosed(neighborHeapNode, searchID);
        heap.insert(neighborHeapNode);
      }

      if (heap.hasNode(neighborHeapNode)){
        var currentPriority = heuristicCost + cost;

        if (currentPriority < neighborHeapNode.priority){
          neighborHeapNode.priority = currentPriority;
          neighborHeapNode.parent = heapNode;
          neighborHeapNode.parentTag = searchID;
          neighborHeapNode.jumpDescriptor = jumpDescriptor;
          heap.remove(neighborHeapNode);
          heap.insert(neighborHeapNode);
        }
      }
    });

    heapNode = heap.pop();
  }

  return false;
}

export { AStar };
