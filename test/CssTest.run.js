if(Meteor.isClient){
  testAsyncMulti('CssTest - run - Failure', [
    // Must run on client to determine hosted url
    // If it works on the client, it obviously worked on the server
    function(test, expect){
      var testData = _.clone(newTest);
      // assetDir is only available on the server, except with method
      Meteor.call('CssTest/assetDir', function(error, result){
        // Slice off leading 'assets/' not required for client
        var assetDir = result.substr(7);

        // Prepare new test with remoteStyles
        testData.remoteStyles = document.location.origin +
                                document.location.pathname +
                                assetDir + 'test/mockup/' +
                                'csstest-mockup.html';
        testData.testUrl = testData.remoteStyles;
        testData.cssFiles = '';

        ServerObject('CssTest', testData, instanceCallback);
      });

      var instance, normative;
      var instanceCallback = function(error, result){
        if(error) throw error;
        instance = result;
        instance.setNormative(setNormativeCallback);
      };
      var setNormativeCallback = function(error, result){
        if(error) throw error;
        normative = result;
        // Switch to other mockup and run test
        var mockup2 = instance.remoteStyles.replace('.html', '2.html');
        instance.update({remoteStyles: mockup2}, updateCallback);
      };
      var updateCallback = function(error, result){
        if(error) throw error;
        instance.run(runCallback);
      };
      var runCallback = expect(function(error, result){
        if(error) throw error;
        var cssFile1 = instance.remoteStyles.replace('2.html', '.css'),
            cssFile2 = instance.remoteStyles.replace('.html', '.css'),
            expected = expectedRunFailures(cssFile1, cssFile2);
        test.isTrue(_.isEqual(expected, result.failures));
        test.equal(result.fixtureHtml, instance.fixtureHtml);
        test.equal(result.owner, instance.owner);
        test.equal(result.testCase, instance._id);
        test.equal(result.normative, normative._id);
        test.isTrue(result.time);
        test.isFalse(result.passed);
        // Clean up
        instance.remove();
      });

    }
  ]);
};

if(Meteor.isServer){
  testAsyncMulti('CssTest - run - Success + Successfully removed', [
    function(test, expect){
      var instance, normative, report;
      var instanceCallback = function(error, result){
        if(error) throw error;
        instance = result;
        instance.setNormative(setNormativeCallback);
      };
      var setNormativeCallback = function(error, result){
        if(error) throw error;
        normative = result;
        // Switch to other mockup and run test
        instance.run(runCallback);
      };
      var runCallback = function(error, result){
        if(error) throw error;
        report = result;
        test.equal(report.fixtureHtml, instance.fixtureHtml);
        test.equal(report.owner, instance.owner);
        test.equal(report.testCase, instance._id);
        test.isTrue(report.time);
        test.isTrue(report.passed);
        _.each(report.failures, function(arr, width){
          test.equal(arr.length, 0);
          test.include(instance.widthsArray, parseInt(width,10));
        });
        var doc = CssHistory.findOne(report._id);
        test.isTrue(_.isEqual(doc, report));
        // Clean up
        instance.remove(removeCallback);
      };
      var removeCallback = expect(function(error, result){
        if(error) throw error;
        var doc = CssHistory.findOne(report._id);
        test.isUndefined(doc);
      });
      var testData = _.clone(newTest);
      testData.cssFiles = '';
      ServerObject('CssTest', testData, instanceCallback);
    }
  ]);
};

testAsyncMulti('CssTest - run - Error', [
  function(test, expect){
    var instance;
    var instanceCallback = function(error, result){
      if(error) throw error;
      instance = result;
      instance.run(runCallback);
    };
    var runCallback = expect(function(error, result){
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
