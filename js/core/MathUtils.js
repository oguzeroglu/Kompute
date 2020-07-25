import { VectorPool } from "./VectorPool";
import { Vector3D } from "./Vector3D";

var vectorPool = new VectorPool(10);

var MathUtils = function(){

}

MathUtils.prototype.clamp = function(val, min, max){
  return Math.max(min, Math.min(max, val));
}

MathUtils.prototype.uuidv4 = function(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export { MathUtils };
