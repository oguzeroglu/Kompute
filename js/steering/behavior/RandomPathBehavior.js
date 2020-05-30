import { PathFollowingBehavior } from "./PathFollowingBehavior";
import { AStar } from "../../core/AStar";
import { Vector3D } from "../../core/Vector3D";

var RandomPathBehavior = function(options){

  var graph = options.graph;
  var aStar = new AStar(graph);

  var allVertices = [];
  graph.forEachVertex(function(x, y, z){
    allVertices.push(new Vector3D(x, y, z));
  });

  PathFollowingBehavior.call(this, {
    path: aStar.path,
    satisfactionRadius: options.satisfactionRadius
  });

  this.aStar = aStar;
  this.allVertices = allVertices;
  this.isPathConstructed = false;

  aStar.path.finishCallback = function(){
    this.isPathConstructed = false;
  }.bind(this);
}

RandomPathBehavior.prototype = Object.create(PathFollowingBehavior.prototype);

RandomPathBehavior.prototype.getRandomWaypoint = function(){
  var allVertices = this.allVertices;
  return allVertices[Math.floor(Math.random() * allVertices.length)] || null;
}

RandomPathBehavior.prototype.constructPath = function(){

  var iterate = true;
  var aStar = this.aStar;
  var graph = aStar.graph;

  while (iterate){
    var startPoint = graph.findClosestVertexToPoint(this.steerable.position);
    if (!startPoint){
      startPoint = this.getRandomWaypoint();
    }
    var endPoint = this.getRandomWaypoint();

    var path = aStar.findShortestPath(startPoint, endPoint);

    iterate = !path;
  }

  this.isPathConstructed = true;
}

RandomPathBehavior.prototype.compute = function(){
  if (!this.isPathConstructed){
    this.constructPath();
  }

  return PathFollowingBehavior.prototype.compute.call(this);
}

Object.defineProperty(RandomPathBehavior.prototype, 'constructor', { value: RandomPathBehavior,  enumerable: false, writable: true });
export { RandomPathBehavior };
