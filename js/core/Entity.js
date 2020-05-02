import { Box } from "./Box";

var Entity = function(id, center, size){
  this.id = id;
  this.center = center;
  this.size = size;

  this.box = new Box(center, size);
}

export { Entity };
