CssTest.prototype.setNormative = function(){
  return this._setNormative(this.extractStyles());
};

// Private method for setting normative to something other than current styles
CssTest.prototype._setNormative = function(value){
  var that = this;
  var insertData = {
    _id: Random.id(),
    testCase: this._id,
    owner: this.owner,
    timestamp: Date.now(),
    value: value
  };

  var fut = new Future();
  CssNormatives.insert(insertData, function(error){
    if(error){
      fut.throw(new Meteor.Error(500, error));
    };
    that._update({hasNormative: true});
    that.getThumbnail({forceRefresh: true});

    fut.return(insertData);
  });
  return fut.wait();
};
