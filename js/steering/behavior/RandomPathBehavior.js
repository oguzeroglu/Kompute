import { PathFollowingBehavior } from "./PathFollowingBehavior";
import { AStar } from "../../core/AStar";
import { Vector3D } from "../../core/Vector3D";
import { logger } from "../../debug/Logger";

var LOGGER_COMPONENT_NAME = "RandomPathBehavior";
var LOG_PATH_CONSTRUCTED = "Path constructed.";
var LOG_FOLLOWING_PATH = "Following path.";

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

RandomPathBehavior.prototype.constructPath = function(steerable){

  var iterate = true;
  var aStar = this.aStar;
  var graph = aStar.graph;

  while (iterate){
    var startPoint = graph.findClosestVertexToPoint(steerable.position);
    if (!startPoint){
      startPoint = this.getRandomWaypoint();
    }
    var endPoint = this.getRandomWaypoint();

    var path = aStar.findShortestPath(startPoint, endPoint);

    iterate = !path;
  }

  this.isPathConstructed = true;
}

RandomPathBehavior.prototype.compute = function(steerable){
  if (!this.isPathConstructed){
    logger.log(LOGGER_COMPONENT_NAME, LOG_PATH_CONSTRUCTED);
    this.constructPath(steerable);
  }

  logger.log(LOGGER_COMPONENT_NAME, LOG_FOLLOWING_PATH);

  return PathFollowingBehavior.prototype.compute.call(this, steerable);
}

Object.defineProperty(RandomPathBehavior.prototype, 'constructor', { value: RandomPathBehavior,  enumerable: false, writable: true });
export { RandomPathBehavior };
