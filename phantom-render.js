var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var htmlFile = system.args[1];
var testWidth = system.args[2];
var thumbWidth = system.args[3];
var thumbHeight = system.args[4];
var pageHTML = fs.read(htmlFile);

page.zoomFactor = thumbWidth / testWidth;
page.viewportSize = {
  width: thumbWidth * page.zoomFactor,
  height: thumbHeight * page.zoomFactor
};

var resourceFailures = [];
page.onResourceReceived = function(response) {
  if(response.stage === 'end' && response.status !== 200){
    resourceFailures.push(response.url + 
      '(' + response.status + ': ' + response.statusText + ')');
  };
};

page.onLoadFinished = function(status){
  if(status === 'success'){
    if(resourceFailures.length){
      throw new Error('Failed to load: ' + resourceFailures.join(', '));
      phantom.exit(1);
    };
    var imageData = page.renderBase64('PNG');
    console.log('data:image/png;base64,' + imageData);
    phantom.exit(0);
  }else{
    throw new Error('Failed to parse ' + htmlFile);
    phantom.exit(1);
  };
};

page.setContent(pageHTML, 'http://localhost/');
