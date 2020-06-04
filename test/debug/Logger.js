var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Logger", function(){

  afterEach(function(){
    Kompute.logger.logMethod = console.log;

    Kompute.logger.lastMessageMap = {};
  });

  it("should be already instanced", function(){

    var logger = Kompute.logger;

    expect(logger.logMethod).to.equal(console.log);
    expect(logger.isEnabled).to.eql(false);
    expect(logger.lastMessageMap).to.eql({});
  });

  it("should enable", function(){

    var logger = Kompute.logger;

    logger.enable();

    expect(logger.isEnabled).to.eql(true);
  });

  it("should disable", function(){
    var logger = Kompute.logger;

    logger.enable();
    logger.disable();

    expect(logger.isEnabled).to.eql(false);
  });

  it("should not log if not enabled", function(){
    var logger = Kompute.logger;

    var called = false;
    logger.logMethod = function(){
      called = true;
    };

    logger.log("testComponent", "testMessage");

    expect(called).to.eql(false);
  });

  it("should not log if message exists in lastMessageMap", function(){
    var logger = Kompute.logger;

    var called = false;
    logger.logMethod = function(){
      called = true;
    };

    logger.enable();
    logger.lastMessageMap = {
      testComponent: "testMessage"
    };

    logger.log("testComponent", "testMessage");

    expect(called).to.eql(false);
  });

  it("should log", function(){
    var logger = Kompute.logger;

    var param = null;
    logger.logMethod = function(msg){
      param = msg;
    };

    logger.enable();

    logger.log("testComponent", "testMessage");

    expect(param).to.eql("[testComponent]: testMessage");
    expect(logger.lastMessageMap).to.eql({ testComponent: "testMessage" });
  });
});
