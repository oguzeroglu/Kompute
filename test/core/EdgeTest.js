var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Edge", function(){

  it("should initialize", function(){

    var fromVertex = new Kompute.Vector3D(100, 200, 300);
    var toVertex = new Kompute.Vector3D(500, -100, 220);

    var edge = new Kompute.Edge(fromVertex, toVertex);

    expect(edge.fromVertex).to.eql(fromVertex);
    expect(edge.toVertex).to.eql(toVertex);
    expect(edge.cost).to.eql(fromVertex.clone().sub(toVertex).getLength());
  });

  it("should clone", function(){
    var fromVertex = new Kompute.Vector3D(100, 200, 300);
    var toVertex = new Kompute.Vector3D(500, -100, 220);

    var edge = new Kompute.Edge(fromVertex, toVertex);

    var cloned = edge.clone();

    expect(edge).to.eql(cloned);
    expect(edge).not.to.equal(cloned);
  });
});
