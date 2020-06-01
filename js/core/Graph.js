import { Edge } from "./Edge";
import { Vertex } from "./Vertex";
import { Vector3D } from "./Vector3D";

var Graph = function(){

  this.world = null

  this.connections = {};

  this.totalVertexCount = 0;

  this.vertexIDs = [];
}

Graph.prototype.clone = function(){
  var cloned = new Graph();

  this.forEachVertex(function(x, y, z){
    cloned.addVertex(new Vector3D(x, y, z));
  });

  this.forEachEdge(function(edge){
    cloned.addEdge(edge.fromVertex, edge.toVertex);
  });

  return cloned;
}

Graph.prototype.findClosestVertexToPoint = function(pointVector){

  var world = this.world;

  if (!world){
    return null;
  }

  var dist = Infinity, closest = null;

  var res = this.world.getNearbyObjects(pointVector);
  for (var obj of res){
    var entity = world.getEntityByID(obj.id);

    if ((entity instanceof Vertex) && entity.graph === this){

      var curDist = pointVector.getDistanceSq(entity.position);
      if (curDist < dist){
        closest = entity;
        dist = curDist;
      }
    }
  }

  if (closest){
    return closest.position;
  }

  return null;
}

Graph.prototype.addVertex = function(vertex){

  if (this.hasVertex(vertex)){
    return false;
  }

  var x = vertex.x;
  var y = vertex.y;
  var z = vertex.z;

  if (!this.connections[x]){
    this.connections[x] = {};
  }

  if (!this.connections[x][y]){
    this.connections[x][y] = {};
  }

  if (!this.connections[x][y][z]){
    this.connections[x][y][z] = [];
  }

  this.totalVertexCount ++;



  return true;
}

Graph.prototype.removeVertex = function(vertex){

  if (!this.hasVertex(vertex)){
    return false;
  }

  var x = vertex.x;
  var y = vertex.y;
  var z = vertex.z;

  delete this.connections[x][y][z];

  if (Object.keys(this.connections[x][y]).length == 0){
    delete this.connections[x][y];
  }

  if (Object.keys(this.connections[x]).length == 0){
    delete this.connections[x];
  }

  for (var x in this.connections){
    for (var y in this.connections[x]){
      for (var z in this.connections[x][y]){
        var ary = this.connections[x][y][z];
        var index = -1;
        for (var i = 0; i < ary.length; i ++){
          var edge = ary[i];
          var to = edge.toVertex;
          if (to.x == vertex.x && to.y == vertex.y && to.z == vertex.z){
            index = i;
            break;
          }
        }
        if (index != -1){
          ary.splice(index, 1);
          this.connections[x][y][z] = ary;
        }
      }
    }
  }

  this.totalVertexCount --;

  return true;
}

Graph.prototype.hasVertex = function(vertex){
  var x = vertex.x;
  var y = vertex.y;
  var z = vertex.z;

  return !!(this.connections[x] && this.connections[x][y] && this.connections[x][y][z]);
}

Graph.prototype.addEdge = function(fromVertex, toVertex){
  if (!this.hasVertex(fromVertex) || !this.hasVertex(toVertex)){
    return false;
  }

  var edges = this.connections[fromVertex.x][fromVertex.y][fromVertex.z];

  for (var i = 0; i < edges.length; i ++){
    var to = edges[i].toVertex;
    if (to.x == toVertex.x && to.y == toVertex.y && to.z == toVertex.z){
      return false;
    }
  }

  var edge = new Edge(fromVertex, toVertex);
  edges.push(edge);

  return true;
}

Graph.prototype.addJumpDescriptor = function(jumpDescriptor){
  var fromVertex = jumpDescriptor.takeoffPosition;
  var toVertex = jumpDescriptor.landingPosition;
  if (!this.hasVertex(fromVertex) || !this.hasVertex(toVertex)){
    return false;
  }

  var edges = this.connections[fromVertex.x][fromVertex.y][fromVertex.z];
  var edge = null;

  for (var i = 0; i < edges.length; i ++){
    var to = edges[i].toVertex;
    if (to.x == toVertex.x && to.y == toVertex.y && to.z == toVertex.z){
      edge = edges[i];
      break;
    }
  }

  if (edge){
    edge.jumpDescriptor = jumpDescriptor;
  }else{
    edge = new Edge(fromVertex, toVertex);
    edge.jumpDescriptor = jumpDescriptor;
    edges.push(edge);
  }

  return true;
}

Graph.prototype.removeEdge = function(fromVertex, toVertex){
  if (!this.hasVertex(fromVertex) || !this.hasVertex(toVertex)){
    return false;
  }

  var ary = this.connections[fromVertex.x][fromVertex.y][fromVertex.z];

  var index = -1;
  for (var i = 0; i < ary.length; i ++){
    var edge = ary[i];
    var to = edge.toVertex;
    if (to.x == toVertex.x && to.y == toVertex.y && to.z == toVertex.z){
      index = i;
      break;
    }
  }

  if (index == -1){
    return false;
  }

  ary.splice(index, 1);
  this.connections[fromVertex.x][fromVertex.y][fromVertex.z] = ary;

  return true;
}

Graph.prototype.forEachNeighbor = function(vertex, fn){
  if (!this.hasVertex(vertex)){
    return;
  }

  var ary = this.connections[vertex.x][vertex.y][vertex.z];

  for (var i = 0; i < ary.length; i ++){
    var edge = ary[i];
    fn(edge.toVertex, edge.cost);
  }
}

Graph.prototype.forEachVertex = function(fn){
  for (var x in this.connections){
    for (var y in this.connections[x]){
      for (var z in this.connections[x][y]){
        fn(parseFloat(x), parseFloat(y), parseFloat(z));
      }
    }
  }
}

Graph.prototype.forEachEdge = function(fn){
  for (var x in this.connections){
    for (var y in this.connections[x]){
      for (var z in this.connections[x][y]){
        var edges = this.connections[x][y][z];
        for (var i = 0; i < edges.length; i ++){
          fn(edges[i]);
        }
      }
    }
  }
}

export { Graph };
