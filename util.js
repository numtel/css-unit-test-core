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
//   args.unshift('--debug=true');
  var command = shell.spawn(phantomjs.path, args);
  var output = '';

  command.stdout.on('data', Meteor.bindEnvironment(function(data){
    data = String(data);
    if(data.substr(20,7) === '[DEBUG]'){
      console.log(data);
    }else{
      output+=data + '\n';
    };
  }));

  command.stderr.on('data', Meteor.bindEnvironment(function(data){
    data = String(data);
    if(data.substr(20,7) === '[DEBUG]'){
      console.log(data);
    }else{
      output+=data + '\n';
    };
  }));

  command.on('exit', Meteor.bindEnvironment(function(code) {
    Meteor.setTimeout(function(){
      if(code !== 0){
        fut.throw(new Meteor.Error(400, output.trim()));
      }else{
        fut.return(output.trim());
      };
    }, 100);
  }));
  return fut.wait();
};
