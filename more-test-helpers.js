// Test Helper - Feed multiple different data objects into one function
//               from within a testAsyncMulti([]) helper
//               f = function(test, data, done){...}
//               Call done() when complete. 
//               Trials run sequentially
multipleData = function(test, expect, data, f){
  var context = this;
  var returnCount = 0;
  var allDone = expect(function(){});
  var done = function(){
    returnCount++;
    if(returnCount === data.length){
      allDone();
    }else{
      f.call(context, test, data[returnCount], done);
    };
  };
  f.call(context, test, data[returnCount], done);
};

