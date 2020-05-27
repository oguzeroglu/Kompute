var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Vertex", function(){

  it("should initialize", function(){

    var position = new Kompute.Vector3D(100, 200, 300);

    var vertex = new Kompute.Vertex(position);

    var box = new Kompute.Box(position, new Kompute.Vector3D(1, 1, 1));

    expect(vertex.id.startsWith("vertex#")).to.eql(true);
    expect(vertex.size).to.eql(new Kompute.Vector3D(1, 1, 1));
    expect(vertex.position).to.eql(position);
    expect(vertex.box).to.eql(box);
    expect(vertex.nearbyObject).to.eql(null);
  });
});
