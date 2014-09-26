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

CssTest.prototype.getHtml = function(options){
  var that = this;
  options = _.defaults(options || {}, {
    fixtureHtml: this.fixtureHtml,
    normativeValue: undefined,
    diff: undefined
  });

  var styleSheets = '';
  if(options.normativeValue === undefined){
    // Styles are coming normally
    if(this.remoteStyles){
      styleSheets += phantomExec('phantom-getSheetsFromUrl.js', [url]);
    };
    that.cssFiles.split('\n').forEach(function(href){
      if(href.trim() !== ''){
        styleSheets += '<link href="' + href + 
                 (href.indexOf('?') === -1 ? '?' + Date.now() : '') + 
                 '" type="text/css" rel="stylesheet" />\n';
      };
    });
  }else{
    // Styles are coming from expectations
    styleSheets = stylesheetFromNormative(options.normativeValue, options.diff);
  };

  var head = [
   '<head>',
   styleSheets,
   (that.remoteStyles ? '<base href="' + that.remoteStyles +'">' : ''),
   '<style>',
   '.steez-highlight-failure { outline: 2px solid #ff0 !important; }',
   '</style>',
   '</head>'].join('\n');

  var output = options.fixtureHtml;

  if(!/\<body[^]+\<\/body\>/i.test(output)){
    // Fixture HTML doesn't contain a <body> element
    output = '<body test-ignore>' + output + '</body>';
  };
  if(!/\<html[^]+\<\/html\>/i.test(output)){
    // Fixture HTML doesn't contain a <html> element
    output = '<html test-ignore>' + head + output + '</html>';
  }else{
    // Place <head> before <body>
    var bodyPos = output.toLowerCase().indexOf('<body');
    output = output.substr(0, bodyPos) + head + output.substr(bodyPos);
  };

  return output;
};
