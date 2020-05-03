import Nearby from "../third-party/Nearby";

var World = function(width, height, depth, binSize){
  this.nearby = new Nearby(width, height, depth, binSize);

  this.entititesByID = {};
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
}

World.prototype.updateEntity = function(entity, position, size){
  this.nearby.update(entity.nearbyObject, position.x, position.y, position.z, size.x, size.y, size.z);
}


export { World };
