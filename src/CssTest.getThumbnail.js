CssTest.prototype.getThumbnail = function(options){
  var that = this;
  var fs = Npm.require('fs');
  var fut = new Future();

  options = _.defaults(options || {}, {
    width: 240,
    height: 180,
    forceRefresh: false
  });

  var thumbKey = '_thumbnail-' + options.width + 'x' + options.height;

  // Return cached image if available
  if(this[thumbKey] && !options.forceRefresh){
    return this[thumbKey];
  };

  // Render new image
  var htmlFile = 'testThumbnail-' + this._id + '-' + Random.id() + '.html';
  fs.writeFile(htmlFile, this.getHtml(), Meteor.bindEnvironment(function(err) {
    if(err){
      fut.throw(new Meteor.Error(500, 'Error writing HTML file'));
    }else{
      var result;
      try{
        result = phantomExec('render.js',
          [htmlFile, that.widthsArray[0], options.width, options.height]);
        result = String(result.trim());
        if(typeof result === 'string' && result.substr(0,10) !== 'data:image'){
          throw result;
        };
        var updates = {};
        updates[thumbKey] = result;
        that._update(updates);
      }catch(err){
        fut.throw(new Meteor.Error(400, err));
      }finally{
        // Delete buffer file
        fs.unlink(htmlFile);
      };
      if(!fut.isResolved()){
        fut.return(result);
      };
    };
  }));
  return fut.wait();
};
