testAsyncMulti('CssTest - loadNormative - Default (latest normative)', [
  function(test, expect){
    var testData = _.clone(newTest);
    var instance, normative;
    var instanceCallback = function(error, result){
      test.isFalse(error);
      instance = result;
      instance.setNormative(setNormativeCallback);
    };
    var setNormativeCallback = function(error, result){
      if(error){
        throw error;
      };
      normative = result;
      instance.loadNormative(finalCallback);
    };
    var finalCallback = expect(function(error, result){
      test.isFalse(error);
      test.equal(result, normative);
      // Clean up
      instance.remove();
    });
    ServerObject('CssTest', testData, instanceCallback);
  }
]);

testAsyncMulti('CssTest - loadNormative - By Id (not latest normative)', [
  function(test, expect){
    var testData = _.clone(newTest);
    var instance, normatives = [];
    var instanceCallback = function(error, result){
      test.isFalse(error);
      instance = result;
      instance.setNormative(setNormativeCallback);
    };
    var setNormativeCallback = function(error, result){
      if(error){
        throw error;
      };
      normatives.push(result);
      instance.setNormative(setNormativeAgainCallback);
    };
    var setNormativeAgainCallback = function(error, result){
      if(error){
        throw error;
      };
      normatives.push(result);
      instance.loadNormative(normatives[0]._id, finalCallback);
    };
    var finalCallback = expect(function(error, result){
      if(error){
        throw error;
      };
      test.equal(result, normatives[0]);
      // Clean up
      instance.remove();
    });
    ServerObject('CssTest', testData, instanceCallback);
  }
]);

testAsyncMulti('CssTest - loadNormative - By Id (Not Found)', [
  function(test, expect){
    var testData = _.clone(newTest);
    var instance, normative;
    var instanceCallback = function(error, result){
      test.isFalse(error);
      instance = result;
      instance.setNormative(setNormativeCallback);
    };
    var setNormativeCallback = function(error, result){
      if(error){
        throw error;
      };
      normative = result;
      instance.loadNormative(normative._id + 'wrong', finalCallback);
    };
    var finalCallback = expect(function(error, result){
      if(error){
        throw error;
      };
      test.isUndefined(result);
      // Clean up
      instance.remove();
    });
    ServerObject('CssTest', testData, instanceCallback);
  }
]);

testAsyncMulti('CssTest - loadNormative - Latest (Not Found)', [
  function(test, expect){
    var testData = _.clone(newTest);
    var instance;
    var instanceCallback = function(error, result){
      test.isFalse(error);
      instance = result;
      instance.loadNormative(finalCallback);
    };
    var finalCallback = expect(function(error, result){
      if(error){
        throw error;
      };
      test.isUndefined(result);
      // Clean up
      instance.remove();
    });
    ServerObject('CssTest', testData, instanceCallback);
  }
]);
