import Nearby from "../third-party/Nearby";

var World = function(width, height, depth, binSize){
  this.nearby = new Nearby(width, height, depth, binSize);
}

export { World };
