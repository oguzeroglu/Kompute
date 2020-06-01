var Edge = function(fromVertex, toVertex){
  this.fromVertex = fromVertex.clone();
  this.toVertex = toVertex.clone();
  this.cost = fromVertex.clone().sub(toVertex).getLength();

  this.jumpDescriptor = null;
}

Edge.prototype.clone = function(){
  return new Edge(this.fromVertex, this.toVertex);
}

export { Edge };
