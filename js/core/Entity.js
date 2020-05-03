var Entity = function(id, center, size){
  this.id = id;
  this.size = size;
  this.position = center.clone();

  this.nearbyObject = null;
}

Entity.prototype.setPosition = function(position){
  this.position.copy(position);

  if (this.world){
    this.world.updateEntity(this, this.position, this.size);
  }
}

export { Entity };
