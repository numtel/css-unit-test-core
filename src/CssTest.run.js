var compareStyles = function(a, b){
  var filterRules = [];
  var failures = [];

  // Do this without recursion
  a=flattenArray(a);
  b=flattenArray(b);

  if(a.length !== b.length){
    throw new Meteor.Error(400, 'Fixture changed! New normative needed!');
  };

  for(var i = 0; i<a.length; i++){
    if(!a[i].ignore){
      _.each(a[i].attributes, function(aVal, key){
        var skip;
        filterRules.forEach(function(rule){
          if(rule.test(key)){
            skip = true;
          };
        });
        if(skip){
          return;
        };
        var bVal = b[i].attributes[key];
        if(bVal !== aVal){
          failures.push({
            'selector': a[i].selector,
            'key': key,
            'aVal': aVal,
            'bVal': bVal,
            'aRules': a[i].rules,
            'bRules': b[i].rules
          });
        };
      });
    };
  };
  return failures;
};

CssTest.prototype.run = function(){
  var that = this;
  var normative = this.loadNormative();
  if(!this.hasNormative || normative === undefined){
    throw new Meteor.Error(400, 'No normative exists!');
  };
  var current = this.extractStyles();
  var failures = {};
  _.each(current, function(viewStyles, viewWidth){
    if(normative.value[viewWidth] === undefined){
      throw new Meteor.Error(400, 'Normative widths mismatch! New normative required.');
    };
    failures[viewWidth] = compareStyles(normative.value[viewWidth], viewStyles);
  });
  
  var totalFailures = 0;
  _.each(failures, function(viewFailures, viewWidth){
    totalFailures += viewFailures.length;
  });
  var report = {
    time: new Date(), 
    passed: totalFailures === 0,
    _id: Random.id(),
    normative: normative._id,
    fixtureHtml: this.fixtureHtml,
    owner: this.owner,
    testCase: this._id,
    failures: failures
  };

  var fut = new Future();
  CssHistory.insert(report, function(error){
    if(error){
      fut.throw(new Meteor.Error(500, error));
    };
    var metaAttr = {
      lastPassed: report.passed,
      lastRun: Date.now()
    };
    if(that.interval){
      metaAttr.nextRun = metaAttr.lastRun + (parseInt(that.interval, 10) * 1000 * 60);
    };
    that._update(metaAttr);

    fut.return(report);
  });
  return fut.wait();
};


