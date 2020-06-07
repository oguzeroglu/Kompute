var expect = require('expect.js');
var Kompute = require("../../../build/Kompute");

describe("SeekBehavior", function(){

  var loggedMsg;

  beforeEach(function(){
    loggedMsg = null;
    Kompute.logger.logMethod = function(msg){
      if (loggedMsg != null){
        return;
      }
      loggedMsg = msg;
    }
  });

  afterEach(function(){
    Kompute.logger.logMethod = console.log;
    Kompute.logger.disable();
  });

  it("should initialize", function(){

    var seekBehavior = new Kompute.SeekBehavior();

    expect(seekBehavior.result).to.eql(new Kompute.SteerResult());
  });

  it("should not request acceleration if steerable has no target position", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var seekBehavior = new Kompute.SeekBehavior();

    Kompute.logger.enable();

    expect(seekBehavior.compute(steerable).linear).to.eql(new Kompute.Vector3D());
    expect(loggedMsg).to.eql("[SeekBehavior]: No target position. (steerable1)");
  });

  it("should compute", function(){

    var steerable = new Kompute.Steerable("steerable1", new Kompute.Vector3D(), new Kompute.Vector3D(10, 10, 10));
    var seekBehavior = new Kompute.SeekBehavior();

    steerable.setTargetPosition(new Kompute.Vector3D(100, 200, 300));
    steerable.maxAcceleration = 100;

    Kompute.logger.enable();

    expect(seekBehavior.compute(steerable).linear.getLength()).to.eql(steerable.maxAcceleration);
    expect(loggedMsg).to.eql("[SeekBehavior]: Speeding up. (steerable1)");
  });
});
