import Nearby from "../third-party/Nearby";

var World = function(width, height, depth, binSize){
  this.nearby = new Nearby(width, height, depth, binSize);

  this.entititesByID = {};
}

World.prototype.getEntityByID = function(entityID){
  return this.entititesByID[entityID] || null;
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

  if (this.onEntityInserted){
    this.onEntityInserted(entity);
  }
}

World.prototype.updateEntity = function(entity, position, size){
  this.nearby.update(entity.nearbyObject, position.x, position.y, position.z, size.x, size.y, size.z);

  if (this.onEntityUpdated){
    this.onEntityUpdated(entity);
  }
}

World.prototype.removeEntity = function(entity){
  delete this.entititesByID[entity.id];
  this.nearby.delete(entity.nearbyObject);

  if (this.onEntityRemoved){
    this.onEntityRemoved(entity);
  }
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
