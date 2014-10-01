// Call with no arguments to load latest normative
CssTest.prototype.loadNormative = function(id){
  var options = {
    sort: {timestamp: -1},
    limit: 1
  };
  var query = {testCase: this._id};
  if(id){
    query._id = id;
  };
  var result = CssNormatives.find(query, options).fetch();
  if(result.length > 0){
    return result[0];
  };
};
