Package.describe({
  summary: "Css Unit Test Core Package",
  version: "0.0.2",
  git: "https://github.com/numtel/css-unit-test-core.git"
});

var packageContents = function(api){
  api.use('underscore');
  api.use('gadicohen:phantomjs@0.0.2');

  api.addFiles('assetKey.js', 'server', {isAsset: true});
  api.addFiles('assetKey.js', 'server');

  api.addFiles('src/phantom/extractStyles.js', 'server', {isAsset: true});
  api.addFiles('src/phantom/getSheetsFromUrl.js', 'server', {isAsset: true});
  api.addFiles('src/phantom/render.js', 'server', {isAsset: true});

  api.addFiles('src/util.js', 'server');
  api.addFiles('src/model.js');
  api.export('CssTests');
  api.export('CssNormatives', 'server');
  api.export('CssHistory');
  api.export('CssTestsHandle', 'client');
  api.export('CssHistoryHandle', 'client');
  api.addFiles('src/CssTest.js', 'server');
  api.export('CssTest', 'server');

  api.addFiles('src/CssTest.getHtml.js', 'server');
  api.addFiles('src/CssTest.getThumbnail.js', 'server');
  api.addFiles('src/CssTest.extractStyles.js', 'server');
  api.addFiles('src/CssTest.setNormative.js', 'server');
  api.addFiles('src/CssTest.loadNormative.js', 'server');
  api.addFiles('src/CssTest.run.js', 'server');

};

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.2.2');
  packageContents(api);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('test-helpers');
  api.addFiles('test/more-test-helpers.js');
  api.use('numtel:serverobject@0.0.15');
  packageContents(api);

  api.addFiles('test/mockup/csstest-mockup.html', 'client', {isAsset: true});
  api.addFiles('test/mockup/csstest-mockup.css', 'client', {isAsset: true});
  api.addFiles('test/mockup/csstest-mockup2.html', 'client', {isAsset: true});
  api.addFiles('test/mockup/csstest-mockup2.css', 'client', {isAsset: true});

  api.addFiles('test/test-init.js');
  api.addFiles('test/CssTest.js');
  api.addFiles('test/CssTest.getHtml.js');
  api.addFiles('test/CssTest.getThumbnail-expected.js');
  api.addFiles('test/CssTest.getThumbnail.js');
  api.addFiles('test/CssTest.extractStyles-expected.js');
  api.addFiles('test/CssTest.extractStyles.js');
  api.addFiles('test/CssTest.setNormative.js');
  api.addFiles('test/CssTest.loadNormative.js');
  api.addFiles('test/CssTest.run-expected.js');
  api.addFiles('test/CssTest.run.js');
});
