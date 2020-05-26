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
      heapNodes[x][y][z] = { priority: 0, parent: null, x: x, y: y, z: z, closedTag: null };
    }
  });

  this.heapNodes = heapNodes;
  this.path = path;
  this.graph = graph;
  this.heap = new MinHeap(graph.totalVertexCount);

  this.searchID = 0;
}

AStar.prototype.getHeapNode = function(x, y, z){
  var nx = this.heapNodes[x];
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

    heapNode = heapNode.parent;

    if (heapNode){
      vec = vectorPool.get().set(heapNode.x, heapNode.y, heapNode.z);
    }
  }

  path.isRewinding = true;
  path.index = path.length - 1;
  path.isFinished = false;

  return path;
}

AStar.prototype.markNodeAsClosed = function(node){
  node.closedTag = this.searchID;
}

AStar.prototype.isNodeClosed = function(node){
  return node.closedTag === this.searchID;
}

AStar.prototype.getShortestPath = function(fromVector, toVector){

  this.searchID ++;

  var graph = this.graph;
  if (!graph.hasVertex(fromVector) || !graph.hasVertex(toVector)){
    return false;
  }

  var heapNode = this.getHeapNode(fromVector.x, fromVector.y, fromVector.z);

  this.heap.insert(heapNode);

  while (heapNode){
    if (this.isNodeBelongToVector(heapNode, toVector)){
      return this.generatePath(toVector);
    }

    heapNode = this.heap.pop();
  }
}

export { AStar };
