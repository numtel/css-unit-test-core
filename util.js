Future = Npm.require('fibers/future');

flattenArray = function(a){
  a = _.map(a, _.clone);
  var b = [];
  a.forEach(function(item){
    if(item.children && item.children.length){
      var recursed = flattenArray(item.children);
      b = b.concat(recursed);
    };
    item.children = undefined;
  });
  return a.concat(b);
};

phantomExec = function(filename, args){
  // Run phantomjs with a file in the asset directory using the specified
  // args array.
  // Returns stdout or throws Meteor.Error()
  var fut = new Future();
  var phantomjs = Npm.require('phantomjs');
  var shell = Npm.require('child_process');
  args.unshift(assetDir + filename);
  var command = shell.spawn(phantomjs.path, args);

  command.stdout.on('data', function(data){
    fut.return(String(data));
  });

  command.stderr.on('data', function(data){
    fut.throw(new Meteor.Error(500, String(data)));
  });

  command.on('exit', function(code) {
    if(!fut.isResolved()){
      fut.throw(new Meteor.Error(500, 'PhantomJS Error: ' + code));
    };
  });
  return fut.wait();
};
