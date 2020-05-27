import { Entity } from "./Entity";
import { Vector3D } from "./Vector3D";

var VERTEX_ENTITY_SIZE = new Vector3D(1, 1, 1);

var Vertex = function(positionVector){

  var position = positionVector.clone();

  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  Entity.call(this, 'vertex#' + uuid, position, VERTEX_ENTITY_SIZE);

  this.position = position;
}

Vertex.prototype = Object.create(Entity.prototype);

Object.defineProperty(Vertex.prototype, 'constructor', { value: Vertex,  enumerable: false, writable: true });
export { Vertex };
