
testAsyncMulti('CssTest - Constructor - Create New', [
  function(test, expect){
    var instanceCallback = expect(function(error, instance){
      test.isFalse(error);
      // Ensure properties are set on instance
      _.each(newTest, function(val, key){
        test.equal(val, instance[key]);
      });

      // widthsArray population
      test.equal(instance.widthsArray.length, 2);
      test.equal(instance.widthsArray[0], 1024);
      test.equal(instance.widthsArray[1], 720);

      if(Meteor.isServer){
        var doc = CssTests.findOne(instance._id);
        _.each(newTest, function(val, key){
          test.equal(val, doc[key]);
        });
      };

      // Clean up
      instance.remove();
    });

    ServerObject('CssTest', newTest, instanceCallback);
  }
]);

testAsyncMulti('CssTest - Constructor - Remove', [
  function(test, expect){
    var instance;
    var instanceCallback = function(error, result){
      instance = result;
      test.isFalse(error);

      instance.remove(removeCallback);

      if(Meteor.isServer){
        var doc = CssTests.findOne(instance._id);
        test.equal(doc, undefined);
      };
    };

    var removeCallback = expect(function(error, result){
      test.isFalse(error);
      test.equal(instance.title, undefined);
    });

    ServerObject('CssTest', newTest, instanceCallback);
  }
]);

testAsyncMulti('CssTest - Constructor - Load from Id', [
  function(test, expect){
    var firstInstance;
    var firstCallback = function(error, instance){
      test.isFalse(error);
      firstInstance = instance;
      ServerObject('CssTest', instance._id, secondCallback);
    };

    var secondCallback = expect(function(error, instance){
      test.isFalse(error);
      _.each(newTest, function(val, key){
        test.equal(val, instance[key]);
      });

      instance.remove();
      firstInstance.remove();
    });

    ServerObject('CssTest', newTest, firstCallback);
  }
]);

testAsyncMulti('CssTest - Constructor - Invalid id', [
  function(test, expect){
    ServerObject('CssTest', 'invalidid', expect(function(error, instance){
      test.notEqual(error, undefined);
      test.equal(error.error, 404);
      test.equal(instance, undefined);
    }));
  }
]);

testAsyncMulti('CssTest - Constructor - Bad Data', [
  function(test, expect){
    var badData = [
      {title: '', widths: '1024'},
      {title: 'ok', widths: 'sadf'},
      {title: 'ok', widths: '1024', interval: 0}
    ];
    multipleData(test, expect, badData, function(test, data, done){
      ServerObject('CssTest', data, expect(function(error, instance){
        test.notEqual(error, undefined);
        test.equal(error.error, 406);
        test.equal(instance, undefined);
        done();
      }));
    });
  }
]);
