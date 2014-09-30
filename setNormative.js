CssTest.prototype.setNormative = function(){
  return this._setNormative(this.extractStyles());
};

// Private method for setting normative to something other than current styles
CssTest.prototype._setNormative = function(value){
  var insertData = {
    _id: Random.id(),
    testCase: this._id,
    owner: this.owner,
    timestamp: Date.now(),
    value: value
  };

  CssNormatives.insert(insertData);
  this._update({hasNormative: true});
  this.getThumbnail({forceRefresh: true});

  return insertData;
};
