'use strict';

Package.describe({
  name: 'awei01:meteor-configurator',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Simple configuration set/get manager.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use('underscore');
  api.addFiles('configurator.js');
  api.export('MeteorConfigurator');
});

Package.onTest(function(api) {
  api.use('practicalmeteor:munit');
  api.use('awei01:meteor-configurator');
  api.addFiles('tests/configurator.spec.js');
});
