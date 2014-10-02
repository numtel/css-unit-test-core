if(Meteor.isClient){
  testAsyncMulti('CssTest - run - Success', [
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
                                assetDir +
                                'csstest-mockup.html';
        testData.testUrl = testData.remoteStyles;
        testData.cssFiles = '';

        ServerObject('CssTest', testData, instanceCallback);
      });

      var instance, normative;
      var instanceCallback = function(error, result){
        test.isFalse(error);
        if(error){
          done();
          return;
        };
        instance = result;
        instance.setNormative(setNormativeCallback);
      };
      var setNormativeCallback = function(error, result){
        test.isFalse(error);
        normative = result;
        // Switch to other mockup css file and run test
        instance.cssFiles = instance.remoteStyles.replace('.html', '2.css');
        instance.remoteStyles = '';
        instance.run(runCallback);
      };
      var runCallback = expect(function(error, result){
        console.log(error, result);
        // Clean up
        instance.remove();
      });

    }
  ]);
};
