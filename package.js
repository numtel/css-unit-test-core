Package.describe({
  summary: "Css Unit Test Core Package",
  version: "0.0.1",
  git: "https://github.com/numtel/css-unit-test-core.git"
});

var packageContents = function(api){
  api.use('underscore');
  api.use('gadicohen:phantomjs@0.0.2');

  api.addFiles('assetKey.js', 'server', {isAsset: true});
  api.addFiles('assetKey.js', 'server');

  api.addFiles('phantom-extractStyles.js', 'server', {isAsset: true});
  api.addFiles('phantom-getSheetsFromUrl.js', 'server', {isAsset: true});
  api.addFiles('phantom-render.js', 'server', {isAsset: true});

  api.addFiles('util.js', 'server');
  api.addFiles('model.js');
  api.export('CssTests');
  api.export('CssNormatives', 'server');
  api.export('CssHistory');
  api.export('CssTestsHandle', 'client');
  api.export('CssHistoryHandle', 'client');
  api.addFiles('csstest.js', 'server');
  api.export('CssTest', 'server');

  api.addFiles('getHtml.js', 'server');
  api.addFiles('getThumbnail.js', 'server');
  api.addFiles('extractStyles.js', 'server');

};

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.2.2');
  packageContents(api);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('test-helpers');
  api.addFiles('more-test-helpers.js');
  api.use('numtel:serverobject@0.0.11');
  packageContents(api);

  api.addFiles('csstest-mockup.html', 'client', {isAsset: true});
  api.addFiles('csstest-mockup.css', 'client', {isAsset: true});

  api.addFiles('test-init.js');
  api.addFiles('csstest-tests.js');
  api.addFiles('getHtml-tests.js');
  api.addFiles('getThumbnail-tests-expected.js');
  api.addFiles('getThumbnail-tests.js');
  api.addFiles('extractStyles-tests-expected.js');
  api.addFiles('extractStyles-tests.js');
});
