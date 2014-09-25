

var stylesheetFromNormative = function(normative, diff){
  var elements = flattenArray(normative),
      style = ['<style>'];
  elements.forEach(function(element){
    if(diff){
      diff.forEach(function(diffItem){
        if(diffItem.selector === element.selector){
          diffItem.instances.forEach(function(instance){
            element.attributes[instance.key] = instance.bVal;
          });
        };
      });
    };
    var rule = element.selector + '{';
    _.each(element.attributes, function(val, key){
      rule += key + ': ' + val + '; ';
    });
    rule += '}';
    style.push(rule);
  });
  style.push('</style>');
  return style.join('\n');
};

var stylesheetsFromUrl = function(url, callback){
  var that = this;
  var phantomjs = Npm.require('phantomjs');
  var shell = Npm.require('child_process');
  var command = shell.spawn(phantomjs.path, 
    [assetDir + 'phantom-getSheetsFromUrl.js', url]);
  var stdout = '', stderr = '';

  command.stdout.on('data', function(data){
    stdout += data;
  });

  command.stderr.on('data', function(data){
    stderr += data;
  });

  command.on('exit', function(code) {
    if(callback){
      if(stdout.substr(0,9) === '##ERROR##'){
        callback.call(that, 1, undefined);
      }else{
        callback.call(that, stderr.length > 0 ? stderr : undefined, 
                            stdout.length > 0 ? stdout : undefined);
      };
    };
  });
};

TestCases.TestCase.prototype.getHTML = function(options, callback){
  var that = this;
  options = _.defaults(options || {}, {
    fixtureHTML: this.fixtureHTML,
    normativeValue: undefined,
    diff: undefined
  });

  var head = '';
  // Split out post-async code
  var finishOutput = function(head){
    if(options.normativeValue === undefined){
      if(head === undefined){
        head = '';
      };
      // Use spec'd css
      var linkTags = [];
      that.cssFiles.split('\n').forEach(function(href){
        if(href.trim() !== ''){
          linkTags.push('<link href="' + href + 
                        (href.indexOf('?') === -1 ? '?' + Date.now() : '')+ 
                        '" type="text/css" rel="stylesheet" />');
        };
      });
      head += linkTags.join('\n');
    }else{
      // Styles are coming from expectations
      head = stylesheetFromNormative(options.normativeValue, options.diff);
    };
    head = [
     '<head>',
     head,
     (that.remoteStyles ? '<base href="' + that.remoteStyles +'">' : ''),
     '<style>',
     '.steez-highlight-failure { outline: 2px solid #ff0 !important; }',
     '</style>',
     '</head>'].join('\n');
    var frameHTML = options.fixtureHTML;
    if(!/\<body[^]+\<\/body\>/i.test(frameHTML)){
      // Fixture HTML doesn't contain a <body> element
      frameHTML = '<body test-ignore>' + frameHTML + '</body>';
    };
    if(!/\<html[^]+\<\/html\>/i.test(frameHTML)){
      // Fixture HTML doesn't contain a <html> element
      frameHTML = '<html test-ignore>' + head + frameHTML + '</html>';
    }else{
      // Place <head> before <body>
      var bodyPos = frameHTML.toLowerCase().indexOf('<body');
      frameHTML = frameHTML.substr(0, bodyPos) + head + frameHTML.substr(bodyPos);
    };
    if(callback){
      callback.call(that, undefined, frameHTML);
    };
    return frameHTML;
  };
  // Begin possible async
  if(options.normativeValue === undefined){
    // Grab stylesheets from remote url
    if(this.remoteStyles){
      head = this.stylesheetsFromUrl(this.remoteStyles, function(error, result){
        if(error){
          if(callback){
            callback.call(that, 'Error loading remote URL.', undefined);
          };
        }else{
          finishOutput(result);
        };
      });
    }else{
      return finishOutput();
    };
  }else{
    return finishOutput();
  };
};
