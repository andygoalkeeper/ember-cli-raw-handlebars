/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var checker = require('ember-cli-version-checker');
var RawHandlebarsCompiler = require('./raw-handlebars-compiler');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-cli-raw-handlebars',
  included: function(app) {
  },
  projectConfig: function() {
    return this.project.config(process.env.EMBER_ENV);
  },
  rawTemplatesPaths: function() {
    var _path = this.app.options.rawTemplatesPath || path.join(this.app.trees.app._directoryPath, 'raw-templates');

    if (fs.existsSync(_path)) {
      return [_path];
    }

    return [];
  },
  rawTemplatesCommonPaths: function() {
    var _path = this.app.options.rawTemplatesPath || path.join(this.app.trees.app._directoryPath, '../lib/common/app/raw-templates');

    if (fs.existsSync(_path)) {
      return [_path];
    }

    return [];
  },
  treeForApp: function(tree) {
    let rawCommonTemplates = mergeTrees(this.rawTemplatesCommonPaths()),
        rawTemplates = mergeTrees(this.rawTemplatesPaths());

    rawCommonTemplates = new Funnel(rawCommonTemplates, { destDir: 'raw-templates' });
    rawCommonTemplates = this.processRawTemplates(rawCommonTemplates);

    rawTemplates = new Funnel(rawTemplates, { destDir: 'raw-templates' });
    rawTemplates = this.processRawTemplates(rawTemplates);

    return mergeTrees([tree, rawCommonTemplates, rawTemplates]);
  },
  processRawTemplates: function(tree) {
    return new RawHandlebarsCompiler(tree);
  }
};
