if(Meteor.isClient){

  testAsyncMulti('CssTest - extractStyles - Default', [
    // Must run on client to determine hosted url
    // If it works on the client, it obviously worked on the server
    function(test, expect){
      var testData = _.clone(newTest);
      var cssFile;
      // assetDir is only available on the server, except with method
      Meteor.call('CssTest/assetDir', function(error, result){
        // Slice off leading 'assets/' not required for client
        var assetDir = result.substr(7);

        // Prepare new test with mockup css file
        testData.remoteStyles = document.location.origin +
                                document.location.pathname +
                                assetDir + 'test/mockup/' +
                                'csstest-mockup.html';
        testData.testUrl = testData.remoteStyles;
        testData.cssFiles = '';
        cssFile = testData.remoteStyles.replace('.html', '.css');

        ServerObject('CssTest', testData, instanceCallback);
      });

      var instance;
      var instanceCallback = function(error, result){
        test.isFalse(error);
        if(error){
          return;
        };
        instance = result;
        instance.extractStyles(extractStylesCallback);
      };
      var extractStylesCallback = expect(function(error, result){
        instance.widthsArray.forEach(function(width){
          test.isTrue(result[width], 'Width not found: ' + width);
          test.isTrue(_.isEqual(expectedExtractedStyles[width](cssFile), 
                                result[width]));
        });
        // Clean up
        instance.remove()
      });
    }
  ]);
};

if(Meteor.isServer){
  // Run only on the server to check for deleted buffer file
  testAsyncMulti('CssTest - extractStyles - Error', [
    function(test, expect){
      var instance;
      var instanceCallback = function(error, result){
        test.isFalse(error);
        if(error){
          return;
        };
        instance = result;
        instance.extractStyles(extractStylesCallback);
      };
      var extractStylesCallback = expect(function(error, result){
        test.isUndefined(result);
        test.isTrue(error);
        test.equal(error.error, 400);
        if(error.error !== 400){
          console.log(error);
        };
        // Clean up
        instance.remove();
      });

      var testData = _.clone(newTest);
      // Prepare new test with erroneous parameters
      testData.cssFiles = 'http://superfake/notworking.css';

      ServerObject('CssTest', testData, instanceCallback);
    }
  ]);
};
