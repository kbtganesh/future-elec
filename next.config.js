const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
const withSass = require("@zeit/next-sass");
const webpack = require("webpack");
const path = require("path");
const Dotenv = require("dotenv-webpack");
const withCSS = require('@zeit/next-css')

module.exports = withPlugins([[withSass], [withCSS], [withImages]], {
  webpack(config, options) {
    config.resolve.modules.push(path.resolve("./"));
    config.plugins.push(new Dotenv({ silent: true, systemvars: true }));
    return config;
  }
});
