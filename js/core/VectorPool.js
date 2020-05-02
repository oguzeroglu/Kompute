import { Vector3D } from "./Vector3D";

var VectorPool = function(size){
  this.index = 0;

  this.vectors = [];
  for (var i = 0; i < size; i ++){
    this.vectors.push(new Vector3D());
  }
}

VectorPool.prototype.get = function(){
  var vect = this.vectors[this.index ++];
  if (this.index == this.vectors.length){
    this.index = 0;
  }
  return vect;
}

export { VectorPool };
