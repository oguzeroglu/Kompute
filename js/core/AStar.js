import { Vector3D } from "./Vector3D";
import { Path } from "./Path";
import { MinHeap } from "./MinHeap";

var ZERO_VECTOR = new Vector3D();

var AStar = function(graph){

  var path = new Path();

  for (var i = 0; i < graph.totalVertexCount; i ++){
    path.waypoints.push(ZERO_VECTOR);
  }

  var heapNodes = {};

  graph.forEachVertex(function(x, y, z){
    if (!heapNodes[x]){
      heapNodes[x] = {};
    }

    if (!heapNodes[x][y]){
      heapNodes[x][y] = {};
    }

    if (!heapNodes[x][y][z]){
      heapNodes[x][y][z] = { priority: 0, parent: null, next: null };
    }
  });

  this.heapNodes = heapNodes;
  this.path = path;
  this.graph = graph;
  this.heap = new MinHeap(graph.totalVertexCount);
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


export { AStar };
