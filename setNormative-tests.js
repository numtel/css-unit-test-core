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
        test.isTrue(instance.hasNormative);
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

if(Meteor.isServer){
  // This test only on server to check mongo collection
  testAsyncMulti('CssTest - setNormative - Inserted into Collection, New Thumb', [
    function(test, expect){
      var testData = _.clone(newTest);
      var instance;
      var origThumb;
      var instanceCallback = function(error, result){
        test.isFalse(error);
        instance = result;
        instance.getThumbnail(getThumbnailCallback);
      };
      var getThumbnailCallback = function(error, result){
        test.isFalse(error);
        test.equal(result.substr(0, 10), 'data:image');
        origThumb = result;
        // Provoke a new thumbnail image
        instance.fixtureHtml = '<p>not rockin wit you</p>';
        instance.setNormative(setNormativeCallback);
      };
      var setNormativeCallback = function(error, result){
        test.isFalse(error);
        // Check for document in collection
        var doc = CssNormatives.findOne(result._id);
        test.isTrue(doc);
        test.isTrue(_.isEqual(doc, result));
        // This call does not have the forceRefresh option set,
        // should have happened with setNormative.
        instance.getThumbnail(finalCallback);
      };
      var finalCallback = expect(function(error, result){
        test.isFalse(error);
        // Make sure thumbnail has changed
        test.notEqual(result, origThumb);
        // Clean up
        instance.remove();
      });
      ServerObject('CssTest', testData, instanceCallback);
    }
  ]);
};

if(Meteor.isServer){
  testAsyncMulti('CssTest - setNormative - Removed by CssTest.remove()', [
    function(test, expect){
      var testData = _.clone(newTest);
      var instance, normativeId;
      var instanceCallback = function(error, result){
        test.isFalse(error);
        instance = result;
        instance.setNormative(setNormativeCallback);
      };
      var setNormativeCallback = function(error, result){
        test.isFalse(error);
        if(error){
          console.log(error);
        };
        normativeId = result._id;
        test.isTrue(normativeId);
        instance.remove(removeCallback);
      };
      var removeCallback = expect(function(error, result){
        test.isFalse(error);
        if(error){
          console.log(error);
        };
        var doc = CssNormatives.findOne(normativeId);
        test.isUndefined(doc);
      });
      ServerObject('CssTest', testData, instanceCallback);
    }
  ]);
};
