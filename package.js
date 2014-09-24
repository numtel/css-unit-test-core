Package.describe({
  summary: "Css Unit Test Core Package",
  version: "0.0.1",
  git: "https://github.com/numtel/css-unit-test.git"
});

var packageContents = function(api){
  api.use('underscore');
  api.addFiles('model.js');
  api.export('CssTests');
  api.export('CssNormatives', 'server');
  api.export('CssHistory');
  api.export('CssTestsHandle', 'client');
  api.export('CssHistoryHandle', 'client');
  api.addFiles('csstest.js', 'server');
  api.export('CssTest', 'server');
};

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.2.2');
  packageContents(api);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('test-helpers');
  api.addFiles('more-test-helpers.js');
  api.use('numtel:serverobject@0.0.5');
  packageContents(api);
  api.addFiles('csstest-tests.js');
  api.addFiles('csstest-tests-construct.js');
  api.addFiles('csstest-tests-update.js');
});
