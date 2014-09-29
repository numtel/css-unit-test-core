if(Meteor.isClient){

  testAsyncMulti('CssTest - getThumbnail - Default', [
    // Must run on client to determine hosted url
    // If it works on the client, it obviously worked on the server
    function(test, expect){
      var trials = [
        {options: undefined, expected: 'default'},
        // Loading same size again should come from the cache very quickly
        {options: undefined, expected: 'default', maxTime: 20},
        // Large image should return longer result
        {options: {width: 1000, height: 1000}, expected: 'large', last: true}
      ];
      var testData = _.clone(newTest);
      var cssFile;
      var instance;
      var lastTime = Date.now();
      multipleData(test, expect, trials, function(test, data, done){
        // Must be placed before
        var getThumbnailCallback = function(error, result){
          test.equal(expectedThumbnails[data.expected], result);
          if(data.last){
            // Clean up
            instance.remove();
          };
          if(data.maxTime){
            test.isTrue(Date.now()-lastTime<data.maxTime);
          };
          lastTime = Date.now();
          done();
        };
        if(!instance){
          // On first trial, get instance
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
            if(error){
              done();
              return;
            };
            instance = result;
            instance.getThumbnail(data.options, getThumbnailCallback);
          };
        }else{
          // Not first trial
          instance.getThumbnail(data.options, getThumbnailCallback);
        };
      });
    }
  ]);
};

if(Meteor.isServer){
  // Run only on the server to check for deleted buffer file
  testAsyncMulti('CssTest - getThumbnail - Error', [
    function(test, expect){
      var instance;
      var instanceCallback = function(error, result){
        test.isFalse(error);
        if(error){
          done();
          return;
        };
        instance = result;
        instance.getThumbnail(getThumbnailCallback);
      };
      var getThumbnailCallback = expect(function(error, result){
        test.isUndefined(result);
        test.isTrue(error);
        test.equal(error.error, 400);
        // Allow 50 ms for file deletion to complete
        Meteor.setTimeout(bufferDeleteCheck, 50);
      });

      var bufferDeleteCheck = expect(function(){
        var fs = Npm.require('fs');
        var htmlFile = 'testThumbnail-' + instance._id + '.html';
        test.isFalse(fs.existsSync(htmlFile));
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
