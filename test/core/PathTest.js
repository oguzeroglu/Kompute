var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Path", function(){

  it("should initialize", function(){

    var path1 = new Kompute.Path({ loop: true });
    var path2 = new Kompute.Path({ rewind: true });
    var path3 = new Kompute.Path();
    var path4 = new Kompute.Path({ fixedLength: 3 });

    expect(path1.index).to.eql(0);
    expect(path1.loop).to.eql(true);
    expect(path1.rewind).to.eql(false);
    expect(path1.isRewinding).to.eql(false);
    expect(path1.isFinished).to.eql(false);
    expect(path1.waypoints).to.eql([]);
    expect(path1.length).to.eql(0);

    expect(path2.index).to.eql(0);
    expect(path2.loop).to.eql(false);
    expect(path2.rewind).to.eql(true);
    expect(path2.isRewinding).to.eql(false);
    expect(path2.isFinished).to.eql(false);
    expect(path2.waypoints).to.eql([]);
    expect(path2.length).to.eql(0);

    expect(path3.index).to.eql(0);
    expect(path3.loop).to.eql(false);
    expect(path3.rewind).to.eql(false);
    expect(path3.isRewinding).to.eql(false);
    expect(path3.isFinished).to.eql(false);
    expect(path3.waypoints).to.eql([]);
    expect(path3.length).to.eql(0);

    expect(path4.index).to.eql(0);
    expect(path4.loop).to.eql(false);
    expect(path4.rewind).to.eql(false);
    expect(path4.isRewinding).to.eql(false);
    expect(path4.isFinished).to.eql(false);
    expect(path4.waypoints).to.eql([new Kompute.Vector3D(), new Kompute.Vector3D(), new Kompute.Vector3D()]);
    expect(path4.length).to.eql(0);
  });

  it("should add waypoint", function(){

    var vp1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp3 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());

    var path = new Kompute.Path();

    path.addWaypoint(vp1);
    path.addWaypoint(vp2);
    path.addWaypoint(vp3);

    expect(path.waypoints).to.eql([vp1, vp2, vp3]);
  });

  it("should insert waypoint", function(){

    var vp1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp3 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());

    var path = new Kompute.Path({ fixedLength: 3 });

    path.insertWaypoint(vp1);
    path.insertWaypoint(vp2);
    path.insertWaypoint(vp3);

    expect(path.waypoints).to.eql([vp1, vp2, vp3]);
    expect(path.length).to.eql(3);
  });

  it("should get current waypoint", function(){
    var vp1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());

    var path = new Kompute.Path();
    var path2 = new Kompute.Path();
    var path3 = new Kompute.Path();

    path.addWaypoint(vp1);
    path3.addWaypoint(vp1);
    path3.isFinished = true;

    expect(path.getCurrentWaypoint()).to.eql(vp1);
    expect(path2.getCurrentWaypoint()).to.eql(false);
    expect(path3.getCurrentWaypoint()).to.eql(false);
  });

  it("should get next [loop=false, rewind=false]", function(){

    var vp1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp3 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());

    var path = new Kompute.Path();

    path.addWaypoint(vp1);
    path.addWaypoint(vp2);
    path.addWaypoint(vp3);

    expect(path.getCurrentWaypoint()).to.eql(vp1);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp2);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp3);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(false);
    expect(path.isFinished).to.eql(true);
  });

  it("should get next [loop=true, rewind = false]", function(){
    var vp1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp3 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());

    var path = new Kompute.Path({ loop: true });

    path.addWaypoint(vp1);
    path.addWaypoint(vp2);
    path.addWaypoint(vp3);

    expect(path.getCurrentWaypoint()).to.eql(vp1);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp2);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp3);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp1);
    expect(path.isFinished).to.eql(false);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp2);
  });

  it("should get next [loop=false, rewind = true]", function(){
    var vp1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp3 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());

    var path = new Kompute.Path({ rewind: true });

    path.addWaypoint(vp1);
    path.addWaypoint(vp2);
    path.addWaypoint(vp3);

    expect(path.getCurrentWaypoint()).to.eql(vp1);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp2);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp3);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp2);
    expect(path.isFinished).to.eql(false);
    expect(path.isRewinding).to.eql(true);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp1);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(false);
    expect(path.isFinished).to.eql(true);
  });

  it("should get next [loop=true, rewind = true]", function(){
    var vp1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp3 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());

    var path = new Kompute.Path({ loop: true, rewind: true });

    path.addWaypoint(vp1);
    path.addWaypoint(vp2);
    path.addWaypoint(vp3);

    expect(path.getCurrentWaypoint()).to.eql(vp1);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp2);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp3);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp2);
    expect(path.isFinished).to.eql(false);
    expect(path.isRewinding).to.eql(true);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp1);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp2);
    expect(path.isFinished).to.eql(false);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp3);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp2);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp1);
    path.next();
    expect(path.getCurrentWaypoint()).to.eql(vp2);
  });

  it("should get random waypoint", function(){
    var vp1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp3 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());

    var path = new Kompute.Path({});

    path.addWaypoint(vp1);
    path.addWaypoint(vp2);
    path.addWaypoint(vp3);

    for (var i = 0; i < 1000; i ++){
      var vp = path.getRandomWaypoint();
      expect(vp.eql(vp1) || vp.eql(vp2) || vp.eql(vp3)).to.eql(true);
    }
  });

  it("should return null to getRandomWaypoint if no waypoint added", function(){
    var path = new Kompute.Path({});
    expect(path.getRandomWaypoint()).to.eql(null);
  });

  it("should execute finishCallback when finished", function(){
    var path = new Kompute.Path({});

    path.addWaypoint(new Kompute.Vector3D(Math.random(), Math.random(), Math.random()));
    path.addWaypoint(new Kompute.Vector3D(Math.random(), Math.random(), Math.random()));
    path.addWaypoint(new Kompute.Vector3D(Math.random(), Math.random(), Math.random()));

    var called = false;
    path.finishCallback = function(){
      called = true;
    };

    path.next();
    expect(called).to.eql(false);
    path.next();
    expect(called).to.eql(false);
    path.next();
    expect(called).to.eql(true);
    called = false;
    path.next();
    expect(called).to.eql(false);

    path = new Kompute.Path({ loop: true });

    path.addWaypoint(new Kompute.Vector3D(Math.random(), Math.random(), Math.random()));
    path.addWaypoint(new Kompute.Vector3D(Math.random(), Math.random(), Math.random()));
    path.addWaypoint(new Kompute.Vector3D(Math.random(), Math.random(), Math.random()));

    path.next();
    expect(called).to.eql(false);
    path.next();
    expect(called).to.eql(false);
    path.next();
    expect(called).to.eql(false);
  });
});
