import Nearby from "../third-party/Nearby";
import { Vector3D } from "./Vector3D";
import { Vertex } from "./Vertex";

var World = function(width, height, depth, binSize){

  this.width = width;
  this.height = height;
  this.depth = depth;

  this.nearby = new Nearby(width, height, depth, binSize);

  this.entititesByID = {};

  this.gravity = 0
}

World.prototype.setGravity = function(gravity){
  this.gravity = gravity;
}

World.prototype.getEntityByID = function(entityID){
  return this.entititesByID[entityID] || null;
}

World.prototype.insertGraph = function(graph){
  if (graph.world){
    return;
  }

  var self = this;

  graph.forEachVertex(function(x, y, z){
    var vertex = new Vertex(new Vector3D(x, y, z), graph);
    self.insertEntity(vertex);
    graph.vertexIDs.push(vertex.id);
  });

  graph.world = this;
}

World.prototype.removeGraph = function(graph){
  if (!graph.world){
    return;
  }

  for (var i = 0; i < graph.vertexIDs.length; i ++){
    var vertexID = graph.vertexIDs[i];
    var entity = this.getEntityByID(vertexID);
    this.removeEntity(entity);
  }

  graph.world = null;
  graph.vertexIDs = [];
}

World.prototype.hideEntity = function(entity){

  if (!this.entititesByID[entity.id] || entity.isHidden){
    return false;
  }

  this.nearby.delete(entity.nearbyObject);
  entity.isHidden = true;

  if (this.onEntityHidden){
    this.onEntityHidden(entity);
  }

  return true;
}

World.prototype.showEntity = function(entity){

  if (!this.entititesByID[entity.id] || !entity.isHidden){
    return false;
  }

  this.nearby.insert(entity.nearbyObject);
  entity.isHidden = false;

  if (this.onEntityShown){
    this.onEntityShown(entity);
  }

  return true;
}

World.prototype.insertEntity = function(entity){

  this.entititesByID[entity.id] = entity;

  var center = entity.position;
  var size = entity.size;

  var nearbyBox = this.nearby.createBox(center.x, center.y, center.z, size.x, size.y, size.z);
  var nearbyObj = this.nearby.createObject(entity.id, nearbyBox);
  this.nearby.insert(nearbyObj);

  entity.world = this;
  entity.nearbyObject = nearbyObj;

  entity.lastWorldPosition = center.clone();
  entity.lastWorldSize = size.clone();

  if (this.onEntityInserted){
    this.onEntityInserted(entity);
  }
}

World.prototype.updateEntity = function(entity, position, size){

  if (entity.isHidden){
    return;
  }

  if (entity.lastWorldPosition.eql(position) && entity.lastWorldSize.eql(size)){
    return;
  }

  this.nearby.update(entity.nearbyObject, position.x, position.y, position.z, size.x, size.y, size.z);

  if (this.onEntityUpdated){
    this.onEntityUpdated(entity);
  }

  entity.lastWorldPosition.copy(position);
  entity.lastWorldSize.copy(size);
}

World.prototype.onLookDirectionUpdated = function(entity){
  if (this.onEntityLookDirectionUpdated){
    this.onEntityLookDirectionUpdated(entity);
  }
}

World.prototype.removeEntity = function(entity){
  delete this.entititesByID[entity.id];
  this.nearby.delete(entity.nearbyObject);

  if (this.onEntityRemoved){
    this.onEntityRemoved(entity);
  }

  delete entity.lastWorldPosition;
  delete entity.lastWorldSize;
}

World.prototype.getNearbyObjects = function(position){
  return this.nearby.query(position.x, position.y, position.z).keys();
}

World.prototype.forEachEntity = function(func){
  for (var key in this.entititesByID){
    var entity = this.entititesByID[key];
    func(entity);
  }
}

export { World };
