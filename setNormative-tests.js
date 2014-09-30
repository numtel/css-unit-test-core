if(Meteor.isClient){
  testAsyncMulti('CssTest - setNormative - Default', [
    function(test, expect){
      var instance;
      var testData = _.clone(newTest);
      // assetDir is only available on the server, except with method
      Meteor.call('CssTest/assetDir', function(error, result){
        // Slice off leading 'assets/' not required for client
        var assetDir = result.substr(7);

        // Prepare new test with mockup css file
        testData.remoteStyles = document.location.origin +
                                document.location.pathname +
                                assetDir +
                                'csstest-mockup.html';
        testData.testUrl = testData.remoteStyles;
        testData.cssFiles = '';

        ServerObject('CssTest', testData, instanceCallback);
      });
      var instanceCallback = function(error, result){
        test.isFalse(error);
        instance = result;
        instance.extractStyles(extractStylesCallback);
      };
      var styles;
      var extractStylesCallback = function(error, result){
        test.isFalse(error);
        styles = result;
        instance.setNormative(setNormativeCallback);
      };
      var setNormativeCallback = expect(function(error, result){
        test.isFalse(error);
        test.isTrue(_.isEqual(styles, result.value));
        test.equal(result.owner, instance.owner);
        test.equal(result._id.length, 17);
        test.equal(result.testCase, instance._id);
        test.isTrue(result.timestamp>1400000000000);
        // Clean up
        instance.remove();
      });
    }
  ]);
};

testAsyncMulti('CssTest - setNormative - Error', [
  function(test, expect){
    var instance;
    var instanceCallback = function(error, result){
      test.isFalse(error);
      if(error){
        done();
        return;
      };
      instance = result;
      instance.setNormative(setNormativeCallback);
    };
    var setNormativeCallback = expect(function(error, result){
      test.isUndefined(result);
      test.isTrue(error);
      test.equal(error.error, 400);
      // Clean up
      instance.remove();
    });

    var testData = _.clone(newTest);
    // Prepare new test with erroneous parameters
    testData.cssFiles = 'http://superfake/notworking.css';

    ServerObject('CssTest', testData, instanceCallback);
  }
]);

//TODO: test setNormative adding to collection (only on server)
//      also check that thumbnail is forced to refresh 
//        (generate first thumbnail with diff html)
