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
    expect(path1.jumpDescriptors).to.eql([]);
    expect(path1.length).to.eql(0);
    expect(path1.options).to.eql({ loop: true });

    expect(path2.index).to.eql(0);
    expect(path2.loop).to.eql(false);
    expect(path2.rewind).to.eql(true);
    expect(path2.isRewinding).to.eql(false);
    expect(path2.isFinished).to.eql(false);
    expect(path2.waypoints).to.eql([]);
    expect(path2.jumpDescriptors).to.eql([]);
    expect(path2.length).to.eql(0);
    expect(path2.options).to.eql({ rewind: true });

    expect(path3.index).to.eql(0);
    expect(path3.loop).to.eql(false);
    expect(path3.rewind).to.eql(false);
    expect(path3.isRewinding).to.eql(false);
    expect(path3.isFinished).to.eql(false);
    expect(path3.waypoints).to.eql([]);
    expect(path3.jumpDescriptors).to.eql([]);
    expect(path3.length).to.eql(0);
    expect(path3.options).to.eql({});

    expect(path4.index).to.eql(0);
    expect(path4.loop).to.eql(false);
    expect(path4.rewind).to.eql(false);
    expect(path4.isRewinding).to.eql(false);
    expect(path4.isFinished).to.eql(false);
    expect(path4.waypoints).to.eql([new Kompute.Vector3D(), new Kompute.Vector3D(), new Kompute.Vector3D()]);
    expect(path4.jumpDescriptors).to.eql([null, null, null]);
    expect(path4.length).to.eql(0);
    expect(path4.options).to.eql({ fixedLength: 3 });
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
    expect(path.length).to.eql(1);
    expect(path.waypoints).to.eql([vp1, new Kompute.Vector3D(), new Kompute.Vector3D()]);

    path.insertWaypoint(vp2);
    expect(path.length).to.eql(2);
    expect(path.waypoints).to.eql([vp1, vp2, new Kompute.Vector3D()]);

    path.insertWaypoint(vp3);
    expect(path.length).to.eql(3);
    expect(path.waypoints).to.eql([vp1, vp2, vp3]);
  });

  it("should insert jump descriptor", function(){

    var vp1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
    var vp3 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());

    var path = new Kompute.Path({ fixedLength: 3 });

    path.insertWaypoint(vp1);
    path.insertWaypoint(vp2);
    path.insertWaypoint(vp3);

    var jd1 = new Kompute.JumpDescriptor({
      takeoffPosition: vp1, landingPosition: vp2,
      takeoffPositionSatisfactionRadius: 100
    });

    var jd2 = new Kompute.JumpDescriptor({
      takeoffPosition: vp2, landingPosition: vp3,
      takeoffPositionSatisfactionRadius: 100
    });

    path.insertJumpDescriptor(jd1);
    expect(path.jumpDescriptorLength).to.eql(1);
    expect(path.jumpDescriptors).to.eql([jd1, null, null]);

    path.insertJumpDescriptor(jd2);
    expect(path.jumpDescriptorLength).to.eql(2);
    expect(path.jumpDescriptors).to.eql([jd1, jd2, null]);
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

  it("should get index of waypoint", function(){

    var path = new Kompute.Path({});

    var wp1 = new Kompute.Vector3D(100, 200, 300);
    var wp2 = new Kompute.Vector3D(300, 400, 500);
    var wp3 = new Kompute.Vector3D(600, 700, 800);

    path.addWaypoint(wp1);
    path.addWaypoint(wp3);

    expect(path.getWaypointIndex(wp1)).to.eql(0);
    expect(path.getWaypointIndex(wp3)).to.eql(1);
    expect(path.getWaypointIndex(wp2)).to.eql(null);

    path = new Kompute.Path({ fixedLength: 10 });

    path.insertWaypoint(wp1);
    path.insertWaypoint(wp2);
    path.insertWaypoint(wp3);

    expect(path.getWaypointIndex(wp1)).to.eql(0);
    expect(path.getWaypointIndex(wp2)).to.eql(1);
    expect(path.getWaypointIndex(wp3)).to.eql(2);
    expect(path.getWaypointIndex(new Kompute.Vector3D())).to.eql(null);
  });

  it("should add jump jumpDescriptor", function(){

    var path = new Kompute.Path({});

    var wp1 = new Kompute.Vector3D(100, 200, 300);
    var wp2 = new Kompute.Vector3D(300, 400, 500);
    var wp3 = new Kompute.Vector3D(600, 700, 800);

    path.addWaypoint(wp1);
    path.addWaypoint(wp2);
    path.addWaypoint(wp3);

    var jumpDescriptor1 = new Kompute.JumpDescriptor({
      takeoffPosition: wp1, landingPosition: wp2,
      takeoffPositionSatisfactionRadius: 100
    });

    var jumpDescriptor2 = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(500, 500, 500), landingPosition: wp2,
      takeoffPositionSatisfactionRadius: 100
    });

    var jumpDescriptor3 = new Kompute.JumpDescriptor({
      takeoffPosition: wp1, landingPosition: new Kompute.Vector3D(500, 500, 500),
      takeoffPositionSatisfactionRadius: 100
    });

    var jumpDescriptor4 = new Kompute.JumpDescriptor({
      takeoffPosition: wp2, landingPosition: wp1,
      takeoffPositionSatisfactionRadius: 100
    });

    expect(path.addJumpDescriptor(jumpDescriptor1)).to.eql(true);
    expect(path.addJumpDescriptor(jumpDescriptor2)).to.eql(false);
    expect(path.addJumpDescriptor(jumpDescriptor3)).to.eql(false);
    expect(path.addJumpDescriptor(jumpDescriptor4)).to.eql(false);

    expect(path.jumpDescriptors).to.eql([jumpDescriptor1]);
  });

  it("should restart", function(){

    var path = new Kompute.Path();

    for (var i = 0; i < 5; i ++){
      path.addWaypoint(new Kompute.Vector3D(Math.random(), Math.random(), Math.random()));
    }

    while (!path.isFinished){
      path.next();
    }

    expect(path.isFinished).to.eql(true);

    expect(path.index).not.to.eql(0);

    path.restart();

    expect(path.index).to.eql(0);

    for (var i = 0; i < 5; i ++){
      expect(path.isFinished).to.eql(false);
      path.next();
    }

    expect(path.isFinished).to.eql(true);
    expect(path.index).to.eql(5);
  });

  it("should clone", function(){

    var path = new Kompute.Path();

    for (var i = 0; i < 5; i ++){
      path.addWaypoint(new Kompute.Vector3D(Math.random(), Math.random(), Math.random()));
    }

    var cloned = path.clone();

    expect(cloned).to.eql(path);
    expect(cloned).not.to.equal(path);

    path = new Kompute.Path({ fixedLength: 10 });
    path.insertWaypoint(new Kompute.Vector3D());

    cloned = path.clone();

    expect(cloned).to.eql(path);
    expect(cloned).not.to.equal(path);

    path = new Kompute.Path();
    path.addWaypoint(new Kompute.Vector3D(0, 10, 20));
    path.addWaypoint(new Kompute.Vector3D(20, 40, 50));

    var jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(0, 10, 20), landingPosition: new Kompute.Vector3D(20, 40, 50),
      takeoffPositionSatisfactionRadius: 100
    });

    path.insertJumpDescriptor(jumpDescriptor);

    cloned = path.clone();

    expect(cloned).to.eql(path);
    expect(cloned).not.to.equal(path);

    path = new Kompute.Path();
    path.addWaypoint(new Kompute.Vector3D(0, 10, 20));
    path.addWaypoint(new Kompute.Vector3D(20, 40, 50));

    jumpDescriptor = new Kompute.JumpDescriptor({
      takeoffPosition: new Kompute.Vector3D(0, 10, 20), landingPosition: new Kompute.Vector3D(20, 40, 50),
      takeoffPositionSatisfactionRadius: 100
    });

    path.addJumpDescriptor(jumpDescriptor);

    cloned = path.clone();
    expect(cloned.jumpDescriptorLength).to.eql(1);
    expect(cloned.jumpDescriptors).to.eql([jumpDescriptor]);

    path = new Kompute.Path({ fixedLength: 3 });
    path.insertWaypoint(new Kompute.Vector3D(0, 10, 20));
    path.insertWaypoint(new Kompute.Vector3D(20, 40, 50));

    path.insertJumpDescriptor(jumpDescriptor);

    cloned = path.clone();
    expect(cloned.jumpDescriptorLength).to.eql(1);
    expect(cloned.jumpDescriptors).to.eql([jumpDescriptor, null, null]);
  });
});
