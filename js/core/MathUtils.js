var MathUtils = function(){

}

MathUtils.prototype.clamp = function(val, min, max){
  return Math.max(min, Math.min(max, val));
}

export { MathUtils };
