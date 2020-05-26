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
      heapNodes[x][y][z] = { priority: 0, parent: null, next: null, x: x, y: y, z: z, closedTag: null };
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

AStar.prototype.generatePath = function(startVector){

  var path = this.path;
  path.length = 0;

  var vec = startVector;
  var heapNode = this.getHeapNode(startVector.x, startVector.y, startVector.z);

  while (heapNode){
    path.insertWaypoint(vec);

    heapNode = heapNode.next;

    if (heapNode){
      vec = vectorPool.get().set(heapNode.x, heapNode.y, heapNode.z);
    }
  }

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
      return this.generatePath(fromVector);
    }

    heapNode = this.heap.pop();
  }
}

export { AStar };
