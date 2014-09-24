// Test Helper - Feed multiple different data objects into one function
//               function(test, data, done){...}
//               Call done() when complete. 
multipleData = function(test, expect, data, f){
  var context = this;
  var returnCount = 0;
  var allDone = expect(function(){});
  var done = function(){
    returnCount++;
    if(returnCount === data.length){
      allDone();
    };
  };
  data.forEach(function(current){
    f.call(context, test, data, done);
  });
};

