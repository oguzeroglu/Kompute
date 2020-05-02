var Entity = function(id, center, size){
  this.id = id;
  this.center = center;
  this.size = size;

  this.nearbyObject = null;

  this.position = this.center.clone();
}

Entity.prototype.assignNearbyObject = function(nearbyObj){
  this.nearbyObject = nearbyObj;
}

export { Entity };
