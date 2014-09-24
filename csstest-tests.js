
testAsyncMulti('CssTest - Crud - Create New', [
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

testAsyncMulti('CssTest - Crud - Create New (Errors)', [
  function(test, expect){
    var trials = [
      {title: '', widths: '1024', owner: userId},
      {title: 'ok', widths: 'sadf', owner: userId},
      {title: 'ok', widths: '1024', interval: 0, owner: userId}
    ];
    multipleData(test, expect, trials, function(test, data, done){
      ServerObject('CssTest', data, function(error, instance){
        test.equal(instance, undefined);
        test.notEqual(error, undefined);
        if(error){
          test.equal(error.error, 406);
        };
        done();
      });
    });
  }
]);

testAsyncMulti('CssTest - Crud - Load from Id', [
  function(test, expect){
    var firstInstance;
    var firstCallback = function(error, instance){
      test.isFalse(error);
      firstInstance = instance;
      if(instance){
        ServerObject('CssTest', instance._id, secondCallback);
      }else{
        secondCallback(error, undefined);
      };
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

testAsyncMulti('CssTest - Crud - Load from Id (Error)', [
  function(test, expect){
    ServerObject('CssTest', 'invalidid', expect(function(error, instance){
      test.notEqual(error, undefined);
      test.equal(error.error, 404);
      test.equal(instance, undefined);
    }));
  }
]);

testAsyncMulti('CssTest - Crud - Update', [
  function(test, expect){
    var trials = [
      {title: 'Cowabunga', description: 'Babaganoush'},
      {cssFiles: 'http://test2.com/test.css\nhttp://test3.com/sample1.css'},
      {interval: '', widths: '234,1290'},
      {interval: '4'}
    ];
    multipleData(test, expect, trials, function(test, data, done){
      var instance;
      var instanceCallback = function(error, result){
        test.isFalse(error);
        instance = result;
        if(!instance){
          done();
          return;
        };
        // Special Case: Must set nextRun in order to test that it is cleared
        if(data.interval === ''){
          instance.nextRun = 21093129;
        };
        instance.update(data, updateCallback);
      };

      var updateCallback = function(error, result){
        test.isFalse(error);

        // Check that data updates
        _.each(data, function(val, key){
          test.equal(instance[key], val);
        });

        // Check that widthsArray updates
        if(data.widths !== undefined){
          var expectedWidthsArray = data.widths.split(',').map(function(width){
            return parseInt(width.trim(), 10);
          });
          test.equal(_.difference(instance.widthsArray, expectedWidthsArray).length, 0);
        };

        // Check that hasNormative updates with select fields
        var updateNormative = ['widths'];
        updateNormative.forEach(function(updateField){
          if(data[updateField] !== undefined &&
             data[updateField] !== newTest[updateField]){
            test.equal(instance.hasNormative, false)
          };
        });

        // Check nextRun interval
        if(data.interval !== undefined){
          if(data.interval === ''){
            test.equal(instance.nextRun, undefined);
          }else{
            test.notEqual(instance.nextRun, undefined);
          }
        };
        instance.remove();
        done();
      };
      ServerObject('CssTest', newTest, instanceCallback);
    });
  }
]);

testAsyncMulti('CssTest - Crud - Update (Errors)', [
  function(test, expect){
    var trials = [
      {title: ''},
      {interval: '0'},
      {widths: '234ia,1290'}
    ];
    multipleData(test, expect, trials, function(test, data, done){
      var instance;
      var instanceCallback = function(error, result){
        test.isFalse(error);
        instance = result;
        if(!instance){
          done();
          return;
        };
        instance.update(data, updateCallback);
      };

      var updateCallback = function(error, result){
        test.notEqual(error, undefined);
        if(error){
          test.equal(error.error, 406);
        };
        test.isUndefined(result);
        done();
      };
      ServerObject('CssTest', newTest, instanceCallback);
    });
  }
]);

testAsyncMulti('CssTest - Crud - Remove', [
  function(test, expect){
    var instance;
    var instanceCallback = function(error, result){
      instance = result;
      test.isFalse(error);

      if(instance){
        instance.remove(removeCallback);
      }else{
        removeCallback(error);
      };

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
