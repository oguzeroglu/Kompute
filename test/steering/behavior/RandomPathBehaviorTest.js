var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("RandomPathBehavior", function(){

  it("should initialize", function(){
    var graph = new Kompute.Graph();
    graph.addVertex(new Kompute.Vector3D(100, 200, 300));
    graph.addVertex(new Kompute.Vector3D(400, 500, 600));

    var randomPathBehavior = new Kompute.RandomPathBehavior({ graph: graph, satisfactionRadius: 50 });

    expect(randomPathBehavior.result).to.eql(new Kompute.SteerResult());
    expect(randomPathBehavior.path).to.equal(randomPathBehavior.aStar.path);
    expect(randomPathBehavior.satisfactionRadius).to.eql(50);
    expect(randomPathBehavior.allVertices).to.eql([new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(400, 500, 600)]);
    expect(randomPathBehavior.isPathConstructed).to.eql(false);
  });

  it("should get random waypoint", function(){

    var graph = new Kompute.Graph();
    var randomPathBehavior = new Kompute.RandomPathBehavior({ graph: graph, satisfactionRadius: 50 });

    expect(randomPathBehavior.getRandomWaypoint()).to.eql(null);

    var allVerices = [
      new Kompute.Vector3D(100, 200, 300),
      new Kompute.Vector3D(400, 700, 1300),
      new Kompute.Vector3D(700, 500, -900),
      new Kompute.Vector3D(500, 400, 350),
      new Kompute.Vector3D(1000, -200, 100)
    ];

    for (var i = 0; i < allVerices.length; i ++){
      graph.addVertex(allVerices[i]);
    }

    randomPathBehavior = new Kompute.RandomPathBehavior({ graph: graph, satisfactionRadius: 50 });

    for (var i = 0; i < 1000; i ++){
      var wp = randomPathBehavior.getRandomWaypoint();
      expect(wp).not.to.eql(null);
      var found = allVerices.find(function(elem){
        return elem.x == wp.x && elem.y == wp.y && elem.z == wp.z
      });
      expect(found).to.eql(wp);
    }
  });

  it("should constructPath path", function(){

    var graph = new Kompute.Graph();

    graph.addVertex(new Kompute.Vector3D(100, 100, 100));
    graph.addVertex(new Kompute.Vector3D(200, 200, 200));
    graph.addEdge(new Kompute.Vector3D(100, 100, 100), new Kompute.Vector3D(200, 200, 200));

    var randomPathBehavior = new Kompute.RandomPathBehavior({ graph: graph, satisfactionRadius: 50 });

    expect(randomPathBehavior.aStar.path.length > 0).to.eql(false);
    expect(randomPathBehavior.isPathConstructed).to.eql(false);

    randomPathBehavior.constructPath({ position: new Kompute.Vector3D() });

    expect(randomPathBehavior.aStar.path.length > 0).to.eql(true);
    expect(randomPathBehavior.isPathConstructed).to.eql(true);
  });

  it("should hook into path finish", function(){

    var graph = new Kompute.Graph();

    graph.addVertex(new Kompute.Vector3D(100, 100, 100));
    graph.addVertex(new Kompute.Vector3D(200, 200, 200));
    graph.addEdge(new Kompute.Vector3D(100, 100, 100), new Kompute.Vector3D(200, 200, 200));

    var randomPathBehavior = new Kompute.RandomPathBehavior({ graph: graph, satisfactionRadius: 50 });

    randomPathBehavior.constructPath({ position: new Kompute.Vector3D() });

    expect(randomPathBehavior.isPathConstructed).to.eql(true);

    var path = randomPathBehavior.aStar.path;

    expect(path.isFinished).to.eql(false);

    while (!path.isFinished){
      path.next();
    }

    expect(randomPathBehavior.isPathConstructed).to.eql(false);
  });

  it("should construct path on compute if not constructed", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    var graph = new Kompute.Graph();
    graph.addVertex(new Kompute.Vector3D(100, 200, 300));
    graph.addVertex(new Kompute.Vector3D(400, 500, 600));
    graph.addEdge(new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(400, 500, 600));

    var randomPathBehavior = new Kompute.RandomPathBehavior({ graph: graph, satisfactionRadius: 50 });

    var path = randomPathBehavior.aStar.path;

    expect(path.length > 0).to.eql(false);

    randomPathBehavior.compute(steerable);

    expect(path.length > 0).to.eql(true);
  });

  it("should compute", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var steerable2 = new Kompute.Steerable("steerable2", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));

    steerable.maxAcceleration = 100;
    steerable.maxSpeed = 100;
    steerable2.maxAcceleration = 100;
    steerable2.maxSpeed = 100;

    var graph = new Kompute.Graph();
    graph.addVertex(new Kompute.Vector3D(100, 200, 300));
    graph.addVertex(new Kompute.Vector3D(400, 500, 600));
    graph.addEdge(new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(400, 500, 600));

    var randomPathBehavior = new Kompute.RandomPathBehavior({ graph: graph, satisfactionRadius: 50 });

    randomPathBehavior.constructPath(steerable);

    var pathFollowingBehavior = new Kompute.PathFollowingBehavior({ path: randomPathBehavior.aStar.path, satisfactionRadius: 50 });

    expect(randomPathBehavior.compute(steerable)).to.eql(pathFollowingBehavior.compute(steerable2));
  });
});
