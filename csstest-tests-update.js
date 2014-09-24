
testAsyncMulti('CssTest - Update - Instance values', [
  function(test, expect){
    var updateValues = {
      title: 'Updated'
    };

    var instance;
    var instanceCallback = function(error, result){
      instance = result;
      instance.update(updateValues, updateCallback);
    };

    var updateCallback = expect(function(error, result){
      if(error){
        throw error;
      };

      _.each(updateValues, function(val, key){
        test.equal(instance[key], val);
      });

      if(Meteor.isServer){
        var doc = CssTests.findOne(instance._id);
        _.each(updateValues, function(val, key){
          test.equal(doc[key], val);
        });
      };

      // Clean up
      instance.remove()
    });

    ServerObject('CssTest', newTest, instanceCallback);
  }
]);

testAsyncMulti('CssTest - Update - Special Cases', [
  function(test, expect){
  }
]);
