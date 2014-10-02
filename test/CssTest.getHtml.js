
testAsyncMulti('CssTest - getHtml - Multiple Trials', [
  function(test, expect){
    var trials = [
      // Test with default mockup
      {options: {},
       expected: [
        '<html test-ignore>',
        '<body test-ignore>',
       ]
      },
      // Test alternate fixtureHtml
      {options: {fixtureHtml: '<body>something you would not expect</body>'},
       unexpected: [
        '<body test-ignore>'
       ]
      },
      {options: {fixtureHtml: '<html><body>something you would not expect</body></html>'},
       expected: [
        'something you would not expect</body>'
       ],
       unexpected: [
        '<html test-ignore>',
        '<body test-ignore>'
       ]
      },
      // Test with normative
      {options: {
        normativeValue: [
            {selector: 'h1',
             attributes: {'color': '#ff0'},
             children: [
              {selector: 'h1>em',
               attributes: {'text-align': 'center'}}
             ]}
          ]
        },
       expected: [
        'h1{color: #ff0; }',
        'h1>em{text-align: center; }'
       ]
      },
      // Test with normative + diff
      {options: {
        normativeValue: [
            {selector: 'h1',
             attributes: {'color': '#ff0'},
             children: [
              {selector: 'h1>em',
               attributes: {'text-align': 'center'}}
             ]}
          ],
         diff: [
          // No children in diff, just flat
          {selector: 'h1',
           instances: [{key: 'color', bVal: '#000'}]}
         ]
        },
       expected: [
        'h1{color: #000; }',
        'h1>em{text-align: center; }'
       ],
      }
    ];
    multipleData(test, expect, trials, function(test, data, done){
      var instance;
      var instanceCallback = function(error, result){
        if(error) throw error;
        instance = result;
        instance.getHtml(data.options, getHtmlCallback);
      };

      var getHtmlCallback = function(error, result){
        if(error) throw error;

        // Result should include fixtureHtml exactly as long as it doesn't
        // have an html tag in it
        var fixtureHtml = data.options.fixtureHtml || instance.fixtureHtml;
        if(fixtureHtml.indexOf('<html') === -1){
          test.isTrue(result.indexOf(fixtureHtml) > -1);
        };

        // Result should have basic tags
        ['html', 'head', 'body'].forEach(function(tag){
          var matcher = new RegExp('\<' + tag + '[^]+\<\/' + tag + '\>', 'i');
          test.isTrue(matcher.test(result), 'Missing tag: ' + tag);
        });

        if(data.options.normativeValue === undefined){
          // CSS Files should be included
          instance.cssFiles.split('\n').forEach(function(href){
            if(href.trim() !== ''){
              test.isTrue(result.indexOf(href) > -1, 
                          'CSS File not included: ' + href);
            };
          });
        }else{
          // No links only style tags
          test.isFalse(/\<link .+rel=\"stylesheet\".+\>/i.test(result));
          test.isTrue(/\<style\>[^]+\<\/style\>/i.test(result));
        };

        if(data.expected && data.expected.length){
          data.expected.forEach(function(expected){
            test.isTrue(result.indexOf(expected) > -1, 'Missing: ' + expected);
          });
        };
        if(data.unexpected && data.unexpected.length){
          data.unexpected.forEach(function(unexpected){
            test.isTrue(result.indexOf(unexpected) === -1, 
                        'Should not have: ' + unexpected);
          });
        };

        // Clean up
        instance.remove();
        done();
      };

      ServerObject('CssTest', newTest, instanceCallback);
    });
  }
]);

if(Meteor.isClient){
  testAsyncMulti('CssTest - getHtml - remoteStyles (Client)', [
    // Must run on client to determine hosted url
    // If it works on the client, it obviously worked on the server
    function(test, expect){
      var testData = _.clone(newTest);
      // assetDir is only available on the server, except with method
      Meteor.call('CssTest/assetDir', function(error, result){
        if(error) throw error;
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

      var instance;
      var instanceCallback = function(error, result){
        if(error) throw error;
        instance = result;
        instance.getHtml({}, getHtmlCallback);
      };
      var getHtmlCallback = expect(function(error, result){
        if(error) throw error;
        // Should have csstest-mockup.css link
        test.include(result, 'csstest-mockup.css');
        // Should have <base> tag
        test.include(result, '<base href="' + testData.testUrl +'">');
        // Clean up
        instance.remove()
      });

    }
  ]);
};

testAsyncMulti('CssTest - getHtml - remoteStyles (Error)', [
  function(test, expect){
    var instance;
    var instanceCallback = function(error, result){
      if(error) throw error;
      instance = result;
      instance.getHtml({}, getHtmlCallback);
    };
    var getHtmlCallback = expect(function(error, result){
      test.isTrue(error);

      test.isUndefined(result);
      test.equal(error.error, 400);
      // Clean up
      instance.remove()
    });

    // Prepare new test with remoteStyles
    var testData = _.clone(newTest);
    testData.remoteStyles = 'notaurl';
    testData.cssFiles = '';

    ServerObject('CssTest', testData, instanceCallback);
  }
]);
