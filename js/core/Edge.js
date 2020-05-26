var Edge = function(fromVertex, toVertex){
  this.fromVertex = fromVertex.clone();
  this.toVertex = toVertex.clone();
  this.cost = fromVertex.clone().sub(toVertex).getLength();
}

export { Edge };
