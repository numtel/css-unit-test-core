CssTest.prototype.extractStyles = function(){
  var that = this;
  var fs = Npm.require('fs');
  var fut = new Future();

  var htmlFile = 'test-' + this._id + '-' + Random.id() + '.html';
  fs.writeFile(htmlFile, this.getHtml(), Meteor.bindEnvironment(function(err) {
    if(err){
      fut.throw(new Meteor.Error(500, 'Error writing HTML file'));
    }else{
      try{
        var result = phantomExec('extractStyles.js',
                                    [htmlFile, that.widthsArray.join(','), that.testUrl]);
        if(typeof result === 'string' && result.substr(0,1) !== '{'){
          throw result.trim();
        };
        var output = JSON.parse(result);
      }catch(err){
        fut.throw(new Meteor.Error(400, err));
      }finally{
        // Delete buffer file
        fs.unlink(htmlFile);
      };
      if(!fut.isResolved()){
        fut.return(output);
      };
    };
  }));
  return fut.wait();
};
