var MinHeap = function(maxNodeCount){
  this.data = [];
  for (var i = 0; i < maxNodeCount; i ++){
    this.data.push(null);
  }

  this.length = 0;

  this.HEAP_CHECK_RESULT_OK = 0;
  this.HEAP_CHECK_RESULT_LEFT = 1;
  this.HEAP_CHECK_RESULT_RIGHT = 2;
}

MinHeap.prototype.peek = function(){
  return this.data[0];
}

MinHeap.prototype.getParentIndex = function(childIndex){
  return Math.floor(childIndex / 2);
}

MinHeap.prototype.getLeftChildIndex = function(rootIndex){
  return this.getRightChildIndex(rootIndex) - 1;
}

MinHeap.prototype.getRightChildIndex = function(rootIndex){
  return 2 * (rootIndex + 1);
}

MinHeap.prototype.insert = function(heapNode){

  if (this.data.length == this.length){
    return false;
  }

  var curNodeIndex = this.length;
  var curParentIndex = this.getParentIndex(this.length);

  this.data[curNodeIndex] = heapNode;

  var parent = this.data[curParentIndex];
  while(parent && heapNode.priority < parent.priority){
    this.data[curParentIndex] = heapNode;
    this.data[curNodeIndex] = parent;

    curNodeIndex = curParentIndex;
    curParentIndex = this.getParentIndex(curNodeIndex);
    parent = this.data[curParentIndex];
  }

  this.length ++;
  return true;
}

MinHeap.prototype.heapCheck = function(rootIndex){
  var root = this.data[rootIndex];

  if (!root){
    return this.HEAP_CHECK_RESULT_OK;
  }

  var leftIndex = this.getLeftChildIndex(rootIndex);
  var rightIndex = this.getRightChildIndex(rootIndex);

  var left = this.data[leftIndex];
  var right = this.data[rightIndex];
  if (!left && !right){
    return this.HEAP_CHECK_RESULT_OK;
  }else if (!right){
    if (root.priority <= left.priority){
      return this.HEAP_CHECK_RESULT_OK;
    }else{
      return this.HEAP_CHECK_RESULT_LEFT;
    }
  }

  if (root.priority <= left.priority && root.priority <= right.priority){
    return this.HEAP_CHECK_RESULT_OK;
  }

  if (left.priority <= root.priority && left.priority <= right.priority){
    return this.HEAP_CHECK_RESULT_LEFT;
  }

  return this.HEAP_CHECK_RESULT_RIGHT;
}

MinHeap.prototype.swap = function(index1, index2){
  var val1 = this.data[index1];
  var val2 = this.data[index2];

  this.data[index1] = val2;
  this.data[index2] = val1;
}

MinHeap.prototype.pop = function(){
  if (this.length == 0){
    return false;
  }

  var minData = this.data[0];

  var lastIndex = this.length - 1;
  this.data[0] = this.data[lastIndex];
  this.data[lastIndex] = null;
  this.length --;

  var rootIndex = 0;
  var heapCheckResult = this.heapCheck(rootIndex);
  while (heapCheckResult != this.HEAP_CHECK_RESULT_OK){
    if (heapCheckResult == this.HEAP_CHECK_RESULT_LEFT){
      var leftIndex = this.getLeftChildIndex(rootIndex);
      this.swap(rootIndex, leftIndex);
      rootIndex = leftIndex;
    }else{
      var rightIndex = this.getRightChildIndex(rootIndex);
      this.swap(rootIndex, rightIndex);
      rootIndex = rightIndex;
    }

    heapCheckResult = this.heapCheck(rootIndex);
  }

  return minData;
}

export { MinHeap };
