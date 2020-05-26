var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("MinHeap", function(){

  it("should initialize", function(){

    var minHeap = new Kompute.MinHeap(5);

    expect(minHeap.data).to.eql([null, null, null, null, null]);
    expect(minHeap.length).to.eql(0);
  });

  it("should insert", function(){

    var minHeap = new Kompute.MinHeap(9);

    var n1 = {priority: 1};
    var n2 = {priority: 2};
    var n3 = {priority: 3};
    var n4 = {priority: 17};
    var n5 = {priority: 19};
    var n6 = {priority: 36};
    var n7 = {priority: 7};
    var n8 = {priority: 25};

    var ary = [n1, n2, n3, n4, n5, n6, n7, n8].sort(function() {
      return 0.5 - Math.random();
    });

    for (var i = 0; i < ary.length; i ++){
      var res = minHeap.insert(ary[i]);
      expect(res).to.eql(true);
    }

    expect(minHeap.peek()).to.eql(n1);

    expect(minHeap.insert({priority: 0.1})).to.eql(true);
    expect(minHeap.peek()).to.eql({priority: 0.1});

    expect(minHeap.insert({priority: 0.001})).to.eql(false);
    expect(minHeap.peek()).to.eql({priority: 0.1});
  });

  it("should remove", function(){

    var minHeap = new Kompute.MinHeap(3);

    var n1 = {priority: 1};
    var n2 = {priority: 2};
    var n3 = {priority: 3};

    expect(minHeap.remove(n1)).to.eql(false);
    expect(minHeap.length).to.eql(0);

    minHeap.insert(n1);
    minHeap.insert(n2);
    minHeap.insert(n3);

    expect(minHeap.remove({priority: 4})).to.eql(false);
    expect(minHeap.length).to.eql(3);

    expect(minHeap.remove(n3)).to.eql(true);
    expect(minHeap.length).to.eql(2);
    expect(minHeap.data).to.eql([n1, n2, null]);

    expect(minHeap.remove(n1)).to.eql(true);
    expect(minHeap.length).to.eql(1);
    expect(minHeap.data).to.eql([n2, null, null]);

    expect(minHeap.remove(n2)).to.eql(true);
    expect(minHeap.length).to.eql(0);
    expect(minHeap.data).to.eql([null, null, null]);

    minHeap = new Kompute.MinHeap(4);
    var n4 = {priority: 4};
    minHeap.insert(n1);
    minHeap.insert(n2);
    minHeap.insert(n3);
    minHeap.insert(n4);

    expect(minHeap.data).to.eql([n1, n2, n3, n4]);
    minHeap.remove(n3);
    expect(minHeap.data).to.eql([n1, n2, n4, null]);

    minHeap.insert(n3);
    expect(minHeap.data).to.eql([n1, n2, n4, n3]);
    minHeap.remove(n2);
    expect(minHeap.data).to.eql([n1, n3, n4, null]);
    minHeap.insert(n2);
    expect(minHeap.data).to.eql([n1, n2, n4, n3]);
    minHeap.remove(n1);
    expect(minHeap.data).to.eql([n2, n3, n4, null]);
  });

  it("should do heap check", function(){

    var minHeap = new Kompute.MinHeap(0);

    minHeap.data = [{priority: 1}];
    expect(minHeap.heapCheck(0)).to.eql(minHeap.HEAP_CHECK_RESULT_OK);

    minHeap.data = [{priority: 1}, {priority: 2}];
    expect(minHeap.heapCheck(0)).to.eql(minHeap.HEAP_CHECK_RESULT_OK);

    minHeap.data = [{priority: 2}, {priority: 1}];
    expect(minHeap.heapCheck(0)).to.eql(minHeap.HEAP_CHECK_RESULT_LEFT);

    minHeap.data = [{priority: 1}, {priority: 2}, {priority: 3}];
    expect(minHeap.heapCheck(0)).to.eql(minHeap.HEAP_CHECK_RESULT_OK);

    minHeap.data = [{priority: 1}, {priority: 3}, {priority: 2}];
    expect(minHeap.heapCheck(0)).to.eql(minHeap.HEAP_CHECK_RESULT_OK);

    minHeap.data = [{priority: 2}, {priority: 1}, {priority: 3}];
    expect(minHeap.heapCheck(0)).to.eql(minHeap.HEAP_CHECK_RESULT_LEFT);

    minHeap.data = [{priority: 3}, {priority: 2}, {priority: 1}];
    expect(minHeap.heapCheck(0)).to.eql(minHeap.HEAP_CHECK_RESULT_RIGHT);

    minHeap.data = [{priority: 6}, {priority: 4}, {priority: 3}];
    expect(minHeap.heapCheck(0)).to.eql(minHeap.HEAP_CHECK_RESULT_RIGHT);
  });

  it("should swap", function(){
    var minHeap = new Kompute.MinHeap(0);

    minHeap.data = [{priority: 1}, {priority: 2}];

    minHeap.swap(0, 1);

    expect(minHeap.data).to.eql([{priority: 2}, {priority: 1}]);
  });

  it("should pop", function(){
    var minHeap = new Kompute.MinHeap(80);

    expect(minHeap.pop()).to.eql(false);

    minHeap.insert({priority: 1});
    expect(minHeap.pop()).to.eql({priority: 1});
    expect(minHeap.length).to.eql(0);


    minHeap.insert({priority: 1});
    minHeap.insert({priority: 2});
    expect(minHeap.pop()).to.eql({priority: 1});
    expect(minHeap.pop()).to.eql({priority: 2});

    minHeap.insert({priority: 3});
    minHeap.insert({priority: 2});
    minHeap.insert({priority: 1});
    expect(minHeap.pop()).to.eql({priority: 1});
    expect(minHeap.pop()).to.eql({priority: 2});
    expect(minHeap.pop()).to.eql({priority: 3});

    minHeap.insert({priority: 3});
    minHeap.insert({priority: 1});
    minHeap.insert({priority: 4});
    minHeap.insert({priority: 2});
    expect(minHeap.pop()).to.eql({priority: 1});
    expect(minHeap.pop()).to.eql({priority: 2});
    expect(minHeap.pop()).to.eql({priority: 3});
    expect(minHeap.pop()).to.eql({priority: 4});

    var n1 = {priority: 1};
    var n2 = {priority: 2};
    var n3 = {priority: 3};
    var n4 = {priority: 4};
    var n5 = {priority: 5};
    var n6 = {priority: 6};
    var n7 = {priority: 7};
    var n8 = {priority: 8};

    var ary = [n1, n2, n3, n4, n5, n6, n7, n8];
    var original = [];
    for (var i = 0; i < ary.length; i ++){
      original.push(ary[i]);
    }
    ary.sort(function() { return 0.5 - Math.random(); });

    for (var i = 0; i < ary.length; i ++){
      minHeap.insert(ary[i]);
    }

    for (var i = 0; i < ary.length; i ++){
      expect(minHeap.pop()).to.eql(original[i]);
    }
  });

  it("should check if node exists", function(){

    var minHeap = new Kompute.MinHeap(80);

    var n1 = {priority: 1};

    expect(minHeap.hasNode(n1)).to.eql(false);

    minHeap.insert(n1);

    expect(minHeap.hasNode(n1)).to.eql(true);
  });

  it("should reset", function(){
    var minHeap = new Kompute.MinHeap(2);

    var n1 = {priority: 1};
    var n2 = {priority: 2};
    minHeap.insert(n1);
    minHeap.insert(n2);

    expect(minHeap.data).not.to.eql([null, null]);
    expect(minHeap.length).not.to.eql(0);

    minHeap.reset();

    expect(minHeap.data).to.eql([null, null]);
    expect(minHeap.length).to.eql(0);
  });
});
