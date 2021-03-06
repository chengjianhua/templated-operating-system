import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import isArray from 'lodash/isArray';

import pkg from '../../../../../package.json';

const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');
const isAnalyze = process.argv.includes('--analyze') || process.argv.includes('--analyse');

const rootDir = path.resolve(__dirname, '../../../../..');
const srcDir = path.join(rootDir, 'src');
const buildDir = path.join(rootDir, 'build');
const postcssConfigPath = path.resolve(__dirname, './postcss.config.js');

const babelrcSource = fs.readFileSync(path.resolve(__dirname, path.resolve(rootDir, '.babelrc')), 'utf8');

const babelConfig = JSON.parse(babelrcSource);

const moduleResolver = babelConfig.plugins.find((plugin) => {
  if (isArray(plugin)) {
    return plugin[0] === 'module-resolver';
  }

  return false;
});

moduleResolver[1].root = [
  srcDir,
];

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const commonCssLoader = [
  {
    loader: 'css-loader',
    options: {
      // CSS Loader https://github.com/webpack/css-loader
      importLoaders: 1,
      sourceMap: isDebug,
      // CSS Modules https://github.com/css-modules/css-modules
      modules: true,
      localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
      // CSS Nano http://cssnano.co/options/
      minimize: !isDebug,
      discardComments: { removeAll: true },
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      config: postcssConfigPath,
      // sourceMap: 'inline',
    },
  },
];

const antdCssLoader = [
  // {
  //   loader: 'css-loader',
  //   options: {
  //     // CSS Loader https://github.com/webpack/css-loader
  //     importLoaders: 1,
  //     sourceMap: isDebug,
  //     // CSS Nano http://cssnano.co/options/
  //     minimize: !isDebug,
  //     discardComments: { removeAll: true },
  //   },
  // },
  // {
  //   loader: 'postcss-loader',
  //   options: {
  //     config: './tools/postcss.config.js',
  //   },
  // },
  {
    loader: 'css-loader',
  },
  {
    loader: 'postcss-loader',
    options: {
      config: postcssConfigPath,
    },
  },
];

export function getPageDir(id) {
  return path.join(buildDir, 'pages', id);
}

export default function getWebpackConfig({
  htmlPluginOptions,
}) {
  const { _id: id } = htmlPluginOptions.pageData;
  const pageDir = getPageDir(id);

  const config = {
    context: rootDir,

    output: {
      // path: path.resolve(srcDir, '../build/pages/assets'),
      path: path.join(pageDir, 'assets'),
      publicPath: `/pages/${id}/assets/`,
      pathinfo: isVerbose,
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [
            srcDir,
          ],
          query: {
            // https://github.com/babel/babel-loader#options
            cacheDirectory: isDebug,

            // https://babeljs.io/docs/usage/options/
            babelrc: false,
            presets: [
              // A Babel preset that can automatically determine the Babel plugins and polyfills
              // https://github.com/babel/babel-preset-env
              ['env', {
                targets: {
                  browsers: pkg.browserslist,
                },
                modules: false,
                useBuiltIns: false,
                debug: false,
              }],
              // Experimental ECMAScript proposals
              // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
              'stage-0',
              // JSX, Flow
              // https://github.com/babel/babel/tree/master/packages/babel-preset-react
              'react',
              // Optimize React code for the production build
              // https://github.com/thejameskyle/babel-react-optimize
              ...isDebug ? [] : ['react-optimize'],
            ],
            plugins: [
              // Adds component stack to warning messages
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source
              ...isDebug ? ['transform-react-jsx-source'] : [],
              // Adds __self attribute to JSX which React will use for some warnings
              // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-self
              ...isDebug ? ['transform-react-jsx-self'] : [],

              ['transform-decorators-legacy'],

              ['transform-react-display-name'],

              ['import', {
                libraryName: 'antd',
                style: 'css',
              }],

              moduleResolver,
            ],
          },
        },
        {
          test: /\.md$/,
          loader: path.join(rootDir, 'tools/lib/markdown-loader.js'),
        },
        {
          test: /\.txt$/,
          loader: 'raw-loader',
        },
        {
          test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
          loader: 'file-loader',
          query: {
            name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]',
          },
        },
        {
          test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
          loader: 'url-loader',
          query: {
            name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]',
            limit: 10000,
          },
        },
      ],
    },

    // Don't attempt to continue if there are any errors.
    bail: !isDebug,

    cache: isDebug,

    stats: {
      colors: true,
      reasons: isDebug,
      hash: isVerbose,
      version: isVerbose,
      timings: true,
      chunks: isVerbose,
      chunkModules: isVerbose,
      cached: isVerbose,
      cachedAssets: isVerbose,
    },
  };

  //
  // Configuration for the client-side bundle (client.js)
  // -----------------------------------------------------------------------------
  const clientConfig = {
    ...config,

    name: 'client',
    target: 'web',

    entry: {
      client: [
        'babel-polyfill',
        path.resolve(__dirname, '../client.js'),
      ],
    },

    output: {
      ...config.output,
      filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
      chunkFilename: isDebug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
    },

    module: {
      ...config.module,

      rules: [
        ...config.module.rules,

        {
          test: /\.css$/,
          exclude: /antd.*css$/,
          use: isDebug ? [
            {
              loader: 'style-loader',
            },
            ...commonCssLoader,
          ] :
          ExtractTextPlugin.extract({
            use: [
              ...commonCssLoader,
            ],
          }),
        },

        {
          test: /antd.*css$/,
          use: ExtractTextPlugin.extract({
            use: [
              ...antdCssLoader,
            ],
          }),
        },

      ],
    },

    plugins: [
      new ExtractTextPlugin('styles.css'),

      // Define free variables
      // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
        'process.env.BROWSER': true,
        __DEV__: isDebug,
      }),

      // Emit a file with assets paths
      // https://github.com/sporto/assets-webpack-plugin#options
      new AssetsPlugin({
        path: pageDir,
        filename: 'assets.json',
        prettyPrint: true,
      }),

      // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
      // http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: (module) => {
          if (/antd/.test(module.resource)) {
            return false;
          }

          return /node_modules/.test(module.resource);
        },
      }),

      ...isDebug ? [] : [
        // Minimize all JavaScript output of chunks
        // https://github.com/mishoo/UglifyJS2#compressor-options
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
            screw_ie8: true, // React doesn't support IE8
            warnings: isVerbose,
            unused: true,
            dead_code: true,
          },
          mangle: {
            screw_ie8: true,
          },
          output: {
            comments: false,
            screw_ie8: true,
          },
        }),
      ],

      new HtmlWebpackPlugin(Object.assign({
        template: path.resolve(__dirname, '../page-template.ejs'),
        filename: path.join(pageDir, 'index.html'),
      }, htmlPluginOptions)),

      // Webpack Bundle Analyzer
      // https://github.com/th0r/webpack-bundle-analyzer
      ...isAnalyze ? [new BundleAnalyzerPlugin()] : [],
    ],

    // Choose a developer tool to enhance debugging
    // http://webpack.github.io/docs/configuration.html#devtool
    devtool: isDebug ? 'cheap-module-eval-source-map' : false,

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    // https://webpack.github.io/docs/configuration.html#node
    // https://github.com/webpack/node-libs-browser/tree/master/mock
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
  };

  return clientConfig;
}
